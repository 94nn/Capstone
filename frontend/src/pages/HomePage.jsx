import React from 'react'
import WlcMessage from '../components/WlcMessage'
import SidebarProfile from '../components/SidebarProfile'
import '../components/HomePage.css'

const HomePage = () => {
  return (
    <main className="main-layout">
      <WlcMessage />
      <SidebarProfile />
    </main>
  )
}

export default HomePage