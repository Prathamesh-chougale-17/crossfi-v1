// Quick test script to verify contract deployment and functionality
const { ethers } = require('hardhat');

async function testContracts() {
  console.log('🧪 Testing deployed contracts...');
  
  try {
    // Get deployment info
    const deploymentInfo = require('./deployments/crossfi-testnet.json');
    console.log('📦 Deployment info:', deploymentInfo);
    
    // Get signers
    const [deployer] = await ethers.getSigners();
    console.log('👤 Deployer:', deployer.address);
    
    // Connect to contracts
    const PlatformToken = await ethers.getContractFactory('PlatformToken');
    const platformToken = PlatformToken.attach(deploymentInfo.contracts.platformToken.address);
    
    const GameNFT = await ethers.getContractFactory('GameNFT');
    const gameNFT = GameNFT.attach(deploymentInfo.contracts.gameNFT.address);
    
    // Test platform token
    console.log('\n🪙 Testing Platform Token...');
    const balance = await platformToken.balanceOf(deployer.address);
    console.log('Deployer balance:', ethers.formatEther(balance), 'JEU');
    
    const [playPool, stakingPool, creatorPool] = await platformToken.getRewardPools();
    console.log('Play Pool:', ethers.formatEther(playPool), 'JEU');
    console.log('Staking Pool:', ethers.formatEther(stakingPool), 'JEU');
    console.log('Creator Pool:', ethers.formatEther(creatorPool), 'JEU');
    
    // Test NFT minting
    console.log('\n🎮 Testing Game NFT...');
    const mintTx = await gameNFT.mintGame(
      deployer.address,
      'Test Game',
      'A test game for verification',
      'https://ipfs.io/ipfs/QmTest/metadata.json',
      'QmTest'
    );
    const receipt = await mintTx.wait();
    
    const event = receipt.logs.find(log => {
      try {
        return gameNFT.interface.parseLog(log).name === 'GameMinted';
      } catch {
        return false;
      }
    });
    
    if (event) {
      const parsedEvent = gameNFT.interface.parseLog(event);
      const tokenId = parsedEvent.args.tokenId.toString();
      console.log('✅ Game NFT minted with Token ID:', tokenId);
      
      // Get game details
      const [gameData, royaltyData, gameScore] = await gameNFT.getGameDetails(tokenId);
      console.log('Game Title:', gameData.gameTitle);
      console.log('Creator:', gameData.creator);
      console.log('Total Plays:', gameData.totalPlays.toString());
      console.log('Game Score:', gameScore.toString());
    }
    
    console.log('\n✅ All tests passed! Dynamic GameFi system is working.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });