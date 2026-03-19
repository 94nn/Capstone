import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const messages = (username) => [
  { before: "Welcome back, ", after: "! Let's get it." },
  { before: "Nice to see you again, ", after: "! Ready to dive into some math?" },
  { before: "Hey ", after: "! Let's crush some math today. 💪" },
  { before: "You're back, ", after: "! Time to level up your math skills! 🚀" },
  { before: "Great to have you back, ", after: "! Let's make some math magic happen! ✨" },
]

const WlcMessage = () => {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/student/1')
      .then(res => setUsername(res.data.username))
      .catch(err => console.error('Error fetching user data:', err))

      const count = parseInt(localStorage.getItem('visitCount') || '0')
      localStorage.setItem('visitCount', (count + 1)%5)
  }, [])

  const visitCount = parseInt(localStorage.getItem('visitCount') || '0')
  const welcomeText = username ? messages(username)[visitCount] : { before: '', after: '' }

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
          <p>
            {welcomeText.before}
            <span className="username">@{username}</span>
            {welcomeText.after}
        </p>
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
          <button onClick={() => navigate('/modules')}>Get Started</button>
        </div>
      </div>
    </section>
  )
}

export default WlcMessage