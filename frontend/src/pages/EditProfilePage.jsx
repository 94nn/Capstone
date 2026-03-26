import React, { useState, useEffect } from "react";
import "../components/EditProfilePage.css";
import axios from "axios";
import { getImageUrl } from "../utils/imageUrl";

export default function EditProfilePage() {
	const [activeTab, setActiveTab] = useState("profile");

	const [student, setStudent] = useState(null);
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [profileImage, setProfileImage] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const user = JSON.parse(localStorage.getItem("user") || "null");
	const student_id = localStorage.getItem("student_id");
	const admin_id = user?.id;

	// Settings fields
	const [email, setEmail] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [currentPasswordVerified, setCurrentPasswordVerified] = useState(false);


  // Load student data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get(`/api/student/${userId}`);
        setStudent(res.data);
        setName(res.data.username || "");
        setBio(res.data.bio || "");
        setEmail(res.data.email || "");
        // Use getImageUrl so relative paths are prefixed with backend URL
        setProfileImage(getImageUrl(res.data.image_url));
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    }
    loadData();
  }, [userId]);

  // Image preview — uses local blob URL while editing, no need for getImageUrl
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

	// Save profile
	const handleSaveProfile = async () => {
		const formData = new FormData();
		formData.append("name", name);
		formData.append("bio", bio);
	
		if (selectedFile) formData.append("profile_pic", selectedFile);
	
		try {
		let res;
	
		if (student_id) {
			res = await fetch(`/api/update-profile/${student_id}`, {
			method: "POST",
			body: formData,
			});
		} else if (admin_id) {
			res = await fetch(`/api/update-profile/${admin_id}`, {
			method: "POST",
			body: formData,
			});
		}
	
		if (!res.ok) throw new Error(await res.text());
	
		const data = await res.json();
	
		setProfileImage(data.image_url || data.profile_pic);
		setSelectedFile(null);
	
		alert("Profile updated!");
	
		} catch (err) {
		console.error(err);
		alert("Failed to update profile");
		}

    try {
      const res = await fetch(`/api/update-profile/${userId}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      // update-profile returns a full URL already, so use it directly
      setProfileImage(getImageUrl(data.image_url));
      setSelectedFile(null);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  // Save settings (email/password)
  const handleSaveSettings = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      const res = await axios.post(`/api/update-settings/${userId}`, {
        email,
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (res.status !== 200) throw new Error(res.data?.error || "Failed");

      alert("Settings updated!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPasswordVerified(false);

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update settings");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`/api/delete-account/${userId}`);
      if (res.status === 200) {
        alert("Account deleted successfully.");
        window.location.href = "/homepage";
      } else {
        alert("Failed to delete account.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting account.");
    }
  };

  const verifyCurrentPassword = async () => {
    if (!currentPassword) {
      alert("Please enter your current password");
      return;
    }

    try {
      const res = await axios.post(`/api/verify-password/${userId}`, {
        current_password: currentPassword,
      });

      if (res.data.valid) {
        setCurrentPasswordVerified(true);
      } else {
        alert("Current password is incorrect");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to verify password");
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

      {/* Main Content */}
      <div className="EditProfile-main">
        {activeTab === "profile" && (
          <>
            <h1 className="EditProfile-title">Profile</h1>
            <div className="EditProfile-content">
              <div className="EditProfile-avatar-section">
                <div className="EditProfile-avatar-wrapper">
                  <img
                    src={profileImage}
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
            <div className="EditProfile-footer">
              <button
                onClick={handleSaveProfile}
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
            <div className="EditProfile-content">
              <div className="EditProfile-form" style={{ flex: 1 }}>
                <div className="EditProfile-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>

                <div className="EditProfile-form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password to change it"
                  />
                </div>

                {currentPasswordVerified && (
                  <>
                    <div className="EditProfile-form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                      />
                    </div>
                    <div className="EditProfile-form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="EditProfile-footer">
              {!currentPasswordVerified ? (
                <button
                  className="EditProfilePage-save-changes-btn"
                  onClick={verifyCurrentPassword}
                >
                  Verify Password
                </button>
              ) : (
                <button
                  className="EditProfilePage-save-changes-btn"
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </button>
              )}
            </div>

            <div className="EditProfile-delete-section">
              <h1 className="EditProfile-delete-title">Delete Account</h1>
              <p className="EditProfile-delete-warning">
                ⚠️ This action is permanent. All your data will be lost.
              </p>
              <button
                className="EditProfile-delete-btn"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}