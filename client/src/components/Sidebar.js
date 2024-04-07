import React from 'react'
import Navbar from './Navbar'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Navbar/>
      <div className="chats">
        Chats
      </div>
    </div>
  )
}

export default Sidebar