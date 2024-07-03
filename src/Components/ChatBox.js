import { useRef, useState, useEffect } from 'react'

import chatbox_icon from '../assest/icon.png'
import send_icon from '../assest/send.png'
import chatbox from '../assest/chatbot.png'
import user_image from '../assest/user.jpeg'

import Avatar from './Avatar'
import Typing from './Typing'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import runChat from '../config/gemini'

import handleFileToText from '../lib/handleFileToText'

const GetHistory = async () => { 
  const response = await fetch('http://localhost:3001/v1/api/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    }
  });

  if (!response.ok) {
    console.error(response.text)
    return [];
  }
  const responseData = await response.json();
  return responseData.data
}

const SaveHistory = async (dataSave) => { 
  const response = await fetch('http://localhost:3001/v1/api/history/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    },
    body: JSON.stringify(dataSave),
  });

  if (!response.ok) {
    console.error(response.text)
  }
}

function ChatBox() {
  const [messages, setMessages] = useState([])
  const [typingMessage, setTypingMessage] = useState(null)
  const [input, setInput] = useState('')
  const [isShow, setSow] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [file, setFile] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const chatboxRef = useRef()
  const inputFileRef = useRef()
  const addFileRef = useRef()

  const [isLogin, setIsLogin] = useState(false)

  // get history from backend 
  useEffect(() => {
    const token = localStorage.getItem('token');
      if (!token) {
        setIsLogin(false);
        return;
      }
      setIsLogin(true);
      const handle = async () => {
      const history = await GetHistory();
        
      setMessages(history);
    }
    handle();
  }, [])

  const sendMessage = async () => {
    const supportSendMessage = async (text) => {
      setMessages([...messages, { sender: 'user', text }]);
      if (isLogin) {
        await SaveHistory({ sender: 'user', text });
      }
      setInput('');
      setLoading(true);
    };
  
    const processResponse = async (inputText) => {
      const response = await runChat(inputText);
      setLoading(false);
      displayTypingEffect(response.trim());
    };
  
    if (file) {
      const text = input + ' ' + file.name;
      await supportSendMessage(text);
      const fileText = await handleFileToText(file);
      setFile('');
      await processResponse(input + ' ' + fileText);
    } else if (input.trim()) {
      await supportSendMessage(input);
      await processResponse(input);
    }
  };

  const displayTypingEffect = (text) => {
    let index = 0
    setTypingMessage(text[0])
    const typingInterval = setInterval(async() => {
      setTypingMessage((prev) => prev + text[index])
      index++

      if (index === text.length) {
        clearInterval(typingInterval)
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text }])
        if (isLogin) {
          await SaveHistory({ sender: 'bot', text })
        }
        setTypingMessage(null)
      }
    }, 10)
  }

  const handlShowChatBox = () => {
    setSow(!isShow)
    !isShow ? chatboxRef.current.classList.add('active') : chatboxRef.current.classList.remove('active')
  }

  const addEmoji = (emoji) => {
    setShowEmojiPicker(false)
    setInput(input + emoji.native)
  }
  
  return (
    <>
      <div className='chatbox-icon-container' onClick={handlShowChatBox}>
        <img src={chatbox_icon} alt='Icon' className='chatbox-icon' />
      </div>
      <div ref={chatboxRef} className='chatbox'>
        <div className='chatbox-nav'>
          <Avatar width='3rem' height='3rem' margin='0 0 0 1rem' image={user_image} />
          <div className='chatbox-nav-text'>ChatGPT</div>
        </div>
        <div className='messages'>
          {messages.map((msg, index) =>
            msg.sender === 'bot' ? (
              <div key={index} className='message-wrapper'>
                <Avatar width='2.5rem' height='2.5rem' alignSelf='flex-start' margin='1rem 0 0 0' image={chatbox} />
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
              <Avatar width='2.5rem' height='2.5rem' alignSelf='flex-start' margin='0 1rem 0 0' image={chatbox} />
              <Typing />
            </div>
          )}
          {typingMessage && (
            <div className='message-wrapper'>
              <Avatar width='2.5rem' height='2.5rem' alignSelf='flex-start' margin='1rem 0 0 0' image={chatbox} />
              <div className='message bot' style={{ alignSelf: 'flex-start' }}>
                {typingMessage}
              </div>
            </div>
          )}
        </div>
        <div className='chatbox-input'>
          <div className='chat-footer'>
            <button className='emoji-button' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              🙂
            </button>
            <div className='chat-input-container'>
              {!!file && (
                <div className='chat-file-name-container'>
                  <div className='chat-file-name-text'>{file.name}</div>
                  <svg
                    className='remove-icon'
                    onClick={() => setFile('')}
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      id='Vector'
                      d='M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18'
                      stroke='#000000'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'></path>
                  </svg>
                </div>
              )}
              <div className='chat-input-main'>
                <input
                  className='chat-input'
                  type='text'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Message chat bot...'
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <div className='chat-file-container'>
                  <input
                    type='file'
                    className='inputfile'
                    accept='.pdf,.docx'
                    ref={inputFileRef}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <svg
                    ref={addFileRef}
                    onClick={() => inputFileRef.current.click()}
                    viewBox='0 0 24 24'
                    width={24}
                    height={24}
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M9 12H15'
                      stroke='#323232'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'></path>
                    <path
                      d='M12 9L12 15'
                      stroke='#323232'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'></path>
                    <path
                      d='M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
                      stroke='#323232'
                      strokeWidth='2'></path>
                  </svg>
                </div>
              </div>
            </div>
            <button onClick={sendMessage} className='chat-btn'>
              <img src={send_icon} alt='Icon' className='send-icon' />
            </button>
            {showEmojiPicker && <Picker data={data} onEmojiSelect={addEmoji} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatBox
