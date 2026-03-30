import React, { useEffect, useRef, useState } from 'react'
import { FaGithub, FaInstagram } from 'react-icons/fa'
import './AboutUsPage.css'
import axios from 'axios'
import { getImageUrl } from '../utils/imageUrl'
import Footer from '../components/Footer'
import { getImageUrl } from '../utils/imageUrl'

const AboutUsPage = () => {
    const [team, setTeam] = useState([])
    const starsRef = useRef(null)

    useEffect(() => {
        window.scrollTo(0, 0)

        axios.get('/api/team')
            .then(res => setTeam(res.data))
            .catch(err => console.error('Error fetching team:', err))
    }, [])

    useEffect(() => {
        const container = starsRef.current
        if (!container) return

        // Clear existing stars
        container.innerHTML = ''

        for (let i = 0; i < 120; i++) {
            const star = document.createElement('div')
            star.className = 'star'
            star.style.left = `${Math.random() * 98}%`
            star.style.top = `${Math.random() * 98}%`
            star.style.width = `${Math.random() * 2 + 1}px`
            star.style.height = star.style.width
            star.style.animationDelay = `${Math.random() * 3}s`
            container.appendChild(star)
        }

        return () => { container.innerHTML = '' }
    }, [])

  return (
    <div>
        <div className="about-us-container">
            <div ref={starsRef} className="stars-layer" aria-hidden="true" />
            <div className="about-us-section">
                <div className="about-us-image">
                    <img src="/images/Calculator.png" alt="Calculator" className='calculator'/>
                </div>
                <div className="about-us-content">
                    <h1>THE MOST FUN WAY TO LEARN MATH!!</h1>
                    <div>
                        <p className='about-us-text'>Mathdex is a brand new way to learn math online. Journey through the world of Algebra, Geometry, Calculus, Statistics, or Trigonometry. Earn experience points (XP) to unlock new levels, solve challenges, and collect all the badges at your own pace.</p>
                        <p className='about-us-emoji'>(づ｡◕‿‿◕｡)づ:･ﾟ✧</p>
                    </div>
                </div>
            </div>
            <div>
                <div className="team-title">
                    <h1>MEET THE TEAM</h1>
                    <p>The folks behind Mathdex have tought mathematics for years and are passionate about making it accessible and fun for everyone.</p>
                </div>
                <div className='team-cards-container'>
                    {team.map(admin => (
                        <div key={admin.id} className='team-card'>
                            <div className='card-frame'>
                                <div className='card-dots'>
                                    <span className='dot'></span>
                                    <span className='dot'></span>
                                </div>
                                <div className='card-image'>
                                    <img src={getImageUrl(admin.image_url)} alt={admin.name} />
                                </div>
                                <div className='card-footer'>
                                    <span className='card-button'></span>
                                    <p className='card-username'>{admin.name}</p>
                                </div>
                            </div>
                            <div className='card-role-wrap'>
                                <p className='card-role'>{admin.role}</p>
                            </div>
                            <div className='card-social'>
                                <a href={admin.github_url} target='_blank' rel='noreferrer'>
                                    <FaGithub className='social-icon' />
                                </a>
                                <a href={admin.ig_url} target='_blank' rel='noreferrer'>
                                    <FaInstagram className='social-icon' />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}


export default AboutUsPage