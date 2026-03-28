import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate, NavLink } from 'react-router-dom'
import Avatar from './Avatar'

const SideProfile = () => {
    const navigate = useNavigate()
    const [student_name, setStudentName] = useState('')
    const [level, setLevel] = useState('')
    const [xp, setXp] = useState('')
    const [badges, setBadges] = useState('')
    const [student_image, setStudentImage] = useState('')
    const [leaderboard, setLeaderboard] = useState([])
    const student_id = localStorage.getItem("student_id");

    useEffect(() => {
        axios.get(`/api/student/${student_id}`)
            .then(res => {
                setStudentName(res.data.username)
                setLevel(res.data.level)
                setXp(res.data.xp)
                setBadges(res.data.badges)
                setStudentImage(res.data.image_url)
            })
            .catch(err => console.error('Error fetching user data:', err))

        axios.get('/api/leaderboard')
            .then(res => setLeaderboard(res.data))
            .catch(err => console.error('Error fetching leaderboard:', err))
    }, [student_id])

    return (
        <aside className="hp-sidebar">
			<div className="hp-card">
                <div className='hp-side-profile-card'>
                    <Avatar name={student_name} src={student_image} size={64} className="hp-profile-pic" />
                    <div>
                        <p className="hp-side-profile-name">{student_name}</p>
				        <p className="hp-side-profile-level">Level {level}</p>
                    </div>
                </div>
				<div className="hp-achievements">
                    <img src="/images/diamond.png" alt="Diamond" className="hp-diamond-icon" />
                    <div className='hp-achievement-text-container'>
                        <p className="hp-achievement-text">{xp}</p>
                        <p className="hp-achievement-name">Total XP</p>
                    </div>
                    <img src="/images/badge.png" alt="Badge" className="hp-badge-icon" />
                    <div className='hp-achievement-text-container'>
                        <p className="hp-achievement-text">{badges}</p>
                        <p className="hp-achievement-name">Badges</p>
                    </div>
				</div>
                <div className="hp-view-profile-button">
                    <button onClick={() => navigate('/ProfilePage')}>View Profile</button>
                </div>
			</div>
            <div className='hp-leaderboard-card'>
                <div className='hp-leaderboard-header'>
                    <h2>#Leaderboard</h2>
                </div>
                <div className='hp-leaderboard-content'>
                    <div className='hp-first'>
                        <div className='hp-avatar-wrapper'>
                            <span className='hp-crown'>👑</span>
                            <Avatar name={leaderboard[0]?.name} src={leaderboard[0]?.profile_pic} size={56} />
                        </div>
                        <div className='hp-leaderboard-info'>
                            <p className='hp-leaderboard-name'>{leaderboard[0]?.name}</p>
                            <p className='hp-leaderboard-xp'>{leaderboard[0]?.xp_balance} XP</p>
                        </div>
                    </div>
                    <div className='hp-second'>
                        <div className='hp-avatar-wrapper'>
                            <span className='hp-crown'>👑</span>
                            <Avatar name={leaderboard[1]?.name} src={leaderboard[1]?.profile_pic} size={56} />
                        </div>
                        <div className='hp-leaderboard-info'>
                            <p className='hp-leaderboard-name'>{leaderboard[1]?.name}</p>
                            <p className='hp-leaderboard-xp'>{leaderboard[1]?.xp_balance} XP</p>
                        </div>
                    </div>
                    <div className='hp-third'>
                        <div className='hp-avatar-wrapper'>
                            <span className='hp-crown'>👑</span>
                            <Avatar name={leaderboard[2]?.name} src={leaderboard[2]?.profile_pic} size={56} />
                        </div>
                        <div className='hp-leaderboard-info'>
                            <p className='hp-leaderboard-name'>{leaderboard[2]?.name}</p>
                            <p className='hp-leaderboard-xp'>{leaderboard[2]?.xp_balance} XP</p>
                        </div>
                    </div>
                </div>
                <div className='hp-view-more-button'>
                    <button onClick={() => navigate('/leaderboard')}>View more</button>
                </div>
            </div>
		</aside>
  )
}

export default SideProfile