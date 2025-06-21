import React, { useState } from 'react';
import '../styles/userInterface.css';
import { getBotResponse } from '../Hooks/getBotResponse.js';

const UserInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };


  // Handler function that helps  to send the message to the bot itself the bot will then preform the actions accordingly
  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = { text: inputValue, sender: 'user' };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const botText = await getBotResponse(inputValue);
        const botMessage = { text: botText, sender: 'bot' };
        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        const errorMessage = { text: 'Error fetching bot response.', sender: 'bot' };
        setMessages((prev) => [...prev, errorMessage]);
      }

      setInputValue('');
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>

      {/* This is for the chat window for both users and the bot itself */}
      <div className="message-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            <span className="message-bubble">{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Text Field where the user enters their information itself */}
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default UserInterface;
