// components/Studentpage/MarksTable.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/StudentDashboard.module.css';
import { api } from '../../Api'; // Make sure this is correct path

const MarksTable = () => {
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/student/marks');
        setMarksData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load marks:", err);
        setError("Failed to load marks. Please try again later.");
        setLoading(false);
      }
    };

    fetchMarks();
  }, []);

  if (loading) {
    return <div className={styles.marksTable}><p>Loading marks...</p></div>;
  }

  if (error) {
    return <div className={styles.marksTable}><p style={{color: 'red'}}>{error}</p></div>;
  }

  if (marksData.length === 0) {
    return (
      <div className={styles.marksTable}>
        <div className={styles.contentHeader}>
          <h3>Subject-wise Marks</h3>
        </div>
        <p>No marks available yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.marksTable}>
      <div className={styles.contentHeader}>
        <h3>Subject-wise Marks</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>UT1</th>
            <th>UT2</th>
            <th>UT3</th>
            <th>Model</th>
            <th>Sem</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {marksData.map((subject, index) => {
            const semMark = subject.marks.sem;
            const isFail = semMark < 50;

            return (
              <tr key={index} className={isFail ? styles.fail : ''}>
                <td>{subject.name}</td>
                <td className={subject.marks.ut1 >= 25 ? styles.pass : styles.fail}>
                  {subject.marks.ut1}/50
                </td>
                <td className={subject.marks.ut2 >= 25 ? styles.pass : styles.fail}>
                  {subject.marks.ut2}/50
                </td>
                <td className={subject.marks.ut3 >= 25 ? styles.pass : styles.fail}>
                  {subject.marks.ut3}/50
                </td>
                <td className={subject.marks.model1 >= 50 ? styles.pass : styles.fail}>
                  {subject.marks.model1}/100
                </td>
                <td className={isFail ? styles.fail : styles.pass}>
                  {semMark}/100
                </td>
                <td>
                  <span className={`${styles.status} ${isFail ? styles.fail : styles.pass}`}>
                    {isFail ? 'Fail' : 'Pass'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MarksTable;