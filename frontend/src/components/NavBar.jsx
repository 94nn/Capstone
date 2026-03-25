import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './NavBar.css'
import NotificationPopup from './NotificationPopup'
import axios from 'axios'

const NavBar = () => {
    const navigate = useNavigate();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isNotifVisible, setIsNotifVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [coins, setCoins] = useState(0);

    const dropdownRef = useRef(null);
    const profileContainerRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const student_id = localStorage.getItem("student_id");

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    // Fetch notifications from API
    useEffect(() => {
        axios.get(`/api/notifications/${student_id}`)
            .then(res => setNotifications(res.data))
            .catch(err => console.error('Error fetching notifications:', err))
    }, [student_id])

    useEffect(() => {
        if (user?.coins_balance !== undefined) {
            setCoins(user.coins_balance);
        }
    }, [user]);

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

    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        localStorage.removeItem("student_id");
        navigate("/login");
    };

    return (
        <header className='nav-bar'>
            <div className="nav-bar-left">
                <NavLink to="/homepage" end className="logo-text">
                    MathDex
                </NavLink>
            </div>
            <nav className="nav-bar-items">
                <NavLink to="/modules" end className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                    Learn
                </NavLink>
                <NavLink to="/challenge" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                    Challenge
                </NavLink>
                <NavLink to="/leaderboard" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                    Leaderboard
                </NavLink>
            </nav>
            <div className="nav-bar-right">
                <div className="bell-container" onClick={toggleNotif}>
                    <img src="/images/bell.png" alt="Bell Icon" className='bell-icon' />
                    {unreadCount > 0 && (
                        <span className="notif-badge">{unreadCount}</span>
                    )}
                </div>
                <div className="coins-container">
                    <img src="/images/Coins.png" alt="Coins" className="coins-pic" />
                    <span className="coins">{user?.coins_balance}</span>
                </div>
                <div className="profile-container" onClick={toggleDropdown} ref={profileContainerRef}>
                    <img src={user?.profile_pic} alt="Profile" className="profile-pic" />
                    <span className="profile-name">{user?.name}</span>
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
                        <li><NavLink to="/ProfilePage" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                            Profile
                        </NavLink></li>
                        <li><NavLink to="/EditProfilePage" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                            Settings
                        </NavLink></li>
                        <li onClick={handleLogout}>Logout</li>
                    </ul>
                </div>
            )}
        </header>
    )
}

export default NavBar