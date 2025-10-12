import React, { memo } from 'react';
import styles from '../../styles/AdminDashboard.module.css';


const AddStaff = memo(({ 
  staffId, setStaffId, 
  staffName, setStaffName, 
  staffPass, setStaffPass, 
  staffEmail, setStaffEmail, 
  staffPhone, setStaffPhone, 
  staffDepartment, setStaffDepartment, 
  staffDesignation, setStaffDesignation, 
  allDepartments, addStaff 
}) => (
  <div className={styles.adminSection}>
    <div className={styles.formGroup}>
      <div>
        <label>Staff ID</label>
        <input className={styles.filterSelect} placeholder="Staff ID" value={staffId} onChange={e => setStaffId(e.target.value)} required />
      </div>
      <div>
        <label>Staff Name</label>
        <input className={styles.filterSelect} placeholder="Staff name" value={staffName} onChange={e => setStaffName(e.target.value)} required />
      </div>
      <div>
        <label>Password</label>
        <input className={styles.filterSelect} type="password" placeholder="Password" value={staffPass} onChange={e => setStaffPass(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>
        <input className={styles.filterSelect} type="email" placeholder="Email" value={staffEmail} onChange={e => setStaffEmail(e.target.value)} required />
      </div>
      <div>
        <label>Phone Number</label>
        <input className={styles.filterSelect} type="tel" placeholder="Phone Number" value={staffPhone} onChange={e => setStaffPhone(e.target.value)} required />
      </div>
      <div>
        <label>Department</label>
        <select className={styles.filterSelect} value={staffDepartment} onChange={e => setStaffDepartment(e.target.value)} required>
          <option value="">Select Department</option>
          {allDepartments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label>Designation</label>
        <select className={styles.filterSelect} value={staffDesignation} onChange={e => setStaffDesignation(e.target.value)} required>
          <option value="">Select Designation</option>
          <option value="Assistant Professor">Assistant Professor</option>
          <option value="Associate Professor">Associate Professor</option>
          <option value="Professor">Professor</option>
        </select>
      </div>
      <div></div>
      <button className={styles.saveBtn} onClick={addStaff}>Add Staff</button>
    </div>
  </div>
));

export default AddStaff;