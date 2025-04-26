import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import FontAwesomeIcon from './fontawasome'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap';

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Enregistrer le composant FontAwesome globalement
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
