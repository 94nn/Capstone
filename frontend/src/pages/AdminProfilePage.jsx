import React, { useEffect, useState } from "react";
import "../components/Profile.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Avatar from "../components/Avatar";
import { FaGithub, FaInstagram } from "react-icons/fa";

function AdminProfilePage() {
    const [admin, setAdmin] = useState(null);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const admin_id = user?.id;

    useEffect(() => {
        if (!admin_id) return;
        axios.get(`/api/admin/user/${admin_id}`)
            .then(res => setAdmin(res.data))
            .catch(err => console.error("Failed to load admin profile", err));
    }, [admin_id]);

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
                        <Avatar name={admin?.name} src={admin?.image_url} size={120} className="profilePicBanner" />
                    </div>

                    <div className="profile-section" style={{ bottom: '-160px' }}>
                        <div className="profile-text">
                            <h1 className="profilePage-name">{admin?.name}</h1>
                            <span className="profile-bio">{admin?.role}</span>
                            {admin?.bio && (
                                <p className="profile-bio" style={{ marginTop: '8px' }}>{admin.bio}</p>
                            )}
                        </div>
                    </div>

                    <NavLink to="/EditProfilePage">
                        <button className="edit-profile-btn">Edit profile</button>
                    </NavLink>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <aside className="sidebar">
                <div className="card profile-card">
                    <div className="character-container">
                        <Avatar name={admin?.name} src={admin?.image_url} size={80} />
                        <div className="character-info">
                            <h1>
                                <span className="character-name">{admin?.name}</span>
                            </h1>
                            <span className="character-level">{admin?.role}</span>
                        </div>
                    </div>

                    <div className="profile-stats">
                        {admin?.github_url && (
                            <div className="stat-container">
                                <a href={admin.github_url} target="_blank" rel="noreferrer">
                                    <FaGithub size={26} />
                                </a>
                            </div>
                        )}
                        {admin?.ig_url && (
                            <div className="stat-container">
                                <a href={admin.ig_url} target="_blank" rel="noreferrer">
                                    <FaInstagram size={26} />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    );
}

export default AdminProfilePage;
