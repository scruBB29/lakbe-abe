import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import Hero from './components/ui/custom/Hero'
import Hotelbooking from './book-hotel/Hotelbooking'


// App component
function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="bg-image">
      {/* Hero */}
      <Hero />
      <Hotelbooking />
    </div>
  )
}

export default App