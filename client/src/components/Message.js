import React from 'react'

const Message = ({message}) => {

  const {content} = message

  return (
    <div className='message'>
        <div className="messageContent">
            <p>{content}</p>
        </div>    
    </div>
  )
}

export default Message