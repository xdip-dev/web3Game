import { ethers } from "ethers";
import { defineStore,acceptHMRUpdate  } from "pinia";
import { ref } from "vue";
import contractABIXenos from '../../artifacts/contracts/XenosToken.sol/XenosToken.json'
import contractABITreasury from '../../artifacts/contracts/Treasury.sol/Treasury.json'


export const storeXenos = defineStore('xenos',()=>{
    const tokenAddress = '0x9779688D887518D172FdB00c947faD4D75E2Fbea'
    const abiXenos = contractABIXenos.abi

    return {tokenAddress ,abiXenos}

})

export const storeTreasury = defineStore('treasury',()=>{
    const treasuryAddress = '0xF4B6B46221e24431A02e1a54742c252945Cc2dbD'
    const abitreasury = contractABITreasury.abi


    async function ConnectionTreasury() {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const treasuryContract = new ethers.Contract(treasuryAddress, abitreasury, signer)
        return treasuryContract
      }
      
      async function deposit(_amount) {
        const treasuryContract = await ConnectionTreasury()
        console.log(_amount);
        treasuryContract.depositTokens(_amount)
          .then(
            tx => tx.wait())
          .then(
            reciep => {
              console.log('reciept: ', reciep)
              treasuryContract.once('Deposit', e => console.log('depot of', ethers.utils.formatEther(ethers.BigNumber.from(e._hex))))
            })
          .catch(e => {
            const errorMessage = e.error.data.data.message
            const errorRaison = errorMessage.split("'")[1]
            console.log(errorRaison);
          })
      
      }
      
      async function withdraw(_amount) {
        const treasuryContract = await ConnectionTreasury()
        console.log(_amount);
        treasuryContract.withdrawTokens(_amount)
          .then(
            tx => tx.wait())
          .then(
            reciep => {
              console.log('reciept: ', reciep)
              treasuryContract.once('Withdraw', e => console.log('Withdraw of', ethers.utils.formatEther(ethers.BigNumber.from(e._hex))))
            })
          .catch(e => {
            const errorMessage = e.error.data.data.message
            const errorRaison = errorMessage.split("'")[1]
            console.log(errorRaison);
      
          })
      
      }

    return {deposit,withdraw,treasuryAddress}

})

// if (import.meta.hot) {
//     import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
//   }