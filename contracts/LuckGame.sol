// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract LuckGame {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    fallback () external payable {
        deposit();
    }

    receive() external payable {}

    function deposit() public payable {}

    function betYourMoney() public payable {
        require(
            address(this).balance > msg.value,
            "not enough found in the contract"
        );

        if (_isOddOrEven()) {
            uint256 gain = msg.value * 2;
            payable(msg.sender).transfer(gain);
        }
    }

 

    function _isOddOrEven() private view returns (bool) {
        console.log('true or false : ',block.timestamp % 2 == 0);
        return block.timestamp % 2 == 0;
    }

    function getBalances() public view returns (uint256) {
        return address(this).balance;
    }

    function transfertBalance(address payable _to) public {
        require(msg.sender == owner, "you are not the owner");
        _to.transfer(address(this).balance);
    }
}
