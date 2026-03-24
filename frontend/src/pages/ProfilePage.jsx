import React, { useEffect, useState } from 'react';
import '../components/Profile.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function ProfilePage() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get(`/api/student/1`);
        setStudent(res.data);
      } catch (error) {
        console.log("Failed to load data", error);
      }
    }
  
    loadData();
  }, []);

    return (
    <div className="main-layout main-layout-split">

      {/* LEFT SIDE */}
      <div className="profile-left">
        <div className="banner-container">
          <img src="/images/banner.png" alt="banner" className="profile-banner" />

          <div className="profile-picture">
            <img
              src={student?.profile_pic || "/images/pixelated_profile_pic.png"}
              alt="Profile"
              className="profilePicBanner"
            />
          </div>

          <div className="profile-section">
            <div className="profile-text">
              <h1 className="profilePage-name">{student?.name}</h1>
              <span className="profile-bio">@{student?.Bio}</span>
            </div>
          </div>

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
              <h1><span className="character-name">{student?.name}</span></h1>
              <span className="character-level">Level {student?.level}</span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-container">
              <img src="/images/tempPoints.png" alt="Points" className="stat-pic"/>
              <span className="stat-number">{student?.xp_balance}/100</span>
              <span className="stat-text">XP</span>
            </div>

            <div className="stat-container">
              <img src="/images/tempBadge.png" alt="Badges" className="stat-pic"/>
              <span className="stat-number">{student?.badges_balance}</span>
              <span className="stat-text">Badges</span>
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}


export default ProfilePage;
