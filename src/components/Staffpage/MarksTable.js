import React from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const MarksTable = ({ selectedSubject, studentsData }) => {
  const handleSave = (index) => {
    const inputs = document.querySelectorAll(`.${styles.markInput}`);
    const ut1 = Math.min(50, Math.max(0, parseInt(inputs[index * 5].value) || 0));
    const ut2 = Math.min(50, Math.max(0, parseInt(inputs[index * 5 + 1].value) || 0));
    const ut3 = Math.min(50, Math.max(0, parseInt(inputs[index * 5 + 2].value) || 0));
    const model1 = Math.min(100, Math.max(0, parseInt(inputs[index * 5 + 3].value) || 0));
    const sem = Math.min(100, Math.max(0, parseInt(inputs[index * 5 + 4].value) || 0));
    alert('Marks saved!');
  };

  return (
    <div className={styles.marksTable}>
      <h3>Enter/Edit Marks for {selectedSubject}</h3>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {studentsData.map((student, index) => (
            <tr key={index} className={student.marks.sem < 50 ? styles.fail : ''}>
              <td>{student.regNo}</td>
              <td>{student.name}</td>
              <td><input type="number" defaultValue={student.marks.ut1} min="0" max="50" className={styles.markInput} /></td>
              <td><input type="number" defaultValue={student.marks.ut2} min="0" max="50" className={styles.markInput} /></td>
              <td><input type="number" defaultValue={student.marks.ut3} min="0" max="50" className={styles.markInput} /></td>
              <td><input type="number" defaultValue={student.marks.model1} min="0" max="100" className={styles.markInput} /></td>
              <td><input type="number" defaultValue={student.marks.sem} min="0" max="100" className={styles.markInput} /></td>
              <td><button className={styles.saveBtn} onClick={() => handleSave(index)}>Save</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarksTable;