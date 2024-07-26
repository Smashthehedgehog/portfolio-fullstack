import React from 'react'
import chatbot_icon from '../../pictures/chatbot-icon.png';
import './Chatbot.css';

const ChatbotIcon = () => {
  return (
    <div className='chatbot-icon d-flex justify-content-center align-items-center'>
        <img src={chatbot_icon} width={'100%'} height={'100%'}></img>
    </div>
  )
}

export default ChatbotIcon;