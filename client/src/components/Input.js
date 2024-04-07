import React, { useState } from 'react'
import { useMessagesContext } from '../hooks/useMessagesContext'

const Input = () => {

  const [message, setMessage] = useState('')
  const {dispatch} = useMessagesContext()


  const handleChange=(e)=>{
    setMessage(e.target.value.trimStart())
  }

  const handleClick = async ()=>{

    if(!message.length) return;

    const response = await fetch('api/messages', {
        method:'POST',
        body: JSON.stringify({content:message.trimEnd()}),
        headers:{
            'Content-type':'application/json'
        }
    })

    const json = await response.json()

    if(response.ok){
        setMessage('')
        dispatch({type:'SEND_MESSAGE', payload:json})
    }
  }

  const handleEnter = (e) => {
    if(e.key==='Enter') handleClick()
  }

  return (
    <div className='input'>
        <input type='text' onChange={handleChange} value={message} onKeyDown={handleEnter} placeholder='Hi..'/>
        <div className="send">
          <button onClick={handleClick}>Send</button>
        </div>
    </div>
  )
}

export default Input