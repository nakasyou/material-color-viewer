import { createVaporApp, vaporInteropPlugin } from 'vue'
import './style.css'
import App from './App.tsx'

createVaporApp(App).use(vaporInteropPlugin).mount('#app')
