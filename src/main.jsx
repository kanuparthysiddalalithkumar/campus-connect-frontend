import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { warmUpBackend } from './api.js'

// Wake up the Railway backend immediately on app load.
// This avoids cold-start timeouts when the user clicks Login/Register.
warmUpBackend();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
