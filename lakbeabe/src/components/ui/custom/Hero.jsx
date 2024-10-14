import { Link } from 'react-router-dom'
import React from 'react'
import { Button } from '../button'

// Homepage Info
function Hero() {

  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
        <h1
        className='font-extrabold text-[50px] text-center mt-16'
        >
         <span className='text-[#000000]'>Discover Your Next Adventure with AI: </span>Personalized Itineraries at Your Fingertips</h1>
        <p className='text-xl text-gray-500 text-center'>Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.</p> 
        
        {/* Button to Create Trip */}
        <Link to={'/create-trip'}>
          <Button style={{
          backgroundColor: '#FFEE8C',
          marginTop: '150px',
          color: '#000000', // Blue font color
          border: '2px solid #FFEE8C', // Optional: border to match font color
          borderRadius: '25px', // More rounded corners
          padding: '15px 30px', // Larger padding for a bigger button
          cursor: 'pointer',
          fontSize: '30px', // Larger font size
          fontWeight: 'bold', // Bold text for emphasis
          transition: 'background-color 0.3s, color 0.3s', // Transition effect
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#F4c430'; // Change background on hover
          e.target.style.color = 'black'; // Change font color on hover
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#FFEE8C'; // Reset background
        }}>Start Your Adventure</Button>
        </Link>
        
    </div>
  )
}

export default Hero