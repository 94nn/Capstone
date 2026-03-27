import React from 'react'
import SimplePage from '../pages/SimplePage'

import { useNavigate } from 'react-router-dom'

const Home_Page_Explore = () => {
    const navigate = useNavigate()
    return (
        <div className='hp-explore-container'>
            <div className='hp-explore-header'>
                <h1>Explore more!</h1>
            </div>
            <div className='hp-explore-content-container'>
                <div className='hp-explore-card'>
                    <button className='hp-explore-button' onClick={() => navigate('/challenge')}>
                        <img src="images/pixelated_challenge_icon.png" alt="Challenge Icon" className='hp-challenge-icon' />
                        <div className='hp-explore-text'>
                            <h3>Challenge Pack</h3>
                            <p>Practice math through engaging challenges designed to sharpen your problem-solving skills.</p>
                        </div>
                    </button>
                </div>
                
                <div className='hp-explore-card'>
                    <button className='hp-explore-button' onClick={() => navigate('/modules')}>
                        <img src="images/pixelated_tutorial_icon.png" alt="Tutorial Icon" className='hp-tutorial-icon' />
                        <div className='hp-explore-text'>
                            <h3>Tutorials</h3>
                            <p>Explore step-by-step lessons that help you understand new math topics and techniques.</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home_Page_Explore