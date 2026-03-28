import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import './NavBar.css'
import NotificationPopup from './NotificationPopup'
import axios from 'axios'
import { getImageUrl } from "../utils/imageUrl";

const NavBar = () => {
    const navigate = useNavigate();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isNotifVisible, setIsNotifVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [coins, setCoins] = useState(0);

    const [profileImage, setProfileImage] = useState("");

    const dropdownRef = useRef(null);
    const profileContainerRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const student_id = localStorage.getItem("student_id");
    const role = localStorage.getItem("role");
    const admin_id = user?.id;

    const location = useLocation();
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    useEffect(() => {
        async function loadData() {
            try {
                let res;

                if (role === "student" && student_id) {
                    res = await axios.get(`/api/student/${student_id}`);
                } else if (role === "admin" && admin_id) {
                    res = await axios.get(`/api/admin/${admin_id}`);
                }

                if (!res) return;
                setProfileImage(getImageUrl(res.data.image_url || res.data.profile_pic));
                if (res.data.coins !== undefined) setCoins(res.data.coins);
            } catch (error) {
                console.error("Failed to load data:", error);
            }
        }

        loadData();
    }, [student_id, admin_id, role, location.pathname]);

    // Fetch notifications from API
    useEffect(() => {
        if (!student_id) return;
        const timer = setTimeout(() => {
            axios.get(`/api/notifications/${student_id}`)
                .then(res => setNotifications(res.data))
                .catch(err => console.error('Error fetching notifications:', err))
        }, 300);
        return () => clearTimeout(timer);
    }, [student_id, location.pathname])

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

    const goProfile = () => {
        navigate(`/student/${student_id || admin_id}`);
    };

    const goEditProfile = () => {
        navigate(`/student/${student_id || admin_id}/edit`);
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
                    <span className="coins">{coins}</span>
                </div>
                <div className="profile-container" onClick={toggleDropdown} ref={profileContainerRef}>
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="profile-pic"
                    />
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
                        <li onClick={goProfile}>Profile</li>
                        <li onClick={goEditProfile}>Settings</li>
                        <li onClick={handleLogout}>Logout</li>
                    </ul>
                </div>
            )}
        </header>
    )
}

export default NavBar
