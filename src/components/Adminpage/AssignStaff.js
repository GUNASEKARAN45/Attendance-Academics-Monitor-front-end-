import React, { memo } from 'react';
import styles from '../../styles/AdminDashboard.module.css';


const AssignStaff = memo(({ 
  assignStaffId, setAssignStaffId, 
  assignStaffName, setAssignStaffName, 
  assignDept, setAssignDept, 
  assignYear, setAssignYear, 
  assignSection, setAssignSection, 
  assignSubject, setAssignSubject, 
  allStaffs, allDepartments, allYears, allSections, allSubjects, assignStaff 
}) => (
  <div className={styles.adminSection}>
    <div className={styles.formGroup}>
      <div>
        <label>Staff</label>
        <select className={styles.filterSelect} value={assignStaffId} onChange={e => {
          const staff = allStaffs.find(s => s.staffId === e.target.value);
          setAssignStaffId(staff?.staffId || '');
          setAssignStaffName(staff?.name || '');
        }} required>
          <option value="">Select Staff</option>
          {allStaffs.map(s => <option key={s.staffId} value={s.staffId}>{s.name} ({s.staffId})</option>)}
        </select>
      </div>
      <div>
        <label>Department</label>
        <select className={styles.filterSelect} value={assignDept} onChange={e => setAssignDept(e.target.value)} required>
          <option value="">Select Department</option>
          {allDepartments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label>Year</label>
        <select className={styles.filterSelect} value={assignYear} onChange={e => setAssignYear(e.target.value)} required>
          <option value="">Select Year</option>
          {allYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label>Section</label>
        <select className={styles.filterSelect} value={assignSection} onChange={e => setAssignSection(e.target.value)} required>
          <option value="">Select Section</option>
          {allSections.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label>Subject</label>
        <select className={styles.filterSelect} value={assignSubject} onChange={e => setAssignSubject(e.target.value)} required>
          <option value="">Select Subject</option>
          {allSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>
      </div>
      <div></div>
      <button className={styles.saveBtn} onClick={assignStaff}>Assign Staff</button>
    </div>
  </div>
));

export default AssignStaff;