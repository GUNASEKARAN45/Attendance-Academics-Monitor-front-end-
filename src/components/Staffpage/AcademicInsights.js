import React from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const AcademicInsights = ({ attendanceInsights, marksInsights }) => {
  return (
    <div className={styles.academicInsights}>
      <h3>Academic Insights</h3>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h4 style={{ fontSize: '1rem', color: '#bfdbfe', marginBottom: '0.8rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>Attendance Insights</h4>
          <ul className={styles.insightsList} style={{ listStyle: 'none', padding: 0 }}>
            {attendanceInsights.map((insight, index) => (
              <li key={index} style={{ marginBottom: '0.8rem', padding: '0.8rem', background: '#374151', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {insight.message}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h4 style={{ fontSize: '1rem', color: '#bfdbfe', marginBottom: '0.8rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>Marks Insights</h4>
          <ul className={styles.insightsList} style={{ listStyle: 'none', padding: 0 }}>
            {marksInsights.map((insight, index) => (
              <li key={index} style={{ marginBottom: '0.8rem', padding: '0.8rem', background: '#374151', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {insight.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AcademicInsights;