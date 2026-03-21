import React from "react";
import { NavLink } from "react-router-dom";
import "./TopBar.css";

function TopBar() {
	return (
		<header className="nav-bar">
			<div className="nav-bar-left">
				<NavLink to="/" end className="logo-text">
					MathDex
				</NavLink>
			</div>
			<nav className="top-nav">
				<NavLink to="/modules/b4login" end className={({ isActive }) => `top-nav-item ${isActive ? "top-nav-item-active" : ""}`}>
					Learn
				</NavLink>
				<NavLink to="/challenge/b4login" className={({ isActive }) => `top-nav-item ${isActive ? "top-nav-item-active" : ""}`}>
					Challenge
				</NavLink>
				<NavLink to="/leaderboard/b4login" className={({ isActive }) => `top-nav-item ${isActive ? "top-nav-item-active" : ""}`}>
					Leaderboard
				</NavLink>
			</nav>
			<div className="nav-bar-right">
				<button className="primary-button">Log in</button>
			</div>
		</header>
	);
}

export default TopBar;