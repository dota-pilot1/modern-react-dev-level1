import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ensureIBSheetConfigured } from './config/ibsheet-config'
import App from './App.tsx'

ensureIBSheetConfigured();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
