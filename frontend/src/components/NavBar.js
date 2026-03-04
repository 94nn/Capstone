import React, {useState} from 'react'
import { NavLink } from 'react-router-dom'
import './NavBar.css'

const NavBar = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Toggle the dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    return (
        <div className='nav-bar'>
            <div className="nav-bar-left">
                <span className="logo-text">MathDex</span>
            </div>
            <nav className="nav-bar-items">
                <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
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