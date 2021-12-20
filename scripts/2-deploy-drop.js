import { ethers } from "ethers";
import sdk from "/Users/ajeir/buidlDao/buildspace-dao-starter/scripts/1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0x4AC11085EaF06f3BC58eB07eAF5B987C1013A92C");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            name: "BuiDlDAO Memebership" ,
            description:"A DAO for tech builders and creators",
            Image: readFileSync("scripts/assets/arc_art.jpg"),
            primarySaleRecipientAddress: ethers.constants.AddressZero,
        });
        
        console.log("Bundle Drop Module deployed successfully address:", 
        );
        
        console.log("budleDrop metadata:", await bundleDropModule.getMetadata(),
        );
    } catch (error) {
        console.error("Failed to deploy bundleDrop module", error);
        process.exit(1);
    }
})();

