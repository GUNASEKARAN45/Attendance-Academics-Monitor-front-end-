import React, { useEffect } from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const CombinedAttendanceChart = ({ timeFilter, setTimeFilter, currentWeek, setCurrentWeek, selectedSubject, combinedAttendanceData, canvasRef, drawChart, activeTab }) => {
  const handlePrev = () => setCurrentWeek(prev => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentWeek(prev => prev + 1);

  useEffect(() => {
    if (activeTab === 'attendance' && canvasRef.current) {
      const timer = setTimeout(() => {
        drawChart();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab, timeFilter, currentWeek, selectedSubject]);

  return (
    <div className={styles.attendanceChart}>
      <div className={styles.chartHeader}>
        <h3>{timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Combined Attendance</h3>
        <div className={styles.filters}>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className={styles.filterSelect}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {timeFilter === 'monthly' && (
            <div>
              <button className={styles.navBtn} onClick={handlePrev} disabled={currentWeek === 0}>Prev</button>
              <button className={styles.navBtn} onClick={handleNext}>Next</button>
            </div>
          )}
        </div>
      </div>
      <div style={{ position: 'relative', width: '900px', height: '400px' }}>
        <canvas ref={canvasRef} width="500" height="380"></canvas>
      </div>
    </div>
  );
};

export default CombinedAttendanceChart;