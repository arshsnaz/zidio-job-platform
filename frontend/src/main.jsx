import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CompleteApp from './CompleteApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CompleteApp />
  </StrictMode>,
)
