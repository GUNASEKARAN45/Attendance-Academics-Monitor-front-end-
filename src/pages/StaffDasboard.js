import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import styles from '../styles/StaffDashboard.module.css';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedDepartment, setSelectedDepartment] = useState('ECE');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('Web Development');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [timeFilter, setTimeFilter] = useState('weekly');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const canvasRef = useRef(null);

  // Mock staff data
  const staffData = {
    staffId: "STF001",
    name: "Mrs. Suriya",
    department: "ECE",
    designation: "Assistant Professor"
  };

  // Mock today's attendance data with flagged (late) students
  const todayAttendanceData = [
    { regNo: "EC001", status: true },
    { regNo: "EC002", status: false },
    { regNo: "EC003", status: true },
    { regNo: "EC004", status: true, late: true },
    { regNo: "EC005", status: false },
    { regNo: "EC006", status: true },
    { regNo: "EC007", status: true, late: true },
    { regNo: "EC008", status: false },
    { regNo: "EC009", status: true },
    { regNo: "EC010", status: true },
    { regNo: "EC011", status: false, late: true },
    { regNo: "EC012", status: true },
    { regNo: "EC013", status: true },
    { regNo: "EC014", status: false },
    { regNo: "EC015", status: true },
  ];

  // Calculate attendance stats
  const totalStudents = todayAttendanceData.length;
  const presentCount = todayAttendanceData.filter(s => s.status).length;
  const lateCount = todayAttendanceData.filter(s => s.late).length;
  const absentCount = totalStudents - presentCount;

  // Mock subject-wise percentage
  const subjectStats = [
    { name: 'Web Development', percentage: 85 },
    { name: 'Data Structures', percentage: 78 },
    { name: 'Database Systems', percentage: 90 },
    { name: 'Operating Systems', percentage: 82 },
    { name: 'Signals & Systems', percentage: 100 },
  ];

  // Mock combined attendance data with monthly labels
  const combinedAttendanceData = {
    daily: {
      labels: ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7'],
      data: {
        'Web Development': [90, 85, 95, 80, 88, 92, 87],
        'Data Structures': [88, 82, 90, 78, 85, 90, 85],
        'Database Systems': [92, 87, 93, 85, 90, 95, 89],
        'Operating Systems': [85, 80, 88, 75, 82, 88, 84],
      }
    },
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      data: {
        'Web Development': [85, 92, 78, 95, 88, 70],
        'Data Structures': [82, 90, 75, 92, 85, 68],
        'Database Systems': [88, 94, 80, 97, 90, 72],
        'Operating Systems': [80, 88, 73, 90, 83, 65],
      }
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: {
        'Web Development': [82, 88, 85, 90],
        'Data Structures': [80, 86, 83, 88],
        'Database Systems': [85, 90, 87, 92],
        'Operating Systems': [78, 84, 81, 86],
      }
    }
  };

  // Mock students data
  const studentsData = [
    {
      regNo: "AC22UEC001",
      name: "Student A",
      marks: { ut1: 45, ut2: 42, ut3: 48, model1: 85, sem: 90 },
      attendancePercentage: 95,
      insights: ["Behavior is good", "Consistent performance", "High marks in Web Development"]
    },
    {
      regNo: "AC22UEC002",
      name: "Student B",
      marks: { ut1: 38, ut2: 40, ut3: 42, model1: 78, sem: 83 },
      attendancePercentage: 85,
      insights: ["Taking continuous leave on Saturday", "Less marks in Database Systems", "Needs improvement in consistency"]
    },
    {
      regNo: "AC22UEC003",
      name: "Student C",
      marks: { ut1: 25, ut2: 22, ut3: 20, model1: 45, sem: 49 },
      attendancePercentage: 60,
      insights: ["Low attendance", "Failing in multiple subjects", "Requires counseling"]
    },
  ];

  // Mock insights with more added
  const attendanceInsights = [
    { message: 'Students continuously absent on Friday and Saturday' },
    { message: 'Less number of students present in the last week' },
    { message: 'High attendance in morning periods' },
    { message: 'Low attendance after lunch breaks' },
    { message: 'Consistent late comers from specific sections' },
  ];

  const marksInsights = [
    { message: '20% failed in Web Development' },
    { message: 'High failure rate in Database Systems' },
    { message: 'Excellent performance in Signals & Systems' },
    { message: 'Improvement needed in practical assessments' },
    { message: 'Top performers consistently scoring above 90%' },
  ];

  // Mock notifications
  const mockNotifications = [
    { id: 1, type: 'low-attendance', message: 'Class attendance below 75% in Web Development', date: '2023-10-23', read: false },
    { id: 2, type: 'exam', message: 'Schedule exam for Data Structures', date: '2023-10-22', read: false },
    { id: 3, type: 'fail', message: 'Multiple failures in Database Systems', date: '2023-10-21', read: true },
    { id: 4, type: 'meeting', message: 'Department meeting tomorrow', date: '2023-10-20', read: false },
    { id: 5, type: 'update', message: 'Update marks for Operating Systems', date: '2023-10-19', read: true }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    drawChart();
  }, [timeFilter, currentWeek, selectedSubject]);

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const drawChart = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    const data = combinedAttendanceData[timeFilter];
    const labels = data.labels;
    const values = data.data ? data.data[selectedSubject] : data.data; // Adjust for non-object data if needed

    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.moveTo(50, 300 - (values[0] / 100) * 250);
    let maxY = Math.max(...values);

    values.forEach((value, index) => {
      const x = 50 + (index * (450 / (values.length - 1)));
      const y = 300 - (value / maxY) * 250;
      ctx.lineTo(x, y);
    });

    ctx.lineTo(500 - 50, 300);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#3b82f6';
    values.forEach((value, index) => {
      const x = 50 + (index * (450 / (values.length - 1)));
      const y = 300 - (value / maxY) * 250;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '10px Inter';
      ctx.fillText(value + '%', x - 10, y - 5);
    });

    ctx.strokeStyle = '#4b5563';
    ctx.setLineDash([5, 5]);
    for (let i = 0; i <= 5; i++) {
      const y = 300 - (i * 50);
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(500 - 50, y);
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.fillText((i * 20) + '%', 20, y + 5);
    }

    ctx.setLineDash([]);
    ctx.fillStyle = '#94a3b8';
    labels.forEach((label, index) => {
      const x = 50 + (index * (450 / (labels.length - 1)));
      ctx.fillText(label, x - 10, 320); // Adjusted to 320 for visibility
    });

    if (timeFilter === 'monthly') {
      const month = new Date(2025, 8 + currentWeek, 1).toLocaleString('default', { month: 'long' });
      ctx.fillText(month, 250, 330); // Adjusted to 330
    }
  };

  const ProfilePopup = () => (
    <div className={styles.profilePopupOverlay}>
      <div className={styles.profilePopup}>
        <h3>Staff Profile</h3>
        <div className={styles.profileInfo}>
          <p><strong>Name:</strong> {staffData.name}</p>
          <p><strong>Staff ID:</strong> {staffData.staffId}</p>
          <p><strong>Department:</strong> {staffData.department}</p>
          <p><strong>Designation:</strong> {staffData.designation}</p>
        </div>
        <div className={styles.profileActions}>
          <button className={styles.changePasswordBtn}>Change Password</button>
          <button className={styles.logoutBtn}>Logout</button>
        </div>
        <button className={styles.closeBtn} onClick={() => setShowProfilePopup(false)}>Close</button>
      </div>
    </div>
  );

  const StudentPopup = () => {
    if (!selectedStudent) return null;
    return (
      <div className={styles.studentPopupOverlay}>
        <div className={styles.studentPopup}>
          <h3>{selectedStudent.name}'s Details</h3>
          <div className={styles.studentInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Reg No:</span>
              <span>{selectedStudent.regNo}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Attendance:</span>
              <span className={selectedStudent.attendancePercentage < 75 ? styles.lowAttendance : ''}>
                {selectedStudent.attendancePercentage}%
              </span>
            </div>
            <div className={styles.marksSection}>
              <h4>Marks</h4>
              <div className={styles.marksGrid}>
                <span>UT1: {selectedStudent.marks.ut1}</span>
                <span>UT2: {selectedStudent.marks.ut2}</span>
                <span>UT3: {selectedStudent.marks.ut3}</span>
                <span>Model1: {selectedStudent.marks.model1}</span>
                <span>Sem: {selectedStudent.marks.sem}</span>
              </div>
            </div>
            <div className={styles.insightsSection}>
              <h4>Predictive Analysis</h4>
              <ul className={styles.insightsList}>
                {selectedStudent.insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => { setShowStudentPopup(false); setSelectedStudent(null); }}>Close</button>
        </div>
      </div>
    );
  };

  const Notifications = () => (
    <div className={styles.notificationsSection}>
      <div className={styles.notificationsHeader}>
        <h3>Notifications</h3>
        <span className={styles.badge}>{unreadCount}</span>
      </div>
      <div className={styles.notificationsList}>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div key={notification.id} className={`${styles.notificationItem} ${notification.read ? styles.read : styles.unread}`}>
              <div className={styles.notificationContent}>
                <span className={`${styles.notificationIcon} ${styles[notification.type]}`}>
                  {notification.type === 'low-attendance' ? '⚠️' :
                    notification.type === 'exam' ? '📝' :
                    notification.type === 'fail' ? '🚫' :
                    notification.type === 'meeting' ? '🗓️' : '🔄'}
                </span>
                <div>
                  <p className={styles.notificationMessage}>{notification.message}</p>
                  <span className={styles.notificationDate}>{notification.date}</span>
                </div>
              </div>
              <div className={styles.notificationActions}>
                {!notification.read && (
                  <button className={styles.markReadBtn} onClick={() => markAsRead(notification.id)} title="Mark as read">✓</button>
                )}
                <button className={styles.deleteBtn} onClick={() => deleteNotification(notification.id)} title="Delete notification">×</button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noNotifications}>No notifications</p>
        )}
      </div>
    </div>
  );

  const TodayAttendance = () => (
    <div className={styles.todayAttendance}>
      <h3>Today's Student Attendance</h3>
      <div className={styles.attendanceStats}>
        <p>Total Students: {totalStudents}</p>
        <p>Present: {presentCount}</p>
        <p>Live Headcount: {presentCount}</p>
        <p>Latecomers: {lateCount}</p>
        <p>Absent: {absentCount}</p>
      </div>
      <div className={styles.attendanceGrid}>
        {todayAttendanceData.map((student, index) => (
          <div key={index} className={styles.studentIcon}>
            <div
              className={`${styles.icon} ${student.status ? styles.present : student.late ? styles.late : styles.absent}`}
              style={{ backgroundImage: `ur[](https://static.thenounproject.com/png/1594252-200.png)`, backgroundSize: 'cover' }}
            >
              {student.late && <span className={styles.tooltip}>Late Comer</span>}
            </div>
            <span>{student.regNo}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const SubjectWisePercentage = () => (
    <div className={styles.subjectPerformance}>
      <h3>Subject-wise Average Attendance</h3>
      <div className={styles.subjectsGrid}>
        {subjectStats.map((subject, index) => (
          <div key={index} className={styles.subjectCard}>
            <div className={styles.circularProgress}>
              <div
                className={styles.progressCircle}
                style={{
                  background: `conic-gradient(#10b981 ${subject.percentage * 3.6}deg, #2d3748 0deg)`
                }}
              >
                <span className={styles.percentage}>{subject.percentage}%</span>
              </div>
            </div>
            <h4>{subject.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );

  const CombinedAttendanceChart = () => {
    const handlePrev = () => setCurrentWeek(prev => Math.max(prev - 1, 0));
    const handleNext = () => setCurrentWeek(prev => prev + 1);

    return (
      <div className={styles.attendanceChart}>
        <div className={styles.chartHeader}>
          <h3>{timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Combined Attendance</h3>
          <div className={styles.filters}>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={styles.filterSelect}>
              <option>Web Development</option>
              <option>Data Structures</option>
              <option>Database Systems</option>
              <option>Operating Systems</option>
            </select>
            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className={styles.filterSelect}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {timeFilter === 'monthly' && (
              <div>
                <button className={styles.navBtn} onClick={handlePrev} disabled={currentWeek === 0}>Prev</button>
                <button className={styles.navBtn} onClick={handleNext}>Next</button>
              </div>
            )}
          </div>
        </div>
        <div style={{ position: 'relative', width: '500px', height: '350px' }}>
          <canvas ref={canvasRef} width="500" height="350"></canvas>
        </div>
      </div>
    );
  };

  const MarksTable = () => {
    const handleSave = (index) => {
      const updatedStudents = [...studentsData];
      const ut1 = Math.min(50, Math.max(0, parseInt(document.getElementsByTagName('input')[index * 6 + 2].value) || 0));
      const ut2 = Math.min(50, Math.max(0, parseInt(document.getElementsByTagName('input')[index * 6 + 3].value) || 0));
      const ut3 = Math.min(50, Math.max(0, parseInt(document.getElementsByTagName('input')[index * 6 + 4].value) || 0));
      const model1 = Math.min(100, Math.max(0, parseInt(document.getElementsByTagName('input')[index * 6 + 5].value) || 0));
      const sem = Math.min(100, Math.max(0, parseInt(document.getElementsByTagName('input')[index * 6 + 6].value) || 0));
      updatedStudents[index].marks = { ut1, ut2, ut3, model1, sem };
      // Here you would typically update state or API
      alert('Marks saved!');
    };

    return (
      <div className={styles.marksTable}>
        <h3>Enter/Edit Marks for {selectedSubject}</h3>
        <table>
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Name</th>
              <th>UT1</th>
              <th>UT2</th>
              <th>UT3</th>
              <th>Model1</th>
              <th>Sem</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map((student, index) => (
              <tr key={index} className={student.marks.sem < 50 ? styles.fail : ''}>
                <td>{student.regNo}</td>
                <td>{student.name}</td>
                <td><input type="number" defaultValue={student.marks.ut1} min="0" max="50" className={styles.markInput} /></td>
                <td><input type="number" defaultValue={student.marks.ut2} min="0" max="50" className={styles.markInput} /></td>
                <td><input type="number" defaultValue={student.marks.ut3} min="0" max="50" className={styles.markInput} /></td>
                <td><input type="number" defaultValue={student.marks.model1} min="0" max="100" className={styles.markInput} /></td>
                <td><input type="number" defaultValue={student.marks.sem} min="0" max="100" className={styles.markInput} /></td>
                <td><button className={styles.saveBtn} onClick={() => handleSave(index)}>Save</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const AcademicInsights = () => (
    <div className={styles.academicInsights}>
      <h3>Attendance Insights</h3>
      <ul className={styles.insightsList}>
        {attendanceInsights.map((insight, index) => (
          <li key={index}>{insight.message}</li>
        ))}
      </ul>
      <h3>Marks Insights</h3>
      <ul className={styles.insightsList}>
        {marksInsights.map((insight, index) => (
          <li key={index}>{insight.message}</li>
        ))}
      </ul>
    </div>
  );

  const StudentInsights = () => (
    <div className={styles.studentInsights}>
      <h3>Students List for {selectedSubject}</h3>
      <p className={styles.smallText}>*Click on the student to see their preview and insights</p>
      <table>
        <thead>
          <tr>
            <th>Reg No</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {studentsData.map((student, index) => (
            <tr key={index} onClick={() => { setSelectedStudent(student); setShowStudentPopup(true); }} style={{ cursor: 'pointer' }}>
              <td>{student.regNo}</td>
              <td>{student.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const TakeAttendance = () => {
    const [classType, setClassType] = useState('offline');
    const [period, setPeriod] = useState('Period 1');
    const [endTime, setEndTime] = useState('');
    const [sessionToken, setSessionToken] = useState('');
    const [inputToken, setInputToken] = useState('');
    const [pairing, setPairing] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [cameras] = useState(['Camera1 (MAC: 00:14:22:01:23:45) [ECE-A]', 'Camera2 (MAC: 00:14:22:01:23:46) [ECE-B]']);
    const [endTimeOptions, setEndTimeOptions] = useState([]);

    const periodStartTimes = {
      'Period 1': { hour: 8, min: 30, ampm: 'AM' },
      'Period 2': { hour: 9, min: 25, ampm: 'AM' },
      'Period 3': { hour: 10, min: 30, ampm: 'AM' },
      'Period 4': { hour: 11, min: 25, ampm: 'AM' },
      'Period 5': { hour: 1, min: 20, ampm: 'PM' },
      'Period 6': { hour: 2, min: 15, ampm: 'PM' },
      'Period 7': { hour: 3, min: 5, ampm: 'PM' },
    };

    const periodOrder = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7'];

    const generateSessionToken = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    useEffect(() => {
      if (!sessionToken) {
        setSessionToken(generateSessionToken());
      }
    }, []);

    const addMinutesToTime = (hour, min, ampm, addMin) => {
      let totalMin = hour * 60 + min + addMin;
      let newHour = Math.floor(totalMin / 60) % 24;
      let newMin = totalMin % 60;
      let newAmpm = ampm;
      if (newHour >= 12) {
        newAmpm = 'PM';
        if (newHour > 12) newHour -= 12;
      } else {
        newAmpm = 'AM';
      }
      if (newHour === 0) newHour = 12;
      return `${newHour}:${newMin < 10 ? '0' + newMin : newMin} ${newAmpm}`;
    };

    useEffect(() => {
      const currentStart = periodStartTimes[period];
      const currentIndex = periodOrder.indexOf(period);
      const nextStart = currentIndex < periodOrder.length - 1 ? periodStartTimes[periodOrder[currentIndex + 1]] : { hour: 4, min: 0, ampm: 'PM' }; // Assume end of day for last period

      let currentHour = currentStart.hour;
      if (currentStart.ampm === 'PM' && currentStart.hour !== 12) currentHour += 12;

      let nextHour = nextStart.hour;
      if (nextStart.ampm === 'PM' && nextStart.hour !== 12) nextHour += 12;

      const currentTotalMin = currentHour * 60 + currentStart.min;
      const nextTotalMin = nextHour * 60 + nextStart.min;

      const options = [];
      for (let time = currentTotalMin + 5; time < nextTotalMin; time += 5) {
        let optHour = Math.floor(time / 60) % 24;
        let optMin = time % 60;
        let optAmpm = optHour < 12 ? 'AM' : 'PM';
        if (optHour > 12) optHour -= 12;
        if (optHour === 0) optHour = 12;
        options.push(`${optHour}:${optMin < 10 ? '0' + optMin : optMin} ${optAmpm}`);
      }

      setEndTimeOptions(options);
      setEndTime(options[0] || '');
    }, [period]);

    const handlePair = () => {
      setPairing(true);
      setTimeout(() => {
        setPairing(false);
        if (inputToken === sessionToken) {
          alert('Pairing successful. Taking attendance now...');
        } else {
          alert('Invalid token!');
        }
      }, 2000);
    };

    const generateQrCode = () => {
      const data = `${selectedDepartment}-${selectedYear}-${selectedSection}-${selectedSubject}`;
      setQrCode(data);
    };

    return (
      <div className={styles.takeAttendance}>
        <h3>Take Attendance</h3>
        <div className={styles.attendanceFilters}>
          <div className={styles.filterGroup}>
            <label>Class Type:</label>
            <select value={classType} onChange={(e) => setClassType(e.target.value)} className={styles.filterSelect}>
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Period:</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className={styles.filterSelect}>
              <option value="Period 1">Period 1 (8:30 AM)</option>
              <option value="Period 2">Period 2 (9:25 AM)</option>
              <option value="Period 3">Period 3 (10:30 AM)</option>
              <option value="Period 4">Period 4 (11:25 AM)</option>
              <option value="Period 5">Period 5 (1:20 PM)</option>
              <option value="Period 6">Period 6 (2:15 PM)</option>
              <option value="Period 7">Period 7 (3:05 PM)</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>End Time:</label>
            <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className={styles.filterSelect}>
              {endTimeOptions.map((opt, index) => (
                <option key={index} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        {classType === 'offline' && (
          <div className={styles.pairingSection}>
            <p>Session Token: <span className={styles.sessionToken}>{sessionToken}</span></p>
            <div className={styles.pairInput}>
              <select className={styles.filterSelect}>
                {cameras.map((cam, index) => <option key={index} value={cam}>{cam}</option>)}
              </select>
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="Enter Session Token"
                className={styles.filterSelect}
                style={{ width: '200px' }}
              />
              <button
                className={styles.pairBtn}
                onClick={handlePair}
                disabled={!sessionToken || pairing}
              >
                {pairing ? 'Pairing...' : 'Pair'}
              </button>
            </div>
            {pairing && <p className={styles.pairStatus}>Pairing successful. Taking attendance now...</p>}
          </div>
        )}
        {classType === 'online' && (
          <div className={styles.qrCode}>
            <div className={styles.qrPlaceholder}>
              {qrCode ? <QRCodeCanvas value={qrCode} size={128} /> : 'Generate QR Code'}
            </div>
            <button className={styles.shareQrBtn} onClick={generateQrCode} disabled={!!qrCode}>
              {qrCode ? 'Share QR' : 'Generate QR'}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.staffDashboard}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.profileSection} onClick={() => setShowProfilePopup(true)}>
            <div className={styles.profileAvatar}>{staffData.name.charAt(0)}</div>
            <div className={styles.profileInfo}>
              <h3>{staffData.name}</h3>
              <p>{staffData.staffId}</p>
            </div>
          </div>
          <div className={styles.navigationTabs}>
            <button className={`${styles.tabBtn} ${activeTab === 'attendance' ? styles.active : ''}`} onClick={() => setActiveTab('attendance')}>
              <i className="fas fa-chart-bar"></i> Attendance Details
            </button>
            <button className={`${styles.tabBtn} ${activeTab === 'marks' ? styles.active : ''}`} onClick={() => setActiveTab('marks')}>
              <i className="fas fa-book"></i> Marks Entry
            </button>
            <button className={`${styles.tabBtn} ${activeTab === 'academicInsights' ? styles.active : ''}`} onClick={() => setActiveTab('academicInsights')}>
              <i className="fas fa-chart-pie"></i> Academic Insights
            </button>
            <button className={`${styles.tabBtn} ${activeTab === 'studentInsights' ? styles.active : ''}`} onClick={() => setActiveTab('studentInsights')}>
              <i className="fas fa-users"></i> Student Insights
            </button>
            <button className={`${styles.tabBtn} ${activeTab === 'takeAttendance' ? styles.active : ''}`} onClick={() => setActiveTab('takeAttendance')}>
              <i className="fas fa-check"></i> Take Attendance
            </button>
          </div>
          <Notifications />
        </div>
        <div className={styles.content}>
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard</h2>
          <br />
          <div className={styles.contentHeader}>
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label>Year:</label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className={styles.filterSelect}>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Department:</label>
                <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className={styles.filterSelect}>
                  <option>ECE</option>
                  <option>CSE</option>
                  <option>MECH</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Section:</label>
                <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className={styles.filterSelect}>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Subject:</label>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={styles.filterSelect}>
                  <option>Web Development</option>
                  <option>Data Structures</option>
                  <option>Database Systems</option>
                  <option>Operating Systems</option>
                </select>
              </div>
              {activeTab === 'attendance' && (
                <div className={styles.filterGroup}>
                  <label>View:</label>
                  <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className={styles.filterSelect}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {activeTab === 'attendance' && (
            <>
              <TodayAttendance />
              <SubjectWisePercentage />
              <CombinedAttendanceChart />
            </>
          )}
          {activeTab === 'marks' && <MarksTable />}
          {activeTab === 'academicInsights' && <AcademicInsights />}
          {activeTab === 'studentInsights' && <StudentInsights />}
          {activeTab === 'takeAttendance' && <TakeAttendance />}
        </div>
      </div>

      {showProfilePopup && <ProfilePopup />}
      {showStudentPopup && <StudentPopup />}
    </div>
  );
};

export default StaffDashboard;