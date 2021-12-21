import { useEffect, useMemo, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";

// instiatiate the SDK on Rinkeby
const sdk = new ThirdwebSDK("rinkeby");

// Grab a reference to ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  "0xCcB5f6975A01A315000bee857Ee9f9FfF879899a"
);

const App = () => {
  // Utilizing connectWallet from thirdweb
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("Hello", address);

  // Signer is required to sign transaction on the blockchain
  // Without it you can only read data, not write
  const signer = provider ? provider.getSigner() : undefined;

  // Set variable to let me know if user has DAO NFT
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  
  // isClaiming allows you to keep a loading state while the NFT is minting
  const [isClaiming, setIsClaiming] = useState(false);


  useEffect(() => {
    // Pass signer to the sdk, which enables you to interact
    // with deployed contract
    sdk.setProviderOrSigner(signer);
  }, [signer]);



  useEffect(() => {
    // If user doesn't have a connected wallet, exit!
    if (!address) {
      return;
    }

    // Check if user has an NFT by using bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0, user has an NFT
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("💯This user has an NFT memebership!");
        } else {
          setHasClaimedNFT(false);
          console.log("🤺This user does not have an NFT memebership!");
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.log("Failed NFT balance check", error);
      });
  }, [address]);

  // Incase User is hasn't connected their wallet
  // let them call connectWallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to BuidlDAO!</h1>
        <h2>Just Buidl it!</h2>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect Your wallet
        </button>
      </div>
    );
  }

  // DAO memebership page 
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>BuidlDAO BuiDl3Rs Page</h1>
        <p> Get to buidling!</p>
        </div>
    );
  };

  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet
    bundleDropModule
      .claim("0", 1)
      .catch((err) => {
        console.log("Failed to claim NFT", err);
        setIsClaiming(false);
      })
      .finally(() => {
        // stop loading state
        setIsClaiming(false);
        //set claim state.
        setHasClaimedNFT(true);
        // Show user new NFT!
        console.log("💯Congrats user! You've successfully minted your membership NFT! check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0"
        );
      });
  }


// Render mint screen 
  return (
    <div className="mint-nft">
        <h1>Mint your free buidL memebership NFT</h1>
        <button className= "mint-nft"
          onClick={() => mintNft()}
          >
            {isClaiming ? "Minting..." : "Mint"}
          </button>
    </div>
  );
};

export default App;
