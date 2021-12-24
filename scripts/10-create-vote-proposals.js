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
    const amount = 500_000;
    // Create proposal to mint 500,000 tokens to the treasury
    await voteModule.propose(
      "Should the DAO mint an additional" +
        amount +
        " tokens into the treasury?",
      [
        {
          // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
          // to send in this proposal. In this case, we're sending 0 ETH.
          // We're just minting new tokens to the treasury. So, set to 0.
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // running a mint, mint to the voteModule
            // it acts as the treasury
            "mint",
            [voteModule.address, 
            ethers.utils.parseUnits(amount.toString(), 18)]
          ),
          //token module which is used to execute mint
          toAddress: tokenModule.address,
        },
      ]
    );
    console.log("✅Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("🧟‍♂️Failed to create proposal to mint tokens", error);
    process.exit(1);
  }

  try {
    const amount = 6_900;
    // create proposal to transfer 6,900 tokens genesis squad.
    await voteModule.propose(
      "Should the DAO transfer " +
        amount +
        " tokens to the genesis squad" +
        process.env.WALLET_ADDRESS +
        "For being a cool creator?",
      [
        {
          // Again, we're sending ourselves 0 ETH. Just sending our own token.
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // running a transfer, transfer from treasury to genesis squad wallet.
            "transfer",
            [
              process.env.WALLET_ADDRESS,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),
          toAddress: tokenModule.address,
        },
      ]
    );
    console.log("✅Successfully created proposal to reward gensis squad");
  } catch (error) {
    console.error("🧟‍♂️Failed to create proposal to reward genesis squad", error);
    process.exit(1);
  }
})();
