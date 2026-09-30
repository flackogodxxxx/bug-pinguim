import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'

if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then(async (regs) => {
      if (!regs.length) return
      await Promise.all(regs.map((reg) => reg.unregister()))
      if (navigator.serviceWorker.controller && !sessionStorage.getItem('bug-pinguim:sw-cleared')) {
        sessionStorage.setItem('bug-pinguim:sw-cleared', '1')
        window.location.reload()
      }
    })
  } else {
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) reg.update()
    })
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
