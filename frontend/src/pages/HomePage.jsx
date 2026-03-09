import React from 'react'
import WlcMessage from '../components/WlcMessage'
import SidebarProfile from '../components/SidebarProfile'
import SideProfile from '../components/SideProfile'
import '../components/HomePage.css'
import Home_Page_Explore from '../components/Home_Page_Explore'

const HomePage = () => {
  return (
    <main className="main-layout">
      <WlcMessage />
      <SideProfile />
      <Home_Page_Explore />
    </main>
  )
}

export default HomePage