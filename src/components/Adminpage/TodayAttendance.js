import React, { memo } from 'react';
import styles from '../../styles/AdminDashboard.module.css';


const TodayAttendance = memo((props) => (
  <div className={styles.todayAttendance}>
    <h3>Today's Student Attendance</h3>
    <div className={styles.attendanceStats}>
      <p>Total Students: {props.totalStudents}</p>
      <p>Present: {props.presentCount}</p>
      <p>Live Headcount: {props.liveCount}</p>
      <p>Latecomers: {props.lateCount}</p>
      <p>Absent: {props.absentCount}</p>
    </div>
    <div className={styles.attendanceGrid}>
      {props.todayAttendanceData.map((student, index) => (
        <div key={student.regNo} className={styles.studentIcon}>
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
));

export default TodayAttendance;