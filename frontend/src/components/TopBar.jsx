import React from "react";
import { NavLink } from "react-router-dom";
import "./TopBar.css";

function TopBar() {
	return (
		<header className="top-bar">
			<div className="top-bar-left">
				<span className="top-bar-logo-text">MathDex</span>
			</div>
			<nav className="top-nav">
				<NavLink to="/modules" end className={({ isActive }) => `top-nav-item ${isActive ? "top-nav-item-active" : ""}`}>
					Learn
				</NavLink>
				<NavLink to="/challenge" className={({ isActive }) => `top-nav-item ${isActive ? "top-nav-item-active" : ""}`}>
					Challenge
				</NavLink>
				<NavLink to="/leaderboard" className={({ isActive }) => `top-nav-item ${isActive ? "top-nav-item-active" : ""}`}>
					Leaderboard
				</NavLink>
			</nav>
			<div className="top-bar-right">
				<button className="primary-button">Log in</button>
			</div>
		</header>
	);
}

export default TopBar;