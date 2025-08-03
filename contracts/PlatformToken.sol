// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title PlatformToken (JEU)
 * @dev The native token for the Jeu Plaza GameFi ecosystem
 * Used for staking, rewards, governance, and play-to-earn mechanics
 */
contract PlatformToken is ERC20, ERC20Burnable, Ownable, Pausable {
    
    // Maximum supply: 1 billion tokens
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    
    // Minting allocations
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 10% initial
    uint256 public constant TEAM_ALLOCATION = 150_000_000 * 10**18; // 15% team
    uint256 public constant COMMUNITY_REWARDS = 400_000_000 * 10**18; // 40% rewards
    uint256 public constant ECOSYSTEM_FUND = 250_000_000 * 10**18; // 25% ecosystem
    uint256 public constant LIQUIDITY_POOL = 100_000_000 * 10**18; // 10% liquidity
    
    // Vesting and reward tracking
    mapping(address => uint256) public teamVesting;
    mapping(address => uint256) public lastRewardClaim;
    
    // Reward pools
    uint256 public playToEarnPool;
    uint256 public stakingRewardPool;
    uint256 public creatorRewardPool;
    
    // Authorized contracts for minting rewards
    mapping(address => bool) public authorizedMinters;
    
    // Events
    event RewardMinted(address indexed recipient, uint256 amount, string rewardType);
    event PoolRefilled(string poolType, uint256 amount);
    event AuthorizedMinterAdded(address indexed minter);
    event AuthorizedMinterRemoved(address indexed minter);
    
    constructor() ERC20("Jeu Token", "JEU") Ownable(msg.sender) {
        // Mint initial supply to deployer
        _mint(msg.sender, INITIAL_SUPPLY);
        
        // Initialize reward pools
        playToEarnPool = COMMUNITY_REWARDS * 40 / 100; // 40% of community rewards
        stakingRewardPool = COMMUNITY_REWARDS * 35 / 100; // 35% of community rewards
        creatorRewardPool = COMMUNITY_REWARDS * 25 / 100; // 25% of community rewards
    }
    
    /**
     * @dev Mint tokens for play-to-earn rewards
     * Only authorized contracts can call this
     */
    function mintPlayReward(address player, uint256 amount) external {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        require(playToEarnPool >= amount, "Insufficient play reward pool");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        playToEarnPool -= amount;
        _mint(player, amount);
        
        emit RewardMinted(player, amount, "PlayToEarn");
    }
    
    /**
     * @dev Mint tokens for staking rewards
     */
    function mintStakingReward(address staker, uint256 amount) external {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        require(stakingRewardPool >= amount, "Insufficient staking reward pool");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        stakingRewardPool -= amount;
        _mint(staker, amount);
        
        emit RewardMinted(staker, amount, "Staking");
    }
    
    /**
     * @dev Mint tokens for creator rewards
     */
    function mintCreatorReward(address creator, uint256 amount) external {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        require(creatorRewardPool >= amount, "Insufficient creator reward pool");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        creatorRewardPool -= amount;
        _mint(creator, amount);
        
        emit RewardMinted(creator, amount, "Creator");
    }
    
    /**
     * @dev Emergency mint for ecosystem needs
     */
    function emergencyMint(address recipient, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(recipient, amount);
    }
    
    /**
     * @dev Refill reward pools (from ecosystem fund)
     */
    function refillRewardPools(
        uint256 playAmount,
        uint256 stakingAmount,
        uint256 creatorAmount
    ) external onlyOwner {
        uint256 totalRefill = playAmount + stakingAmount + creatorAmount;
        require(totalSupply() + totalRefill <= MAX_SUPPLY, "Exceeds max supply");
        
        if (playAmount > 0) {
            playToEarnPool += playAmount;
            emit PoolRefilled("PlayToEarn", playAmount);
        }
        
        if (stakingAmount > 0) {
            stakingRewardPool += stakingAmount;
            emit PoolRefilled("Staking", stakingAmount);
        }
        
        if (creatorAmount > 0) {
            creatorRewardPool += creatorAmount;
            emit PoolRefilled("Creator", creatorAmount);
        }
        
        // Mint tokens to contract for distribution
        _mint(address(this), totalRefill);
    }
    
    /**
     * @dev Add authorized minter (GameNFT contract, staking contracts, etc.)
     */
    function addAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit AuthorizedMinterAdded(minter);
    }
    
    /**
     * @dev Remove authorized minter
     */
    function removeAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit AuthorizedMinterRemoved(minter);
    }
    
    /**
     * @dev Pause token transfers (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get reward pool balances
     */
    function getRewardPools() external view returns (
        uint256 playPool,
        uint256 stakingPool,
        uint256 creatorPool
    ) {
        return (playToEarnPool, stakingRewardPool, creatorRewardPool);
    }
    
    /**
     * @dev Calculate dynamic reward based on user activity
     */
    function calculateDynamicReward(
        address user,
        uint256 baseReward,
        uint256 activityScore,
        uint256 loyaltyBonus
    ) external view returns (uint256) {
        // Base reward with activity multiplier
        uint256 reward = baseReward + (baseReward * activityScore / 100);
        
        // Loyalty bonus (based on token holding time)
        reward += loyaltyBonus;
        
        // Early user bonus (first 10,000 users get 20% bonus)
        if (_getTotalHolders() < 10000) {
            reward = reward * 120 / 100;
        }
        
        return reward;
    }
    
    /**
     * @dev Get approximate total holders (simplified)
     */
    function _getTotalHolders() internal view returns (uint256) {
        // This is a simplified implementation
        // In practice, you'd track this more accurately
        return totalSupply() / 1000 * 10**18; // Rough estimation
    }
    
    /**
     * @dev Override transfer functions to add pause functionality
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(!paused(), "Token transfers paused");
        super._update(from, to, amount);
    }
    
    /**
     * @dev Batch transfer for airdrops and rewards distribution
     */
    function batchTransfer(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            transfer(recipients[i], amounts[i]);
        }
    }
}