import React from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const StudentPopup = ({ selectedStudent, onClose }) => {
  if (!selectedStudent) return null;
  return (
    <div className={styles.studentPopupOverlay}>
      <div className={styles.studentPopup}>
        <h3>{selectedStudent.name}'s Details</h3>
        <div className={styles.studentInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Reg No:</span>
            <span>{selectedStudent.regNo}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Attendance:</span>
            <span className={selectedStudent.attendancePercentage < 75 ? styles.lowAttendance : ''}>
              {selectedStudent.attendancePercentage}%
            </span>
          </div>
          <div className={styles.marksSection}>
            <h4>Marks</h4>
            <div className={styles.marksGrid}>
              <span>UT1: {selectedStudent.marks.ut1}</span>
              <span>UT2: {selectedStudent.marks.ut2}</span>
              <span>UT3: {selectedStudent.marks.ut3}</span>
              <span>Model1: {selectedStudent.marks.model1}</span>
              <span>Sem: {selectedStudent.marks.sem}</span>
            </div>
          </div>
          <div className={styles.insightsSection}>
            <h4>Predictive Analysis</h4>
            <ul className={styles.insightsList}>
              {selectedStudent.insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
        <button className={`${styles.closeBtn} ${styles.redCloseBtn}`} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default StudentPopup;