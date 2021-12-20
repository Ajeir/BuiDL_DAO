import sdk from "/Users/ajeir/buidlDao/buildspace-dao-starter/scripts/1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0xCaeb3aa2821c19471F81e35370C1e37d8AADCc4a",
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
