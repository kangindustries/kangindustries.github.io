import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

const params = new URLSearchParams(window.location.search);
const p = params.get("p");
if (p) {
  window.history.replaceState(null, "", p);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)