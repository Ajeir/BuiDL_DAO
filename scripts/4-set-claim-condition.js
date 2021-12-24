import sdk from "/Users/ajeir/Development/Web3/buidlDao/buildspace-dao-starter/scripts/1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(
  "0xCcB5f6975A01A315000bee857Ee9f9FfF879899a",
);

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
    // Conditions specifics
    claimConditionFactory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 100,
      maxQuantityPerTransaction: 1,
    });

    await bundleDrop.setClaimCondition(0, claimConditionFactory);
    console.log("✅ Claim Condition set successfully on budleDrop address:", bundleDrop.address);
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();
