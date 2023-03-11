
<template>

  <button @click="connectionWallet">Connect Wallet</button>
  <p>
    {{ isConnected }}
    {{ address }}
  </p>

  <button @click="test">test</button>
  <br>
  <button @click="getBalance">getBalance</button>

  <p>
    <button @click="send5ETH">send  5 eth to the contract</button>
  </p>

  <p>
    <button @click="betYourMoney">bet 1 eth</button>
  </p>





</template>

<script setup>
import { ref } from 'vue';
import {storeToRefs} from 'pinia'
import {ethers} from 'ethers';
import {storeContract} from './store/contractsCall'
import contractABI from '../artifacts/contracts/LuckGame.sol/LuckGame.json'
const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

const dataContract=storeContract()

// const {abi} = storeToRefs(dataContract)

const isConnected = ref('false')
const address = ref('rien')


function connectionWallet () {
  if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask is installed!');
  ethereum.request({ method: 'eth_requestAccounts' }).then( event => address.value = event[0])
  isConnected.value = ethereum.isConnected()

  
}
}

async function send5ETH() {
  try {
            const { ethereum} = window
            if (ethereum) {
                const provider =  new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const luckyGameContract = new ethers.Contract(contractAddress, contractABI.abi, signer)

                const transactionParameters = {
                  // gas: '0x2710', // customizable by user during MetaMask confirmation.
                  to: '0x5fbdb2315678afecb367f032d93f642f64180aa3', // Required except during contract publications.
                  // from: ethereum.selectedAddress, // must match user's active address.
                  value: ethers.utils.parseEther('5.0'), // Only required to send ether to the recipient from the initiating external account.
                };

                const tx = await signer.sendTransaction(transactionParameters)
                // const tx = await luckyGameContract.deposit({ value: ethers.utils.parseEther('5.0'), gas:100000 });
                const receipt = await tx.wait();
                console.log(receipt);
            }
        }
        catch (e) {
            console.log('e', e)
          }
}

async function getBalance(){
        try {
            const { ethereum} = window
            if (ethereum) {
                const provider =  new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const luckyGameContract = new ethers.Contract(contractAddress, contractABI.abi, signer)
                const count = (await luckyGameContract.getBalances())
                const amt = ethers.utils.formatEther(count)
                console.log('count', amt)
            }
        }
        catch (e) {
            console.log('e', e)
          }
    }

function test(){
  console.log(contractABI.abi);
}

async function betYourMoney(){
        try {
            const { ethereum} = window
            if (ethereum) {
                const provider =  new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const luckyGameContract = new ethers.Contract(contractAddress, contractABI.abi, signer)
                const tx = await luckyGameContract.betYourMoney({ value: ethers.utils.parseEther('1.0'), gas:50000 });
                const receipt = await tx.wait();
                console.log(receipt);
            }
        }
        catch (e) {
            console.log('e', e)
          }
    }

</script>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
