import { ethers } from "ethers";
import sdk from "/Users/ajeir/Development/Web3/buidlDao/buildspace-dao-starter/scripts/1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "0x8CcF336a2E5f49e9D7F323A21E2e859B9d14a7dd"
);

(async () => {
  try {
    // max token supply
    const amount = 100_000_000;
    // Use a utility function from "ethers" to conver the
    // to have 18 decimals ( the standard for erc-20 tokens )
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
    // Interact with deployed ERC-20 contract and mint tokens
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();

    // Print the total supply of the token
    console.log(
      " 👷 Total supply of 'BuilT' token is:",
      ethers.utils.formatUnits(totalSupply, 18)
    );
  } catch (error) {
    console.error("🧟‍♂️Failed to print tokens, wheel and come again", error);
  }
})();

