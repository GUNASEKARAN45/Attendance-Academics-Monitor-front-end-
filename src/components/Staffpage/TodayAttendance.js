import React from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const TodayAttendance = ({ todayAttendanceData, setShowEditAttendance, loadingStudents }) => {
  const totalStudents = todayAttendanceData.length;
  const presentCount = todayAttendanceData.filter(s => s.status === true && !s.late).length;
  const lateCount = todayAttendanceData.filter(s => s.late).length;
  const absentCount = todayAttendanceData.filter(s => s.status === false).length;
  const markedCount = todayAttendanceData.filter(s => s.status !== null).length;

  if (loadingStudents) {
    return (
      <div className={styles.todayAttendance}>
        <h3>Today's Student Attendance</h3>
        <p>Loading students...</p>
      </div>
    );
  }

  if (totalStudents === 0) {
    return (
      <div className={styles.todayAttendance}>
        <h3>Today's Student Attendance</h3>
        <p>No students found for selected class</p>
      </div>
    );
  }

  return (
    <div className={styles.todayAttendance}>
      <h3>Today's Student Attendance</h3>

      <div className={styles.attendanceStats}>
        <p>Total Students: {totalStudents}</p>

        <p>
          <span className={`${styles.statusDot} ${styles.dotPresent}`}></span>
          Present: {presentCount}
        </p>

        <p>
          <span className={`${styles.statusDot} ${styles.dotLate}`}></span>
          Latecomers: {lateCount}
        </p>

        <p>
          <span className={`${styles.statusDot} ${styles.dotAbsent}`}></span>
          Absent: {absentCount}
        </p>

        <p>Live Headcount: {presentCount + lateCount}</p>

        <p>Marked: {markedCount} / {totalStudents}</p>
      </div>

      <div className={styles.attendanceGrid}>
        {todayAttendanceData.map((student, index) => (
          <div
            key={student.studentId || index}
            className={styles.studentIcon}
            onClick={() => setShowEditAttendance(student)}
            style={{ cursor: 'pointer' }}
          >
            <div
              className={`${styles.icon} ${
                student.status === true
                  ? student.late
                    ? styles.late      // Orange (Late)
                    : styles.present   // Green (Present)
                  : styles.absent      // Red (Absent)
              }`}
              style={{
                backgroundImage: `url(https://static.thenounproject.com/png/1594252-200.png)`,
                backgroundSize: 'cover'
              }}
            >
              {student.late && <span className={styles.tooltip}>Late</span>}
              {student.status === false && <span className={styles.tooltip}>Absent</span>}
              {student.status === null && <span className={styles.tooltip}>Not Marked</span>}
            </div>

            <span>{student.regNo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayAttendance;
