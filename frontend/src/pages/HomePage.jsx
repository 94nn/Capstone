import React from 'react'
import WlcMessage from '../components/WlcMessage'
import SidebarProfile from '../components/SidebarProfile'
import SideProfile from '../components/SideProfile'
import '../components/HomePage.css'

const HomePage = () => {
  return (
    <main className="main-layout">
      <WlcMessage />
      <SideProfile />
    </main>
  )
}

export default HomePage