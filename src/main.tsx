import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


registerSW({
  onNeedRefresh() {
    console.log('New version available')
  },

  onOfflineReady() {
    console.log('App ready to work offline')
  }
})
