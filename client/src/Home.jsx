
import React from 'react'
import './Home.css'
import Navbar from './Navbar.jsx'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='mainDiv'>
      <Navbar />
      <div className='hero-section' >
        <div className='container-home'>
          <div className='row'>
            <div className='col-md-6'>
              <h1 className='title'>Raise Money for Donation</h1>
              <p className='description'>Your generosity means everything to us and to the community we serve. We know you have a lot of choices when it comes to donating, and we are so grateful that you chose to donate to our cause. We promise to be responsible stewards of both your donation and your trust.</p>
              <Link to={{pathname:'/pay'}}><button className='donate-btn'>DONATE</button></Link>
            </div>
            <div className='col-md-6'>
              <p className='hero-image'></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home