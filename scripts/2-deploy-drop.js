import { ethers } from "ethers";
import sdk from "/Users/ajeir/buidlDao/buildspace-dao-starter/scripts/1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0xCaeb3aa2821c19471F81e35370C1e37d8AADCc4a");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            name: "BuiDlDAO Memebership" ,
            description:"A DAO for tech builders and creators",
            Image: readFileSync("/Users/ajeir/buidlDao/buildspace-dao-starter/scripts/assets/arc_art.jpg"),
            primarySaleRecipientAddress: ethers.constants.AddressZero,
        });
        
        console.log("👋Bundle Drop Module deployed successfully address:", bundleDropModule.address);
        
        console.log("✅budleDrop metadata:", await bundleDropModule.getMetadata(),
        );
    } catch (error) {
        console.error("Failed to deploy bundleDrop module", error);
        process.exit(1);
    }
})();

