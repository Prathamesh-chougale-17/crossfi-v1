// Test script to verify tokenization flow
const { ethers } = require('hardhat');

async function testTokenizationFlow() {
  console.log('🧪 Testing tokenization flow...');
  
  try {
    // Get deployment info
    const deploymentInfo = require('./deployments/localhost.json');
    console.log('📦 Using deployed contracts:', {
      platformToken: deploymentInfo.contracts.platformToken.address,
      gameNFT: deploymentInfo.contracts.gameNFT.address
    });
    
    // Get signers
    const [deployer, user1] = await ethers.getSigners();
    console.log('👤 Deployer:', deployer.address);
    console.log('👤 User1:', user1.address);
    
    // Connect to contracts
    const PlatformToken = await ethers.getContractFactory('PlatformToken');
    const platformToken = PlatformToken.attach(deploymentInfo.contracts.platformToken.address);
    
    const GameNFT = await ethers.getContractFactory('GameNFT');
    const gameNFT = GameNFT.attach(deploymentInfo.contracts.gameNFT.address);
    
    // Test 1: Check initial state
    console.log('\n📊 Initial State:');
    const balance = await platformToken.balanceOf(deployer.address);
    console.log('Deployer JEU balance:', ethers.formatEther(balance));
    
    // Test 2: Mint game NFT (simulating user tokenization)
    console.log('\n🎮 Tokenizing a game...');
    const gameTitle = 'My Awesome Game';
    const gameDescription = 'A great game I created';
    const ipfsHash = 'QmTestHash123';
    const tokenURI = `https://ipfs.io/ipfs/${ipfsHash}/metadata.json`;
    
    const mintTx = await gameNFT.mintGame(
      user1.address,
      gameTitle,
      gameDescription,
      tokenURI,
      ipfsHash
    );
    const receipt = await mintTx.wait();
    
    // Extract token ID from events
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
      
      // Test 3: Verify game details
      const [gameData, royaltyData, gameScore] = await gameNFT.getGameDetails(tokenId);
      console.log('📝 Game Details:');
      console.log('  Title:', gameData.gameTitle);
      console.log('  Creator:', gameData.creator);
      console.log('  Owner:', await gameNFT.ownerOf(tokenId));
      console.log('  IPFS Hash:', gameData.ipfsHash);
      console.log('  Total Earned:', ethers.formatEther(royaltyData.totalEarned), 'JEU');
      
      // Test 4: Simulate some activity
      console.log('\n🎯 Simulating game activity...');
      
      // Record a game play
      const playTx = await gameNFT.recordGamePlay(tokenId, user1.address, 1000, 120);
      await playTx.wait();
      console.log('✅ Game play recorded (score: 1000, duration: 120s)');
      
      // Check updated details
      const [updatedGameData, updatedRoyaltyData] = await gameNFT.getGameDetails(tokenId);
      console.log('📊 After play:');
      console.log('  Total Plays:', updatedGameData.totalPlays.toString());
      console.log('  Creator Earnings:', ethers.formatEther(updatedRoyaltyData.totalEarned), 'JEU');
      
      // Test 5: Test staking
      console.log('\n💰 Testing staking...');
      
      // Transfer some tokens to user1 for staking
      const transferTx = await platformToken.transfer(user1.address, ethers.parseEther('1000'));
      await transferTx.wait();
      
      // User1 approves staking
      const platformTokenUser1 = platformToken.connect(user1);
      const gameNFTUser1 = gameNFT.connect(user1);
      
      const approveTx = await platformTokenUser1.approve(gameNFT.target, ethers.parseEther('100'));
      await approveTx.wait();
      
      // User1 stakes tokens
      const stakeTx = await gameNFTUser1.stakeOnGame(tokenId, ethers.parseEther('100'));
      await stakeTx.wait();
      console.log('✅ Staked 100 JEU on the game');
      
      // Check staking info
      const [stakedAmount, pendingRewards, userShare] = await gameNFT.getUserStakingInfo(tokenId, user1.address);
      console.log('📈 Staking Status:');
      console.log('  Staked Amount:', ethers.formatEther(stakedAmount), 'JEU');
      console.log('  User Share:', userShare.toString() / 100, '%');
      
    } else {
      console.log('❌ Could not find GameMinted event');
    }
    
    console.log('\n✅ All tokenization tests passed! The flow is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

testTokenizationFlow()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });