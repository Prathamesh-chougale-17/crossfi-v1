const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting GameFi smart contract deployment...");
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Get account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  try {
    // Deploy Platform Token (JEU) first
    console.log("\n🪙 Deploying Platform Token (JEU)...");
    const PlatformToken = await hre.ethers.getContractFactory("PlatformToken");
    const platformToken = await PlatformToken.deploy();
    await platformToken.waitForDeployment();
    const platformTokenAddress = await platformToken.getAddress();
    console.log("✅ Platform Token deployed to:", platformTokenAddress);
    
    // Deploy GameNFT contract
    console.log("\n🎮 Deploying GameNFT contract...");
    const GameNFT = await hre.ethers.getContractFactory("GameNFT");
    const gameNFT = await GameNFT.deploy(
      platformTokenAddress,
      "Jeu Plaza Game NFT",
      "JPGAME"
    );
    await gameNFT.waitForDeployment();
    const gameNFTAddress = await gameNFT.getAddress();
    console.log("✅ GameNFT deployed to:", gameNFTAddress);
    
    // Authorize GameNFT contract to mint rewards
    console.log("\n🔐 Authorizing GameNFT contract to mint rewards...");
    const authTx = await platformToken.addAuthorizedMinter(gameNFTAddress);
    await authTx.wait();
    console.log("✅ GameNFT contract authorized as minter");
    
    // Setup initial reward pools
    console.log("\n💧 Setting up initial reward pools...");
    const setupTx = await platformToken.refillRewardPools(
      hre.ethers.parseEther("1000000"), // 1M tokens for play-to-earn
      hre.ethers.parseEther("1500000"), // 1.5M tokens for staking
      hre.ethers.parseEther("500000")   // 500K tokens for creators
    );
    await setupTx.wait();
    console.log("✅ Reward pools initialized");
    
    // Verify deployments
    console.log("\n🔍 Verifying deployments...");
    const tokenSupply = await platformToken.totalSupply();
    const tokenSymbol = await platformToken.symbol();
    const nftName = await gameNFT.name();
    const isAuthorized = await platformToken.authorizedMinters(gameNFTAddress);
    
    console.log("📊 Platform Token Supply:", hre.ethers.formatEther(tokenSupply), tokenSymbol);
    console.log("🎯 GameNFT Name:", nftName);
    console.log("🔑 Authorization Status:", isAuthorized);
    
    // Create deployment info object
    const deploymentInfo = {
      network: hre.network.name,
      chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
      deployer: deployer.address,
      contracts: {
        platformToken: {
          address: platformTokenAddress,
          name: "Jeu Token",
          symbol: "JEU",
          totalSupply: hre.ethers.formatEther(tokenSupply)
        },
        gameNFT: {
          address: gameNFTAddress,
          name: nftName,
          symbol: "JPGAME"
        }
      },
      timestamp: new Date().toISOString(),
      gasUsed: "Estimated deployment cost calculated during deployment"
    };
    
    // Save deployment info
    const fs = require('fs');
    const path = require('path');
    
    const deploymentDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentDir)) {
      fs.mkdirSync(deploymentDir);
    }
    
    const deploymentFile = path.join(deploymentDir, `${hre.network.name}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    
    console.log(`\n📁 Deployment info saved to: ${deploymentFile}`);
    
    // Display final summary
    console.log("\n🎉 Deployment Summary:");
    console.log("=" .repeat(50));
    console.log(`Network: ${hre.network.name}`);
    console.log(`Platform Token: ${platformTokenAddress}`);
    console.log(`GameNFT: ${gameNFTAddress}`);
    console.log(`Deployer: ${deployer.address}`);
    console.log("=" .repeat(50));
    
    // Return addresses for further use
    return {
      platformToken: platformTokenAddress,
      gameNFT: gameNFTAddress
    };
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

// Handle script execution
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;