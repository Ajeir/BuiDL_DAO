import sdk from "/Users/ajeir/buidlDao/buildspace-dao-starter/scripts/1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0xCcB5f6975A01A315000bee857Ee9f9FfF879899a",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "BuiDlDAO Entry",
        description: "NFT access to the DAO",
        Image: readFileSync("scripts/assets/buildDao.jpg"),
      },
    ]);
    console.log("A new NFT has been created in the drop! ");
  } catch (error) {
    console.error("Failed to create a new NFT", error);
  }
})()
