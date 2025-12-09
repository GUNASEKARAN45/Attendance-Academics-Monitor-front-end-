// src/components/Staffpage/ExamScheduler.jsx
import React, { useState } from 'react';
import styles from '../../styles/StaffDashboard.module.css';
import { api } from '../../Api';

const ExamScheduler = ({ selectedYear, selectedDepartment, selectedSection }) => {
  const [formData, setFormData] = useState({
    subject: '',
    subjectCode: '',
    examType: 'UT1',
    examDate: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/api/staff/exam-schedule', {
        ...formData,
        year: selectedYear,
        department: selectedDepartment,
        section: selectedSection
      });

      setMessage('Exam scheduled successfully!');
      setFormData({ subject: '', subjectCode: '', examType: 'UT1', examDate: '' });
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to schedule exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.examScheduler}>
      <div className={styles.schedulerCard}>


        {message && (
          <div className={message.includes('success') ? styles.successMsg : styles.errorMsg}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.schedulerForm}>
          {/* First Row */}
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Subject Name</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="e.g., Web Development"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Subject Code</label>
              <input
                type="text"
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleChange}
                required
                placeholder="e.g., CS8601"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Exam Type</label>
              <select name="examType" value={formData.examType} onChange={handleChange}>
                <option value="UT1">Unit Test 1</option>
                <option value="UT2">Unit Test 2</option>
                <option value="UT3">Unit Test 3</option>
                <option value="Model">Model Exam</option>
                <option value="Semester">Semester Exam</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Exam Date</label>
              <input
                type="date"
                name="examDate"
                value={formData.examDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.scheduleBtn}
          >
            {loading ? 'Scheduling...' : 'Schedule Exam'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExamScheduler;