// src/pages/StaffDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/StaffDashboard.module.css';
import ProfilePopup from '../components/Staffpage/ProfilePopup';
import StudentPopup from '../components/Staffpage/StudentPopup';
import EditAttendancePopup from '../components/Staffpage/EditAttendancePopup';
import Notifications from '../components/Staffpage/Notifications'; // ← Shared floating bell
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
  const canvasRef = useRef(null);

  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedYear, setSelectedYear] = useState('4');
  const [selectedDepartment, setSelectedDepartment] = useState('ECE');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('Web Development');

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // ← For floating bell
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [showEditAttendance, setShowEditAttendance] = useState(null);

  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayAttendanceData, setTodayAttendanceData] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'low-attendance', message: 'Class attendance below 75% in Web Development', date: '2025-04-05', read: false },
    { id: 2, type: 'exam', message: 'UT2 scheduled for next week', date: '2025-04-04', read: false },
    { id: 3, type: 'meeting', message: 'Department meeting tomorrow at 3 PM', date: '2025-04-03', read: true },
  ]);

  const [timeFilter, setTimeFilter] = useState('weekly');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock Data
  const subjectStats = [
    { name: 'Web Development', percentage: 85 },
    { name: 'Data Structures', percentage: 78 },
    { name: 'Database Systems', percentage: 90 },
    { name: 'Operating Systems', percentage: 82 },
  ];

  const combinedAttendanceData = {
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      data: {
        'Web Development': [85, 92, 78, 95, 88, 70],
        'Data Structures': [82, 90, 75, 92, 85, 68],
      },
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: {
        'Web Development': [82, 88, 85, 90],
        'Data Structures': [80, 86, 83, 88],
      },
    },
  };

  const attendanceInsights = [
    { message: 'High attendance in morning sessions' },
    { message: 'Low attendance after lunch breaks' },
    { message: 'Consistent late comers in Section A' },
  ];

  const marksInsights = [
    { message: '20% students scored below 40 in UT1' },
    { message: 'Top performer: Gunasekaran K (98/100)' },
    { message: 'Improvement needed in Model Exam' },
  ];

  // Fetch Staff Profile
  useEffect(() => {
    document.title = 'Attenitix - Staff Dashboard';
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/user/profile');
        setStaffData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
        if (err.response?.status === 401) navigate('/login/staff_login');
      }
    };
    fetchProfile();
  }, [navigate]);

  // Fetch Students for Attendance
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedYear || !selectedDepartment || !selectedSection) return;
      setLoadingStudents(true);
      try {
        const response = await api.get('/api/staff/students', {
          params: { year: selectedYear, department: selectedDepartment, section: selectedSection },
        });
        const students = response.data.map(s => ({
          regNo: s.studentReg.slice(-5),
          fullRegNo: s.studentReg,
          name: s.name,
          studentId: s._id,
          status: false,
          late: false,
        }));
        setTodayAttendanceData(students);
      } catch (err) {
        console.error(err);
        setTodayAttendanceData([]);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedYear, selectedDepartment, selectedSection]);

  // Notification Handlers
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Close notification dropdown when clicking outside
  // Add this useEffect inside StaffDashboard component
