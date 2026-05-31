import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'

// Import Bootstrap CSS dan JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import global styles (overrides bootstrap)
import './assets/global.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
