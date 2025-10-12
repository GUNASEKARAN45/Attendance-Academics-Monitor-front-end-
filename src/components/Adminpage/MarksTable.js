import React, { memo } from 'react';
import styles from '../../styles/AdminDashboard.module.css';


const MarksTable = memo((props) => (
  <div className={styles.marksTable}>
    <h3>View Marks for {props.selectedSubject}</h3>
    <table>
      <thead>
        <tr>
          <th>Reg No</th>
          <th>Name</th>
          <th>UT1</th>
          <th>UT2</th>
          <th>UT3</th>
          <th>Model1</th>
          <th>Sem</th>
        </tr>
      </thead>
      <tbody>
        {props.studentsData.map((student) => (
          <tr key={student.regNo} className={student.marks.sem < 50 ? styles.fail : ''}>
            <td>{student.regNo}</td>
            <td>{student.name}</td>
            <td>{student.marks.ut1}</td>
            <td>{student.marks.ut2}</td>
            <td>{student.marks.ut3}</td>
            <td>{student.marks.model1}</td>
            <td>{student.marks.sem}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

export default MarksTable;