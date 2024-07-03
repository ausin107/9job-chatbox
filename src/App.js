import './App.css'

import Navbar from './Components/Navbar'
import ChatBox from './Components/ChatBox'

function App() {
  return (
    <div className='App' style={{ overflow: 'hidden' }}>
      <Navbar />
      <main className='container'>
        <div className='header'>
          Chatbox with
          <span style={{ color: '#ff9900' }}> ChatGPT</span>
        </div>
        <ChatBox />
      </main>
    </div>
  )
}

export default App
