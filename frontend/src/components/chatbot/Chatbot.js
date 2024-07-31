import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = ({ chatbotState }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatContainerRef = useRef(null);

    const handleSend = async () => {
        if (input.trim() === '') return;

        setMessages([...messages, { sender: 'user', text: input }]);

        try {
            const inputtedMessage = input;
            setInput('');
            const response = await axios.post('http://localhost:5000/chat', { sender: 'user', message: inputtedMessage });
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'assistant', text: response.data.reply }
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setInput('');
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={`chat-container d-flex flex-column ${chatbotState ? "open" : "closed"}`}>
            <div className='chat-header'></div>
            <div className="chat-messages" ref={chatContainerRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className='chat-line'></div>
            <div className="input-container d-flex flex-row align-items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about me!"
                />
                <button tabIndex='0' className="send-button d-flex align-items-center justify-content-center" onClick={handleSend}>
                    <i class="bi bi-send"></i>
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
