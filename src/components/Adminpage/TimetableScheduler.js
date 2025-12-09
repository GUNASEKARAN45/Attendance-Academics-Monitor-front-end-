// src/components/Adminpage/TimetableScheduler.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/AdminDashboard.module.css';
import { api } from '../../Api';

const periods = [
  { name: 'Period 1', time: '8:30 AM' },
  { name: 'Period 2', time: '9:25 AM' },
  { name: 'Period 3', time: '10:30 AM' },
  { name: 'Period 4', time: '11:25 AM' },
  { name: 'Period 5', time: '1:20 PM' },
  { name: 'Period 6', time: '2:15 PM' },
  { name: 'Period 7', time: '3:05 PM' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TimetableScheduler = ({ selectedYear, selectedDepartment, selectedSection }) => {
  const [form, setForm] = useState({
    day: 'Monday',
    period: 'Period 1',
    subject: '',
    staffName: '',
    room: ''
  });
  const [message, setMessage] = useState('');
  const [timetableData, setTimetableData] = useState([]);

  // Fetch timetable on class change
  useEffect(() => {
    if (!selectedYear || !selectedDepartment || !selectedSection) return;

    const fetchTimetable = async () => {
      try {
        const res = await api.get('/api/timetable', {
          params: { year: selectedYear, department: selectedDepartment, section: selectedSection }
        });
        setTimetableData(res.data || []);
      } catch (err) {
        console.error('Failed to load timetable:', err);
        setTimetableData([]);
      }
    };

    fetchTimetable();
  }, [selectedYear, selectedDepartment, selectedSection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.staffName) {
      setMessage('Subject and Staff Name are required');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      // Check if this day + period already exists
      const existingEntry = timetableData.find(
        e => e.day === form.day && e.period === form.period
      );

      if (existingEntry) {
        // UPDATE existing entry
        await api.put(`/api/admin/timetable/${existingEntry._id}`, {
          subject: form.subject,
          staffName: form.staffName,
          room: form.room || ''
        });
        setMessage('Period updated successfully!');
      } else {
        // CREATE new entry
        await api.post('/api/admin/timetable', {
          year: selectedYear,
          department: selectedDepartment,
          section: selectedSection,
          day: form.day,
          period: form.period,
          subject: form.subject,
          staffName: form.staffName,
          room: form.room || ''
        });
        setMessage('Period added successfully!');
      }

      // Clear form (except day/period)
      setForm({ ...form, subject: '', staffName: '', room: '' });

      // Refresh data
      const res = await api.get('/api/timetable', {
        params: { year: selectedYear, department: selectedDepartment, section: selectedSection }
      });
      setTimetableData(res.data || []);

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save. Try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getCell = (day, period) => {
    const entry = timetableData.find(e => e.day === day && e.period === period);
    if (!entry) return <span className={styles.emptyCell}>—</span>;

    return (
      <div className={styles.ttCell}>
        <strong>{entry.subject}</strong>
        <div>{entry.staffName}</div>
        {entry.room && <small className={styles.room}>{entry.room}</small>}
      </div>
    );
  };

  return (
    <div className={styles.timetableScheduler}>

      {message && (
        <div className={message.includes('success') ? styles.successMsg : styles.errorMsg}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.ttForm}>
        <div className={styles.ttGrid}>
          <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
            {periods.map(p => (
              <option key={p.name} value={p.name}>
                {p.name} ({p.time})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Subject Name"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Staff ID"
            value={form.staffName}
            onChange={(e) => setForm({ ...form, staffName: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Room (Optional)"
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
          />

          <button type="submit">
            {timetableData.find(e => e.day === form.day && e.period === form.period)
              ? 'Update Period'
              : 'Add Period'}
          </button>
        </div>
      </form>

      {/* Live Preview Table */}
      <div className={styles.timetablePreview}>
        <h3>Current Weekly Timetable</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.ttTable}>
            <thead>
              <tr>
                <th>Day</th>
                {periods.map(p => (
                  <th key={p.name}>
                    {p.name}
                    <br />
                    <small>{p.time}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day}>
                  <td><strong>{day}</strong></td>
                  {periods.map(p => (
                    <td key={p.name}>{getCell(day, p.name)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimetableScheduler;