
<template>
  Welcome {{ addressConnected }} and your {{ balanceOfToken }} XDP
  <button @click="connectionWallet">Connect Wallet</button>

  <button :disabled="addressConnected === '' ? true : false">Claim Rewards</button>
  <button :disabled="addressConnected === '' ? true : false" @click="joinAnArmy">
    Join the Army
  </button>

    <p> Verif
      <button :disabled="addressConnected === '' ? true : false" @click="contracts.checkAllowence(
    addressConnected,
    contracts.treasuryAddress
  )">
    check allowance
  </button>
  <button :disabled="addressConnected === '' ? true : false" @click="contracts.getBalancePool">Balance Pool</button>
    </p>
  
</template>

<script setup>
import { ref } from 'vue';
import { storeContractInteractions } from './store/contractsCall'

const contracts = storeContractInteractions()

const addressConnected = ref('')
const balanceOfToken = ref('...')


async function connectionWallet() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    const account = await ethereum.request({ method: 'eth_requestAccounts' })
    addressConnected.value = account[0]
    balanceOfToken.value = await contracts.getBalanceOf(account[0])
  }
}

async function joinAnArmy(){
  const txSendToken = await contracts.sendTokens(1)
  console.log(txSendToken);
}

</script>


<style scoped>
button {
  padding: 5px;
  margin: 5px;
}

input {
  margin: 5px;
}

.block {
  margin: 25px;
}

.block_input {
  width: 100%;
}

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
