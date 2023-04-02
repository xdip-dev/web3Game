const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");


describe("Token contract", function () {

  async function deployTokenFixture() {
    const XenosToken = await ethers.getContractFactory("XenosToken");
    const [ownerToken] = await ethers.getSigners();

    const xenostoken = await XenosToken.deploy();

    await xenostoken.deployed();

    return { xenostoken, ownerToken };
  }

  describe('Treasury', () => {

    async function deployTreasuryFixture() {

      const { xenostoken, ownerToken } = await loadFixture(deployTokenFixture)

      const signers = await ethers.getSigners();

      const Treasury = await ethers.getContractFactory("Treasury");
      const treasury = await Treasury.deploy(xenostoken.address);

      await treasury.deployed();

      // some preparations

      await xenostoken.connect(ownerToken).mint(signers[0].address, ethers.utils.parseEther('100'));
      await xenostoken.connect(ownerToken).mint(signers[1].address, ethers.utils.parseEther('100'));
      await xenostoken.connect(ownerToken).mint(signers[2].address, ethers.utils.parseEther('100'));
      await xenostoken.connect(ownerToken).mint(signers[3].address, ethers.utils.parseEther('100'));
      await xenostoken.connect(ownerToken).mint(signers[4].address, ethers.utils.parseEther('100'));
      await xenostoken.connect(ownerToken).mint(signers[5].address, ethers.utils.parseEther('100'));
      await xenostoken.connect(ownerToken).mint(signers[6].address, ethers.utils.parseEther('100'));

      await xenostoken.connect(signers[0]).approve(treasury.address, ethers.utils.parseEther('100'));
      await xenostoken.connect(signers[1]).approve(treasury.address, ethers.utils.parseEther('100'));
      await xenostoken.connect(signers[2]).approve(treasury.address, ethers.utils.parseEther('100'));
      await xenostoken.connect(signers[3]).approve(treasury.address, ethers.utils.parseEther('100'));
      await xenostoken.connect(signers[4]).approve(treasury.address, ethers.utils.parseEther('100'));
      await xenostoken.connect(signers[5]).approve(treasury.address, ethers.utils.parseEther('100'));
      await xenostoken.connect(signers[6]).approve(treasury.address, ethers.utils.parseEther('100'));

      //team 2 (winners)
      await treasury.connect(signers[0]).depositTokens(ethers.utils.parseEther('1'), 2)
      await treasury.connect(signers[1]).depositTokens(ethers.utils.parseEther('1'), 2)
      await treasury.connect(signers[2]).depositTokens(ethers.utils.parseEther('1'), 2)

      //team 1
      await treasury.connect(signers[3]).depositTokens(ethers.utils.parseEther('1'), 1)

      //team 3 
      await treasury.connect(signers[4]).depositTokens(ethers.utils.parseEther('1'), 3);


      return { treasury, signers, xenostoken, ownerToken };
    }

    describe('Deposite Logic', () => {

      it('should bet only 1 token', async function () {
        const { treasury } = await loadFixture(deployTreasuryFixture)
        await expect(treasury.depositTokens(ethers.utils.parseEther('2'), 1)).to.be.revertedWith("please Bet only 1 token")
        await expect(treasury.depositTokens(ethers.utils.parseEther('1'), 1)).to.not.be.revertedWith("please Bet only 1 token")

      })

      it('should place a player into a team when betting 1 token', async function () {
        const { treasury, signers } = await loadFixture(deployTreasuryFixture)

        const expectedAddressesTeam2 = [
          signers[0].address,
          signers[1].address,
          signers[2].address,
        ];

        const expectedAddressesTeam3 = [
          signers[4].address,
        ];

        expect(await treasury.readMapping(2)).to.have.members(expectedAddressesTeam2)
        expect(await treasury.readMapping(3)).to.have.members(expectedAddressesTeam3)
      });



      it('should gather all player bet into the balance pool', async function () {

        const { treasury, signers } = await loadFixture(deployTreasuryFixture)

        expect(await treasury.getBalancePool()).to.be.equal(ethers.utils.parseEther('5'))
      })

      it('should play only once per game', async () => {
        const { treasury, signers } = await loadFixture(deployTreasuryFixture)

        for (let i = 0; i <= 4; i++){
          expect(await treasury.checkPlayerPlayed(signers[i].address)).to.be.equal(true)
        }
        
        await treasury.playRound()

        for (let i = 0; i <= 4; i++){
          expect(await treasury.checkPlayerPlayed(signers[i].address)).to.be.equal(false)
        }

      }
      )

    })

    describe('Withdraw Logic', () => {
      it('should calculate the winning per winner (pool balance)/(team size)', async function () {
        const { treasury, signers } = await loadFixture(deployTreasuryFixture)
        const winningTeam = 2

        const bigNumberDeposit = ethers.BigNumber.from(ethers.utils.parseEther("5"))
        const expectedResult = bigNumberDeposit.div(3)

        const calculus = await treasury.calculateRewardsOfTheRound(winningTeam)

        expect(calculus).to.be.equal(expectedResult)

      })

      it('should spread the balancePool to the withdraw allowance for the winners', async function() {
        const { treasury, signers } = await loadFixture(deployTreasuryFixture)
        const winningTeam = 2

        await treasury.playRound()

        const bigNumberDeposit = ethers.BigNumber.from(ethers.utils.parseEther("5"))
        const expectedResult = bigNumberDeposit.div(3)

        expect(await treasury.getAllowanceWithdraw(signers[0].address)).to.be.equal(expectedResult)
        expect(await treasury.getAllowanceWithdraw(signers[1].address)).to.be.equal(expectedResult)
        expect(await treasury.getAllowanceWithdraw(signers[2].address)).to.be.equal(expectedResult)

        expect(await treasury.getAllowanceWithdraw(signers[3].address)).to.be.equal(0)
        expect(await treasury.getAllowanceWithdraw(signers[4].address)).to.be.equal(0)

        expect(await treasury.getBalancePool()).to.be.equal(0)

      })



      it('should regulate the withdraw and set the allowance to 0 once withdrawed', async () => {
        const { treasury, signers } = await loadFixture(deployTreasuryFixture)
        const winningTeam = 2

        await treasury.playRound()
 
        await expect(treasury.connect(signers[6]).withdrawTokens()).to.be.revertedWith("not enough allowance")
        
        await treasury.connect(signers[0]).withdrawTokens()
        expect(await treasury.getAllowanceWithdraw(signers[0].address)).to.be.equal(0)


      })

    })

    describe('Game Feature', () =>{

      
      it('shoould control the ownership of onlyOwner function', async () => {
        const { treasury, signers } = await loadFixture(deployTreasuryFixture)

        await expect(treasury.connect(signers[1]).playRound()).to.be.rejectedWith('Ownable: caller is not the owner')

      })

      it('should trigger the contract at a specific time')

      it('should trigger only with a minimum of player')

      it('it should set back the team to empty array after the round',async () => {
        const { treasury } = await loadFixture(deployTreasuryFixture)

        await treasury.playRound();

        expect(await treasury.readMapping(1)).to.have.members([])
        expect(await treasury.readMapping(2)).to.have.members([])
        expect(await treasury.readMapping(3)).to.have.members([])   

      })


    })

    describe('Event', () =>{

      it('should emit on deposit', async () => {
        const { treasury,signers } = await loadFixture(deployTreasuryFixture)
        
        await expect(treasury.connect(signers[5]).depositTokens(ethers.utils.parseEther('1'), 1)).to.emit(treasury,'Deposit').withArgs(signers[5].address,ethers.utils.parseEther('1'))

      })

      it('should emit on withdraw',async () => {
        const { treasury,signers } = await loadFixture(deployTreasuryFixture)

        await treasury.playRound();
        
        await expect(treasury.connect(signers[0]).withdrawTokens()).to.emit(treasury,'Withdraw').withArgs(signers[0].address,ethers.BigNumber.from(ethers.utils.parseEther("5")).div(3))

      })
    })

  })

});


