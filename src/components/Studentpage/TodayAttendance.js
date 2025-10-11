import React from 'react';
import styles from '../../styles/StudentDashboard.module.css';


const TodayAttendance = () => {
  const attendanceData = {
    today: [true, false, true, true, true, false, true]
  };

  return (
    <div className={styles.todayAttendance}>
      <h3>Today's Attendance</h3>
      <div className={styles.periodsContainer}>
        {attendanceData.today.map((present, index) => (
          <div key={index} className={styles.periodDot}>
            <div className={`${styles.dot} ${present ? styles.present : styles.absent}`}>
              {index + 1}
            </div>
            <span>P{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayAttendance;