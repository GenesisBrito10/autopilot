import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// Importação de estilos
import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Importar Sweetalert2
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const app = createApp(App)
axios.defaults.baseURL = 'https://backend-automatico.tipolariumbroker.com'
// Configurar Sweetalert2
const options = {
    confirmButtonColor: '#2596BE',
    cancelButtonColor: '#ff7674',
    background: '#181414',
    color: '#fff'
}

app.use(router)
app.use(VueSweetalert2, options)
app.mount('#app')

// Unregister service workers to fix errors
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Get all service worker registrations and unregister them
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
        console.log('ServiceWorker unregistered successfully')
      }
      
      // Clear caches
      if ('caches' in window) {
        const keys = await caches.keys()
        for (const key of keys) {
          await caches.delete(key)
        }
        console.log('Caches cleared successfully')
      }
    } catch (error) {
      console.error('Error while unregistering service worker:', error)
    }
  })
}

// Add install prompt for PWA
let deferredPrompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
})

// Export the prompt for use in components
window.installPWA = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      }
      deferredPrompt = null
    })
  }
} 