useEffect(() => {
  const closeNotifications = (e) => {
    // Close only if click is outside the notification area
    if (!e.target.closest(`.${styles.notificationsSection}`)) {
      setShowNotifications(false);
    }
  };

  if (showNotifications) {
    document.addEventListener('click', closeNotifications);
  }

  return () => document.removeEventListener('click', closeNotifications);
}, [showNotifications]);

  if (loading) return <div className={styles.profilePopupOverlay}><div className={styles.profilePopup}><p>Loading...</p></div></div>;
  if (error) return <div className={styles.profilePopupOverlay}><div className={styles.profilePopup}><p>{error}</p></div></div>;

  return (
    <div className={styles.staffDashboard}>
      <div className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.profileSection} onClick={() => setShowProfilePopup(true)}>
            <div className={styles.profileAvatar}>{staffData?.name?.[0] || 'S'}</div>
            <div className={styles.profileInfo}>
              <h3>{staffData?.name || 'Staff'}</h3>
              <p>{staffData?.staffId || 'ID'}</p>
            </div>
          </div>

          <div className={styles.navigationTabs}>
            {[
              { key: 'attendance', label: 'Attendance Details' },
              { key: 'takeAttendance', label: 'Take Attendance' },
              { key: 'marks', label: 'Marks Entry' },
              { key: 'academicInsights', label: 'Academic Insights' },
              { key: 'studentInsights', label: 'Student Insights' },
            ].map(tab => (
              <button
                key={tab.key}
                className={`${styles.tabBtn} ${activeTab === tab.key ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Floating Notification Bell - Same as Admin */}
          <Notifications
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            unreadCount={unreadCount}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
          />

          <h2>
            {activeTab === 'attendance' && 'Attendance Details'}
            {activeTab === 'takeAttendance' && 'Take Attendance'}
            {activeTab === 'marks' && 'Marks Entry'}
            {activeTab === 'academicInsights' && 'Academic Insights'}
            {activeTab === 'studentInsights' && 'Student Insights'}
          </h2>
          <br />

          <div className={styles.contentHeader}>
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label>Year:</label>
                <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className={styles.filterSelect}>
                  {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Department:</label>
                <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)} className={styles.filterSelect}>
                  {['ECE', 'CSE', 'IT', 'EEE'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Section:</label>
                <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} className={styles.filterSelect}>
                  {['A', 'B', 'C'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Subject:</label>
                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className={styles.filterSelect}>
                  {['Web Development', 'Data Structures', 'Database Systems', 'Operating Systems'].map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'attendance' && (
            <>
              <TodayAttendance
                todayAttendanceData={todayAttendanceData}
                setShowEditAttendance={setShowEditAttendance}
                loadingStudents={loadingStudents}
              />
              <SubjectWisePercentage subjectStats={subjectStats} />
              <CombinedAttendanceChart
                timeFilter={timeFilter}
                setTimeFilter={setTimeFilter}
                currentWeek={currentWeek}
                setCurrentWeek={setCurrentWeek}
                selectedSubject={selectedSubject}
                combinedAttendanceData={combinedAttendanceData}
                canvasRef={canvasRef}
                drawChart={() => console.log('Drawing chart...')}
                activeTab={activeTab}
              />
            </>
          )}

          {activeTab === 'marks' && (
            <MarksTable
              selectedYear={selectedYear}
              selectedDepartment={selectedDepartment}
              selectedSection={selectedSection}
              selectedSubject={selectedSubject}
            />
          )}

          {activeTab === 'academicInsights' && <AcademicInsights attendanceInsights={attendanceInsights} marksInsights={marksInsights} />}
          {activeTab === 'studentInsights' && (
  <StudentInsights
    selectedSubject={selectedSubject}
    studentsData={todayAttendanceData}
    selectedYear={selectedYear}
    selectedDepartment={selectedDepartment}
    selectedSection={selectedSection}
    setSelectedStudent={setSelectedStudent}
    setShowStudentPopup={setShowStudentPopup}
  />
)}
          {activeTab === 'takeAttendance' && (
            <TakeAttendance
              selectedYear={selectedYear}
              selectedDepartment={selectedDepartment}
              selectedSection={selectedSection}
              selectedSubject={selectedSubject}
            />
          )}
        </div>
      </div>

      {/* Popups */}
      {showProfilePopup && <ProfilePopup setShowProfilePopup={setShowProfilePopup} />}
      {showStudentPopup && selectedStudent && (
  <StudentPopup
    selectedStudent={selectedStudent}
    selectedSubject={selectedSubject}
    onClose={() => {
      setShowStudentPopup(false);
      setSelectedStudent(null);
    }}
  />
)}
      {showEditAttendance && (
        <EditAttendancePopup
          student={showEditAttendance}
          onClose={() => setShowEditAttendance(null)}
          setTodayAttendanceData={setTodayAttendanceData}
        />
      )}
    </div>
  );
};

export default StaffDashboard;