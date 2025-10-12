import React, { memo } from 'react';
import styles from '../../styles/AdminDashboard.module.css';


const StudentsList = memo((props) => (
  <div className={styles.studentInsights}>
    <h3>Students List for {props.selectedSubject}</h3>
    <p className={styles.smallText}>*Click on the student to see their preview and insights</p>
    <table>
      <thead>
        <tr>
          <th>Reg No</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {props.studentsData.map((student) => (
          <tr key={student.regNo} onClick={() => { props.setSelectedStudent(student); props.setShowStudentPopup(true); }} style={{ cursor: 'pointer' }}>
            <td>{student.regNo}</td>
            <td>{student.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

export default StudentsList;