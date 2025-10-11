import React from 'react';
import styles from '../../styles/StudentDashboard.module.css';


const SubjectPerformance = () => {
  const attendanceData = {
    semester: {
      subjects: [
        { name: 'Web Development', percentage: 92 },
        { name: 'Data Structures', percentage: 85 },
        { name: 'Operating Systems', percentage: 82 },
        { name: 'Software Engineering', percentage: 88 },
        { name: 'Internet of Things', percentage: 82 },
        { name: 'Sensors & Actuators', percentage: 88 }
      ]
    }
  };

  return (
    <div className={styles.subjectPerformance}>
      <h3>Subject-wise Performance</h3>
      <div className={styles.subjectsGrid}>
        {attendanceData.semester.subjects.map((subject, index) => (
          <div key={index} className={styles.subjectCard}>
            <div className={styles.circularProgress}>
              <div 
                className={styles.progressCircle}
                style={{ background: `conic-gradient(${subject.percentage < 75 ? '#ef4444' : '#22c55e'} ${subject.percentage * 3.6}deg, #374151 0deg)` }}
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

export default SubjectPerformance;