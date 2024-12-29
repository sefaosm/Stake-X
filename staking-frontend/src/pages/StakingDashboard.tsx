import { useGetAccountInfo, useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { WebWalletLoginButton } from "@multiversx/sdk-dapp/UI";
import { logout } from "@multiversx/sdk-dapp/utils";
import { useState, useEffect } from "react";
import { Address, ContractFunction } from "@multiversx/sdk-core";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
import { sendTransactions } from "@multiversx/sdk-dapp/services";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Add this validation
if (!CONTRACT_ADDRESS) {
  throw new Error("Contract address not found in environment variables");
}

try {
  // Validate the address format
  new Address(CONTRACT_ADDRESS);
} catch (error) {
  throw new Error("Invalid contract address format");
}

const provider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");

const StakingDashboard = () => {
  const { address } = useGetAccountInfo();
  const { isLoggedIn } = useGetLoginInfo();
  const [stakedAmount, setStakedAmount] = useState("0");
  const [rewards, setRewards] = useState("0");
  const [stakeInput, setStakeInput] = useState("");
  const [unstakeInput, setUnstakeInput] = useState("");

  useEffect(() => {
    if (isLoggedIn && address) {
      fetchStakingInfo();
    }
  }, [isLoggedIn, address]);

  const fetchStakingInfo = async () => {
    try {
      const contract = new Address(CONTRACT_ADDRESS);
      const userAddress = new Address(address);

      console.log('Fetching for address:', address);
      console.log('Contract address:', CONTRACT_ADDRESS);

      // Get staking position
      const positionQuery = await provider.queryContract({
        address: contract,
        func: new ContractFunction("getStakingPosition"),
        caller: userAddress,
        getEncodedArguments: () => []
      });

      console.log('Raw query response:', positionQuery);
      console.log('Return data:', positionQuery.returnData);

      // Convert and format the response
      if (positionQuery.returnData.length > 0) {
        const positionHex = Buffer.from(positionQuery.returnData[0], 'base64').toString('hex');
        console.log('Position hex:', positionHex);
        
        // Parse the position data
        const amount = parseInt(positionHex.slice(0, 64), 16) / Math.pow(10, 18);
        const rewards = parseInt(positionHex.slice(128), 16) / Math.pow(10, 18);

        console.log('Parsed values:', { amount, rewards });

        setStakedAmount(amount.toString());
        setRewards(rewards.toString());
      } else {
        console.log('No staking position found');
        setStakedAmount("0");
        setRewards("0");
      }
    } catch (error) {
      console.error("Error fetching staking info:", error);
    }
  };

  const handleStake = async () => {
    try {
      console.log("Attempting to stake:", stakeInput);
      const stakeValue = parseFloat(stakeInput) * Math.pow(10, 18); // Convert EGLD to wei

      const tx = {
        value: stakeValue.toString(),
        data: "stake",
        receiver: CONTRACT_ADDRESS,
        gasLimit: 60000000
      };
      
      console.log("Transaction:", tx);
      await sendTransactions({
        transactions: tx,
        transactionsDisplayInfo: {
          processingMessage: "Processing Stake transaction",
          errorMessage: "An error occurred during staking",
          successMessage: "Stake transaction successful"
        }
      });

      setStakeInput("");
      await fetchStakingInfo();
    } catch (error) {
      console.error("Error staking:", error);
    }
  };

  const handleUnstake = async () => {
    try {
      console.log("Attempting to unstake:", unstakeInput);
      const unstakeValue = parseFloat(unstakeInput) * Math.pow(10, 18); // Convert EGLD to wei

      const tx = {
        value: "0",
        data: `unstake@${unstakeValue.toString()}`,
        receiver: CONTRACT_ADDRESS,
        gasLimit: 60000000
      };
      
      console.log("Transaction:", tx);
      await sendTransactions({
        transactions: tx,
        transactionsDisplayInfo: {
          processingMessage: "Processing Unstake transaction",
          errorMessage: "An error occurred during unstaking",
          successMessage: "Unstake transaction successful"
        }
      });

      setUnstakeInput("");
      await fetchStakingInfo();
    } catch (error) {
      console.error("Error unstaking:", error);
    }
  };

  const handleClaimRewards = async () => {
    try {
      const tx = {
        value: "0",
        data: "claimRewards",
        receiver: CONTRACT_ADDRESS,
        gasLimit: 60000000
      };
      
      await sendTransactions({
        transactions: tx,
        transactionsDisplayInfo: {
          processingMessage: "Processing Claim Rewards transaction",
          errorMessage: "An error occurred during claiming rewards",
          successMessage: "Rewards claimed successfully"
        }
      });

      await fetchStakingInfo();
    } catch (error) {
      console.error("Error claiming rewards:", error);
    }
  };

  /* // Add this CSS to your index.css
  const dashboardStyle = `
    .dashboard-grid {
      display: grid;
      gap: 20px;
      margin-top: 20px;
    }

    .stat-box {
      background: #161616;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }

    .input-group {
      margin: 15px 0;
    }

    .input-group input {
      padding: 8px;
      margin-right: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .action-button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #3B82F6;
      color: white;
    }

    .action-button:hover {
      background: #2563EB;
    }
  `; */

  return (
    <div className="container">
      {!isLoggedIn ? (
        <>
          <h1>Connect your wallet to start staking</h1>
          <WebWalletLoginButton 
            loginButtonText="Connect Web Wallet" 
            callbackRoute="/"
            className="login-button"
          />
        </>
      ) : (
        <>
          <h1 className="dashboard-title">Staking Dashboard</h1>
          <p className="address">{address}</p>
          
          <div className="dashboard-grid">
            <div className="stat-box">
              <h3>Staked Amount</h3>
              <p>{stakedAmount} EGLD</p>
            </div>
            <div className="stat-box">
              <h3>Available Rewards</h3>
              <p>{rewards} EGLD</p>
            </div>
          </div>

          <div className="input-groups-container">
            <div className="input-group">
              <input
                type="number"
                value={stakeInput}
                onChange={(e) => setStakeInput(e.target.value)}
                placeholder="Amount to stake"
              />
              <button className="stake-button" onClick={handleStake}>
                Stake
              </button>
            </div>

            <div className="input-group">
              <input
                type="number"
                value={unstakeInput}
                onChange={(e) => setUnstakeInput(e.target.value)}
                placeholder="Amount to unstake"
              />
              <button className="stake-button" onClick={handleUnstake}>
                Unstake
              </button>
            </div>
          </div>

          <button className="action-button" onClick={handleClaimRewards}>
            Claim Rewards
          </button>

          <button onClick={() => logout()} style={{ marginTop: '20px', background: '#EF4444' }} className="action-button">
            Disconnect Wallet
          </button>
        </>
      )}
    </div>
  );
};

export default StakingDashboard;