import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './admin/context/AuthContext.jsx'
import { SiteSettingsProvider } from './context/SiteSettingsContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <SiteSettingsProvider>
          <App />
        </SiteSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
