import sdk from "/Users/ajeir/Development/Web3/buidlDao/buildspace-dao-starter/scripts/1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "0x8CcF336a2E5f49e9D7F323A21E2e859B9d14a7dd",
);

(async () => {
  try {
    // log the current roles.
    console.log(
      "Here are the current roles within the DAO:",
      await tokenModule.getAllRoleMembers()
    );

    // revoke admin privilages fom my wallet to make the DAO fair
    await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
    console.log(
      "✅Roles after revoking creators",
      await tokenModule.getAllRoleMembers()
    );
    console.log("successfully removed admin powers from genesis squad");
  } catch (error) {
    console.error("Failed to revoke admin powers from genesis squad", error);
  }
})();
