import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";

// Import ThirdWeb SDK
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';


// Chain support
// 4 = Rinkeby
const supportedChainIds = [4];


//Supported Wallets types
const connectors = {
  injected: {},
};


// Render the App component to the DOM & Wrap app with ThirdWeb3Provider
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider 
    connectors={connectors}
    supportedChainIds={supportedChainIds}
    >
      <div className="landing">
    <App />
    </div>
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
