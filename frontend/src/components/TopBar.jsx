import React from "react";
import { NavLink } from "react-router-dom";

function TopBar() {
	return (
		<header className="top-bar">
			<div className="top-bar-left">
				<span className="logo-text">MathDex</span>
			</div>
			<nav className="top-nav">
				<NavLink
				to="/modules"
				end
				className={({ isActive }) =>
					`nav-item ${isActive ? "nav-item-active" : ""}`
				}
				>
				Learn
				</NavLink>
				<NavLink
				to="/challenge"
				className={({ isActive }) =>
					`nav-item ${isActive ? "nav-item-active" : ""}`
				}
				>
				Challenge
				</NavLink>
				<NavLink
				to="/leaderboard"
				className={({ isActive }) =>
					`nav-item ${isActive ? "nav-item-active" : ""}`
				}
				>
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