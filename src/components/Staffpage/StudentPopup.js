import React from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const StudentPopup = ({ selectedStudent, selectedSubject, onClose }) => {
  if (!selectedStudent) return null;

  return (
    <div className={styles.studentPopupOverlay} onClick={onClose}>
      <div className={styles.studentPopup} onClick={(e) => e.stopPropagation()}>
        <h3>{selectedStudent.name}'s Details</h3>
        <div className={styles.studentInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Reg No:</span>
            <span>{selectedStudent.fullRegNo || selectedStudent.regNo}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Attendance:</span>
            <span className={selectedStudent.attendancePercentage < 75 ? styles.lowAttendance : ''}>
              {selectedStudent.attendancePercentage || 0}%
            </span>
          </div>

          <div className={styles.marksSection}>
            <h4>Marks - {selectedSubject}</h4>
            <div className={styles.marksGrid}>
              <span>UT1: {selectedStudent.marks?.ut1 ?? 0}</span>
              <span>UT2: {selectedStudent.marks?.ut2 ?? 0}</span>
              <span>UT3: {selectedStudent.marks?.ut3 ?? 0}</span>
              <span>Model: {selectedStudent.marks?.model1 ?? 0}</span>
              <span>Sem: {selectedStudent.marks?.sem ?? 0}</span>
            </div>
          </div>

          <div className={styles.insightsSection}>
            <h4>Predictive Insights</h4>
            <ul className={styles.insightsList}>
              {selectedStudent.insights?.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
        <button className={`${styles.closeBtn} ${styles.redCloseBtn}`} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default StudentPopup;