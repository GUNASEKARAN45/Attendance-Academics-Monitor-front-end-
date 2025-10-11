import React from 'react';
import styles from '../../styles/StudentDashboard.module.css';


const MarksTable = () => {
  const academicData = {
    subjects: [
      {
        name: 'Web Dev',
        marks: { ut1: 45, ut2: 42, ut3: 48, model1: 85, sem: 90 }
      },
      {
        name: 'Data Structures',
        marks: { ut1: 38, ut2: 40, ut3: 42, model1: 78, sem: 83 }
      },
      {
        name: 'Database',
        marks: { ut1: 25, ut2: 22, ut3: 20, model1: 45, sem: 49 }
      }
    ]
  };

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
            <th>Model1</th>
            <th>Sem</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {academicData.subjects.map((subject, index) => (
            <tr key={index} className={subject.marks.sem < 50 ? styles.fail : ''}>
              <td>{subject.name}</td>
              <td className={subject.marks.ut1 >= 25 ? styles.pass : styles.fail}>{subject.marks.ut1}/50</td>
              <td className={subject.marks.ut2 >= 25 ? styles.pass : styles.fail}>{subject.marks.ut2}/50</td>
              <td className={subject.marks.ut3 >= 25 ? styles.pass : styles.fail}>{subject.marks.ut3}/50</td>
              <td className={subject.marks.model1 >= 50 ? styles.pass : styles.fail}>{subject.marks.model1}/100</td>
              <td className={subject.marks.sem >= 50 ? styles.pass : styles.fail}>{subject.marks.sem}/100</td>
              <td>
                <span className={`${styles.status} ${subject.marks.sem >= 50 ? styles.pass : styles.fail}`}>
                  {subject.marks.sem >= 50 ? 'Pass' : 'Fail'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarksTable;