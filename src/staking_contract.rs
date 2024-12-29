#![no_std]

mod wasm;
use multiversx_sc::{derive_imports::*, imports::*};

#[type_abi]
#[derive(TopEncode, TopDecode, NestedEncode, NestedDecode)]
pub struct StakingPosition<M: ManagedTypeApi> {
    amount: BigUint<M>,
    last_action_block: u64,
    rewards: BigUint<M>,
}

#[multiversx_sc::contract]
pub trait StakingContract {
    #[init]
    fn init(&self, apy: u64) {
        self.apy().set(apy);
    }

    // Stake EGLD tokens
    #[payable("EGLD")]
    #[endpoint]
    fn stake(&self) {
        let payment = self.call_value().egld_value();
        let caller = self.blockchain().get_caller();
        let current_block = self.blockchain().get_block_nonce();

        if !self.staking_position(&caller).is_empty() {
            let mut position = self.staking_position(&caller).get();
            let rewards = self.calculate_rewards(&position);
            position.rewards = position.rewards.clone() + rewards.clone();
            position.amount = position.amount.clone() + (*payment).clone();
            position.last_action_block = current_block;
            self.staking_position(&caller).set(&position);
        } else {
            let position = StakingPosition {
                amount: payment.clone_value(),
                last_action_block: current_block,
                rewards: BigUint::zero(),
            };
            self.staking_position(&caller).set(&position);
            self.staked_addresses().insert(caller);
        }
    }

    // Unstake EGLD tokens
    #[endpoint]
    fn unstake(&self, amount: BigUint) {
        let caller = self.blockchain().get_caller();
        require!(
            self.staking_position(&caller).is_empty() == false,
            "No staking position found"
        );

        let mut position = self.staking_position(&caller).get();
        require!(position.amount >= amount, "Insufficient staked amount");

        // Calculate rewards before unstaking
        let rewards = self.calculate_rewards(&position);
        position.rewards += rewards;
        position.amount -= &amount;
        position.last_action_block = self.blockchain().get_block_nonce();

        // Update or remove staking position
        if position.amount > 0 {
            self.staking_position(&caller).set(&position);
        } else {
            self.staking_position(&caller).clear();
            self.staked_addresses().swap_remove(&caller);
        }

        // Send unstaked amount back to caller
        self.send().direct_egld(&caller, &amount);
    }

    // Claim accumulated rewards
    #[endpoint]
    fn claim_rewards(&self) {
        let caller = self.blockchain().get_caller();
        require!(
            self.staking_position(&caller).is_empty() == false,
            "No staking position found"
        );

        if !self.staking_position(&caller).is_empty() {
            let mut position = self.staking_position(&caller).get();
            let rewards = self.calculate_rewards(&position);
            let total_rewards = position.rewards + rewards;
            require!(total_rewards > 0, "No rewards to claim");

            // Reset rewards and update last action block
            position.rewards = BigUint::zero();
            position.last_action_block = self.blockchain().get_block_nonce();
            self.staking_position(&caller).set(&position);

            // Send rewards to caller
            self.send().direct_egld(&caller, &total_rewards);
        }
    }

    // Calculate rewards for a staking position
    fn calculate_rewards(&self, position: &StakingPosition<Self::Api>) -> BigUint {
        let current_block = self.blockchain().get_block_nonce();
        let blocks_passed = current_block - position.last_action_block;
        
        // APY calculation: (amount * apy * blocks_passed) / (100 * BLOCKS_IN_YEAR)
        let apy = self.apy().get();
        let blocks_in_year = 31_536_000u64 / 6; // Assuming 6 second block time
        let reward = position.amount.clone() * apy * blocks_passed;
        reward / (100u64 * blocks_in_year)
    }

    // View functions
    #[view(getStakingPosition)]
    fn get_staking_position(&self, address: ManagedAddress) -> Option<StakingPosition<Self::Api>> {
        if self.staking_position(&address).is_empty() {
            None
        } else {
            Some(self.staking_position(&address).get())
        }
    }

    #[view(getStakedAddresses)]
    fn get_staked_addresses(&self) -> MultiValueEncoded<ManagedAddress> {
        self.staked_addresses().iter().collect()
    }

    #[view(getApy)]
    fn get_apy(&self) -> u64 {
        self.apy().get()
    }

    // Storage
    #[storage_mapper("stakingPosition")]
    fn staking_position(
        &self,
        address: &ManagedAddress,
    ) -> SingleValueMapper<StakingPosition<Self::Api>>;

    #[storage_mapper("stakedAddresses")]
    fn staked_addresses(&self) -> UnorderedSetMapper<ManagedAddress>;

    #[storage_mapper("apy")]
    fn apy(&self) -> SingleValueMapper<u64>;
}