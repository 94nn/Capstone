import React from 'react'
import WlcMessage from '../components/WlcMessage'
import SideProfile from '../components/SideProfile'
import '../components/HomePage.css'
import Home_Page_Explore from '../components/Home_Page_Explore'
import Home_Page_Progress from '../components/Home_Page_Progress'

const HomePage = () => {
  return (
    <main className="main-layout">
      <WlcMessage />
      <SideProfile />
      <div className='left-column'>
        <Home_Page_Progress />
        <Home_Page_Explore />
      </div>
    </main>
  )
}

export default HomePage