import React from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const TodayAttendance = ({ todayAttendanceData, setShowEditAttendance }) => {
  const totalStudents = todayAttendanceData.length;
  const presentCount = todayAttendanceData.filter(s => s.status && !s.late).length;
  const lateCount = todayAttendanceData.filter(s => s.late && s.status).length;
  const absentCount = todayAttendanceData.filter(s => !s.status).length;
  const liveCount = presentCount + lateCount;

  return (
    <div className={styles.todayAttendance}>
      <h3>Today's Student Attendance</h3>
      <div className={styles.attendanceStats}>
        <p>Total Students: {totalStudents}</p>
        <p>Present: {presentCount}</p>
        <p>Live Headcount: {liveCount}</p>
        <p>Latecomers: {lateCount}</p>
        <p>Absent: {absentCount}</p>
      </div>
      <div className={styles.attendanceGrid}>
        {todayAttendanceData.map((student, index) => (
          <div
            key={index}
            className={styles.studentIcon}
            onClick={() => setShowEditAttendance(student)}
            style={{ cursor: 'pointer' }}
          >
            <div
              className={`${styles.icon} ${student.status ? (student.late ? styles.late : styles.present) : styles.absent}`}
              style={{ backgroundImage: `url(https://static.thenounproject.com/png/1594252-200.png)`, backgroundSize: 'cover' }}
            >
              {student.late && <span className={styles.tooltip}>Late Comer</span>}
            </div>
            <span>{student.regNo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayAttendance;