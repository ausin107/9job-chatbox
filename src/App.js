import { useEffect } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import chatbox_icon from './assest/icon.png'
function App() {
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
            height: '40rem',
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
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '1rem',
              }}>
              <div>A</div>
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '1.5rem', marginLeft: '1rem' }}>ChatGPT</div>
          </div>
          <div></div>
        </div>
      </main>
    </div>
  )
}

export default App
