// Updated profilepopup.js
import React, { useState, useEffect } from 'react';
import styles from '../../styles/StudentDashboard.module.css';
import { api,setAuthToken } from '../../Api'; // Adjust path if needed

const ProfilePopup = ({ setShowProfilePopup }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/user/profile');
        setStudentData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
        newPassword
      });
      setPasswordSuccess(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setShowChangePassword(false), 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to change password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Assuming token is stored in localStorage
    setAuthToken(null); // From api.js
    window.location.href = '/login'; // Redirect to login page (adjust path as needed)
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
          <button className={styles.closeBtn} onClick={() => setShowProfilePopup(false)}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePopupOverlay}>
      <div className={styles.profilePopup}>
        <h3>Student Profile</h3>
        <div className={styles.profileInfo}>
          <p><strong>Name:</strong> {studentData.name}</p>
          <p><strong>Reg Number:</strong> {studentData.studentReg}</p>
          <p><strong>Degree:</strong> {studentData.degree}</p>
          <p><strong>Department:</strong> {studentData.department}</p>
          <p><strong>Year:</strong> {studentData.year}</p>
          <p><strong>Section:</strong> {studentData.section}</p>
          <p><strong>DOB:</strong> {new Date(studentData.dob).toLocaleDateString()}</p>
          <p><strong>Email:</strong> {studentData.email}</p>
          <p><strong>Phone:</strong> {studentData.phone}</p>
        </div>
        <div className={styles.profileActions}>
          <button 
            className={styles.changePasswordBtn} 
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            Change Password
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>

        {showChangePassword && (
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
        )}

        <button className={styles.closeBtn} onClick={() => setShowProfilePopup(false)}>Close</button>
      </div>
    </div>
  );
};

export default ProfilePopup;