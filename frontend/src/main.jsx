import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import UserContext from './context/UserContext.jsx'
import DriverContext from './context/DriverContext.jsx'
import { SocketProvider } from './context/socketContext.jsx'
import { NonceProvider } from './context/NonceContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NonceProvider>
      <SocketProvider>
        <DriverContext>
          <UserContext>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </UserContext>
        </DriverContext>
      </SocketProvider>
    </NonceProvider>
  </StrictMode>
)
