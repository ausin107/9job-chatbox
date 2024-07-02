import logo from '../assest/logo.png'

function Navbar() {
  return (
    <navbar
      className='navbar'
      style={{
        width: '100vw',
        height: '2rem',
        padding: '1.5rem',
        position: 'fixed',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      }}>
      <img src={logo} alt='Logo' />
    </navbar>
  )
}

export default Navbar
