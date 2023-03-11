import { ethers } from "ethers";
import { defineStore,acceptHMRUpdate  } from "pinia";
import { ref } from "vue";
import contractABIXenos from '../../artifacts/contracts/XenosToken.sol/XenosToken.json'
import contractABITreasury from '../../artifacts/contracts/Treasury.sol/Treasury.json'


export const storeXenos = defineStore('xenos',()=>{
    const tokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    const abiXenos = contractABIXenos.abi

    return {tokenAddress ,abiXenos}

})

export const storeTreasury = defineStore('treasury',()=>{
    const treasuryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const abitreasury = contractABITreasury.abi

    return {treasuryAddress , abitreasury}

})

// if (import.meta.hot) {
//     import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
//   }