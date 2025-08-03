// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
/**
 * @title GameNFT
 * @dev NFT contract for tokenizing AI-generated games
 * Each game becomes an NFT with royalty mechanisms
 */
contract GameNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;
    
    // Platform token for rewards and staking
    IERC20 public immutable platformToken;
    
    // Platform fee percentage (basis points, 250 = 2.5%)
    uint256 public platformFee = 250;
    
    // Royalty percentage for creators (basis points, 500 = 5%)
    uint256 public creatorRoyalty = 500;
    
    struct GameMetadata {
        address creator;
        string gameTitle;
        string gameDescription;
        string ipfsHash; // Game code and assets
        uint256 createdAt;
        uint256 totalPlays;
        uint256 totalForks;
        uint256 totalStaked;
        bool isActive;
    }
    
    struct RoyaltyInfo {
        uint256 totalEarned;
        uint256 playEarnings;
        uint256 forkEarnings;
        uint256 stakingRewards;
        uint256 lastClaimed;
    }
    
    // Token ID to game metadata
    mapping(uint256 => GameMetadata) public games;
    
    // Token ID to royalty information
    mapping(uint256 => RoyaltyInfo) public royalties;
    
    // User staking: tokenId => staker => amount
    mapping(uint256 => mapping(address => uint256)) public stakes;
    
    // Total staked per game
    mapping(uint256 => uint256) public totalStaked;
    
    // Staking rewards pool per game
    mapping(uint256 => uint256) public rewardPools;
    
    // Game performance metrics
    mapping(uint256 => uint256) public gameScores; // Composite score
    
    // Events
    event GameMinted(uint256 indexed tokenId, address indexed creator, string gameTitle);
    event GamePlayed(uint256 indexed tokenId, address indexed player, uint256 reward);
    event GameForked(uint256 indexed originalId, uint256 indexed newId, address indexed forker);
    event TokensStaked(uint256 indexed tokenId, address indexed staker, uint256 amount);
    event TokensUnstaked(uint256 indexed tokenId, address indexed staker, uint256 amount);
    event RewardsDistributed(uint256 indexed tokenId, uint256 totalReward);
    event RoyaltyClaimed(uint256 indexed tokenId, address indexed creator, uint256 amount);
    
    constructor(
        address _platformToken,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        platformToken = IERC20(_platformToken);
    }
    
    /**
     * @dev Mint a new game NFT
     */
    function mintGame(
        address creator,
        string memory gameTitle,
        string memory gameDescription,
        string memory _tokenURI,
        string memory ipfsHash
    ) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(creator, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        
        games[newTokenId] = GameMetadata({
            creator: creator,
            gameTitle: gameTitle,
            gameDescription: gameDescription,
            ipfsHash: ipfsHash,
            createdAt: block.timestamp,
            totalPlays: 0,
            totalForks: 0,
            totalStaked: 0,
            isActive: true
        });
        
        emit GameMinted(newTokenId, creator, gameTitle);
        
        return newTokenId;
    }
    
    /**
     * @dev Record a game play and distribute rewards
     */
    function recordGamePlay(
        uint256 tokenId,
        address player,
        uint256 score,
        uint256 duration
    ) external onlyOwner nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Game does not exist");
        require(games[tokenId].isActive, "Game is not active");
        
        GameMetadata storage game = games[tokenId];
        game.totalPlays++;
        
        // Calculate play reward based on game performance
        uint256 baseReward = calculatePlayReward(tokenId, score, duration);
        
        // Distribute rewards
        if (baseReward > 0) {
            // Creator royalty
            uint256 creatorReward = (baseReward * creatorRoyalty) / 10000;
            royalties[tokenId].playEarnings += creatorReward;
            royalties[tokenId].totalEarned += creatorReward;
            
            // Platform fee
            uint256 platformReward = (baseReward * platformFee) / 10000;
            
            // Remaining to stakers
            uint256 stakerReward = baseReward - creatorReward - platformReward;
            if (totalStaked[tokenId] > 0) {
                rewardPools[tokenId] += stakerReward;
            }
            
            // Transfer reward to player
            uint256 playerReward = baseReward / 4; // 25% to player
            platformToken.transfer(player, playerReward);
            
            emit GamePlayed(tokenId, player, playerReward);
        }
        
        // Update game score
        updateGameScore(tokenId, score);
    }
    
    /**
     * @dev Fork a game (creates new NFT)
     */
    function forkGame(
        uint256 originalTokenId,
        address forker,
        string memory newTitle,
        string memory newDescription,
        string memory _newTokenURI,
        string memory newIpfsHash
    ) external onlyOwner returns (uint256) {
        require(_ownerOf(originalTokenId) != address(0), "Original game does not exist");
        
        // Mint new game NFT
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(forker, newTokenId);
        _setTokenURI(newTokenId, _newTokenURI);
        
        games[newTokenId] = GameMetadata({
            creator: forker,
            gameTitle: newTitle,
            gameDescription: newDescription,
            ipfsHash: newIpfsHash,
            createdAt: block.timestamp,
            totalPlays: 0,
            totalForks: 0,
            totalStaked: 0,
            isActive: true
        });
        
        // Update original game fork count
        games[originalTokenId].totalForks++;
        
        // Pay fork royalty to original creator
        uint256 forkFee = 1000 * 10**18; // 1000 tokens
        royalties[originalTokenId].forkEarnings += forkFee;
        royalties[originalTokenId].totalEarned += forkFee;
        
        emit GameForked(originalTokenId, newTokenId, forker);
        
        return newTokenId;
    }
    
    /**
     * @dev Stake tokens on a game
     */
    function stakeOnGame(uint256 tokenId, uint256 amount) external nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Game does not exist");
        require(games[tokenId].isActive, "Game is not active");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens from user
        platformToken.transferFrom(msg.sender, address(this), amount);
        
        // Update staking records
        stakes[tokenId][msg.sender] += amount;
        totalStaked[tokenId] += amount;
        games[tokenId].totalStaked += amount;
        
        emit TokensStaked(tokenId, msg.sender, amount);
    }
    
    /**
     * @dev Unstake tokens from a game
     */
    function unstakeFromGame(uint256 tokenId, uint256 amount) external nonReentrant {
        require(stakes[tokenId][msg.sender] >= amount, "Insufficient staked amount");
        
        // Calculate and distribute pending rewards
        uint256 pendingRewards = calculateStakingRewards(tokenId, msg.sender);
        if (pendingRewards > 0) {
            platformToken.transfer(msg.sender, pendingRewards);
            rewardPools[tokenId] -= pendingRewards;
        }
        
        // Update staking records
        stakes[tokenId][msg.sender] -= amount;
        totalStaked[tokenId] -= amount;
        games[tokenId].totalStaked -= amount;
        
        // Return staked tokens
        platformToken.transfer(msg.sender, amount);
        
        emit TokensUnstaked(tokenId, msg.sender, amount);
    }
    
    /**
     * @dev Claim royalties for game creator
     */
    function claimRoyalties(uint256 tokenId) external nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Only game owner can claim");
        
        RoyaltyInfo storage royalty = royalties[tokenId];
        uint256 claimable = royalty.totalEarned - royalty.lastClaimed;
        
        require(claimable > 0, "No royalties to claim");
        
        royalty.lastClaimed = royalty.totalEarned;
        platformToken.transfer(msg.sender, claimable);
        
        emit RoyaltyClaimed(tokenId, msg.sender, claimable);
    }
    
    /**
     * @dev Calculate play reward based on game performance
     */
    function calculatePlayReward(
        uint256 tokenId,
        uint256 score,
        uint256 duration
    ) internal view returns (uint256) {
        // Base reward calculation
        uint256 baseReward = 10 * 10**18; // 10 tokens base
        
        // Score multiplier (higher score = more reward)
        uint256 scoreMultiplier = (score * 100) / 1000; // 0-100% bonus
        
        // Duration multiplier (longer engagement = more reward)
        uint256 durationMultiplier = duration > 300 ? 150 : 100; // 50% bonus for 5+ min
        
        // Game popularity multiplier
        uint256 popularityMultiplier = games[tokenId].totalPlays > 100 ? 120 : 100;
        
        return (baseReward * (100 + scoreMultiplier) * durationMultiplier * popularityMultiplier) / 1000000;
    }
    
    /**
     * @dev Calculate staking rewards for a user
     */
    function calculateStakingRewards(
        uint256 tokenId,
        address staker
    ) internal view returns (uint256) {
        if (totalStaked[tokenId] == 0) return 0;
        
        uint256 userStake = stakes[tokenId][staker];
        uint256 userShare = (userStake * 10000) / totalStaked[tokenId];
        
        return (rewardPools[tokenId] * userShare) / 10000;
    }
    
    /**
     * @dev Update game performance score
     */
    function updateGameScore(uint256 tokenId, uint256 playScore) internal {
        GameMetadata storage game = games[tokenId];
        
        // Composite score based on plays, forks, and staking
        uint256 playWeight = game.totalPlays * 10;
        uint256 forkWeight = game.totalForks * 50;
        uint256 stakeWeight = game.totalStaked / 10**18;
        
        gameScores[tokenId] = playWeight + forkWeight + stakeWeight + playScore;
    }
    
    /**
     * @dev Get game details
     */
    function getGameDetails(uint256 tokenId) external view returns (
        GameMetadata memory gameData,
        RoyaltyInfo memory royaltyData,
        uint256 gameScore
    ) {
        return (games[tokenId], royalties[tokenId], gameScores[tokenId]);
    }
    
    /**
     * @dev Get user's staking info for a game
     */
    function getUserStakingInfo(uint256 tokenId, address user) external view returns (
        uint256 stakedAmount,
        uint256 pendingRewards,
        uint256 userShare
    ) {
        stakedAmount = stakes[tokenId][user];
        pendingRewards = calculateStakingRewards(tokenId, user);
        userShare = totalStaked[tokenId] > 0 ? (stakedAmount * 10000) / totalStaked[tokenId] : 0;
    }
    
    /**
     * @dev Override required by Solidity
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Admin functions
     */
    function setPlatformFee(uint256 _platformFee) external onlyOwner {
        require(_platformFee <= 1000, "Platform fee too high"); // Max 10%
        platformFee = _platformFee;
    }
    
    function setCreatorRoyalty(uint256 _creatorRoyalty) external onlyOwner {
        require(_creatorRoyalty <= 1000, "Creator royalty too high"); // Max 10%
        creatorRoyalty = _creatorRoyalty;
    }
    
    function toggleGameStatus(uint256 tokenId) external onlyOwner {
        games[tokenId].isActive = !games[tokenId].isActive;
    }
}