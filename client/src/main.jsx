import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'tailwindcss/tailwind.css'
import axios from 'axios'

// Set base URL for all API requests
axios.defaults.baseURL = 'http://localhost:5001';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)