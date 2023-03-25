
<template>
  <div class="block">
    <button @click="connectionWallet">Connect Wallet</button>
    <button @click="xenosToken.getBalanceOf(address)">Balance XDP</button>
    <button @click="xenosToken.getBalanceOf(treasury.treasuryAddress)">Balance Contract XDP</button>
    <p>
      who's connected :
      {{ isConnected }}
      {{ address }}
    </p>
  </div>
  <div class="block">
    <div class="block_input">
      <input type="text" placeholder="to" v-model="mintTo" />
      <input type="text" placeholder="amount to mint/approve" v-model="amount_mintApprove" />
    </div>
    <button @click="xenosToken.MintToken(mintTo,amount_mintApprove)">Mint token (only owner)</button>
    <button @click="xenosToken.approve(amount_mintApprove)">approve the amount selected</button>
  </div>
  <div class="block">
    <p>
      interaction avec le contract Treasury
    </p>
    <div class="block_input">
      <input type="number" placeholder="montant" v-model="amount" />
    </div>
    <button @click="treasury.deposit(amount)">Deposit</button>
    <button @click="treasury.withdraw(amount)">Withdraw</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeTreasury, storeXenos } from './store/contractsCall'

const xenosToken = storeXenos()
const treasury = storeTreasury()

const isConnected = ref('false')
const address = ref('rien')
const mintTo = ref('')
const amount_mintApprove = ref(0)
const amount = ref(0)


function connectionWallet() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    ethereum.request({ method: 'eth_requestAccounts' }).then(event => address.value = event[0])
    isConnected.value = ethereum.isConnected()
    getBalanceOf()
  }
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
