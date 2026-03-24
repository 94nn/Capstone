import React, { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './NavBar.css'
import NotificationPopup from './NotificationPopup'
import axios from 'axios'

const AdminNavBar = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)
    const [isNotifVisible, setIsNotifVisible] = useState(false)
    const [notifications, setNotifications] = useState([])

    const unreadCount = notifications.filter(n => !n.is_read).length

    const dropdownRef = useRef(null)
    const profileContainerRef = useRef(null)

    // Fetch notifications from API
    useEffect(() => {
        axios.get('/api/notifications/1')
            .then(res => setNotifications(res.data))
            .catch(err => console.error('Error fetching notifications:', err))
    }, [])

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                profileContainerRef.current && !profileContainerRef.current.contains(event.target)
            ) {
                setIsDropdownVisible(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleDropdown = () => {
        setIsDropdownVisible(prev => !prev)
        setIsNotifVisible(false)
    }

    const toggleNotif = () => {
        setIsNotifVisible(prev => !prev)
        setIsDropdownVisible(false)
    }

    return (
        <header className='nav-bar'>
            <div className="nav-bar-left">
                <NavLink to="/homepage" end className="logo-text">
                    MathDex
                </NavLink>
                <NavLink to="/admin" end className="logo-text">
                    Admin
                </NavLink>
            </div>
            <nav className="nav-bar-items">
                <NavLink to="/feedback" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                    Feedback
                </NavLink>
                <NavLink to="/challenge" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                    Challenge
                </NavLink>
            </nav>
            <div className="nav-bar-right">
                <div className="bell-container" onClick={toggleNotif}>
                    <img src="images/bell.png" alt="Bell Icon" className='bell-icon' />
                    {unreadCount > 0 && (
                        <span className="notif-badge">{unreadCount}</span>
                    )}
                </div>
                <div className="coins-container">
                    <img src="/images/Coins.png" alt="Coins" className="coins-pic" />
                    <span className="coins">100</span>
                </div>
                <div className="profile-container" onClick={toggleDropdown}>
                    <img src="/images/profilepicture.jpeg" alt="Profile" className="profile-pic" />
                    <span className="profile-name">Kahock</span>
                </div>
            </div>

            <NotificationPopup
                isVisible={isNotifVisible}
                onClose={() => setIsNotifVisible(false)}
                notifications={notifications}
                setNotifications={setNotifications}
            />

            {isDropdownVisible && (
                <div className="dropdown" ref={dropdownRef}>
                    <ul>
                        <li><NavLink to="/ProfilePage" className={({ isActive }) => `dropdown-item ${isActive ? "dropdown-item-active" : ""}`}>
                            Profile
                        </NavLink></li>
                        <li><NavLink to="/SettingsPage" className={({ isActive }) => `dropdown-item ${isActive ? "dropdown-item-active" : ""}`}>
                            Settings
                        </NavLink></li>
                        <li>Logout</li>
                    </ul>
                </div>
            )}
        </header>
    )
}

export default AdminNavBar