import React from 'react';

function ProfilePage() {
  return (
    <div className="main-layout main-layout-split">

      <div></div>

      <aside className="sidebar">
        <div className="card profile-card">

          {/* Character + Name */}
            <div className="character-container">
                <img src="/images/tempCharacter.png" alt="character" className="character-pic" />

                <div className="character-info">
                    <h1><span className="character-name">Corigin</span></h1>
                    <span className="character-level">Level 1</span>
                </div>
            </div>

          {/* Stats */}
            <div className="profile-stats">

                <div className="stat-container">
                    <img src="/images/tempPoints.png" alt="Points" className="stat-pic"/>
                    <span className="stat-number">0</span>
                    <span className="stat-text">Points</span>
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
