const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  const { ethers } = require("hardhat");

  describe("Xenos Token", function () {

    async function deployTokenFixture() {
      const XenosToken = await ethers.getContractFactory("XenosToken");
      const signers = await ethers.getSigners();
  
      const xenostoken = await XenosToken.deploy();
 
      await xenostoken.deployed();
  
      return { xenostoken,signers };
    }

    it('should mint 10 token',async function() {
        const { xenostoken, signers } = await loadFixture(deployTokenFixture)
        
        await xenostoken.connect(signers[1]).faucetMint()

        expect(await xenostoken.connect(signers[1]).balanceOf(signers[1].address)).to.be.equal(ethers.utils.parseEther('10'))

    })

    it('should allow the mint only once',async function() {
      const { xenostoken, signers } = await loadFixture(deployTokenFixture)
      
      await xenostoken.connect(signers[1]).faucetMint()

      await expect(xenostoken.connect(signers[1]).faucetMint()).to.be.rejectedWith('You already mint the free tokens')

  })

})