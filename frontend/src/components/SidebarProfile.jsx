function SidebarProfile() {
  	return (
		<aside className="sidebar">
			<div className="card profile-card">
				<div className="avatar-circle">Y</div>
				<div className="profile-info">
				<p className="profile-name">Your Name</p>
				<p className="profile-level">Level 1</p>
				<p className="profile-subtext">
					Create an account to save and track your progress
				</p>
				</div>
				<button className="primary-button full-width">Sign up</button>
			</div>
		</aside>
  );
}

export default SidebarProfile;