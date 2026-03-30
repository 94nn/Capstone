import React, { useEffect, useState } from "react";
import "../components/Profile.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Avatar from "../components/Avatar";


import Footer from '../components/Footer';
import '../components/Footer.css';


function ProfilePage() {
  const [student, setStudent] = useState(null);
  const [badgesList, setBadgesList] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const student_id = localStorage.getItem("student_id");
  const admin_id = user?.id;
  const role = localStorage.getItem("role");

  const getCharacterImage = (level) => {
    if (level >= 50) return "/images/character06.png";
    if (level >= 40) return "/images/character05.png";
    if (level >= 30) return "/images/character04.png";
    if (level >= 20) return "/images/character03.png";
    if (level >= 10) return "/images/character02.png";

    return "/images/Character01.png";
  };

  useEffect(() => {
    async function loadBadges() {
      try {
        const res = await axios.get("/api/profile/badges");
        setBadgesList(res.data);
      } catch (err) {
        console.log("Failed to load badges", err);
      }
    }

    loadBadges();
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        let res;

        if (role === "student" && student_id) {
          res = await axios.get(`/api/student/${student_id}`);
        } else if (role === "admin" && admin_id) {
          res = await axios.get(`/api/admin/${admin_id}`);
        }

      if (!res) return;
        setStudent(res.data);
      } catch (error) {
        console.log("Failed to load data", error);
      }
    }

    loadData();
  }, [student_id, admin_id, role]);

  return (

    <div className='main-layout main-layout-split'>
      {/* LEFT SIDE */}
      <div className='profile-left'>
        <div className='banner-container'>
			<img
				src='/images/banner.png'
				alt='banner'
				className='profile-banner'
			/>

            <div className='profile-picture'>
              <Avatar name={student?.username} src={student?.image_url} size={120} className="profilePicBanner" />
            </div>

            <div className='profile-section'>
              <div className='profile-text'>
                <h1 className='profilePage-name'>{student?.username}</h1>
                <span className='profile-bio'>{student?.bio}</span>
              </div>
            </div>

            <NavLink to={`/student/${student_id || admin_id}/edit`}>
              <button className='edit-profile-btn'>Edit profile</button>
            </NavLink>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <aside className='sidebar'>
          <div className='card profile-card'>
            <div className='profilePage-character-container'>
              <img
                src={getCharacterImage(student?.level)}
                alt='character'
                className='profilePage-character-pic'
              />

              <div className='character-info'>
                <h1>
                  <span className='character-name'>{student?.username}</span>
                </h1>
                <span className='character-level'>Level {student?.level}</span>
              </div>
            </div>

            <div className='profile-stats'>
              <div className='stat-container'>
                <img
                  src='/images/diamond.png'
                  alt='Points'
                  className='stat-pic'
                />
                <span className='stat-number'>{student?.xp}</span>
                <span className='stat-text'>XP</span>
              </div>

              <div className='stat-container'>
                <img src='/images/badge.png' alt='Badges' className='stat-pic' />
                <span className='stat-number'>{student?.badges}</span>
                <span className='stat-text'>Badges</span>
              </div>
            </div>
          </div>

          <div className='profilePage-badge-card'>
            <div className='profilePage-badge-header'>
              <h3>Course Badges</h3>
              <span>{student?.badges || 0}/{badgesList.length}</span>
            </div>

            <div className='profilePage-badge-grid'>
              {badgesList.map((badge) => {
                const earned = student?.badges_list?.includes(badge.id);

                return (
                  <img
                    key={badge.id}
                    src={`/${badge.image_path}`}
                    alt={`badge-${badge.id}`}
                    className={`profilePage-badge-icon ${earned ? "earned" : "locked"}`}
                  />
                );
              })}
            </div>
            <p className='profilePage-badge-subtext'>
              Complete a chapter to earn a badge - collect them all!
            </p>
          </div>
        </aside>
      <Footer />
    </div>
  );
}

export default ProfilePage;
