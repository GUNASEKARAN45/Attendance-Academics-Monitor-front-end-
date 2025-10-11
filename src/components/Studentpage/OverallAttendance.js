import React from 'react';
import styles from '../../styles/StudentDashboard.module.css';


const OverallAttendance = () => {
  const attendanceData = {
    semester: { overall: 87.5 }
  };

  return (
    <div className={styles.overallAttendance}>
      <div className={styles.attendanceCircle}>
        <div 
          className={styles.circleProgress}
          style={{ background: `conic-gradient(${attendanceData.semester.overall < 75 ? '#ef4444' : '#22c55e'} ${attendanceData.semester.overall * 3.6}deg, #374151 0deg)` }}
        >
          <span className={styles.percentage}>{attendanceData.semester.overall}%</span>
        </div>
      </div>
      <div className={styles.attendanceInfo}>
        <h4>Overall Attendance</h4>
        <p>Semester 7</p>
      </div>
    </div>
  );
};

export default OverallAttendance;