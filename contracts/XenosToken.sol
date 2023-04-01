// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XenosToken is ERC20, ERC20Burnable, Ownable {

    mapping (address => bool) private alreadyMintfreeToken;

    constructor() ERC20("Xenos", "XDP") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function faucetMint() public {
        require(alreadyMintfreeToken[msg.sender]==false,'You already mint the free tokens');

        alreadyMintfreeToken[msg.sender]=true;

        _mint(msg.sender,10*10 ** decimals());
    }
}