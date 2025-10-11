import React from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const SubjectWisePercentage = ({ subjectStats }) => {
  return (
    <div className={styles.subjectPerformance}>
      <h3>Subject-wise Average Attendance</h3>
      <div className={styles.subjectsGrid}>
        {subjectStats.map((subject, index) => (
          <div key={index} className={styles.subjectCard}>
            <div className={styles.circularProgress}>
              <div
                className={styles.progressCircle}
                style={{
                  background: `conic-gradient(#10b981 ${subject.percentage * 3.6}deg, #2d3748 0deg)`
                }}
              >
                <span className={styles.percentage}>{subject.percentage}%</span>
              </div>
            </div>
            <h4>{subject.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectWisePercentage;