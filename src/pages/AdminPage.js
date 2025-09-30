import React, { useState, useEffect } from 'react';
import styles from '../styles/AdminDashboard.module.css'; // Reuse StaffDashboard styles for similarity
import { api, setAuthToken } from "../Api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [filterType, setFilterType] = useState('department'); // 'department' or 'staff'
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [timeFilter, setTimeFilter] = useState('weekly');
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Admin-specific states
  const [token] = useState(localStorage.getItem("token") || "");
  const [allStaffs, setAllStaffs] = useState([]);
  const [allDepartments] = useState(['ECE', 'CSE', 'MECH']); // Mock departments
  const [allYears] = useState(['1', '2', '3', '4']); // Mock years
  const [allSections] = useState(['A', 'B', 'C']); // Mock sections
  const [allSubjects, setAllSubjects] = useState([]); // Dynamic subjects based on filters
  const [users, setUsers] = useState([]);

  // Student add states
  const [studentReg, setStudentReg] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPass, setStudentPass] = useState("");
  const [studentDegree, setStudentDegree] = useState("");
  const [studentYear, setStudentYear] = useState("");
  const [studentDept, setStudentDept] = useState("");
  const [studentSection, setStudentSection] = useState("");

  // Staff add states
  const [staffId, setStaffId] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffPass, setStaffPass] = useState("");

  // Staff assignment states
  const [assignStaffId, setAssignStaffId] = useState("");
  const [assignStaffName, setAssignStaffName] = useState("");
  const [assignDept, setAssignDept] = useState("");
  const [assignYear, setAssignYear] = useState("");
  const [assignSection, setAssignSection] = useState("");

  // Notification and Mail states
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationTarget, setNotificationTarget] = useState('student'); // 'student' or 'staff'
  const [mailMessage, setMailMessage] = useState("");
  const [mailTarget, setMailTarget] = useState('student'); // 'student' or 'staff'

  // Mock admin data
  const adminData = {
    adminId: "ADM001",
    name: "Admin User",
    designation: "Administrator"
  };

  // Mock today's attendance data (dynamic based on filters)
  const [todayAttendanceData, setTodayAttendanceData] = useState([
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
  ]);

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
  const [studentsData, setStudentsData] = useState([
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
  ]);

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

  useEffect(() => {
    if (token) setAuthToken(token);
    fetchUsers();
    fetchStaffList();
    setNotifications(mockNotifications);
    fetchFilteredData();
  }, [selectedDepartment, selectedYear, selectedSection, selectedSubject, selectedStaff, filterType]);

  async function fetchFilteredData() {
    try {
      // Example API call for filtered data
      const params = {
        department: selectedDepartment,
        year: selectedYear,
        section: selectedSection,
        subject: selectedSubject,
        staff: selectedStaff,
        filterType,
      };
      const res = await api.get('/api/admin/filtered-data', { params });
      setTodayAttendanceData(res.data.attendance || []);
      setStudentsData(res.data.students || []);
      setAllSubjects(res.data.subjects || []);
    } catch (err) {
      console.error(err);
      // Use mock data as fallback
      setTodayAttendanceData([
        { regNo: "EC001", status: true },
        // Add more
      ]);
      setStudentsData([
        // Add mock students
      ]);
      setAllSubjects(['Web Development', 'Data Structures', 'Database Systems', 'Operating Systems']);
    }
  }

  async function fetchUsers() {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchStaffList() {
    try {
      const res = await api.get("/api/admin/staff-list");
      setAllStaffs(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addStudent() {
    if (!studentReg || !studentName || !studentPass || !studentDegree || !studentYear || !studentDept || !studentSection) {
      return alert("Please fill all student fields");
    }
    try {
      await api.post("/api/admin/add-student", {
        studentReg, name: studentName, password: studentPass,
        degree: studentDegree, year: studentYear, department: studentDept, section: studentSection
      });
      alert("Student added");
      setStudentReg(""); setStudentName(""); setStudentPass("");
      setStudentDegree(""); setStudentYear(""); setStudentDept(""); setStudentSection("");
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.error || "Failed");
    }
  }

  async function addStaff() {
    if (!staffId || !staffName || !staffPass) return alert("Please fill all staff fields");
    try {
      await api.post("/api/admin/add-staff", { staffId, name: staffName, password: staffPass });
      alert("Staff added");
      setStaffId(""); setStaffName(""); setStaffPass("");
      fetchUsers(); fetchStaffList();
    } catch (err) {
      alert(err?.response?.data?.error || "Failed");
    }
  }

  async function assignStaff() {
    if (!assignStaffId || !assignDept || !assignYear || !assignSection) return alert("Please fill all fields");
    try {
      await api.post("/api/admin/assign-staff", {
        staffId: assignStaffId,
        staffName: assignStaffName,
        department: assignDept,
        year: assignYear,
        section: assignSection
      });
      alert("Staff assigned successfully");
      setAssignStaffId(""); setAssignStaffName(""); setAssignDept(""); setAssignYear(""); setAssignSection("");
    } catch (err) {
      alert(err?.response?.data?.error || "Failed");
    }
  }

  async function sendNotification() {
    if (!notificationMessage) return alert("Please enter a message");
    try {
      await api.post("/api/admin/send-notification", { message: notificationMessage, target: notificationTarget });
      alert("Notification sent");
      setNotificationMessage("");
    } catch (err) {
      alert(err?.response?.data?.error || "Failed");
    }
  }

  async function sendMail() {
    if (!mailMessage) return alert("Please enter a message");
    try {
      await api.post("/api/admin/send-mail", { message: mailMessage, target: mailTarget });
      alert("Mail sent");
      setMailMessage("");
    } catch (err) {
      alert(err?.response?.data?.error || "Failed");
    }
  }

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
        <h3>Admin Profile</h3>
        <div className={styles.profileInfo}>
          <p><strong>Name:</strong> {adminData.name}</p>
          <p><strong>Admin ID:</strong> {adminData.adminId}</p>
          <p><strong>Designation:</strong> {adminData.designation}</p>
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

  // Today's Attendance Component for Admin
  const TodayAttendance = () => (
    <div className={styles.todayAttendance}>
      <h3>Today's Student Attendance</h3>
      <div className={styles.attendanceGrid}>
        {todayAttendanceData.map((student, index) => (
          <div key={index} className={styles.studentIcon}>
            <div className={`${styles.icon} ${student.status ? styles.present : styles.absent}`}></div>
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

  // Marks Table Component for Admin (View Only)
  const MarksTable = () => (
    <div className={styles.marksTable}>
      <h3>View Marks for {selectedSubject}</h3>
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
          </tr>
        </thead>
        <tbody>
          {studentsData.map((student, index) => (
            <tr key={index} className={student.marks.sem < 50 ? styles.fail : ''}>
              <td>{student.regNo}</td>
              <td>{student.name}</td>
              <td>{student.marks.ut1}</td>
              <td>{student.marks.ut2}</td>
              <td>{student.marks.ut3}</td>
              <td>{student.marks.model1}</td>
              <td>{student.marks.sem}</td>
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

  // Add Student Component
  const AddStudent = () => (
    <div className={styles.adminSection}>
      <h3>Add Student</h3>
      <input className={styles.filterSelect} placeholder="Registration number" value={studentReg} onChange={e => setStudentReg(e.target.value)} />
      <input className={styles.filterSelect} placeholder="Student name" value={studentName} onChange={e => setStudentName(e.target.value)} />
      <input className={styles.filterSelect} placeholder="Password" type="password" value={studentPass} onChange={e => setStudentPass(e.target.value)} />
      <input className={styles.filterSelect} placeholder="Degree" value={studentDegree} onChange={e => setStudentDegree(e.target.value)} />
      <input className={styles.filterSelect} placeholder="Year" type="number" value={studentYear} onChange={e => setStudentYear(e.target.value)} />
      <input className={styles.filterSelect} placeholder="Department" value={studentDept} onChange={e => setStudentDept(e.target.value)} />
      <input className={styles.filterSelect} placeholder="Section" value={studentSection} onChange={e => setStudentSection(e.target.value)} />
      <button className={styles.saveBtn} onClick={addStudent}>Add Student</button>
    </div>
  );

  // Add Staff Component
  const AddStaff = () => (
    <div className={styles.adminSection}>
      <h3>Add Staff</h3>
      <input className={styles.filterSelect} placeholder="Staff ID" value={staffId} onChange={e => setStaffId(e.target.value)} />
      <input className={styles.filterSelect} placeholder="Staff name" value={staffName} onChange={e => setStaffName(e.target.value)} />
      <input className={styles.filterSelect} placeholder="Password" type="password" value={staffPass} onChange={e => setStaffPass(e.target.value)} />
      <button className={styles.saveBtn} onClick={addStaff}>Add Staff</button>
    </div>
  );

  // Assign Staff Component
  const AssignStaff = () => (
    <div className={styles.adminSection}>
      <h3>Assign Staff</h3>
      <select className={styles.filterSelect} value={assignStaffId} onChange={e => {
        const staff = allStaffs.find(s => s.staffId === e.target.value);
        setAssignStaffId(staff?.staffId || '');
        setAssignStaffName(staff?.name || '');
      }}>
        <option value="">Select Staff</option>
        {allStaffs.map(s => <option key={s.staffId} value={s.staffId}>{s.name} ({s.staffId})</option>)}
      </select>
      <select className={styles.filterSelect} value={assignDept} onChange={e => setAssignDept(e.target.value)}>
        <option value="">Select Department</option>
        {allDepartments.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <select className={styles.filterSelect} value={assignYear} onChange={e => setAssignYear(e.target.value)}>
        <option value="">Select Year</option>
        {allYears.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
      <select className={styles.filterSelect} value={assignSection} onChange={e => setAssignSection(e.target.value)}>
        <option value="">Select Section</option>
        {allSections.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <button className={styles.saveBtn} onClick={assignStaff}>Assign Staff</button>
    </div>
  );

  // Send Notification Component
  const SendNotification = () => (
    <div className={styles.adminSection}>
      <h3>Send Notification</h3>
      <select className={styles.filterSelect} value={notificationTarget} onChange={e => setNotificationTarget(e.target.value)}>
        <option value="student">To Students</option>
        <option value="staff">To Staff</option>
      </select>
      <textarea className={styles.filterSelect} style={{height: '100px'}} placeholder="Notification Message" value={notificationMessage} onChange={e => setNotificationMessage(e.target.value)} />
      <button className={styles.saveBtn} onClick={sendNotification}>Send Notification</button>
    </div>
  );

  // Send Mail Component
  const SendMail = () => (
    <div className={styles.adminSection}>
      <h3>Send Mail</h3>
      <select className={styles.filterSelect} value={mailTarget} onChange={e => setMailTarget(e.target.value)}>
        <option value="student">To Students</option>
        <option value="staff">To Staff</option>
      </select>
      <textarea className={styles.filterSelect} style={{height: '100px'}} placeholder="Mail Message" value={mailMessage} onChange={e => setMailMessage(e.target.value)} />
      <button className={styles.saveBtn} onClick={sendMail}>Send Mail</button>
    </div>
  );

  // All Users Component
  const AllUsers = () => (
    <div className={styles.marksTable}>
      <h3>All Users</h3>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Username</th>
            <th>Name</th>
            <th>StudentReg</th>
            <th>Degree</th>
            <th>Year</th>
            <th>Department</th>
            <th>Section</th>
            <th>StaffId</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.role}</td>
              <td>{u.username}</td>
              <td>{u.name}</td>
              <td>{u.studentReg || "-"}</td>
              <td>{u.degree || "-"}</td>
              <td>{u.year || "-"}</td>
              <td>{u.department || "-"}</td>
              <td>{u.section || "-"}</td>
              <td>{u.staffId || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.staffDashboard}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div 
            className={styles.profileSection}
            onClick={() => setShowProfilePopup(true)}
          >
            <div className={styles.profileAvatar}>
              {adminData.name.charAt(0)}
            </div>
            <div className={styles.profileInfo}>
              <h3>{adminData.name}</h3>
              <p>{adminData.adminId}</p>
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
              <i className="fas fa-book"></i> Marks View
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
            <button 
              className={`${styles.tabBtn} ${activeTab === 'addStudent' ? styles.active : ''}`}
              onClick={() => setActiveTab('addStudent')}
            >
              <i className="fas fa-user-plus"></i> Add Student
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'addStaff' ? styles.active : ''}`}
              onClick={() => setActiveTab('addStaff')}
            >
              <i className="fas fa-user-tie"></i> Add Staff
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'assignStaff' ? styles.active : ''}`}
              onClick={() => setActiveTab('assignStaff')}
            >
              <i className="fas fa-tasks"></i> Assign Staff
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'sendNotification' ? styles.active : ''}`}
              onClick={() => setActiveTab('sendNotification')}
            >
              <i className="fas fa-bell"></i> Send Notification
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'sendMail' ? styles.active : ''}`}
              onClick={() => setActiveTab('sendMail')}
            >
              <i className="fas fa-envelope"></i> Send Mail
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'allUsers' ? styles.active : ''}`}
              onClick={() => setActiveTab('allUsers')}
            >
              <i className="fas fa-list"></i> All Users
            </button>
          </div>

          <Notifications />
        </div>

        <div className={styles.content}>
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1')} Dashboard</h2> {/* Improved tab title formatting */}
          <br/>
          <div className={styles.contentHeader}>
            
            <div className={styles.filters}>
              {['attendance', 'marks', 'analysis', 'students'].includes(activeTab) && (
                <>
                  <div className={styles.filterGroup}>
                    <label>Filter Type:</label>
                    <select 
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="department">Department Wise</option>
                      <option value="staff">Staff Wise</option>
                    </select>
                  </div>
                  {filterType === 'department' && (
                    <>
                      <div className={styles.filterGroup}>
                        <label>Department:</label>
                        <select 
                          value={selectedDepartment} 
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          className={styles.filterSelect}
                        >
                          <option value="">Select</option>
                          {allDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className={styles.filterGroup}>
                        <label>Year:</label>
                        <select 
                          value={selectedYear} 
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className={styles.filterSelect}
                        >
                          <option value="">Select</option>
                          {allYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div className={styles.filterGroup}>
                        <label>Section:</label>
                        <select 
                          value={selectedSection} 
                          onChange={(e) => setSelectedSection(e.target.value)}
                          className={styles.filterSelect}
                        >
                          <option value="">Select</option>
                          {allSections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className={styles.filterGroup}>
                        <label>Subject:</label>
                        <select 
                          value={selectedSubject} 
                          onChange={(e) => setSelectedSubject(e.target.value)}
                          className={styles.filterSelect}
                        >
                          <option value="">Select</option>
                          {allSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                  {filterType === 'staff' && (
                    <>
                      <div className={styles.filterGroup}>
                        <label>Staff:</label>
                        <select 
                          value={selectedStaff} 
                          onChange={(e) => setSelectedStaff(e.target.value)}
                          className={styles.filterSelect}
                        >
                          <option value="">Select</option>
                          {allStaffs.map(s => <option key={s.staffId} value={s.staffId}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className={styles.filterGroup}>
                        <label>Handled Subject:</label>
                        <select 
                          value={selectedSubject} 
                          onChange={(e) => setSelectedSubject(e.target.value)}
                          className={styles.filterSelect}
                        >
                          <option value="">Select</option>
                          {allSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                      </div>
                    </>
                  )}
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
                </>
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

          {activeTab === 'addStudent' && (
            <AddStudent />
          )}

          {activeTab === 'addStaff' && (
            <AddStaff />
          )}

          {activeTab === 'assignStaff' && (
            <AssignStaff />
          )}

          {activeTab === 'sendNotification' && (
            <SendNotification />
          )}

          {activeTab === 'sendMail' && (
            <SendMail />
          )}

          {activeTab === 'allUsers' && (
            <AllUsers />
          )}
        </div>
      </div>

      {showProfilePopup && <ProfilePopup />}
      {showStudentPopup && <StudentPopup />}
    </div>
  );
};

export default AdminDashboard;