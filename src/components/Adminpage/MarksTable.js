// components/Adminpage/MarksTable.js
import React from 'react';
import styles from '../../styles/AdminDashboard.module.css';

const MarksTable = ({ studentsData, selectedSubject }) => {
  // DOWNLOAD FUNCTION (CSV with current data)
  const downloadMarks = () => {
    if (studentsData.length === 0) {
      alert("No data to download");
      return;
    }

    const headers = ["Reg No", "Name", "UT1", "UT2", "UT3", "Model", "Semester"];
    const rows = studentsData.map(s => [
      s.regNo,
      s.name,
      s.marks.ut1,
      s.marks.ut2,
      s.marks.ut3,
      s.marks.model1,
      s.marks.sem
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Admin_${selectedSubject}_Marks_Report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!selectedSubject) {
    return (
      <div className={styles.marksTable}>
        <h3>Please select Department, Year, Section, and Subject</h3>
      </div>
    );
  }

  if (studentsData.length === 0) {
    return (
      <div className={styles.marksTable}>
        <h3>Marks for {selectedSubject}</h3>
        <p style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          No students found in this class
        </p>
      </div>
    );
  }

  return (
    <div className={styles.marksTable}>
      {/* Header with Title + Download Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h3 style={{ margin: 0 }}>Marks for {selectedSubject}</h3>

        <button
          onClick={downloadMarks}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.4rem',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(220, 38, 38, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.4)';
          }}
        >
          {/* Download Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Download Report</span>
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Name</th>
              <th>UT1</th>
              <th>UT2</th>
              <th>UT3</th>
              <th>Model</th>
              <th>Sem</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map((student) => (
              <tr key={student.regNo}>
                <td>{student.regNo}</td>
                <td>{student.name}</td>
                <td>{student.marks.ut1}</td>
                <td>{student.marks.ut2}</td>
                <td>{student.marks.ut3}</td>
                <td>{student.marks.model1}</td>
                <td style={{ 
                  fontWeight: 'bold', 
                  color: student.marks.sem < 50 ? '#ef4444' : '#10b981' 
                }}>
                  {student.marks.sem}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarksTable;