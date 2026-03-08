import React from 'react'

const WlcMessage = () => {
  return (
    <section className="lesson-section">
      <div className="header">
        <div className="profile-section">
          <img
            src="/images/pixelated_computer_right.png"
            alt="Profile Icon"
            className="profile-icon"
          />
        </div>

        <div className="welcome-message">
          <p>Welcome back, <span className="username">@Hann1101</span>! Let's get it.</p>
        </div>
      </div>
      <div className="get-started-container">
        <div className='student-icons'>
          <img
            src="/images/boy_student.png"
            alt="Boy Student"
            className="boy-student-icon"
          />
          <img 
            src="/images/girl_student.png" 
            alt="Girl Student" 
            className="girl-student-icon" 
          />
        </div>
        <div className="welcome-text">
          <h1>Welcome to Mathdex!</h1>
          <p>Discover a world of math learning with us. Explore interactive lessons and practice problems to boost your math skills. Let's embark on this exciting journey together!</p>
        </div>
        <div className="get-started-button">
          <button>Get Started</button>
        </div>
      </div>
    </section>
  )
}

export default WlcMessage