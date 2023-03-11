
<template>
  <button @click="connectionWallet">Connect Wallet</button>
  <button @click="getBalanceOf">Balance XDP</button>
  <button @click="getBalanceOfContract">Balance Contract XDP</button>
  <p>
    who's connected :
    {{ isConnected }}
    {{ address }}
  </p>
  <input type="text" placeholder="to" v-model="mintTo" />
  <button @click="MintToken(mintTo)">Mint 1000 token only owner</button>
  <button @click="approve1000">approve 1000</button>
  <p>
    interaction avec le contract Treasury
  </p>
  <input type="number" placeholder="montant" v-model="amount" />
  <button @click="treasury.deposit(amount)">Deposit</button>
  <button @click="treasury.withdraw(amount)">Withdraw</button>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import { ethers } from 'ethers';
import { storeTreasury, storeXenos } from './store/contractsCall'

const xenosToken = storeXenos()
const treasury = storeTreasury()

const isConnected = ref('false')
const address = ref('rien')
const mintTo = ref('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
const amount = ref()


function connectionWallet() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    ethereum.request({ method: 'eth_requestAccounts' }).then(event => address.value = event[0])
    isConnected.value = ethereum.isConnected()
    getBalanceOf()
  }
}


// --------------------------------------------------------------------------------------------------------------------------------------------------

async function ConnectionToken() {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const xenosContract = new ethers.Contract(xenosToken.tokenAddress, xenosToken.abiXenos, signer)
  return xenosContract
}

async function MintToken(_to) {
  const xenosContract = await ConnectionToken()
  const tx = await xenosContract.mint(_to, ethers.utils.parseEther('1000'))

  console.log(tx);
}

async function approve1000() {
  const xenosContract = await ConnectionToken()
  const tx = await xenosContract.approve(treasury.treasuryAddress, ethers.utils.parseEther('1000'))

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

async function getBalanceOf() {
  const xenosContract = await ConnectionToken()
  const balance = await xenosContract.balanceOf(address.value)
  console.log(ethers.utils.formatEther(balance), 'XDP');
}

async function getBalanceOfContract() {
  const xenosContract = await ConnectionToken()
  const balance = await xenosContract.balanceOf(treasury.treasuryAddress)
  console.log(ethers.utils.formatEther(balance), 'XDP');
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
