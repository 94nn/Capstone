import React, {useState, useRef, useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import './NavBar.css'

const NavBar = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Reference for the dropdown and profile container
    const dropdownRef = useRef(null);
    const profileContainerRef = useRef(null);

    // Toggle the dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

      // Close the dropdown if clicked outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                profileContainerRef.current && !profileContainerRef.current.contains(event.target)
            ) {
                setIsDropdownVisible(false);
            }
        };

        // Add event listener to detect clicks outside
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener when the component unmounts
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className='nav-bar'>
            <div className="nav-bar-left">
<<<<<<< HEAD
<<<<<<< HEAD:frontend/src/components/NavBar.jsx
                <NavLink to="/homepage" end className="logo-text">
                    MathDex
=======
                <NavLink to="/admin" end className="logo-text">
                    Admin
>>>>>>> 3e273be (Admin module management):frontend/src/components/AdminNavBar.jsx
=======

                <NavLink to="/admin" end className="logo-text">
                    Admin

>>>>>>> 15eafe5 (finish module management(admin))
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
<<<<<<< HEAD
<<<<<<< HEAD:frontend/src/components/NavBar.jsx
                <div className="bell-container">
                    <img src="images/bell.png" alt="Bell Icon" className='bell-icon' />
                </div>
=======
                <div>
                    <img src="images/bell.png" alt="Bell Icon" className='bell-icon' />
                </div>
                <div className="profile-container" onClick={toggleDropdown} ref={profileContainerRef}>
                    <img src="/images/pixelated_profile_pic.png" alt="Profile" className="profile-pic" />
                    <span className="profile-name">Hann</span>
                </div>
>>>>>>> 15eafe5 (finish module management(admin))
                <div className="coins-container">
                    <img src="/images/Coins.png" alt="Coins" className="coins-pic" />
                    <span className="coins">100</span>
                </div>
                <div className="profile-container" onClick={toggleDropdown} ref={profileContainerRef}>
                    <img src="/images/pixelated_profile_pic.png" alt="Profile" className="profile-pic" />
                    <span className="profile-name">Hann</span>
=======
                <div className="profile-container" onClick={toggleDropdown}>
                    <img src="/images/profilepicture.jpeg" alt="Profile" className="profile-pic" />
                    <span className="profile-name">Kahock</span>
>>>>>>> 3e273be (Admin module management):frontend/src/components/AdminNavBar.jsx
                </div>
            </div>

            {isDropdownVisible && (
                <div className="dropdown" ref={dropdownRef}>
                <ul>
                    <li><NavLink to="/ProfilePage" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                        Profile
                    </NavLink></li>
                    <li><NavLink to="/SettingsPage" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                        Settings
                    </NavLink></li>
                    <li>Logout</li>
                </ul>
                </div>
            )}
        </header>
    )
}

export default NavBar