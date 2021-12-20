import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from "ethers";

//import dotenv file
import dotenv from "dotenv";
dotenv.config();

// Check to see if .env is working
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
  console.log("Private key not found!");
  
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == "") {
  console.log("Alchemy API URL not found!");
  
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
  console.log("Wallet Address not found!");
  
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // private keys
    process.env.PRIVATE_KEY,
    // RPC URL, use alchemy API URL from .env
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL)
  )
);

(async () => {
  try {
    const apps = await sdk.getApps();
    console.log("Your app address:", apps[0].address);
  } catch (err) {
    console.error("Failed to get apps from SDK", err);
    process.exit(1);
  }
})();

// Export initialized SDK to use in other scripts
export default sdk;
