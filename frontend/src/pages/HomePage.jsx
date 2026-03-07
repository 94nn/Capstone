import React from 'react'
import './HomePage.css'

const HomePage = () => {
  return (
    <div className="header">
      <div className="profile-section">
        <img
          src="/images/pixelated_computer_right.png"
          alt="Profile Icon"
          className="profile-icon"
        />
      </div>

      <div className="welcome-message">
        <p>Welcome back, <span className="username">@Hanni101</span>! Let's get it.</p>
      </div>
    </div>
  )
}

export default HomePage