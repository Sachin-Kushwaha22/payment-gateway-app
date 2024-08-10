import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom';
import logo from './assets/logo.png';

function Navbar() {
  return (
    <div style={{ width: '100%' }}>
      <nav className="navbar">
        <div className="logo">
          <a href="/"><img src={logo} alt="Logo" /></a>
        </div>
        <ul className="nav-links">
          <li>
            <Link to={{pathname:'/'}}>Home</Link>
          </li>
          <li>
            <Link to={{pathname:'/pay'}}>Donate</Link>
          </li>
          <li>
            <Link to={{pathname:'/'}}>Contact</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar