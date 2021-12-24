import { ethers } from "ethers";
import sdk from "/Users/ajeir/Development/Web3/buidlDao/buildspace-dao-starter/scripts/1-initialize-sdk.js";

// Governance contract module
const voteModule = sdk.getVoteModule(
  "0xA106dC6dC212ae4473A6aD192463923C5fCA6275"
);

// ERC-20 contract module
const tokenModule = sdk.getTokenModule(
  "0x8CcF336a2E5f49e9D7F323A21E2e859B9d14a7dd"
);

(async () => {
  try {
    // Give treasury the power to mint additional tokens if needed
    await tokenModule.grantRole("minter", voteModule.address);

    console.log("Successfully granted minter role to treasury");
  } catch (error) {
    console.error(
      "🤷‍♂️Yikes it seems we failed to grant minter role to treasury",
      error
    );
    process.exit(1);
  }

  try {
    //Grab my wallet token balance
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Grab 90% of my token balance
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percentageTransfer = ownedAmount.div(100).mul(90);

    // Transfer 90% of my token balance to the voting contract
    await tokenModule.transfer(voteModule.address, percentageTransfer);

    console.log("✅Successfully transferred tokens to vote module");
  } catch (err) {
    console.error("🧟‍♂️Failed to transfer tokens to vote module", err);
  }
})();
