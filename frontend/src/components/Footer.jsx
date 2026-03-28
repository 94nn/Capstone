import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Footer = () => {
    const [modules, setModules] = useState([])
    const isLoggedIn = !!localStorage.getItem('student_id')

    useEffect(() => {
        axios.get('/api/modules')
            .then(res => setModules(res.data))
            .catch(err => console.error('Error fetching modules:', err))
    }, [])

    return (
        <div className='footer-container'>
            <div className='footer-header'>
                <div className='mathdex-header'>
                    <h1>Mathdex</h1>
                    <img src="/images/mathdex_logo.png" alt="Mathdex Logo" className='mathdex-logo' />
                </div>
                <div>
                    <p>Made with ❤️ from 6 bitches</p>
                </div>
            </div>
            <div className='footer-content'>
                <div className='footer-category'>
                    <p>COMPANY</p>
                    <Link to={isLoggedIn ? "/aboutus" : "/aboutus/b4login"} className='footer-links'>About Us</Link>
                </div>
                <div className='footer-category'>
                    <p>PRACTICE</p>
                    <Link to={isLoggedIn ? "/challenge" : "/challenge/b4login"} className='footer-links'>Challenges</Link>
                </div>
                <div className='footer-category'>
                    <p>LEARN</p>
                    <div className='footer-links-container'>
                        {modules.map(module => (
                            <Link
                                key={module.id}
                                to={isLoggedIn ? `/modules/${module.slug}` : `/modules/b4login/${module.slug}`}
                                className='footer-links'
                            >
                                {module.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <div className='copyright'>
                <p className='text-center text-sm text-gray-500 py-4'>© 2026 Mathdex. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer