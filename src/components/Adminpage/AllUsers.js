import React, { memo } from 'react';
import styles from '../../styles/AdminDashboard.module.css';


const AllUsers = memo((props) => (
  <div className={styles.marksTable}>
    <table>
      <thead>
        <tr>
          <th>Role</th>
          <th>Username</th>
          <th>Name</th>
          <th>StudentReg</th>
          <th>Degree</th>
          <th>Year</th>
          <th>Department</th>
          <th>Section</th>
          <th>StaffId</th>
        </tr>
      </thead>
      <tbody>
        {props.users.map(u => (
          <tr key={u._id}>
            <td>{u.role}</td>
            <td>{u.username}</td>
            <td>{u.name}</td>
            <td>{u.studentReg || "-"}</td>
            <td>{u.degree || "-"}</td>
            <td>{u.year || "-"}</td>
            <td>{u.department || "-"}</td>
            <td>{u.section || "-"}</td>
            <td>{u.staffId || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

export default AllUsers;