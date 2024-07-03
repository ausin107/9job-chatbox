import { useNavigate } from 'react-router-dom'
import logo from '../assest/logo.png'
function Navbar() {
  const navigate = useNavigate()

  return (
    <div className='navbar'>
      <img className='navbar-logo' src={logo} alt='Logo' />
      <div className='navbar-login-btn' onClick={() => navigate('/login')}>
        Login
      </div>
    </div>
  )
}

export default Navbar
