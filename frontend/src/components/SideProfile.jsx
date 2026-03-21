import React, {useEffect, useState} from 'react'
import axios from 'axios'
// import { Crown } from 'lucide-react'

const SideProfile = () => {
    const [student_name, setStudentName] = useState('')
    const [level, setLevel] = useState('')
    const [xp, setXp] = useState('')
    const [badges, setBadges] = useState('')
    const [student_image, setStudentImage] = useState('')
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        axios.get('/api/student/1')
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
    }, [])

    return (
        <aside className="sidebar">
			<div className="card">
                <div className='side-profile-card'>
                    <img src={student_image} alt="Profile" className="profile-pic" />
                    <div>
                        <p className="side-profile-name">{student_name}</p>
				        <p className="side-profile-level">Level {level}</p>
                    </div>
                </div>
				<div className="achievements">
                    <img src="/images/diamond.png" alt="Diamond" className="diamond-icon" />
                    <div className='achievement-text-container'>
                        <p className="achievement-text">{xp}</p>
                        <p className="achievement-name">Total XP</p>
                    </div>
                    <img src="/images/badge.png" alt="Badge" className="badge-icon" />
                    <div className='achievement-text-container'>
                        <p className="achievement-text">{badges}</p>
                        <p className="achievement-name">Badges</p>
                    </div>
				</div>
                <div className="view-profile-button">
                    <button>View Profile</button>
                </div>
			</div>
            <div className='leaderboard-card'>
                <div className='leaderboard-header'>
                    <h2>#Leaderboard</h2>
                </div>
                <div className='leaderboard-content'>
                    <div className='first'>
                        <div className='avatar-wrapper'>
                            <span className='crown'>👑</span>
                            <img src={leaderboard[0]?.profile_pic} alt="1st place" />
                        </div>
                        <div className='leaderboard-info'>
                            <p className='leaderboard-name'>{leaderboard[0]?.name}</p>
                            <p className='leaderboard-xp'>{leaderboard[0]?.xp_balance} XP</p>
                        </div>
                    </div>
                    <div className='second'>
                        <div className='avatar-wrapper'>
                            <span className='crown'>👑</span>
                            <img src={leaderboard[1]?.profile_pic} alt="2nd place" />
                        </div>
                        <div className='leaderboard-info'>
                            <p className='leaderboard-name'>{leaderboard[1]?.name}</p>
                            <p className='leaderboard-xp'>{leaderboard[1]?.xp_balance} XP</p>
                        </div>
                    </div>
                    <div className='third'>
                        <div className='avatar-wrapper'>
                            <span className='crown'>👑</span>
                            <img src={leaderboard[2]?.profile_pic} alt="3rd place" />
                        </div>
                        <div className='leaderboard-info'>
                            <p className='leaderboard-name'>{leaderboard[2]?.name}</p>
                            <p className='leaderboard-xp'>{leaderboard[2]?.xp_balance} XP</p>
                        </div>
                    </div>
                </div>
                <div className='view-more-button'>
                    <button>View more</button>
                </div>
            </div>
		</aside>
  )
}

export default SideProfile