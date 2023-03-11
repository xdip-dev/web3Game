// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IERC20.sol"; // import ERC20 token contract interface

contract Treasury {
    IERC20 public token; // declare public variable for ERC20 token contract interface
    uint256 _amount;

    event Deposit(uint256 value);
    event Withdraw(uint256 value);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress); // initialize ERC20 token contract interface
    }

    function depositTokens(uint256 amount) public {
        _amount = amount * 1 ether;

        require(token.allowance(msg.sender, address(this)) >= _amount, "You must approve tokens first");
        require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");

        emit Deposit(_amount);
        // deposit tokens into the game contract
    }

    function withdrawTokens(uint256 amount) public {
        _amount = amount * 1 ether;

        require(token.balanceOf(address(this)) >= _amount, "Insufficient tokens in the game contract");
        require(token.transfer(msg.sender, _amount), "Token transfer failed");

        emit Withdraw(_amount);
        // withdraw tokens from the game contract
    }
}