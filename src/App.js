import './App.css'
import { useRef, useState } from 'react'
import chatbox_icon from './assest/icon.png'
import Navbar from './Components/Navbar'
import Avatar from './Components/Avatar'
import Typing from './Components/Typing'

const { GoogleGenerativeAI } = require('@google/generative-ai')
const genAI = new GoogleGenerativeAI('AIzaSyBxBhH8nPk2Hra3OSHjcyHqbvbHMv_8f1A')
function App() {
  const [messages, setMessages] = useState([])
  const [typingMessage, setTypingMessage] = useState(null)
  const [input, setInput] = useState('')
  const [isShow, setSow] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const chatboxRef = useRef()
  const sendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', text: input }])
      setInput('')
      setLoading(true)
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const prompt = input
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        const botMessage = text.trim()
        setLoading(false)
        displayTypingEffect(botMessage)
      } catch (error) {
        console.log(error)
      }
    }
  }
  const displayTypingEffect = (text) => {
    let index = 0
    setTypingMessage('')
    const typingInterval = setInterval(() => {
      setTypingMessage((prev) => prev + text[index])
      index++

      if (index === text.length) {
        clearInterval(typingInterval)
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text }])
        setTypingMessage(null)
      }
    }, 10)
  }
  const handlShowChatBox = () => {
    setSow(!isShow)
    !isShow ? chatboxRef.current.classList.add('active') : chatboxRef.current.classList.remove('active')
  }
  return (
    <div className='App' style={{ overflow: 'hidden' }}>
      <Navbar />
      <main className='container'>
        <div className='header'>
          Chatbox with
          <span style={{ color: '#ff9900' }}> ChatGPT</span>
        </div>
        <div className='chatbox-icon-container' onClick={handlShowChatBox}>
          <img src={chatbox_icon} alt='Icon' className='chatbox-icon' />
        </div>
        <div ref={chatboxRef} className='chatbox'>
          <div className='chatbox-nav'>
            <Avatar width='3rem' height='3rem' margin='0 0 0 1rem' />
            <div className='chatbox-nav-text'>ChatGPT</div>
          </div>
          <div className='messages'>
            {messages.map((msg, index) =>
              msg.sender === 'bot' ? (
                <div key={index} className='message-wrapper'>
                  <Avatar width='2.5rem' height='2.5rem' alignSelf='flex-start' margin='1rem 0 0 0' />
                  <div className={`message ${msg.sender}`}>{msg.text}</div>
                </div>
              ) : (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              )
            )}
            {isLoading && (
              <div className='typing-box'>
                <Avatar width='2.5rem' height='2.5rem' alignSelf='flex-start' margin='0 1rem 0 0' />
                <Typing />
              </div>
            )}
            {typingMessage && (
              <div className='message-wrapper'>
                <Avatar width='2.5rem' height='2.5rem' alignSelf='flex-start' margin='1rem 0 0 0' />
                <div className='message bot' style={{ alignSelf: 'flex-start' }}>
                  {typingMessage}
                </div>
              </div>
            )}
          </div>
          <div className='chatbox-input'>
            <div className='chat-footer'>
              <input
                className='chat-input'
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} className='chat-btn'>
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
