import './App.css'
import React, { useState } from 'react';
import Navbar from './Components/Navbar'
import chatbox_icon from './assest/icon.png'
import Avatar from './Components/Avatar';

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI('AIzaSyBxBhH8nPk2Hra3OSHjcyHqbvbHMv_8f1A');


function App() {

  const [messages, setMessages] = useState([]);
  const [typingMessage, setTypingMessage] = useState(null);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', text: input }]);
      setInput('');
      
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const prompt = input;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const botMessage = text.trim();
        displayTypingEffect(botMessage);
      } catch (error) {
        console.log(error)
      }
    }
  };

  const displayTypingEffect = (text) => {
    let index = 0;
    setTypingMessage('');

    const typingInterval = setInterval(() => {
      setTypingMessage((prev) => prev + text[index]);
      index++;

      if (index === text.length) {
        clearInterval(typingInterval);
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text }]);
        setTypingMessage(null);
      }
    }, 10);
  };


  return (
    <div className='App' style={{ overflow: 'hidden' }}>
      <Navbar />
      <main
        style={{
          width: '100vw',
          minHeight: 'calc(100vh - 10rem)',
          backgroundColor: '#ece9fe',
          paddingTop: '10rem',
        }}>
        <div style={{ paddingLeft: '5rem', fontSize: '4rem', fontWeight: 'bold' }}>
          Chatbox with
          <span style={{ color: '#ff9900' }}> ChatGPT</span>
        </div>

        <div
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            backgroundColor: '#3399ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3.5rem',
            height: '3.5rem',
          }}>
          <img src={chatbox_icon} alt='Icon' style={{ width: '2rem', height: '2rem' }} />
        </div>
        <div
          style={{
            position: 'fixed',
            width: '25rem',
            height: '80%',
            borderRadius: '15px',
            backgroundColor: '#ffffff',
            right: '6rem',
            bottom: '1rem',
          }}>
          <div
            style={{
              width: '25rem',
              height: '4rem',
              backgroundColor: '#3399ff',
              borderTopRightRadius: '15px',
              borderTopLeftRadius: '15px',
              display: 'flex',
              alignItems: 'center',
            }}>
            <Avatar width='3rem' height='3rem' margin='0 0 0 1rem' />
            <div style={{ fontWeight: 'bold', fontSize: '1.5rem', marginLeft: '1rem' }}>ChatGPT</div>
          </div>

          <div className="messages">
            {messages.map((msg, index) => (
              msg.sender === 'bot' ? (
                <div key={index} className="message-wrapper">
                  
                  <Avatar width='2.5rem' height='2.5rem' alignSelf='flex-start' margin='1rem 0 0 0' />
                  <div className={`message ${msg.sender}`}> 
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              )
            ))
            }
            {typingMessage && (
              <div className="message-wrapper">
                <Avatar width='2.5rem' height='2.5rem' alignSelf='flex-start' margin='1rem 0 0 0' />
                <div className="message bot" style={{alignSelf: 'flex-start'}}>
                  {typingMessage}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <div className="chat-footer">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
