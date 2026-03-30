import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const messages = (username) => [
  { before: "Welcome back, ", after: "! Let's go get it." },
  { before: "Nice to see you again, ", after: "! Ready to dive into some math?" },
  { before: "Hey ", after: "! Let's crush some math today. 💪" },
  { before: "You're back, ", after: "! Time to level up your math skills! 🚀" },
  { before: "Great to have you back, ", after: "! Let's make some math magic happen! ✨" },
]

const WlcMessage = () => {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()
  const student_id = localStorage.getItem("student_id");

  useEffect(() => {
    if (!student_id) return
    axios.get(`/api/student/${student_id}`)
      .then(res => setUsername(res.data.username))
      .catch(err => console.error('Error fetching user data:', err))

      const count = parseInt(localStorage.getItem('visitCount') || '0')
      localStorage.setItem('visitCount', (count + 1)%5)
  }, [student_id])

  const visitCount = parseInt(localStorage.getItem('visitCount') || '0')
  const welcomeText = username ? messages(username)[visitCount] : { before: '', after: '' }

  return (
    <section className="hp-lesson-section">
      <div className="hp-header">
        <div className="hp-wlc-section">
          <img
            src="/images/pixelated_computer_right.png"
            alt="Computer Icon"
            className="hp-computer-icon"
          />
        </div>

        <div className="hp-welcome-message">
          <p>
            {welcomeText.before}
            <span className="hp-username">@{username}</span>
            {welcomeText.after}
        </p>
        </div>
      </div>
      <div className="hp-get-started-container">
        <div className='hp-student-icons'>
          <img
            src="/images/boy_student.png"
            alt="Boy Student"
            className="hp-boy-student-icon"
          />
          <img 
            src="/images/girl_student.png" 
            alt="Girl Student" 
            className="hp-girl-student-icon" 
          />
        </div>
        <div className="hp-welcome-text">
          <h1>Welcome to Mathdex!</h1>
          <p>Discover a world of math learning with us. Explore interactive lessons and practice problems to boost your math skills. Let's embark on this exciting journey together!</p>
        </div>
        <div className="hp-get-started-button">
          <button onClick={() => navigate('/modules')}>Get Started</button>
        </div>
      </div>
    </section>
  )
}

export default WlcMessage