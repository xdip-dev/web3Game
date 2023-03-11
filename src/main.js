import { createApp } from 'vue'
import {createPinia} from 'pinia'
import './style.css'
import AppGame from './AppGame.vue'

const app = createApp(AppGame)
app.use(createPinia())
app.mount('#app')
