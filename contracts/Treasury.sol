// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IERC20.sol"; // import ERC20 token contract interface
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Treasury is Ownable {
    IERC20 public token; // declare public variable for ERC20 token contract interface

    uint256 private balancePool;

    address[] public playerPlayed;

    mapping(uint8 => address[]) public teamMapping;

    mapping(address => uint256) private playerAllowenceWithdraw;

    event Deposit(uint256 value);
    event Withdraw(uint256 value);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress); // initialize ERC20 token contract interface
    }

    function depositTokens(uint256 amount, uint8 teamNumber) public {
        require(amount == 1 ether, "please Bet only 1 token");

        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "You must approve tokens first"
        );
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );

        require(
            !checkPlayerPlayed(msg.sender),
            "You already played for this round"
        );

        balancePool += amount;
        assignTeamMember(teamNumber, msg.sender);
        playerPlayed.push(msg.sender);

        emit Deposit(amount);
    }

    function withdrawTokens() public {
        require(
            playerAllowenceWithdraw[msg.sender] > 0,
            "not enough allowance"
        );
        uint256 amountToTransfert = playerAllowenceWithdraw[msg.sender];

        playerAllowenceWithdraw[msg.sender] = 0;

        token.transfer(msg.sender, amountToTransfert);
    }

    function assignTeamMember(uint8 teamNumber, address addressPlayer) private {
        teamMapping[teamNumber].push(addressPlayer);
    }

    function readMapping(
        uint8 teamNumber
    ) public view returns (address[] memory) {
        return teamMapping[teamNumber];
    }

    function getBalancePool() public view returns (uint256) {
        return balancePool;
    }

    function getSizeArray(
        address[] memory addresses
    ) private pure returns (uint256) {
        return addresses.length;
    }

    function calculateRewardsOfTheRound(
        uint8 winningTeam
    ) public view returns (uint256) {
        return getBalancePool() / getSizeArray(readMapping(winningTeam));
    }

    function addAllowanceWinners(uint8 winningTeam) private {
        address[] memory winners = readMapping(winningTeam);
        uint winningArraySize = getSizeArray(winners);
        uint reward = calculateRewardsOfTheRound(winningTeam);

        for (uint i = 0; i < winningArraySize; i++) {
            playerAllowenceWithdraw[winners[i]] += reward;
        }

        balancePool = 0;
    }

    function getAllowanceWithdraw(
        address _address
    ) public view returns (uint256) {
        return playerAllowenceWithdraw[_address];
    }

    function setWinnerTeam() private view onlyOwner returns (uint8) {
        uint256 team1 = getSizeArray(readMapping(1));
        uint256 team2 = getSizeArray(readMapping(2));
        uint256 team3 = getSizeArray(readMapping(3));
        uint8 Winner = 1;
        if (team2 > team1) {
            Winner = 2;
        }
        if (team3 > team1) {
            Winner = 3;
        }
        return Winner;
    }

    function resetTeam() private {
        for (uint8 i = 1; i < 4; i++) {
            delete teamMapping[i];
        }
    }

    function deletePlayerPlayed() private {
        delete playerPlayed;
    }

    function checkPlayerPlayed(address player) public view returns (bool) {
        for (uint i = 0; i < playerPlayed.length; i++) {
            if (playerPlayed[i] == player) {
                return true;
            }
        }

        return false;
    }

    function playRound() public onlyOwner{
        uint8 winner = setWinnerTeam();
        addAllowanceWinners(winner);
        resetTeam();
        deletePlayerPlayed();
    }
}
