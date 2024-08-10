import React from 'react'
import './Home.css'
import Navbar from './Navbar.jsx'
import App from './App.jsx'
import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className='mainDiv'>
            <Navbar />
            <div className='body-div' style={{
                width: '100%', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', marginBottom: 'auto'}}>
                <div>
                    <div>
                        <Link to={{pathname:'/pay'}}><button className='donate-btn'>DONATE</button></Link>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Home