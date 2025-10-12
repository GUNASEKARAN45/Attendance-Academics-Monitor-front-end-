import React, { memo, useEffect } from 'react';
import styles from '../../styles/AdminDashboard.module.css';


const CombinedAttendanceChart = memo((props) => {
  const handlePrev = () => props.setCurrentWeek(prev => Math.max(prev - 1, 0));
  const handleNext = () => props.setCurrentWeek(prev => prev + 1);

  useEffect(() => {
    if (props.activeTab === 'attendance' && props.canvasRef.current) {
      props.drawChart();
    }
  }, [props.activeTab, props.timeFilter, props.currentWeek, props.selectedSubject]);

  return (
    <div className={styles.attendanceChart}>
      <div className={styles.chartHeader}>
        <h3>{props.timeFilter.charAt(0).toUpperCase() + props.timeFilter.slice(1)} Combined Attendance</h3>
        <div className={styles.filters}>
          <select value={props.timeFilter} onChange={(e) => props.setTimeFilter(e.target.value)} className={styles.filterSelect}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {props.timeFilter === 'monthly' && (
            <div>
              <button className={styles.navBtn} onClick={handlePrev} disabled={props.currentWeek === 0}>Prev</button>
              <button className={styles.navBtn} onClick={handleNext}>Next</button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.chartContainer}>
        <canvas ref={props.canvasRef} width={800} height={350} />
      </div>
    </div>
  );
});

export default CombinedAttendanceChart;