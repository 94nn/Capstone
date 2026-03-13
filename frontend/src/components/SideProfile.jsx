import React, {useEffect, useState} from 'react'
import axios from 'axios'

const SideProfile = () => {
    const [student_name, setStudentName] = useState('')

    useEffect(() => {
        axios.get('/api/student/1')
        .then(res => setStudentName(res.data.username))
        .catch(err => console.error('Error fetching user data:', err))
    }, [])

    return (
        <aside className="sidebar">
			<div className="card">
                <div className='side-profile-card'>
                    <img src="/images/pixelated_profile_pic.png" alt="Profile" className="profile-pic" />
                    <div>
                        <p className="side-profile-name">{student_name}</p>
				        <p className="side-profile-level">Level 1</p>
                    </div>
                </div>
				<div className="achievements">
                    <div className="achievement-item-top">
                        <img src="/images/diamond.png" alt="Diamond" className="diamond-icon" />
                        <div className='achievement-text-container'>
                            <p className="achievement-text">0</p>
                            <p className="achievement-name">Total XP</p>
                        </div>
                        <img src="/images/rank.png" alt="Rank" className="rank-icon" />
                        <div className='achievement-text-container'>
                            <p className="achievement-text">Bronze</p>
                            <p className="achievement-name">Rank</p>
                        </div>
                    </div>
                    <div className="achievement-item-bottom">
                        <img src="/images/badge.png" alt="Badge" className="badge-icon" />
                        <div className='achievement-text-container'>
                            <p className="achievement-text">0</p>
                            <p className="achievement-name">Badges</p>
                        </div>
                        <img src="/images/fire.png" alt="Streak" className="streak-icon" />
                        <div className='achievement-text-container'>
                            <p className="achievement-text">2</p>
                            <p className="achievement-name">Day Streak</p>
                        </div>
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
                    LEADERBOARD
                </div>
                <div className='view-more-button'>
                    <button>View more</button>
                </div>
            </div>
		</aside>
  )
}

export default SideProfile