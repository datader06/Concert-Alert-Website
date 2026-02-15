import React, { useState, useEffect } from 'react';
import '../styles/Pages.css';
import { authService } from '../services/api';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    email: '',
    username: '',
    city: '',
    country: ''
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await authService.getProfile();
      if (result.ok && result.data) {
        setProfileData({
          email: result.data.email || '',
          username: result.data.username || '',
          city: result.data.city || '',
          country: result.data.country || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage('❌ Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const result = await authService.updateProfile(
        profileData.city,
        profileData.country
      );
      if (result.ok) {
        setMessage('✅ Profile updated successfully!');
        setEditing(false);
      } else {
        setMessage('❌ Error updating profile');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error updating profile');
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-page">
      <h1>👤 My Profile</h1>

      {message && <div className="message">{message}</div>}

      <div className="profile-card">
        <div className="profile-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            disabled
            className="disabled-field"
          />
        </div>

        <div className="profile-field">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={profileData.username}
            disabled
            className="disabled-field"
          />
        </div>

        <div className="profile-field">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={profileData.city}
            onChange={handleChange}
            disabled={!editing}
            className={editing ? '' : 'disabled-field'}
            placeholder="New York"
          />
        </div>

        <div className="profile-field">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={profileData.country}
            onChange={handleChange}
            disabled={!editing}
            className={editing ? '' : 'disabled-field'}
            placeholder="United States"
          />
        </div>

        <div className="profile-actions">
          {!editing ? (
            <button className="btn-edit" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          ) : (
            <>
              <button className="btn-save" onClick={handleSave}>
                💾 Save
              </button>
              <button className="btn-cancel" onClick={() => setEditing(false)}>
                ✖️ Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
