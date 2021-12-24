import { useEffect, useMemo, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";
import { ethers } from "ethers";

// instiatiate the SDK on Rinkeby
const sdk = new ThirdwebSDK("rinkeby");

// Grab a reference to ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  "0xCcB5f6975A01A315000bee857Ee9f9FfF879899a"
);

// reference to ERC-20 contract token
const tokenModule = sdk.getTokenModule(
  "0x8CcF336a2E5f49e9D7F323A21E2e859B9d14a7dd"
);

// reference to vote contract
const voteModule = sdk.getVoteModule(
  "0xA106dC6dC212ae4473A6aD192463923C5fCA6275",
);

const App = () => {
  // Utilizing connectWallet from thirdweb
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("Hello", address);


  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Signer is required to sign transaction on the blockchain
  // Without it you can only read data, not write
  const signer = provider ? provider.getSigner() : undefined;

  // Set variable to let me know if user has DAO NFT
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // isClaiming allows you to keep a loading state while the NFT is minting
  const [isClaiming, setIsClaiming] = useState(false);

  // Holds the amount of token each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});

  // Array holding all of the members addresses in the DAO
  const [memberAddresses, setMemberAddresses] = useState([]);

  // Function to shorten wallet addresses
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

// Retrieve all exisiting proposals from the contract
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // A call to voteModule.getAll() to grab the proposals
  voteModule
    .getAll()
    .then((proposals) => {
      //set state
        setProposals(proposals);
        console.log("🗽 Proposals: ", proposals);
      })
      .catch((err) => {
      console.error("🧟‍♂️ Failed to get proposals", err);
    });
}, [hasClaimedNFT]);

// Check if the user has voted on any of the proposals
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // If the app hasn't fininshed retrieveing proposals
  // from the use effect above then it can't check 
  //if the user has voted
  if (!proposals.length) {
    return;
  }

  // Check if user has voted on the first proposal
  voteModule
    .hasVoted(proposals[0].proposalId, address)
    .then((hasVoted) => {
      setHasVoted(hasVoted);
      console.log("🗽 User has voted already: ")
    })
    .catch((err) => {
      console.error("🧟‍♂️ Failed to check if user has voted", err);
    });
}, [hasClaimedNFT, proposals, address]);





  // Grabs the address of all the members holding the DAO NFT
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // grab users who hold NFT with the ID 0
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("🤺Members addresses", addresses);
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.error("🥀Failed to get member list", err);
      });
  }, [hasClaimedNFT]);

  // Grabs the # of token each member holds
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab all the balances
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("🍾Member token amounts", amounts);
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("🌋Failed to get member token amounts", err);
      });
  }, [hasClaimedNFT]);

  // Combine all the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If address isn't in memberTokenAmounts,
          // It means they don't own any of the DAO tokens
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

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

  if (error && error.name === "UnsupportedChainIdError") { 
    return (
      <div className="unsupported-network">
        <h2> Please connect to the Rinkeby network</h2>
        <p>
          For now, BuiDLDAO only works if you're connected to Rinkeby.
        </p>
      </div>
    );
  }

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
        <div>
          <div>
            <h1>Members List</h1>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2> Acitve Proposals</h2>
            <form 
              onSubmit={async(e) => {
                e.preventDefault();
                e.stopPropagation();

                // before async, disable button to prevernt multiple clicks
                setIsVoting(true);
                
                // get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  let voteResult = {
                    proposalId: proposal.proposalId,
                  //abstain by defeault
                  vote: 2,
                };
                proposal.votes.forEach((vote) => {
                  const elem =document.getElementById(
                    proposal.proposalId + "-" + vote.type
                  );
  
                  if (elem.checked) {
                    voteResult.vote = vote.type;
                    return;
                  }
                });
                return voteResult;
              });
              
              // first ensure that users delegate their tokens to vote
              try {
                // check if the wallet needs to delegate their tokens before they can vote
                const delegation = await tokenModule.getDelegationOf(address);
                // if delegation is the 0x0 address, it means they haven't delegated their governance tokens yet
                if (delegation === ethers.constants.AddressZero) {
                  // delegate the tokens for them if they haven't delegated yet before voting
                  await tokenModule.delegateTo(address);
                }
                // now initiate vote on proposals
                try {
                  await Promise.all(
                    votes.map(async (vote) => {
                      //check whether proposal is open for voting
                      // get largest state of the proposal
                      const proposal = await voteModule.get(vote.proposalId);
                      // if proposal is open for voting ( state === 1 means it is open)
                      if (proposal.state === 1) {
                        // if its open then allow voting
                        return voteModule.vote(vote.proposalId, vote.vote);
                      }
                      // if proposal is not open for voting, return nothing and gwaan
                      return;
                    })
                  );
                  try {
                    // if any of the proposals are ready for execution then execute
                    // if state is in state 4 then its ready for execution
                    await Promise.all(
                      votes.map(async (vote) => {
                        // first get the latest state again incase user may have voted before
                        const proposal = await voteModule.get(
                          vote.proposalId
                        );

                        // if state is in state 4 run execution
                        if (proposal.state === 4) {
                          return voteModule.execute(vote.proposalId);
                        }
                      })
                    );
                    // code executes successfully if it reaches here, therefore set "hasVoted" state to true
                    setHasVoted(true);
                    // log success message
                    console.log("Voted successfully!");
                  } catch (err) {
                    console.log("woops, seems the code failed to execute votes", err);
                  }
                  } catch (err) {
                    console.log("blasted, seems the code failed to vote", err);
                  }
              } catch (err) {
                console.log("damnit, seems the code failed to delegate tokens", err);
              } finally {
                // in either case, set the isVoting state to false to enable the button again
                setIsVoting(false);
              }
            }}
            >
              {proposals.map((proposal, index) => (
                <div key = {proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map((vote) => (
                      <div key={vote.type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + vote.type}
                          name={proposal.proposalId}
                          value={vote.type}
                          // default the abstain vote to checked
                          defaultChecked={vote.type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + vote.type}>
                          {vote.label}
                        </label>
                        </div>
                    ))}
                    </div>
                    </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting 
                ? "Voting..." 
                : hasVoted
                 ? "You already voted bregin"
                  : "Submit Yuh Votes"}
              </button>
              <small>
                 This will trigger the multiple transactions you will need to sign.
              </small>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
        console.log(
          "💯Congrats user! You've successfully minted your membership NFT! check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0"
        );
      });
  };

  // Render mint screen
  return (
    <div className="mint-nft">
      <h1>Mint your free buidL memebership NFT</h1>
      <button className="mint-nft" onClick={() => mintNft()}>
        {isClaiming ? "Minting..." : "Mint"}
      </button>
    </div>
  );
};

export default App;
