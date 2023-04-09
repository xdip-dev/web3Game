
<template>
  <div>
    <NavBar />
    Welcome {{ addressConnected }} and your {{ balanceOfToken }} XDP
    <button @click="connectionWallet">Connect Wallet</button>
    <div v-show="addressConnected === '' ? false : true">
      <button>Claim Rewards</button>
      <button @click="contracts.faucetToken">Faucet XDP token</button>
    </div>
    <div v-show="addressConnected === '' ? false : true" class="container text-center">
      <div class="row">
        <div  class="col-sm">
          <Card imageUrl="https://i.pinimg.com/736x/31/d4/f4/31d4f4fe850a119b3bbb0877929ebcce.jpg" team="Orc"
            :asPlayed="asPlayed" @clickedCard="joinAnArmy(teamAssociation[$event])" />
        </div>
        <div class="col-sm">
          <Card imageUrl="https://donjonetdragon.fr/wp-content/uploads/2022/02/elfes-dd.jpeg" team="Elf"
            :asPlayed="asPlayed" @clickedCard="joinAnArmy(teamAssociation[$event])" />
        </div>
        <div class="col-sm">
          <Card imageUrl="https://i.pinimg.com/originals/b3/07/ff/b307ff8dd520a4fa62753151f712d112.jpg" team="Humain"
            :asPlayed="asPlayed" @clickedCard="joinAnArmy(teamAssociation[$event])" />
        </div>
      </div>
      <div>
        Balance Pool rewards : {{ balancePoolRewards }} XDP
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { storeContractInteractions } from './store/contractsCall'
import Card from './components/Card.vue'
import NavBar from './components/NavBar.vue'
import { ethers } from 'ethers';
// import { log } from 'console';

const contracts = storeContractInteractions()
const asPlayed = ref(false)
const addressConnected = ref('')
const balanceOfToken = ref('...')
const balancePoolRewards = ref('')

const teamAssociation = {
  'Orc': 1,
  'Elf': 2,
  'Humain': 3,
}


async function connectionWallet() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    const account = await ethereum.request({ method: 'eth_requestAccounts' })
    addressConnected.value = account[0]
    balanceOfToken.value = await contracts.getBalanceOf(account[0])
    asPlayed.value = await contracts.checkPlayerPlayed(addressConnected.value)
    balancePoolRewards.value = await contracts.getBalancePool()
  }
}

async function joinAnArmy(team) {
  const txSendToken = await contracts.sendTokens(team)
  console.log(txSendToken);
}

</script>


<style scoped>
.cards {
  display: flex;
  transition-delay: 250ms;
}

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
