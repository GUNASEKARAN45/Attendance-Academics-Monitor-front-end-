import React from 'react';
import styles from '../../styles/StudentDashboard.module.css';

const ProfilePopup = ({ setShowProfilePopup }) => {
  const studentData = {
    name: "Gunasekaran K",
    regNumber: "6176AC22UEC036",
    class: "B.E",
    department: "ECE",
    year: "4",
    section: "A",
    semester: 7
  };

  return (
    <div className={styles.profilePopupOverlay}>
      <div className={styles.profilePopup}>
        <h3>Student Profile</h3>
        <div className={styles.profileInfo}>
          <p><strong>Name:</strong> {studentData.name}</p>
          <p><strong>Reg Number:</strong> {studentData.regNumber}</p>
          <p><strong>Class:</strong> {studentData.class}</p>
          <p><strong>Department:</strong> {studentData.department}</p>
          <p><strong>Year:</strong> {studentData.year}</p>
          <p><strong>Section:</strong> {studentData.section}</p>
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