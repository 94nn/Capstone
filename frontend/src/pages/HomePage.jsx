import React from 'react'
import WlcMessage from '../components/WlcMessage'
import SideProfile from '../components/SideProfile'
import '../components/HomePage.css'
import Home_Page_Explore from '../components/Home_Page_Explore'
import Home_Page_Progress from '../components/Home_Page_Progress'
import Footer from '../components/Footer'
import '../components/Footer.css'

const HomePage = () => {
  return (
    <div>
		<main className="hp-main-layout">
			<WlcMessage />
			<SideProfile />
			<div className='hp-left-column'>
				<Home_Page_Progress />
				<Home_Page_Explore />
			</div>
		</main>
      <Footer /> 
    </div> 
  )
}

export default HomePage