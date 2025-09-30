import React, { useState, useEffect } from 'react';
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
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock staff data
  const staffData = {
    staffId: "STF001",
    name: "Mrs. Suriya",
    department: "ECE",
    designation: " Assistant Professor"
  };

  // Mock today's attendance data for students
  const todayAttendanceData = [
  { regNo: "EC001", status: true },
  { regNo: "EC002", status: false },
  { regNo: "EC003", status: true },
  { regNo: "EC004", status: true },
  { regNo: "EC005", status: false },
  { regNo: "EC006", status: true },
  { regNo: "EC007", status: true },
  { regNo: "EC008", status: false },
  { regNo: "EC009", status: true },
  { regNo: "EC010", status: true },
  { regNo: "EC011", status: false },
  { regNo: "EC012", status: true },
  { regNo: "EC013", status: true },
  { regNo: "EC014", status: false },
  { regNo: "EC015", status: true },
  { regNo: "EC016", status: true },
  { regNo: "EC017", status: false },
  { regNo: "EC018", status: true },
  { regNo: "EC019", status: true },
  { regNo: "EC020", status: false },
  { regNo: "EC021", status: true },
  { regNo: "EC022", status: true },
  { regNo: "EC023", status: false },
  { regNo: "EC024", status: true },
  { regNo: "EC025", status: true },
  { regNo: "EC026", status: false },
  { regNo: "EC027", status: true },
  { regNo: "EC028", status: true },
  { regNo: "EC029", status: false },
  { regNo: "EC030", status: true },
];


  // Mock subject-wise percentage (subjects handled by staff)
  const subjectStats = [
    { name: 'Web Development', percentage: 85 },
    { name: 'Data Structures', percentage: 78 },
    { name: 'Database Systems', percentage: 90 },
    { name: 'Operating Systems', percentage: 82 },
    { name: 'Signals & Systems', percentage: 100 },
  ];

  // Mock combined attendance data
  const combinedAttendanceData = {
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      data: [85, 92, 78, 95, 88, 70]
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [82, 88, 85, 90]
    }
  };

  // Mock students list with marks, attendance percentage, and insights
  const studentsData = [
    {
      regNo: "AC22UEC001",
      name: "Student A",
      marks: {
        ut1: 45, ut2: 42, ut3: 48,
        model1: 85,
        sem: 90
      },
      attendancePercentage: 95,
      insights: [
        "Behavior is good",
        "Consistent performance",
        "High marks in Web Development"
      ]
    },
    {
      regNo: "AC22UEC002",
      name: "Student B",
      marks: {
        ut1: 38, ut2: 40, ut3: 42,
        model1: 78, 
        sem: 83
      },
      attendancePercentage: 85,
      insights: [
        "Taking continuous leave on Saturday",
        "Less marks in Database Systems",
        "Needs improvement in consistency"
      ]
    },
    {
      regNo: "AC22UEC003",
      name: "Student C",
      marks: {
        ut1: 25, ut2: 22, ut3: 20,
        model1: 45,
        sem: 49
      },
      attendancePercentage: 60,
      insights: [
        "Low attendance",
        "Failing in multiple subjects",
        "Requires counseling"
      ]
    },
  ];

  // Mock insights
  const attendanceInsights = [
    { message: 'Students continuously absent on Friday and Saturday' },
    { message: 'Less number of students present in the last week' },
  ];

  const marksInsights = [
    { message: '20% failed in Web Development' },
    { message: 'High failure rate in Database Systems' },
  ];

  // Mock notifications data
  const mockNotifications = [
    { id: 1, type: 'low-attendance', message: 'Class attendance below 75% in Web Development', date: '2023-10-23', read: false },
    { id: 2, type: 'exam', message: 'Schedule exam for Data Structures', date: '2023-10-22', read: false },
    { id: 3, type: 'fail', message: 'Multiple failures in Database Systems', date: '2023-10-21', read: true },
    { id: 4, type: 'meeting', message: 'Department meeting tomorrow', date: '2023-10-20', read: false },
    { id: 5, type: 'update', message: 'Update marks for Operating Systems', date: '2023-10-19', read: true }
  ];

  // Initialize notifications
  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Profile Popup Component
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

  // Student Popup Component
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
          <button 
            className={styles.closeBtn} 
            onClick={() => { setShowStudentPopup(false); setSelectedStudent(null); }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Notifications Component
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
                  <button 
                    className={styles.markReadBtn}
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button 
                  className={styles.deleteBtn}
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete notification"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noNotifications}>No notifications</p>
        )}
      </div>
    </div>
  );

  // Today's Attendance Component for Staff (Updated with new icon and smaller size)
  const TodayAttendance = () => (
    <div className={styles.todayAttendance}>
      <h3>Today's Student Attendance</h3>
      <div className={styles.attendanceGrid}>
        {todayAttendanceData.map((student, index) => (
          <div key={index} className={styles.studentIcon}>
            <div 
              className={`${styles.icon} ${student.status ? styles.present : styles.absent}`} 
              style={{ backgroundImage: `url(https://static.thenounproject.com/png/1594252-200.png)`, backgroundSize: 'cover' }}
            ></div>
            <span>{student.regNo}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Subject Wise Percentage Component
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
                  background: `conic-gradient(#4CAF50 ${subject.percentage * 3.6}deg, #e0e0e0 0deg)`
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

  // Combined Attendance Chart Component
  const CombinedAttendanceChart = () => (
    <div className={styles.attendanceChart}>
      <h3>{timeFilter === 'weekly' ? 'Weekly' : 'Monthly'} Combined Attendance</h3>
      <div className={styles.chartContainer}>
        {(timeFilter === 'weekly' ? combinedAttendanceData.weekly.data : combinedAttendanceData.monthly.data)
          .map((percentage, index) => (
          <div key={index} className={styles.chartBar}>
            <div 
              className={styles.barFill} 
              style={{ height: `${percentage}%` }}
            ></div>
            <span>{timeFilter === 'weekly' 
              ? combinedAttendanceData.weekly.labels[index] 
              : combinedAttendanceData.monthly.labels[index]}</span>
            <span className={styles.percentage}>{percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Marks Table Component for Staff (Editable)
  const MarksTable = () => (
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
              <td><input type="number" defaultValue={student.marks.ut1} className={styles.markInput} /></td>
              <td><input type="number" defaultValue={student.marks.ut2} className={styles.markInput} /></td>
              <td><input type="number" defaultValue={student.marks.ut3} className={styles.markInput} /></td>
              <td><input type="number" defaultValue={student.marks.model1} className={styles.markInput} /></td>
              <td><input type="number" defaultValue={student.marks.sem} className={styles.markInput} /></td>
              <td>
                <button className={styles.saveBtn} onClick={() => alert('Marks saved!')}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Student Analysis Component
  const StudentAnalysis = () => (
    <div className={styles.studentAnalysis}>
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

  // Students List Component
  const StudentsList = () => (
    <div className={styles.studentsList}>
      <h3>Students List for {selectedSubject}</h3>
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

  return (
    <div className={styles.staffDashboard}>
      <div className={styles.container}>
        {/* Left Sidebar - 25% */}
        <div className={styles.sidebar}>
          <div 
            className={styles.profileSection}
            onClick={() => setShowProfilePopup(true)}
          >
            <div className={styles.profileAvatar}>
              {staffData.name.charAt(0)}
            </div>
            <div className={styles.profileInfo}>
              <h3>{staffData.name}</h3>
              <p>{staffData.staffId}</p>
            </div>
          </div>

          <div className={styles.navigationTabs}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'attendance' ? styles.active : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              <i className="fas fa-chart-bar"></i> Attendance Details
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'marks' ? styles.active : ''}`}
              onClick={() => setActiveTab('marks')}
            >
              <i className="fas fa-book"></i> Marks Entry
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'analysis' ? styles.active : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              <i className="fas fa-chart-pie"></i> Student Analysis
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'students' ? styles.active : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <i className="fas fa-users"></i> Students List
            </button>
          </div>

          <Notifications />
        </div>

        {/* Right Content - 75% */}
        <div className={styles.content}>
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard</h2>
          <br/>
          <div className={styles.contentHeader}>
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label>Year:</label>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Department:</label>
                <select 
                  value={selectedDepartment} 
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option>ECE</option>
                  <option>CSE</option>
                  <option>MECH</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Section:</label>
                <select 
                  value={selectedSection} 
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Subject:</label>
                <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option>Web Development</option>
                  <option>Data Structures</option>
                  <option>Database Systems</option>
                  <option>Operating Systems</option>
                </select>
              </div>
              {activeTab === 'attendance' && (
                <div className={styles.filterGroup}>
                  <label>View:</label>
                  <select 
                    value={timeFilter} 
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
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

          {activeTab === 'marks' && (
            <MarksTable />
          )}

          {activeTab === 'analysis' && (
            <StudentAnalysis />
          )}

          {activeTab === 'students' && (
            <StudentsList />
          )}
        </div>
      </div>

      {showProfilePopup && <ProfilePopup />}
      {showStudentPopup && <StudentPopup />}
    </div>
  );
};

export default StaffDashboard;