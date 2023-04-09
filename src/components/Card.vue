
<template>
  <div >
    <div class="card" @mouseover="showButton = true" @mouseleave="showButton = false">
      <img :src="imageUrl" alt="Card Image">
      <div v-if="props.asPlayed">
        <button v-show="showButton" >You already played this Round</button>
      </div>
      <div v-else>
        <button v-show="showButton" @click="onButtonClick">Join the Army</button>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { storeContractInteractions } from '../store/contractsCall'

const emit = defineEmits(['clickedCard'])

const props = defineProps({
  imageUrl: {
      type: String,
      required: true,
    },
    team:{
      required: true,
    },
    asPlayed : {
      type:Boolean
    },
})
const showButton = ref(false);

function onButtonClick() {
      emit('clickedCard',props.team)
    }

</script>

<style scoped>
.card {
  position: relative;
  display: inline-block;
  margin: 1rem;
  width: 300px;
  height: 400px;
  background-color: #2c2d31;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
}

.card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card button {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background-color: #8f390e;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  outline: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.card:hover button {
  opacity: 1;
}

/* Warcraft style */
.card {
  background-image: url('https://wow.zamimg.com/uploads/guide/header/10006.jpg');
  background-size: cover;
  background-position: center;
  color: #fff;
}

.card button {
  background-color: #b6b6b6;
  color: #000;
  text-shadow: none;
}

.card:hover button {
  background-color: #ebebeb;
  color: #000;
}
</style>
  