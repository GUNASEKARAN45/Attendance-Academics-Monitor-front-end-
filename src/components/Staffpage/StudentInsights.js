import React from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const StudentInsights = ({ selectedSubject, studentsData, setSelectedStudent, setShowStudentPopup }) => {
  return (
    <div className={styles.studentInsights}>
      <h3>Students List for {selectedSubject}</h3>
      <p className={styles.smallText}>*Click on the student to see their preview and insights</p>
      <table>
        <thead>
          <tr>
            <th>Reg No</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {studentsData.map((student, index) => (
            <tr key={index} onClick={() => { setSelectedStudent(student); setShowStudentPopup(true); }} style={{ cursor: 'pointer' }}>
              <td>{student.regNo}</td>
              <td>{student.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentInsights;