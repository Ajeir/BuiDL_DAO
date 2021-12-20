import { useEffect, useMemo, useState } from "react";


// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";

const App = () => {
  // Utilizing connectWallet from thirdweb
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("Hello", address);

  // Incase User is hasn't connected their wallet
  // let them call connectWallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Connect your wallet</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
        Connect Your wallet 
        </button>
      </div>
    );
  }


  return (
    <div className="landing">
      <h1>Welcome to BuidlDAO!</h1>
      <h2>Just Buidl it!</h2>
    </div>
  );
};

export default App;
