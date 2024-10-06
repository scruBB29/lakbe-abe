import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Hero from './components/ui/custom/Hero.jsx'
import App from './App.jsx'
import CreateTrip from './create-trip/index.jsx'
import './index.css'
import Header from './components/ui/custom/Header.jsx'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google';

// LakbeAbe web page pathways
const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:'create-trip',
    element:<CreateTrip/>
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header />
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>,
)
