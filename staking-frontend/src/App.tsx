import { DappProvider } from "@multiversx/sdk-dapp/wrappers/DappProvider";
import { NotificationModal } from "@multiversx/sdk-dapp/UI/NotificationModal";
import { SignTransactionsModals } from "@multiversx/sdk-dapp/UI/SignTransactionsModals";
import { TransactionsToastList } from "@multiversx/sdk-dapp/UI/TransactionsToastList";
import StakingDashboard from "./pages/StakingDashboard";

const App = () => {
  const network = import.meta.env.VITE_NETWORK || "devnet";
  
  return (
    <DappProvider
      environment={network}
      customNetworkConfig={{
        name: network,
        apiTimeout: 6000,
        walletConnectV2ProjectId: ""
      }}
    >
      <TransactionsToastList />
      <NotificationModal />
      <SignTransactionsModals />
      <StakingDashboard />
    </DappProvider>
  );
};

export default App;
