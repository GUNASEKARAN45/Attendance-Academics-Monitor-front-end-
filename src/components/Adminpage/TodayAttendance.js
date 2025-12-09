// src/components/Adminpage/TodayAttendance.js
import React from 'react';
import styles from '../../styles/AdminDashboard.module.css';

const TodayAttendance = ({
  totalStudents,
  presentCount,
  liveCount,
  lateCount,
  absentCount,
  todayAttendanceData,
  loading = false,
}) => {
  // Helper to safely get last 5 digits
  const getLastFive = (regNo) => {
    if (!regNo || typeof regNo !== 'string') return '-----';
    return regNo.length >= 5 ? regNo.slice(-5) : regNo.padStart(5, '0');
  };

  return (
    <div className={styles.todayAttendance}>
      <h3>Today's Student Attendance</h3>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
          Loading students...
        </div>
      ) : todayAttendanceData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
          No students found for the selected filters
        </div>
      ) : (
        <>
          <div className={styles.attendanceStats}>
            <p>Total Students: <strong>{totalStudents}</strong></p>
            <p>Present: <strong style={{ color: '#10b981' }}>{presentCount}</strong></p>
            <p>Live Headcount: <strong style={{ color: '#3b82f6' }}>{liveCount}</strong></p>
            <p>Latecomers: <strong style={{ color: '#f59e0b' }}>{lateCount}</strong></p>
            <p>Absent: <strong style={{ color: '#ef4444' }}>{absentCount}</strong></p>
          </div>

          <div className={styles.attendanceGrid}>
            {todayAttendanceData.map((student, index) => {
              const lastFive = getLastFive(student?.regNo);

              return (
                <div key={student?.regNo || index} className={styles.studentIcon}>
                  <div
                    className={`${styles.icon} ${
                      student?.status
                        ? student?.late
                          ? styles.late
                          : styles.present
                        : styles.absent
                    }`}
                    style={{
                      backgroundImage: `url(https://static.thenounproject.com/png/1594252-200.png)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {student?.late && <span className={styles.tooltip}>Late Comer</span>}
                  </div>

                  {/* Last 5 digits – always safe */}
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#e2e8f0',
                      marginTop: '4px',
                      display: 'block',
                      textAlign: 'center',
                      minWidth: '50px',
                    }}
                  >
                    {lastFive}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default TodayAttendance;