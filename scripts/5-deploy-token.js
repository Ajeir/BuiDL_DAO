import sdk from "/Users/ajeir/Development/Web3/buidlDao/buildspace-dao-starter/scripts/1-initialize-sdk.js";

// you'll need app module address to deploy tokens
const app = sdk.getAppModule("0xCaeb3aa2821c19471F81e35370C1e37d8AADCc4a");

(async () => {
  try {
    // deploy ERC-20 contract token
    const tokenModule = await app.deployTokenModule({
      name: "BuiDlDAO Token",
      symbol: "BuilT",
    });

    console.log(
      "👋Token Module deployed successfully address:",
      tokenModule.address
    );

    console.log("✅Token metadata:", await tokenModule.getMetadata());
  } catch (error) {
    console.error("Failed to deploy token module", error);
    process.exit(1);
  }
})();
