import React from 'react'
import SimplePage from '../pages/SimplePage'
import ModulePage from '../pages/ModulePage'

const Home_Page_Explore = () => {
  return (
    <div className='explore-container'>
        <div className='explore-header'>
            <h1>Explore more!</h1>
        </div>
        <div className='explore-content-container'>
            <div className='explore-card'>
                <button className='explore-button' onClick={() => <SimplePage title="Challenge" description="Challenge" />}>
                    <img src="images/pixelated_challenge_icon.png" alt="Challenge Icon" className='challenge-icon' />
                    <div className='explore-text'>
                        <h3>Challenge Pack</h3>
                        <p>Practice math through engaging challenges designed to sharpen your problem-solving skills.</p>
                    </div>
                </button>
            </div>
            
            <div className='explore-card'>
                <button className='explore-button' onClick={() => <ModulePage />}>
                    <img src="images/pixelated_tutorial_icon.png" alt="Tutorial Icon" className='tutorial-icon' />
                    <div className='explore-text'>
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