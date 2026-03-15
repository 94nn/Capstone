import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer-container'>
        <div className='footer-header'>
            <div className='mathdex-header'>
                <h1>Mathdex</h1>
                <img src="images/mathdex_logo.png" alt="Mathdex Logo" className='mathdex-logo' />
            </div>
            <div>
                <p>Made with ❤️ from 6 bitches</p>
            </div>
        </div>
        <div className='footer-content'>
            <div className='footer-category'>
                <p>COMPANY</p>
                <Link to="/about" className='footer-links'>About Us</Link>
            </div>
            <div className='footer-category'>
                <p>PRACTICE</p>
                <Link to="/challenges" className='footer-links'>Challenges</Link>
            </div>
            <div className='footer-category'>
                <p>LEARN</p>
                <Link to="/module/differentiation" className='footer-links'>Differentiation</Link>
                <Link to="/module/integration" className='footer-links'>Integration</Link>
                <Link to="/module/algebra" className='footer-links'>Algebra</Link>
            </div>
        </div>
        <div className='copyright'>
            <p className='text-center text-sm text-gray-500 py-4'>© 2026 Mathdex. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer