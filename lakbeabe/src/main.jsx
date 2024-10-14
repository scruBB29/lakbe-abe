import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Hero from './components/ui/custom/Hero.jsx'
import App from './App.jsx'
import CreateTrip from './create-trip/index.jsx'
import './index.css'
import Header from './components/ui/custom/Header.jsx'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Viewtrip from './view-trip/[tripId]/index.jsx'
import HotelBooking  from './book-hotel/Hotelbooking.jsx'
import MyTrips from './my-trips/index.jsx'


// Simple authentication check
const isAuthenticated = () => {
  return !!localStorage.getItem('user'); // Check local storage for a user item
};


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
  {
    path:'/view-trip/:tripId',
    element: isAuthenticated() ? <Viewtrip/> : <Navigate to="/" />,
  },
  {
    path:'/my-trips',
    element: isAuthenticated() ? <MyTrips/> : <Navigate to="/" />,
  },
  {
    path:'/Hotelbooking',
    element: <HotelBooking/>
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
