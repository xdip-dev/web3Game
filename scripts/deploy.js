// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {

  const Xenos = await hre.ethers.getContractFactory("XenosToken");
  const xenos = await Xenos.deploy();

  await xenos.deployed();

  await xenos.mint('0x70997970C51812dc3A010C7d01b50e0d17dc79C8',ethers.utils.parseEther('100'))
  await xenos.mint('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',ethers.utils.parseEther('100'))


  console.log(
    `Xenos Token deployed to ${xenos.address}`
  );

  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(xenos.address);

  await treasury.deployed();

  console.log(
    `Treasury deployed to ${treasury.address}`
  );

  await xenos.approve(`${treasury.address}`,ethers.utils.parseEther('100'))

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
