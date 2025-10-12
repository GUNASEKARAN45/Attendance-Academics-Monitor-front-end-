import React, { memo } from 'react';
import styles from '../../styles/AdminDashboard.module.css';


const ProfilePopup = memo((props) => (
  <div className={styles.profilePopupOverlay}>
    <div className={styles.profilePopup}>
      <h3>Admin Profile</h3>
      <div className={styles.profileInfo}>
        <p><strong>Name:</strong> {props.adminData.name}</p>
        <p><strong>Admin ID:</strong> {props.adminData.adminId}</p>
        <p><strong>Designation:</strong> {props.adminData.designation}</p>
      </div>
      <div className={styles.profileActions}>
        <button className={styles.changePasswordBtn}>Change Password</button>
        <button className={styles.logoutBtn}>Logout</button>
      </div>
      <button className={styles.closeBtn} onClick={() => props.setShowProfilePopup(false)}>Close</button>
    </div>
  </div>
));

export default ProfilePopup;