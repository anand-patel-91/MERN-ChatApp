import React, { useEffect } from 'react'
import Message from './Message'
import { useMessagesContext } from '../hooks/useMessagesContext'

const Messages = () => {

  const {messages, dispatch} = useMessagesContext()
  useEffect(()=>{
    const fetchMessages = async()=>{
      const respnse = await fetch('/api/messages')
      const json = await respnse.json()

      if(respnse.ok){
        dispatch({type:'SET_MESSAGES', payload:json})
      }
    }

    fetchMessages()
  },[dispatch])

  return (
    <div className='messages'>
        {messages && messages.map((message)=>(
            <Message message={message} key={message._id}/>
        ))}
    </div>
  )
}

export default Messages