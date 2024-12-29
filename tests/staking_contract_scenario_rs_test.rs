use multiversx_sc_scenario::*;

fn world() -> ScenarioWorld {
    let mut blockchain = ScenarioWorld::new();

    // blockchain.set_current_dir_from_workspace("relative path to your workspace, if applicable");
    blockchain.register_contract("mxsc:output/staking-contract.mxsc.json", staking_contract::ContractBuilder);
    blockchain
}

#[test]
fn staking_contract_scenario_rs_test() {
    world().run("scenarios/staking_contract.scen.json");
}
