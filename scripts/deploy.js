const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Deploying CredentialVerifier contract...");

    const CredentialVerifier = await hre.ethers.getContractFactory("CredentialVerifier");
    const credentialVerifier = await CredentialVerifier.deploy();

    await credentialVerifier.waitForDeployment();

    const address = await credentialVerifier.getAddress();
    console.log("CredentialVerifier deployed to:", address);

    // Save the contract address and ABI to the frontend
    const frontendDir = path.join(__dirname, "..", "frontend", "src");
    if (!fs.existsSync(frontendDir)) {
        fs.mkdirSync(frontendDir, { recursive: true });
    }

    const configPath = path.join(frontendDir, "contract-config.json");
    const configData = {
        address: address,
        abi: JSON.parse(credentialVerifier.interface.formatJson())
    };

    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    console.log("Contract config saved to:", configPath);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

