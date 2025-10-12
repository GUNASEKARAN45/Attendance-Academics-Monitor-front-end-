import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/StaffDashboard.module.css';
import ProfilePopup from '../components/Staffpage/ProfilePopup';
import StudentPopup from '../components/Staffpage/StudentPopup';
import EditAttendancePopup from '../components/Staffpage/EditAttendancePopup';
import Notifications from '../components/Staffpage/Notifications';
import TodayAttendance from '../components/Staffpage/TodayAttendance';
import SubjectWisePercentage from '../components/Staffpage/SubjectWisePercentage';
import CombinedAttendanceChart from '../components/Staffpage/CombinedAttendanceChart';
import MarksTable from '../components/Staffpage/MarksTable';
import AcademicInsights from '../components/Staffpage/AcademicInsights';
import StudentInsights from '../components/Staffpage/StudentInsights';
import TakeAttendance from '../components/Staffpage/TakeAttendance';
import { api } from '../Api';

const StaffDashboard = () => {
  const navigate = useNavigate();
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
  const [showEditAttendance, setShowEditAttendance] = useState(null);
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayAttendanceData, setTodayAttendanceData] = useState([
    { regNo: "EC001", status: true },
    { regNo: "EC002", status: true },
    { regNo: "EC003", status: true },
    { regNo: "EC004", status: true, late: true },
    { regNo: "EC005", status: false },
    { regNo: "EC006", status: true },
    { regNo: "EC007", status: true },
    { regNo: "EC008", status: false },
    { regNo: "EC009", status: true },
    { regNo: "EC010", status: true },
    { regNo: "EC011", status: true },
    { regNo: "EC012", status: true },
    { regNo: "EC013", status: true },
    { regNo: "EC014", status: false },
    { regNo: "EC015", status: false },
    { regNo: "EC016", status: true },
    { regNo: "EC017", status: true, late: true },
    { regNo: "EC018", status: false },
    { regNo: "EC019", status: true },
    { regNo: "EC020", status: true },
    { regNo: "EC021", status: true },
    { regNo: "EC022", status: true },
    { regNo: "EC023", status: false },
    { regNo: "EC024", status: true },
    { regNo: "EC025", status: true },
    { regNo: "EC026", status: true, late: true },
    { regNo: "EC027", status: false },
    { regNo: "EC028", status: true },
    { regNo: "EC029", status: true },
    { regNo: "EC030", status: false },
  ]);

  // Mock data for components
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

  const studentsData = [
    {
      regNo: "AC22UEC001",
      name: "Student A",
      marks: { ut1: 45, ut2: 42, ut3: 48, model1: 85, sem: 90 },
      attendancePercentage: 95,
      insights: ["Behavior is good", "Consistent performance", "High marks in Web Development"],
    },
    {
      regNo: "AC22UEC002",
      name: "Student B",
      marks: { ut1: 38, ut2: 40, ut3: 42, model1: 78, sem: 83 },
      attendancePercentage: 85,
      insights: ["Taking continuous leave on Saturday", "Less marks in Database Systems", "Needs improvement in consistency"],
    },
    {
      regNo: "AC22UEC003",
      name: "Student C",
      marks: { ut1: 25, ut2: 22, ut3: 20, model1: 45, sem: 49 },
      attendancePercentage: 60,
      insights: ["Low attendance", "Failing in multiple subjects", "Requires counseling"],
    },
  ];

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
    { id: 1, type: 'low-attendance', message: 'Class attendance below 75% in Web Development', date: '2023-10-23', read: false },
    { id: 2, type: 'exam', message: 'Schedule exam for Data Structures', date: '2023-10-22', read: false },
    { id: 3, type: 'fail', message: 'Multiple failures in Database Systems', date: '2023-10-21', read: true },
    { id: 4, type: 'meeting', message: 'Department meeting tomorrow', date: '2023-10-20', read: false },
    { id: 5, type: 'update', message: 'Update marks for Operating Systems', date: '2023-10-19', read: true },
  ];

  useEffect(() => {
    document.title = 'Attenitix - Staff Dashboard';
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/user/profile');
        setStaffData(response.data);
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
          navigate('/login/staff_login');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const canvasRef = useRef(null);

  const drawChart = () => {
    console.log('Chart drawing function - implement in component');
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
          <button className={styles.closeBtn} onClick={() => navigate('/login/staff_login')}>
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
            <div className={styles.profileAvatar}>{staffData?.name ? staffData.name.charAt(0) : 'U'}</div>
            <div className={styles.profileInfo}>
              <h3>{staffData?.name || 'Unknown'}</h3>
              <p>{staffData?.staffId || 'N/A'}</p>
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
              className={`${styles.tabBtn} ${activeTab === 'takeAttendance' ? styles.active : ''}`}
              onClick={() => setActiveTab('takeAttendance')}
            >
              <i className="fas fa-check"></i> Take Attendance
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'marks' ? styles.active : ''}`}
              onClick={() => setActiveTab('marks')}
            >
              <i className="fas fa-book"></i> Marks Entry
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'academicInsights' ? styles.active : ''}`}
              onClick={() => setActiveTab('academicInsights')}
            >
              <i className="fas fa-chart-pie"></i> Academic Insights
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'studentInsights' ? styles.active : ''}`}
              onClick={() => setActiveTab('studentInsights')}
            >
              <i className="fas fa-users"></i> Student Insights
            </button>
          </div>
          <Notifications notifications={notifications} unreadCount={unreadCount} onDelete={deleteNotification} onMarkAsRead={markAsRead} />
        </div>
        <div className={styles.content}>
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard</h2>
          <br />
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
            </div>
          </div>

          {activeTab === 'attendance' && (
            <>
              <TodayAttendance todayAttendanceData={todayAttendanceData} setShowEditAttendance={setShowEditAttendance} />
              <SubjectWisePercentage subjectStats={subjectStats} />
              <CombinedAttendanceChart
                timeFilter={timeFilter}
                setTimeFilter={setTimeFilter}
                currentWeek={currentWeek}
                setCurrentWeek={setCurrentWeek}
                selectedSubject={selectedSubject}
                combinedAttendanceData={combinedAttendanceData}
                canvasRef={canvasRef}
                drawChart={drawChart}
                activeTab={activeTab}
              />
            </>
          )}
          {activeTab === 'marks' && <MarksTable selectedSubject={selectedSubject} studentsData={studentsData} />}
          {activeTab === 'academicInsights' && <AcademicInsights attendanceInsights={attendanceInsights} marksInsights={marksInsights} />}
          {activeTab === 'studentInsights' && (
            <StudentInsights selectedSubject={selectedSubject} studentsData={studentsData} setSelectedStudent={setSelectedStudent} setShowStudentPopup={setShowStudentPopup} />
          )}
          {activeTab === 'takeAttendance' && (
            <TakeAttendance selectedDepartment={selectedDepartment} selectedYear={selectedYear} selectedSection={selectedSection} selectedSubject={selectedSubject} />
          )}
        </div>
      </div>

      {showProfilePopup && <ProfilePopup setShowProfilePopup={setShowProfilePopup} />}
      {showStudentPopup && selectedStudent && <StudentPopup selectedStudent={selectedStudent} onClose={() => { setShowStudentPopup(false); setSelectedStudent(null); }} />}
      {showEditAttendance && (
        <EditAttendancePopup student={showEditAttendance} onClose={() => setShowEditAttendance(null)} setTodayAttendanceData={setTodayAttendanceData} />
      )}
    </div>
  );
};

export default StaffDashboard;