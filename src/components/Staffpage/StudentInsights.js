// components/Staffpage/StudentInsights.jsx
import React, { useState } from 'react';
import styles from '../../styles/StaffDashboard.module.css';
import { api } from '../../Api';

const StudentInsights = ({
  selectedSubject,
  studentsData,
  selectedYear,
  selectedDepartment,
  selectedSection,
  setSelectedStudent,
  setShowStudentPopup,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetchingStudentId, setFetchingStudentId] = useState(null); // Track which row is loading

  const handleStudentClick = async (student) => {
    if (fetchingStudentId === student.studentId) return; // Prevent double click

    setFetchingStudentId(student.studentId);
    setLoading(true);

    try {
      const response = await api.get('/api/staff/student-insights', {
        params: {
          studentId: student.studentId,
          subject: selectedSubject,
          year: selectedYear,
          department: selectedDepartment,
          section: selectedSection,
        },
      });

      setSelectedStudent(response.data);
      setShowStudentPopup(true);
    } catch (err) {
      console.error("Failed to load student insights:", err);
      alert("Failed to load student details. Please try again.");
    } finally {
      setLoading(false);
      setFetchingStudentId(null);
    }
  };

  return (
    <div className={styles.studentInsights}>
      <h3>Students List for {selectedSubject}</h3>
      <p className={styles.smallText}>
        *Click on a student to view detailed marks and insights
      </p>

      <table>
        <thead>
          <tr>
            <th>Registration Number</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {studentsData.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                No students found for selected filters
              </td>
            </tr>
          ) : (
            studentsData.map((student) => (
              <tr
                key={student.studentId}
                onClick={() => handleStudentClick(student)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: fetchingStudentId === student.studentId ? '#f0f8ff' : 'transparent',
                  opacity: fetchingStudentId === student.studentId ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <td>
                  {student.fullRegNo || student.regNo || '—'}
                  {fetchingStudentId === student.studentId && (
                    <span style={{ marginLeft: '8px', color: '#0066cc' }}>Loading...</span>
                  )}
                </td>
                <td>{student.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentInsights;