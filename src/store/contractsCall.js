import { ethers } from "ethers";
import { defineStore,acceptHMRUpdate  } from "pinia";
import { ref } from "vue";
import contractABIXenos from '../../artifacts/contracts/XenosToken.sol/XenosToken.json'
import contractABITreasury from '../../artifacts/contracts/Treasury.sol/Treasury.json'

export const storeContractInteractions = defineStore('contracts',()=>{
  const treasuryAddress = '0x2ce1F61cd4a411442E574f7B8606eb2A4dB29032'
  const abitreasury = contractABITreasury.abi
  const tokenAddress = '0x5c08215338db9f5a36878e799dab1fDA2EcA89b7'
  const abiXenos = contractABIXenos.abi

//--------------------------------------------------------------------------------------------------------------

  async function ConnectionToken() {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const xenosContract = new ethers.Contract(tokenAddress, abiXenos, signer)
    return xenosContract
  }

  async function getBalanceOf(address) {
    const xenosContract = await ConnectionToken()
    const balance = await xenosContract.balanceOf(address)
    return ethers.utils.formatEther(balance)
  }

  async function approveToken(_amount) {
    const xenosContract = await ConnectionToken()
    const tx = await xenosContract.approve(treasuryAddress, ethers.utils.parseEther(_amount))
  
    const EmitApproval = xenosContract.once('Approval', (owner, spender, value, event) => {
      let recap = {
        value: ethers.utils.formatEther(ethers.BigNumber.from(value._hex)),
        data: event
      }
      console.log(recap)
      return recap
    })
    console.log(tx);
    console.log(EmitApproval)
  }

  async function checkAllowence(owner,contract){
    const xenosContract = await ConnectionToken()
    const tx = await xenosContract.allowance(owner, contract)
    console.log(ethers.utils.formatEther(tx));
    return tx

  }

  async function faucetToken(){
    console.log('reach here');
    const xenosContract = await ConnectionToken()
    try {
      await xenosContract.faucetMint()
    }
    catch (error){   
      const reason = error.error.data.message
      console.log(reason)
      return ''
    }
    console.log('waitting emit ?');
    xenosContract.once('Transfer', (from, to, value, event) => {
      let recap = {
        from:from,
        to:to,
        value: ethers.utils.formatEther(ethers.BigNumber.from(value._hex)),
        data: event
      }
      console.log(recap)
    })

  }

//--------------------------------------------------------------------------------------------------------------

  async function ConnectionTreasury() {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const treasuryContract = new ethers.Contract(treasuryAddress, abitreasury, signer)
      return treasuryContract
    }
  
    async function sendTokens(team) {
      const contract = await ConnectionTreasury()
      try{
        const txDepositeToken = await contract.depositTokens(ethers.utils.parseEther('1'),team)   
        return txDepositeToken
      }       
      catch (error){  
        
        const reason = error.error.data.message
        console.log(reason);
        console.log('reach error')
        if (reason.includes('You must approve tokens first')) {
          approveToken('199').then( e => {
            return sendTokens(team)
          })
        }
      }

    }

    async function getBalancePool(){
      const contract = await ConnectionTreasury()
      const balance = await contract.balancePool()
      return ethers.utils.formatEther(balance)
    }

    async function calculateRewardsOfTheRound(team){
      const contract = await ConnectionTreasury()
      const balance = await contract.calculateRewardsOfTheRound(team)
      return ethers.utils.formatEther(balance)
    }

    async function checkPlayerPlayed(address){
      const contract = await ConnectionTreasury()
      const played = await contract.checkPlayerPlayed(address)
      return played
    }

    
  return {treasuryAddress,tokenAddress , getBalanceOf,sendTokens,checkAllowence,getBalancePool,faucetToken,calculateRewardsOfTheRound,checkPlayerPlayed}

})