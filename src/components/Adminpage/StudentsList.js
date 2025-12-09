// components/Adminpage/StudentsList.js
import React from 'react';
import styles from '../../styles/AdminDashboard.module.css';

const StudentsList = ({ studentsData, setSelectedStudent, setShowStudentPopup }) => {
  if (studentsData.length === 0) {
    return (
      <div className={styles.studentInsights}>
        <h3>Students Analysis</h3>
        <p style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          Select Department, Year, and Section to view students
        </p>
      </div>
    );
  }

  return (
    <div className={styles.studentInsights}>
      <h3>Students List</h3>
      <p className={styles.smallText}>
        *Click on any student to view detailed analysis and predictive insights
      </p>
      <table>
        <thead>
          <tr>
            <th>Reg No</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {studentsData.map((student) => (
            <tr
              key={student.regNo}
              onClick={() => {
                setSelectedStudent(student);
                setShowStudentPopup(true);
              }}
              style={{ cursor: 'pointer' }}
            >
              <td>{student.regNo}</td>
              <td>{student.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsList;