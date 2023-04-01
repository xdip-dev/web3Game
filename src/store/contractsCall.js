import { ethers } from "ethers";
import { defineStore,acceptHMRUpdate  } from "pinia";
import { ref } from "vue";
import contractABIXenos from '../../artifacts/contracts/XenosToken.sol/XenosToken.json'
import contractABITreasury from '../../artifacts/contracts/Treasury.sol/Treasury.json'

export const storeContractInteractions = defineStore('contracts',()=>{
  const treasuryAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
  const abitreasury = contractABITreasury.abi
  const tokenAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
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
        console.log('reach try')
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
      const balance = await contract.getBalancePool()
      console.log(ethers.utils.formatEther(balance));
    }
    
  return {treasuryAddress,tokenAddress , getBalanceOf,sendTokens,checkAllowence,getBalancePool}

})