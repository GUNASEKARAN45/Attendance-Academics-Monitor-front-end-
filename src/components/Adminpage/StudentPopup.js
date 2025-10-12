import React, { memo } from 'react';
import styles from '../../styles/AdminDashboard.module.css';


const StudentPopup = memo((props) => {
  if (!props.selectedStudent) return null;
  return (
    <div className={styles.studentPopupOverlay}>
      <div className={styles.studentPopup}>
        <h3>{props.selectedStudent.name}'s Details</h3>
        <div className={styles.studentInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Reg No:</span>
            <span>{props.selectedStudent.regNo}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Attendance:</span>
            <span className={props.selectedStudent.attendancePercentage < 75 ? styles.lowAttendance : ''}>
              {props.selectedStudent.attendancePercentage}%
            </span>
          </div>
          <div className={styles.marksSection}>
            <h4>Marks</h4>
            <div className={styles.marksGrid}>
              <span>UT1: {props.selectedStudent.marks.ut1}</span>
              <span>UT2: {props.selectedStudent.marks.ut2}</span>
              <span>UT3: {props.selectedStudent.marks.ut3}</span>
              <span>Model1: {props.selectedStudent.marks.model1}</span>
              <span>Sem: {props.selectedStudent.marks.sem}</span>
            </div>
          </div>
          <div className={styles.insightsSection}>
            <h4>Predictive Analysis</h4>
            <ul className={styles.insightsList}>
              {props.selectedStudent.insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
        <button 
          className={`${styles.closeBtn} ${styles.redCloseBtn}`} 
          onClick={() => { props.setShowStudentPopup(false); props.setSelectedStudent(null); }}
        >
          Close
        </button>
      </div>
    </div>
  );
});

export default StudentPopup;