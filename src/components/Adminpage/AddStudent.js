import React, { memo } from 'react';
import styles from '../../styles/AdminDashboard.module.css';


const AddStudent = memo(({ 
  studentReg, setStudentReg, 
  studentName, setStudentName, 
  studentPass, setStudentPass, 
  studentDegree, setStudentDegree, 
  studentYear, setStudentYear, 
  studentDept, setStudentDept, 
  studentSection, setStudentSection, 
  studentDOB, setStudentDOB, 
  studentEmail, setStudentEmail, 
  studentPhone, setStudentPhone, 
  yearOptions, departmentOptions, 
  allSections, addStudent 
}) => (
  <div className={styles.adminSection}>
    <div className={styles.formGroup}>
      <div>
        <label>Registration Number</label>
        <input className={styles.filterSelect} placeholder="Registration number" value={studentReg} onChange={e => setStudentReg(e.target.value)} required />
      </div>
      <div>
        <label>Student Name</label>
        <input className={styles.filterSelect} placeholder="Student name" value={studentName} onChange={e => setStudentName(e.target.value)} required />
      </div>
      <div>
        <label>Password</label>
        <input className={styles.filterSelect} type="password" placeholder="Password" value={studentPass} onChange={e => setStudentPass(e.target.value)} required />
      </div>
      <div>
        <label>Degree</label>
        <select className={styles.filterSelect} value={studentDegree} onChange={e => setStudentDegree(e.target.value)} required>
          <option value="">Select Degree</option>
          <option value="BE/BTech">BE/BTech</option>
          <option value="ME/MTech">ME/MTech</option>
          <option value="MCA">MCA</option>
          <option value="MBA">MBA</option>
        </select>
      </div>
      <div>
        <label>Year</label>
        <select className={styles.filterSelect} value={studentYear} onChange={e => setStudentYear(e.target.value)} required>
          <option value="">Select Year</option>
          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label>Department</label>
        <select className={styles.filterSelect} value={studentDept} onChange={e => setStudentDept(e.target.value)} required>
          <option value="">Select Department</option>
          {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label>Section</label>
        <select className={styles.filterSelect} value={studentSection} onChange={e => setStudentSection(e.target.value)} required>
          <option value="">Select Section</option>
          {allSections.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label>Date of Birth</label>
        <input className={styles.filterSelect} type="date" value={studentDOB} onChange={e => setStudentDOB(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>
        <input className={styles.filterSelect} type="email" placeholder="Email" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} required />
      </div>
      <div>
        <label>Phone Number</label>
        <input className={styles.filterSelect} type="tel" placeholder="Phone Number" value={studentPhone} onChange={e => setStudentPhone(e.target.value)} required />
      </div>
      <button className={styles.saveBtn} onClick={addStudent}>Add Student</button>
    </div>
  </div>
));

export default AddStudent;