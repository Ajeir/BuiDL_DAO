import { ethers } from "ethers";
import sdk from "/Users/ajeir/Development/Web3/buidlDao/buildspace-dao-starter/scripts/1-initialize-sdk.js";

// Use addess of ERC-1155 membership contract
const bundleDropModule = sdk.getBundleDropModule(
  "0xCcB5f6975A01A315000bee857Ee9f9FfF879899a"
);

// Addess of ER-20 token contract
const tokenModule = sdk.getTokenModule(
  "0x8CcF336a2E5f49e9D7F323A21E2e859B9d14a7dd"
);

(async () => {
  try {
    // Grab address of all membership token owners
    // members have a tokeID of 0
    const walletAddress = await bundleDropModule.getAllClaimerAddresses("0");

    if (walletAddress.length === 0) {
      console.log(
        "🤷‍♂️ None of the membership NFT memberships have been claimed yet"
      );
      process.exit(0);
    }

    // Loop through array of addresses
    const airdropTargets = walletAddress.map((address) => {
      // pick random # between 1000 and 10000
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );
      console.log("start airdrop", randomAmount, "tokens to", address);

      // setup airdrop target
      const airdropTarget = {
        address,
        // convert amount to 18 decimals ( neccessary )
        amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
      };
      return airdropTarget;
    });

    // Call transferBatch on all airdrop targets
    console.log("💰 Executing airdrop... 💰");
    await tokenModule.transferBatch(airdropTargets);
    console.log("✅ Airdrop complete! ");
  } catch (err) {
    console.error("🧟‍♂️ Failed to airdrop tokens", err);
  }
})();
