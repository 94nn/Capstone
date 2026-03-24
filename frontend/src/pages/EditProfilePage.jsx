import React, { useState, useEffect } from "react";
import "../components/EditProfilePage.css";
import axios from "axios";

export default function EditProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Student state
  const [student, setStudent] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const userId = 1; // replace with actual logged-in user id

  // 🔹 Load student data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get(`/api/student/${userId}`);
        setStudent(res.data);
        setName(res.data.username || "");
        setBio(res.data.bio || "");
        setProfileImage(res.data.image_url || "");
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    }
    loadData();
  }, [userId]);

  // 🔹 Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  // 🔹 Save profile
  const handleSave = async () => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("bio", bio);

  if (selectedFile) {
    formData.append("profile_pic", selectedFile);
  }

  try {
    const res = await fetch(`/api/update-profile/${userId}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Server error:", text);
      alert("Error updating profile. Check console for details.");
      return;
    }

    const data = await res.json();
    console.log("Profile updated:", data);


    setProfileImage(data.image_url);
    setSelectedFile(null); // reset local file

    alert("Profile updated successfully!");
  } catch (err) {
    console.error("Request failed:", err);
    alert("Error updating profile");
  }
};

  return (
    <div className="EditProfile-container">
      {/* Sidebar */}
      <div className="EditProfile-sidebar">
        <div className="EditProfile-menu">
          <div
            className={`EditProfile-menu-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </div>
          <div
            className={`EditProfile-menu-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="EditProfile-main">
        {activeTab === "profile" && (
          <>
            <h1 className="EditProfile-title">Profile</h1>

            <div className="EditProfile-content">
              {/* Avatar Section */}
              <div className="EditProfile-avatar-section">
                <div className="EditProfile-avatar-wrapper">
                  <img
                    src={profileImage || "/images/default-avatar.png"}
                    alt="Profile"
                    className="EditProfile-profilePicBanner"
                  />
                  <div
                    className="EditProfile-avatar-overlay"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    ✏️ Edit photo
                  </div>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </div>
                <p className="EditProfile-avatar-text">
                  Recommended ratio 1:1 <br /> and file size &lt; 5 MB.
                </p>
              </div>

              {/* Form Section */}
              <div className="EditProfile-form">
                <div className="EditProfile-form-group">
                  <label>Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div className="EditProfile-form-group">
                  <label>Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="EditProfile-footer">
              <button
                onClick={handleSave}
                className="EditProfilePage-save-changes-btn"
              >
                Save changes
              </button>
            </div>
          </>
        )}

        {activeTab === "settings" && (
          <>
            <h1 className="EditProfile-title">Settings</h1>
            <p style={{ marginTop: "20px" }}>Settings content goes here.</p>
          </>
        )}
      </div>
    </div>
  );
}