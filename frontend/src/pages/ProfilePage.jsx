import React from 'react';
import '../components/Profile.css';
import { NavLink } from 'react-router-dom';

function ProfilePage() {
  return (
    <div className="main-layout main-layout-split">

      {/* LEFT SIDE */}
      <div className="profile-left">

        <div className="banner-container">
          <img
            src="/images/banner.png"
            alt="banner"
            className="profile-banner"
          />
          
          <div className="profile-picture">
            <img src="/images/pixelated_profile_pic.png" alt="Profile" className="profilePicBanner" />
          </div>
          <div className="profile-section">
            <div className="profile-text">
              <h1 className="profilePage-name">Hann</h1>
              <span className="profile-username">@Hann</span>
            </div>
          </div>
          
          
            <button className="edit-profile-btn">
                Edit profile
            </button>

            <NavLink to="/EditProfilePage">
                <button className="edit-profile-btn">
                    Edit profile
                </button>
            </NavLink>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <aside className="sidebar">
        <div className="card profile-card">

          <div className="character-container">
            <img src="/images/tempCharacter.png" alt="character" className="character-pic" />

            <div className="character-info">
              <h1><span className="character-name">Hann</span></h1>
              <span className="character-level">Level 1</span>
            </div>
          </div>

          <div className="profile-stats">

            <div className="stat-container">
              <img src="/images/tempPoints.png" alt="Points" className="stat-pic"/>
              <span className="stat-number">0/100</span>
              <span className="stat-text">XP</span>
            </div>

            <div className="stat-container">
              <img src="/images/tempBadge.png" alt="Badges" className="stat-pic"/>
              <span className="stat-number">0</span>
              <span className="stat-text">Badges</span>
            </div>

          </div>

        </div>
      </aside>

    </div>
  );
}


export default ProfilePage;
