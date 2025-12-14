import React, { useState, useEffect } from 'react';
import styles from '../../styles/StudentDashboard.module.css';
import axios from 'axios';

const TodayAttendance = () => {
  const [periods, setPeriods] = useState(Array(7).fill(null)); // [true, false, null...]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/student/today-attendance", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPeriods(response.data.periods);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className={styles.todayAttendance}>
        <h3>Today's Attendance</h3>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.todayAttendance}>
      <h3>Today's Attendance</h3>
      <div className={styles.periodsContainer}>
        {periods.map((status, index) => {
          let dotClass = styles.dot;
          let label = '-';

          if (status === true) {
            dotClass += ` ${styles.present}`;
            label = 'P';
          } else if (status === false) {
            dotClass += ` ${styles.absent}`;
            label = 'A';
          } else {
            dotClass += ` ${styles.neutral}`;
          }

          return (
            <div key={index} className={styles.periodDot}>
              <div className={dotClass}>{label}</div>
              <span>P{index + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayAttendance;