import React from "react";
import { NavLink } from "react-router-dom";

function TopBar() {
	return (
		<header className="top-bar">
			<div className="top-bar-left">
				<span className="logo-text">Capstone</span>
			</div>
			<nav className="top-nav">
				<NavLink
				to="/"
				end
				className={({ isActive }) =>
					`nav-item ${isActive ? "nav-item-active" : ""}`
				}
				>
				Learn
				</NavLink>
				<NavLink
				to="/practice"
				className={({ isActive }) =>
					`nav-item ${isActive ? "nav-item-active" : ""}`
				}
				>
				Practice
				</NavLink>
				<NavLink
				to="/build"
				className={({ isActive }) =>
					`nav-item ${isActive ? "nav-item-active" : ""}`
				}
				>
				Build
				</NavLink>
				<NavLink
				to="/community"
				className={({ isActive }) =>
					`nav-item ${isActive ? "nav-item-active" : ""}`
				}
				>
				Community
				</NavLink>
				<NavLink
				to="/pricing"
				className={({ isActive }) =>
					`nav-item ${isActive ? "nav-item-active" : ""}`
				}
				>
				Pricing
				</NavLink>
			</nav>
			<div className="top-bar-right">
				<button className="primary-button">Sign up</button>
			</div>
		</header>
	);
}

export default TopBar;