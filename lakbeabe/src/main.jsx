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
import HotelBooking from './book-hotel/Components/HotelBooking.jsx'
import MyTrips from './my-trips/index.jsx'
import BokedHotel from './my-booked/index.jsx'
import AdminBookings from './book-hotel/Admin/Admin.jsx'
import Footer from './view-trip/components/Footer.jsx'


// Simple authentication check
const isAuthenticated = () => {
  return !!localStorage.getItem('user'); // Check local storage for a user item
};

// Simple authentication check
const isauthenticated = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Parse the user object from local storage
  return user && user.isAdmin === true; // Check if the user exists and matches the specific email
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
    element: isAuthenticated() ? <HotelBooking/> : <Navigate to="/" />,
  },
  {
    path:'/my-bookings',
    element: isAuthenticated() ? <BokedHotel/> : <Navigate to="/" />,
  },
  {
    path:'/adminbookings',
    element: isauthenticated() ? <AdminBookings/> : <Navigate to="/" />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header />
      <Toaster />
      <RouterProvider router={router} />
      <Footer />
    </GoogleOAuthProvider>
  </StrictMode>,
)
