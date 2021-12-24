import sdk from "/Users/ajeir/Development/Web3/buidlDao/buildspace-dao-starter/scripts/1-initialize-sdk.js";

// Get app module address
const app = sdk.getAppModule("0xCaeb3aa2821c19471F81e35370C1e37d8AADCc4a");

(async () => {
  try {
    const voteModule = await app.deployVoteModule({
      name: "BuiDlDAO Vote",

      // Location of governance token
      votingTokenAddress: "0x8CcF336a2E5f49e9D7F323A21E2e859B9d14a7dd",

      // Set specific voting period after proposal is submitted
      // to allow members to vote on the proposal
      proposalStartWaitTimeInSeconds: 0,

      // Set specific time period to end voting after
      // a proposal has been submitted
      // set it to 24 hours (86400) as an example
      proposalVotingTimeInSeconds: 24 * 60 * 60,

      // In order for a proposal to pass, a minimum x % of token must be used in the vote
      votingQuorumFraction: 0,

      // Minimum # of tokens required to create a proposal
      // set it to 0 so members don't need a set # of tokens
      // to create a proposal
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      " ✅ Vote Module deployed successfully address:",
      voteModule.address
    );
  } catch (err) {
    console.log(" Woops, failed to deploy vote module", err);
  }
})();
