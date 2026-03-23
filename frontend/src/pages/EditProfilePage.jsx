import React from "react";
import '../components/EditProfilePage.css';

import { useState } from "react";

export default function EditProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="EditProfile-container">
        <div className="EditProfile-sidebar">
            <div className="EditProfile-menu">
            <div
                className={`EditProfile-menu-item ${
                activeTab === "profile" ? "active" : ""
                }`}
                onClick={() => setActiveTab("profile")}
            >
                👤 Profile
            </div>

            <div
                className={`EditProfile-menu-item ${
                activeTab === "settings" ? "active" : ""
                }`}
                onClick={() => setActiveTab("settings")}
            >
                ⚙️Settings
            </div>
            </div>
        </div>

        <div className="EditProfile-main">
            {activeTab === "profile" && (
            <>
                <h1 className="EditProfile-title">Profile</h1>

                <div className="EditProfile-content">
                    <div className="EditProfile-avatar-section">
                        <img src="/images/pixelated_profile_pic.png" alt="Profile" className="profilePicBanner" />
                        <p className="EditProfile-avatar-text">
                        Recommended ratio 1:1 <br /> and file size &lt; 5 MB.
                        </p>
                    </div>

                    <div className="EditProfile-form">
                        <div className="EditProfile-form-group">
                            <label>Name</label>
                            <input defaultValue="Hann" placeholder="Your Name" />
                        </div>

                        <div className="EditProfile-form-group">
                            <label>Username *</label>
                            <input defaultValue="Hann" placeholder="Choose a Username" />
                        </div>

                        <div className="EditProfile-form-group">
                            <label>Bio</label>  
                            <textarea />
                        </div>
                    </div>
                </div>
                <div className="EditProfile-footer">
                    <button className="EditProfilePage-save-changes-btn">
                        Save changes
                    </button>
                </div>
            </>
            )}

            {activeTab === "settings" && (
            <>
                <h1 className="EditProfile-title">Settings</h1>
                <p style={{ marginTop: "20px" }}>
                {/* Replace with your settings UI */}
                Settings content goes here.
                </p>
            </>
            )}
        </div>
    </div>
  );
}