// src/components/Staffpage/MarksTable.jsx
import React, { useState, useEffect, useMemo } from 'react';
import styles from '../../styles/StaffDashboard.module.css';
import { api } from '../../Api';

const MarksTable = ({ selectedYear, selectedDepartment, selectedSection, selectedSubject }) => {
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingIds, setSavingIds] = useState(new Set());

  // Fetch marks from backend
  useEffect(() => {
    if (!selectedYear || !selectedDepartment || !selectedSection || !selectedSubject) return;

    const fetchMarks = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/staff/marks', {
          params: { year: selectedYear, department: selectedDepartment, section: selectedSection, subject: selectedSubject }
        });
        setMarksData(res.data);
      } catch (err) {
        console.error("Failed to load marks:", err);
        setMarksData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, [selectedYear, selectedDepartment, selectedSection, selectedSubject]);

  // Sort by register number (e.g., SIH2501 → 2501)
  const sortedMarksData = useMemo(() => {
    return [...marksData].sort((a, b) => {
      const regA = (a.studentReg || '').toUpperCase();
      const regB = (b.studentReg || '').toUpperCase();
      const numA = parseInt(regA.match(/\d+$/)?.[0] || '0', 10);
      const numB = parseInt(regB.match(/\d+$/)?.[0] || '0', 10);
      return numA - numB;
    });
  }, [marksData]);

  // Update mark by student _id (safe even after sorting)
  const handleMarkChange = (studentId, field, value) => {
    const cleanValue = value.replace(/^0+/, '') || '0';
    setMarksData(prev =>
      prev.map(student =>
        student._id === studentId ? { ...student, [field]: cleanValue } : student
      )
    );
  };

  // Save single student's marks
  const handleSave = async (student) => {
    const studentId = student._id;

    setSavingIds(prev => new Set(prev).add(studentId));

    try {
      await api.post('/api/staff/marks/save', {
        marks: [{
          _id: studentId,
          ut1: parseInt(student.ut1) || 0,
          ut2: parseInt(student.ut2) || 0,
          ut3: parseInt(student.ut3) || 0,
          model1: parseInt(student.model1) || 0,
          sem: parseInt(student.sem) || 0,
        }],
        subject: selectedSubject,
        year: selectedYear,
        department: selectedDepartment,
        section: selectedSection,
      });

      alert(`Marks saved for ${student.name}!`);
    } catch (err) {
      console.error(err);
      alert("Failed to save marks for " + student.name);
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(studentId);
        return next;
      });
    }
  };

  // DOWNLOAD MARKS AS CSV (Includes unsaved changes!)
  const downloadMarks = () => {
    if (marksData.length === 0) {
      alert("No data to download");
      return;
    }

    const headers = ["Reg No", "Name", "UT1", "UT2", "UT3", "Model", "Semester"];
    const rows = marksData.map(s => [
      s.studentReg,
      s.name,
      s.ut1 || 0,
      s.ut2 || 0,
      s.ut3 || 0,
      s.model1 || 0,
      s.sem || 0
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedDepartment}_Y${selectedYear}_${selectedSection}_${selectedSubject}_Marks.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className={styles.marksTable}><p>Loading marks...</p></div>;
  if (marksData.length === 0) return <div className={styles.marksTable}><p>No students found</p></div>;

  return (
    <div className={styles.marksTable}>
      {/* Header with Title + Download Button */}
      {/* Header with Title + Download Button with Icon (Inline Styled) */}
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
  gap: '1rem'
}}>
  <h3 style={{ margin: 0 }}>Enter/Edit Marks - {selectedSubject}</h3>

  <button
    onClick={downloadMarks}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.4rem',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(29, 78, 216, 0.4)',
      transition: 'all 0.3s ease',
      outline: 'none'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(29, 78, 216, 0.5)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(29, 78, 216, 0.4)';
    }}
  >
    {/* Download Icon */}
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    <span>Download Marks</span>
  </button>
</div>

      <div className={styles.tableContainer}>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedMarksData.map((student) => (
              <tr key={student._id}>
                <td>{student.studentReg}</td>
                <td>{student.name}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={student.ut1 || ''}
                    onChange={(e) => handleMarkChange(student._id, 'ut1', e.target.value)}
                    className={styles.markInput}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={student.ut2 || ''}
                    onChange={(e) => handleMarkChange(student._id, 'ut2', e.target.value)}
                    className={styles.markInput}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={student.ut3 || ''}
                    onChange={(e) => handleMarkChange(student._id, 'ut3', e.target.value)}
                    className={styles.markInput}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={student.model1 || ''}
                    onChange={(e) => handleMarkChange(student._id, 'model1', e.target.value)}
                    className={styles.markInput}
                    placeholder="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={student.sem || ''}
                    onChange={(e) => handleMarkChange(student._id, 'sem', e.target.value)}
                    className={styles.markInput}
                    placeholder="0"
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleSave(student)}
                    disabled={savingIds.has(student._id)}
                    className={styles.saveBtn}
                  >
                    {savingIds.has(student._id) ? "Saving..." : "Save"}
                  </button>
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