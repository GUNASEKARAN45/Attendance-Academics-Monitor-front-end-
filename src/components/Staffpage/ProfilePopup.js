import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/AdminDashboard.module.css';
import { api, setAuthToken } from '../../Api';

const ProfilePopup = memo(({ setShowProfilePopup }) => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  useEffect(() => {
    console.log('Token in ProfilePopup:', localStorage.getItem('token'));
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) setAuthToken(token);
        const response = await api.get('/api/user/profile');
        console.log('Profile data fetched:', response.data);
        setAdminData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch error:', err.response?.status, err.response?.data);
        setError(
          err.response?.status === 401
            ? 'Session expired, please log in again'
            : err.response?.status === 502
            ? 'Server is down, please try again later'
            : err.response?.status === 404
            ? 'User profile not found'
            : 'Failed to load profile data'
        );
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setAuthToken(null);
          navigate('/login/admin_login');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      const response = await api.post('/api/user/change-password', {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setShowChangePasswordPopup(false), 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to change password');
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setAuthToken(null);
    console.log('Token removed, redirecting to /login/admin_login');
    navigate('/login/admin_login');
  };

  if (loading) {
    return (
      <div className={styles.profilePopupOverlay}>
        <div className={styles.profilePopup}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.profilePopupOverlay}>
        <div className={styles.profilePopup}>
          <p>{error}</p>
          <button className={styles.closeBtn} onClick={() => setShowProfilePopup(false)}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Profile Popup */}
      <div className={styles.profilePopupOverlay}>
        <div className={styles.profilePopup}>
          <h3>Admin Profile</h3>
          <div className={styles.profileInfo}>
            <p><strong>Name:</strong> {adminData?.name || 'Unknown'}</p>
            <p><strong>Admin ID:</strong> {adminData?.adminId || 'N/A'}</p>
            <p><strong>Designation:</strong> {adminData?.designation || 'N/A'}</p>
          </div>
          <div className={styles.profileActions}>
            <button
              className={styles.changePasswordBtn}
              onClick={() => setShowChangePasswordPopup(true)}
            >
              Change Password
            </button>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
          <button className={styles.closeBtn} onClick={() => setShowProfilePopup(false)}>
            Close
          </button>
        </div>
      </div>

      {/* Change Password Popup */}
      {showChangePasswordPopup && (
        <div className={styles.profilePopupOverlay}>
          <div className={styles.profilePopup}>
            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword} className={styles.changePasswordForm}>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              {passwordError && <p className={styles.error}>{passwordError}</p>}
              {passwordSuccess && <p className={styles.success}>{passwordSuccess}</p>}
              <button type="submit">Update Password</button>
            </form>
            <button
              className={styles.closeBtn}
              onClick={() => setShowChangePasswordPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default ProfilePopup;