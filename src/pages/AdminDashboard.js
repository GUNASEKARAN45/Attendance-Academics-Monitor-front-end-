import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../Api';
import styles from '../styles/AdminDashboard.module.css';
import AddStudent from '../components/Adminpage/AddStudent';
import AddStaff from '../components/Adminpage/AddStaff';
import AssignStaff from '../components/Adminpage/AssignStaff';
import SendNotification from '../components/Adminpage/SendNotification';
import ProfilePopup from '../components/Adminpage/ProfilePopup';
import StudentPopup from '../components/Adminpage/StudentPopup';
import Notifications from '../components/Adminpage/Notifications';
import TodayAttendance from '../components/Adminpage/TodayAttendance';
import SubjectWisePercentage from '../components/Adminpage/SubjectWisePercentage';
import CombinedAttendanceChart from '../components/Adminpage/CombinedAttendanceChart';
import MarksTable from '../components/Adminpage/MarksTable';
import AcademicInsights from '../components/Adminpage/AcademicInsights';
import StudentsList from '../components/Adminpage/StudentsList';
import AllUsers from '../components/Adminpage/AllUsers';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [filterType, setFilterType] = useState('department');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [timeFilter, setTimeFilter] = useState('weekly');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin-specific states
  const [token] = useState(localStorage.getItem('token') || '');
  const [allStaffs, setAllStaffs] = useState([]);
  const [allDepartments] = useState(['ECE', 'CSE', 'IT']);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [allYears] = useState(['1', '2', '3', '4']);
  const [yearOptions, setYearOptions] = useState([]);
  const [allSections] = useState(['A','B','C']);
  const [allSubjects, setAllSubjects] = useState([]);
  const [users, setUsers] = useState([]);

  // Student add states
  const [studentReg, setStudentReg] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentPass, setStudentPass] = useState('');
  const [studentDegree, setStudentDegree] = useState('');
  const [studentYear, setStudentYear] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [studentSection, setStudentSection] = useState('');
  const [studentDOB, setStudentDOB] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');

  // Staff add states
  const [staffId, setStaffId] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffPass, setStaffPass] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffDepartment, setStaffDepartment] = useState('');
  const [staffDesignation, setStaffDesignation] = useState('');

  // Staff assignment states
  const [assignStaffId, setAssignStaffId] = useState('');
  const [assignStaffName, setAssignStaffName] = useState('');
  const [assignDept, setAssignDept] = useState('');
  const [assignYear, setAssignYear] = useState('');
  const [assignSection, setAssignSection] = useState('');
  const [assignSubject, setAssignSubject] = useState('');

  // Notification states
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationTarget, setNotificationTarget] = useState('student');

  const canvasRef = useRef(null);

  // Mock data
  const [todayAttendanceData, setTodayAttendanceData] = useState([
    { regNo: 'EC001', status: true },
    { regNo: 'EC002', status: true },
    { regNo: 'EC003', status: true },
    { regNo: 'EC004', status: true, late: true },
    { regNo: 'EC005', status: false },
    { regNo: 'EC006', status: true },
    { regNo: 'EC007', status: true },
    { regNo: 'EC008', status: false },
    { regNo: 'EC009', status: true },
    { regNo: 'EC010', status: true },
    { regNo: 'EC011', status: false },
    { regNo: 'EC012', status: true, late: true },
    { regNo: 'EC013', status: true },
    { regNo: 'EC014', status: false },
    { regNo: 'EC015', status: true },
    { regNo: 'EC016', status: true },
    { regNo: 'EC017', status: false },
    { regNo: 'EC018', status: true },
    { regNo: 'EC019', status: true, late: true },
    { regNo: 'EC020', status: false },
  ]);

  const totalStudents = todayAttendanceData.length;
  const presentCount = todayAttendanceData.filter((s) => s.status && !s.late).length;
  const lateCount = todayAttendanceData.filter((s) => s.late && s.status).length;
  const absentCount = todayAttendanceData.filter((s) => !s.status).length;
  const liveCount = presentCount + lateCount;

  const subjectStats = [
    { name: 'Web Development', percentage: 85 },
    { name: 'Data Structures', percentage: 78 },
    { name: 'Database Systems', percentage: 90 },
    { name: 'Operating Systems', percentage: 82 },
    { name: 'Signals & Systems', percentage: 100 },
  ];

  const combinedAttendanceData = {
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      data: {
        'Web Development': [85, 92, 78, 95, 88, 70],
        'Data Structures': [82, 90, 75, 92, 85, 68],
        'Database Systems': [88, 94, 80, 97, 90, 72],
        'Operating Systems': [80, 88, 73, 90, 83, 65],
      },
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: {
        'Web Development': [82, 88, 85, 90],
        'Data Structures': [80, 86, 83, 88],
        'Database Systems': [85, 90, 87, 92],
        'Operating Systems': [78, 84, 81, 86],
      },
    },
  };

  const [studentsData, setStudentsData] = useState([
    {
      regNo: 'AC22UEC001',
      name: 'Student A',
      marks: { ut1: 45, ut2: 42, ut3: 48, model1: 85, sem: 90 },
      attendancePercentage: 95,
      insights: ['Behavior is good', 'Consistent performance', 'High marks in Web Development'],
    },
    {
      regNo: 'AC22UEC002',
      name: 'Student B',
      marks: { ut1: 38, ut2: 40, ut3: 42, model1: 78, sem: 83 },
      attendancePercentage: 85,
      insights: ['Taking continuous leave on Saturday', 'Less marks in Database Systems', 'Needs improvement in consistency'],
    },
    {
      regNo: 'AC22UEC003',
      name: 'Student C',
      marks: { ut1: 25, ut2: 22, ut3: 20, model1: 45, sem: 49 },
      attendancePercentage: 60,
      insights: ['Low attendance', 'Failing in multiple subjects', 'Requires counseling'],
    },
  ]);

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

  const mockNotifications = [
    { id: 1, type: 'low-attendance', message: 'Class attendance below 75% in Web Development', date: '2025-10-11', read: false },
    { id: 2, type: 'exam', message: 'Schedule exam for Data Structures', date: '2025-10-10', read: false },
    { id: 3, type: 'fail', message: 'Multiple failures in Database Systems', date: '2025-10-09', read: true },
    { id: 4, type: 'meeting', message: 'Department meeting tomorrow', date: '2025-10-11', read: false },
    { id: 5, type: 'update', message: 'Update marks for Operating Systems', date: '2025-10-08', read: true },
  ];

  useEffect(() => {
    document.title = 'Attenitix - Admin Dashboard';
    const fetchProfile = async () => {
      try {
        if (token) setAuthToken(token);
        const response = await api.get('/api/user/profile');
        setAdminData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch error:', err.response?.status, err.response?.data);
        setError(
          err.response?.status === 401
            ? 'Session expired, please log in again'
            : err.response?.status === 502
            ? 'Server is down, please try again later'
            : err.response?.status === 404
            ? 'User profile not found'
            : 'Failed to load profile data'
        );
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setAuthToken(null);
          navigate('/login/admin_login');
        }
      }
    };
    fetchProfile();
  }, [navigate, token]);

  useEffect(() => {
    if (token) setAuthToken(token);
    fetchUsers();
    fetchStaffList();
    setNotifications(mockNotifications);
    fetchFilteredData();
  }, [selectedDepartment, selectedYear, selectedSection, selectedSubject, selectedStaff, filterType, token]);

  useEffect(() => {
    const departmentMap = {
      'BE/BTech': ['ECE', 'CSE', 'IT'],
      'ME/MTech': ['ECE', 'CSE', 'IT'],
      MCA: ['Computer Applications'],
      MBA: ['Business Administration'],
    };
    setDepartmentOptions(departmentMap[studentDegree] || []);

    const yearMap = {
      'BE/BTech': ['1', '2', '3', '4'],
      'ME/MTech': ['1', '2'],
      MCA: ['1', '2', '3'],
      MBA: ['1', '2'],
    };
    setYearOptions(yearMap[studentDegree] || []);
  }, [studentDegree]);

  async function fetchFilteredData() {
    try {
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
      setTodayAttendanceData([
        { regNo: 'EC001', status: true },
        { regNo: 'EC002', status: true },
        { regNo: 'EC003', status: true },
        { regNo: 'EC004', status: true, late: true },
        { regNo: 'EC005', status: false },
        { regNo: 'EC006', status: true },
        { regNo: 'EC007', status: true },
        { regNo: 'EC008', status: false },
        { regNo: 'EC009', status: true },
        { regNo: 'EC010', status: true },
        { regNo: 'EC011', status: false },
        { regNo: 'EC012', status: true, late: true },
        { regNo: 'EC013', status: true },
        { regNo: 'EC014', status: false },
        { regNo: 'EC015', status: true },
        { regNo: 'EC016', status: true },
        { regNo: 'EC017', status: false },
        { regNo: 'EC018', status: true },
        { regNo: 'EC019', status: true, late: true },
        { regNo: 'EC020', status: false },
      ]);
      setAllSubjects(['Web Development', 'Data Structures', 'Database Systems', 'Operating Systems']);
    }
  }

  async function fetchUsers() {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchStaffList() {
    try {
      const res = await api.get('/api/admin/staff-list');
      setAllStaffs(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addStudent() {
    if (!studentReg || !studentName || !studentPass || !studentDegree || !studentYear || !studentDept || !studentSection || !studentDOB || !studentEmail || !studentPhone) {
      return alert('Please fill all student fields');
    }
    try {
      await api.post('/api/admin/add-student', {
        studentReg,
        name: studentName,
        password: studentPass,
        degree: studentDegree,
        year: studentYear,
        department: studentDept,
        section: studentSection,
        dob: studentDOB,
        email: studentEmail,
        phone: studentPhone,
      });
      alert('Student added');
      setStudentReg('');
      setStudentName('');
      setStudentPass('');
      setStudentDegree('');
      setStudentYear('');
      setStudentDept('');
      setStudentSection('');
      setStudentDOB('');
      setStudentEmail('');
      setStudentPhone('');
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed');
    }
  }

  async function addStaff() {
    if (!staffId || !staffName || !staffPass || !staffEmail || !staffPhone || !staffDepartment || !staffDesignation) {
      return alert('Please fill all staff fields');
    }
    try {
      await api.post('/api/admin/add-staff', {
        staffId,
        name: staffName,
        password: staffPass,
        email: staffEmail,
        phone: staffPhone,
        department: staffDepartment,
        designation: staffDesignation,
      });
      alert('Staff added');
      setStaffId('');
      setStaffName('');
      setStaffPass('');
      setStaffEmail('');
      setStaffPhone('');
      setStaffDepartment('');
      setStaffDesignation('');
      fetchUsers();
      fetchStaffList();
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed');
    }
  }

  async function assignStaff() {
    if (!assignStaffId || !assignDept || !assignYear || !assignSection || !assignSubject) {
      return alert('Please fill all fields');
    }
    try {
      await api.post('/api/admin/assign-staff', {
        staffId: assignStaffId,
        staffName: assignStaffName,
        department: assignDept,
        year: assignYear,
        section: assignSection,
        subject: assignSubject,
      });
      alert('Staff assigned successfully');
      setAssignStaffId('');
      setAssignStaffName('');
      setAssignDept('');
      setAssignYear('');
      setAssignSection('');
      setAssignSubject('');
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed');
    }
  }

  async function sendNotification() {
    if (!notificationMessage) return alert('Please enter a message');
    try {
      await api.post('/api/admin/send-notification', { message: notificationMessage, target: notificationTarget });
      alert('Notification sent');
      setNotificationMessage('');
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed');
    }
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    canvas.width = 800;
    canvas.height = 350;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const data = combinedAttendanceData[timeFilter];
    if (!data || !data.labels || !data.data) {
      console.error('Invalid data for chart');
      return;
    }

    const labels = data.labels;
    const values = data.data[selectedSubject] || [];

    if (!values.length) {
      console.error('No values for selected subject:', selectedSubject);
      return;
    }

    const maxY = 100;
    const padding = 60;
    const width = canvas.width;
    const height = canvas.height;
    const pointSpacing = (width - padding * 2) / (labels.length - 1);
    const points = values.map((value, i) => ({
      x: padding + i * pointSpacing,
      y: height - padding - (value / maxY) * (height - padding * 2),
      value,
      label: labels[i],
    }));

    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * (height - padding * 2);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '12px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(`${100 - i * 20}%`, padding - 10, y + 4);
    }
    ctx.setLineDash([]);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    points.forEach((point, i) => {
      ctx.fillText(labels[i], point.x, height - padding + 20);
    });
    if (timeFilter === 'monthly') {
      ctx.font = 'bold 12px Inter';
      ctx.fillText(combinedAttendanceData.monthly.months?.[currentWeek]?.name || 'Month', width / 2, height - padding + 40);
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point, i) => {
      if (i > 0) {
        const prev = points[i - 1];
        const xc = (prev.x + point.x) / 2;
        const yc = (prev.y + point.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
      }
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  if (loading) {
    return (
      <div className={styles.profilePopupOverlay}>
        <div className={styles.profilePopup}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.profilePopupOverlay}>
        <div className={styles.profilePopup}>
          <p>{error}</p>
          <button className={styles.closeBtn} onClick={() => navigate('/login/admin_login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.staffDashboard}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.profileSection} onClick={() => setShowProfilePopup(true)}>
            <div className={styles.profileAvatar}>{adminData?.name ? adminData.name.charAt(0) : 'U'}</div>
            <div className={styles.profileInfo}>
              <h3>{adminData?.name || 'Unknown'}</h3>
              <p>{adminData?.adminId || 'N/A'}</p>
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
              <i className="fas fa-book"></i> View Marks
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'analysis' ? styles.active : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              <i className="fas fa-chart-pie"></i> Academic Insights
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'students' ? styles.active : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <i className="fas fa-users"></i> Students Analysis
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
          </div>
        </div>

        <div className={styles.content}>
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1')} Dashboard</h2>
          <br />
          <div className={styles.contentHeader}>
            <div className={styles.filters}>
              {['attendance', 'marks', 'analysis', 'students'].includes(activeTab) && (
                <>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    <div className={styles.filters} style={{ flexWrap: 'wrap' }}>
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
                              {allDepartments.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
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
                              {allYears.map((y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ))}
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
                              {allSections.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
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
                              {allSubjects.map((sub) => (
                                <option key={sub} value={sub}>
                                  {sub}
                                </option>
                              ))}
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
                              {allStaffs.map((s) => (
                                <option key={s.staffId} value={s.staffId}>
                                  {s.name}
                                </option>
                              ))}
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
                              {allSubjects.map((sub) => (
                                <option key={sub} value={sub}>
                                  {sub}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {activeTab === 'attendance' && (
            <>
              <TodayAttendance totalStudents={totalStudents} presentCount={presentCount} liveCount={liveCount} lateCount={lateCount} absentCount={absentCount} todayAttendanceData={todayAttendanceData} />
              <SubjectWisePercentage subjectStats={subjectStats} />
              <CombinedAttendanceChart
                activeTab={activeTab}
                timeFilter={timeFilter}
                currentWeek={currentWeek}
                selectedSubject={selectedSubject}
                canvasRef={canvasRef}
                drawChart={drawChart}
                setTimeFilter={setTimeFilter}
                setCurrentWeek={setCurrentWeek}
              />
            </>
          )}

          {activeTab === 'marks' && <MarksTable studentsData={studentsData} selectedSubject={selectedSubject} />}

          {activeTab === 'analysis' && <AcademicInsights attendanceInsights={attendanceInsights} marksInsights={marksInsights} />}

          {activeTab === 'students' && (
            <StudentsList studentsData={studentsData} selectedSubject={selectedSubject} setSelectedStudent={setSelectedStudent} setShowStudentPopup={setShowStudentPopup} />
          )}

          {activeTab === 'addStudent' && (
            <AddStudent
              studentReg={studentReg}
              setStudentReg={setStudentReg}
              studentName={studentName}
              setStudentName={setStudentName}
              studentPass={studentPass}
              setStudentPass={setStudentPass}
              studentDegree={studentDegree}
              setStudentDegree={setStudentDegree}
              studentYear={studentYear}
              setStudentYear={setStudentYear}
              studentDept={studentDept}
              setStudentDept={setStudentDept}
              studentSection={studentSection}
              setStudentSection={setStudentSection}
              studentDOB={studentDOB}
              setStudentDOB={setStudentDOB}
              studentEmail={studentEmail}
              setStudentEmail={setStudentEmail}
              studentPhone={studentPhone}
              setStudentPhone={setStudentPhone}
              yearOptions={yearOptions}
              departmentOptions={departmentOptions}
              allSections={allSections}
              addStudent={addStudent}
            />
          )}

          {activeTab === 'addStaff' && (
            <AddStaff
              staffId={staffId}
              setStaffId={setStaffId}
              staffName={staffName}
              setStaffName={setStaffName}
              staffPass={staffPass}
              setStaffPass={setStaffPass}
              staffEmail={staffEmail}
              setStaffEmail={setStaffEmail}
              staffPhone={staffPhone}
              setStaffPhone={setStaffPhone}
              staffDepartment={staffDepartment}
              setStaffDepartment={setStaffDepartment}
              staffDesignation={staffDesignation}
              setStaffDesignation={setStaffDesignation}
              allDepartments={allDepartments}
              addStaff={addStaff}
            />
          )}

          {activeTab === 'assignStaff' && (
            <AssignStaff
              assignStaffId={assignStaffId}
              setAssignStaffId={setAssignStaffId}
              assignStaffName={assignStaffName}
              setAssignStaffName={setAssignStaffName}
              assignDept={assignDept}
              setAssignDept={setAssignDept}
              assignYear={assignYear}
              setAssignYear={setAssignYear}
              assignSection={assignSection}
              setAssignSection={setAssignSection}
              assignSubject={assignSubject}
              setAssignSubject={setAssignSubject}
              allStaffs={allStaffs}
              allDepartments={allDepartments}
              allYears={allYears}
              allSections={allSections}
              allSubjects={allSubjects}
              assignStaff={assignStaff}
            />
          )}

          {activeTab === 'sendNotification' && (
            <SendNotification
              notificationTarget={notificationTarget}
              setNotificationTarget={setNotificationTarget}
              notificationMessage={notificationMessage}
              setNotificationMessage={setNotificationMessage}
              sendNotification={sendNotification}
            />
          )}

          {activeTab === 'allUsers' && <AllUsers users={users} />}
        </div>
      </div>

      {showProfilePopup && <ProfilePopup setShowProfilePopup={setShowProfilePopup} />}
      {showStudentPopup && <StudentPopup selectedStudent={selectedStudent} setShowStudentPopup={setShowStudentPopup} setSelectedStudent={setSelectedStudent} />}
      <Notifications
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        unreadCount={unreadCount}
        markAsRead={markAsRead}
        deleteNotification={deleteNotification}
      />
    </div>
  );
};

export default AdminDashboard;