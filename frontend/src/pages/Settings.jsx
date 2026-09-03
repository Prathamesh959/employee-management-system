import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Settings.css";

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState("profile");

  // Profile State
  const [profileData, setProfileData] = useState({ name: "", email: "", role: "", created_at: "" });
  const [nameInput, setNameInput] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.success) {
          setProfileData(res.data.data);
          setNameInput(res.data.data.name);
        }
      } catch (err) {
        setProfileError("Failed to load profile data.");
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!nameInput.trim()) {
      setProfileError("Name cannot be empty.");
      return;
    }

    setIsSavingProfile(true);

    try {
      const res = await api.put("/auth/me", { name: nameInput.trim() });
      if (res.data.success) {
        setProfileSuccess("Profile updated successfully!");
        setProfileData(res.data.data);
        
        updateUser({ name: res.data.data.name });
        
        setTimeout(() => setProfileSuccess(""), 3000);
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setProfileError(err.response.data.message);
      } else {
        setProfileError("Failed to update profile.");
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    setIsSavingPassword(true);

    try {
      const res = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword
      });

      if (res.data.success) {
        setPasswordSuccess("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setPasswordSuccess(""), 3000);
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setPasswordError(err.response.data.message);
      } else {
        setPasswordError("Failed to change password.");
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account settings and preferences.</p>
        </div>
        <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
          Loading profile...
        </div>
      </div>
    );
  }

  const memberSince = profileData.created_at 
    ? new Date(profileData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : "Unknown";

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account settings and preferences.</p>
      </div>

      <div className="settings-layout">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <button 
            className={`settings-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button 
            className={`settings-tab ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
          <button 
            className={`settings-tab ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
        </div>

        {/* Content Area */}
        <div className="settings-content">
          {activeTab === "profile" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h2 className="settings-card-title">Profile Information</h2>
              </div>
              <div className="settings-card-body">
                {profileSuccess && <div className="alert-success">{profileSuccess}</div>}
                {profileError && <div className="alert-error">{profileError}</div>}

                <form onSubmit={handleProfileSubmit}>
                  {/* Photo Section (Disabled for now)
                  <div className="profile-photo-section">
                    <div className="profile-avatar">
                      {getInitials(profileData.name)}
                    </div>
                    <div className="profile-photo-actions">
                      <button type="button" className="btn-primary" disabled>Change Photo</button>
                      <p className="profile-photo-hint">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>
                  */}

                  {/* Form Grid */}
                  <div className="settings-form-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Jane Doe"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-input bg-gray-100"
                        value={profileData.email}
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <input
                        type="text"
                        className="form-input bg-gray-100"
                        value={profileData.role}
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Member Since</label>
                      <input
                        type="text"
                        className="form-input bg-gray-100"
                        value={memberSince}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="settings-form-footer">
                    <button type="submit" className="btn-primary" disabled={isSavingProfile || nameInput === profileData.name}>
                      {isSavingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h2 className="settings-card-title">Security</h2>
              </div>
              <div className="settings-card-body">
                {passwordSuccess && <div className="alert-success">{passwordSuccess}</div>}
                {passwordError && <div className="alert-error">{passwordError}</div>}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="settings-form-grid">
                    <div className="form-group full-width">
                      <label className="form-label">Current Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          className="form-input"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          className="btn-view-password"
                          onClick={() => togglePasswordVisibility('current')}
                          title={showPasswords.current ? "Hide password" : "Show password"}
                        >
                          {showPasswords.current ? "Hide" : "View"}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          className="form-input"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          className="btn-view-password"
                          onClick={() => togglePasswordVisibility('new')}
                        >
                          {showPasswords.new ? "Hide" : "View"}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          className="form-input"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          className="btn-view-password"
                          onClick={() => togglePasswordVisibility('confirm')}
                        >
                          {showPasswords.confirm ? "Hide" : "View"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="settings-form-footer">
                    <button type="submit" className="btn-primary" disabled={isSavingPassword}>
                      {isSavingPassword ? "Changing..." : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h2 className="settings-card-title">Preferences</h2>
              </div>
              <div className="settings-card-body">
                <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
                  Preference settings are not yet available in this version.
                </p>
                <div style={{ padding: "1.5rem", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>Account Actions</h3>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1rem" }}>
                    Sign out of your current session on this device.
                  </p>
                  <button type="button" className="btn-danger" onClick={logout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
