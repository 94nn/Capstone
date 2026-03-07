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
        document.addEventListener('click', handleClickOutside);

        // Clean up the event listener when the component unmounts
        return () => {
        document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className='nav-bar'>
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
                <div className="profile-container" onClick={toggleDropdown}>
                    <img src="/images/profilepicture.jpeg" alt="Profile" className="profile-pic" />
                    <span className="profile-name">Hann</span>
                </div>
            </div>
            {isDropdownVisible && (
                <div className="dropdown">
                <ul>
                    <li>Profile</li>
                    <li>Settings</li>
                    <li>Logout</li>
                </ul>
                </div>
            )}
        </div>
    )
}

export default NavBar