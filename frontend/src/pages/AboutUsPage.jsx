import React, { useEffect } from 'react'
import './AboutUsPage.css'

const AboutUsPage = () => {

    useEffect(() => {
    const container = document.querySelector('.about-us-container')

    document.querySelectorAll('.star').forEach(s => s.remove())

    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.width = `${Math.random() * 2 + 1}px`   // 1px to 3px
      star.style.height = star.style.width
      star.style.animationDelay = `${Math.random() * 3}s` // random twinkle timing
      container.appendChild(star)
    }
  }, [])

  return (
    <div className="about-us-container">
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
  )
}


export default AboutUsPage