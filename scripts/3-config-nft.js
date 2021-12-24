import sdk from "/Users/ajeir/Development/Web3/buidlDao/buildspace-dao-starter/scripts/1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x7D5FA0ca749072256406d78739d3c49600f6d34f",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "BuiDlDAO Entry",
        description: "NFT access to the DAO",
        Image: readFileSync("/Users/ajeir/buidlDao/buildspace-dao-starter/scripts/assets/buildDao.jpg"),
      },
    ]);
    console.log("A new NFT has been created in the drop! ");
  } catch (error) {
    console.error("Failed to create a new NFT", error);
  }
})()
