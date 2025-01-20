// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EveryThinkToken is ERC20, Ownable {
    constructor() ERC20("EveryThink Coin", "ETC") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Function to distribute tokens for social engagement
    function rewardSocialEngagement(address user, uint256 amount) public onlyOwner {
        require(amount <= 1000 * 10 ** decimals(), "Reward too large");
        _mint(user, amount);
    }
}