import React from 'react'
import { Button } from '../button'
import { Link } from 'react-router-dom'

// Header Content
function Header() {

  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-5'>
        <img src='/LakbeAbe.svg'/>
        {/* <Button><img src='/LakbeAbe.svg'/></Button> */}
        <div>
            <Button>Book Hotel</Button>
            &nbsp;
            <Button>Sign In</Button>
        </div>
    </div>
  )
}

export default Header