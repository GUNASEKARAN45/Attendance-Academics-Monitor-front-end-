// src/components/Adminpage/AddStudent.jsx
import React, { memo, useState } from 'react';
import CaptureFaceEmbedding from './CaptureFaceEmbedding';
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
  yearOptions, departmentOptions, allSections,
  faceEmbedding, setFaceEmbedding,
  addStudent
}) => {
  const [showFaceCapture, setShowFaceCapture] = useState(false);

  const handleFaceSuccess = (embedding) => {
    setFaceEmbedding(embedding);
    setShowFaceCapture(false);
  };

  const handleSubmit = () => {
    addStudent();
  };

  return (
    <div className={styles.adminSection}>
      <div className={styles.formGroup}>

        <div>
          <label>Registration Number</label>
          <input
            className={styles.filterSelect}
            placeholder="e.g. AC22UEC001"
            value={studentReg}
            onChange={(e) => setStudentReg(e.target.value)}
          />
        </div>

        <div>
          <label>Student Name</label>
          <input
            className={styles.filterSelect}
            placeholder="Full name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            className={styles.filterSelect}
            type="password"
            placeholder="Set password"
            value={studentPass}
            onChange={(e) => setStudentPass(e.target.value)}
          />
        </div>

        <div>
          <label>Degree</label>
          <select
            className={styles.filterSelect}
            value={studentDegree}
            onChange={(e) => setStudentDegree(e.target.value)}
          >
            <option value="">Select Degree</option>
            <option value="BE/BTech">BE/BTech</option>
            <option value="ME/MTech">ME/MTech</option>
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
          </select>
        </div>

        <div>
          <label>Year</label>
          <select
            className={styles.filterSelect}
            value={studentYear}
            onChange={(e) => setStudentYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div>
          <label>Department</label>
          <select
            className={styles.filterSelect}
            value={studentDept}
            onChange={(e) => setStudentDept(e.target.value)}
          >
            <option value="">Select Department</option>
            {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <label>Section</label>
          <select
            className={styles.filterSelect}
            value={studentSection}
            onChange={(e) => setStudentSection(e.target.value)}
          >
            <option value="">Select Section</option>
            {allSections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label>Date of Birth</label>
          <input
            className={styles.filterSelect}
            type="date"
            value={studentDOB}
            onChange={(e) => setStudentDOB(e.target.value)}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            className={styles.filterSelect}
            type="email"
            placeholder="student@example.com"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            className={styles.filterSelect}
            type="tel"
            placeholder="10-digit number"
            value={studentPhone}
            onChange={(e) => setStudentPhone(e.target.value)}
          />
        </div>

        {/* FACE ID BUTTON — SAME STYLE AS BEFORE */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setShowFaceCapture(true)}
            disabled={!!faceEmbedding}
            className={styles.filterSelect}
            style={{
              background: faceEmbedding 
                ? '#28a745' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '14px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: faceEmbedding ? 'not-allowed' : 'pointer',
              opacity: faceEmbedding ? 0.9 : 1,
              width: '100%',
              boxShadow: faceEmbedding ? '0 4px 15px rgba(40,167,69,0.4)' : '0 4px 20px rgba(102,126,234,0.4)'
            }}
          >
            {faceEmbedding ? 'Face ID Captured Successfully' : 'Capture Face Embeddings'}
          </button>
        </div>

        {/* ADD STUDENT BUTTON — SAME AS BEFORE */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            className={styles.saveBtn}
            onClick={handleSubmit}
            disabled={!faceEmbedding}
            style={{
              padding: '13px 40px',
              fontSize: '16px',
              textAlign:"center",
              width: '100%',
              opacity: !faceEmbedding ? 0.6 : 1,
              cursor: !faceEmbedding ? 'not-allowed' : 'pointer'
            }}
          >
            Add Student
          </button>
        </div>

      </div>

      {/* Face Capture Modal */}
      {showFaceCapture && (
        <CaptureFaceEmbedding
          onSuccess={handleFaceSuccess}
          onCancel={() => setShowFaceCapture(false)}
        />
      )}
    </div>
  );
});

export default AddStudent;