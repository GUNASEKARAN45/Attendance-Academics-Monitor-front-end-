import React from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const ProfilePopup = ({ setShowProfilePopup, staffData }) => {
  return (
    <div className={styles.profilePopupOverlay}>
      <div className={styles.profilePopup}>
        <h3>Staff Profile</h3>
        <div className={styles.profileInfo}>
          <p><strong>Name:</strong> {staffData.name}</p>
          <p><strong>Staff ID:</strong> {staffData.staffId}</p>
          <p><strong>Department:</strong> {staffData.department}</p>
          <p><strong>Designation:</strong> {staffData.designation}</p>
        </div>
        <div className={styles.profileActions}>
          <button className={styles.changePasswordBtn}>Change Password</button>
          <button className={styles.logoutBtn}>Logout</button>
        </div>
        <button className={styles.closeBtn} onClick={() => setShowProfilePopup(false)}>Close</button>
      </div>
    </div>
  );
};

export default ProfilePopup;