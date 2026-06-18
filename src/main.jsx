import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { WatchlistProvider } from './contexts/WatchlistContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'
import { CHUNK_RELOAD_KEY, isChunkLoadError } from './lib/lazyWithRetry.js'
import './i18n'

// Rede de segurança global: se um chunk obsoleto (pós-deploy) escapar do
// fluxo do lazyWithRetry, recarrega a página UMA única vez. Reutiliza a
// mesma flag de sessionStorage para não brigar com o lazyWithRetry nem
// entrar em loop de reload.
function reloadOnceForChunkError(error) {
  if (!isChunkLoadError(error)) return
  if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) return
  sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
  window.location.reload()
}

window.addEventListener('unhandledrejection', (event) => {
  reloadOnceForChunkError(event.reason)
})
window.addEventListener('error', (event) => {
  reloadOnceForChunkError(event.error || event.message)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ThemeProvider>
          <AuthProvider>
            <WatchlistProvider>
              <App />
            </WatchlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
)