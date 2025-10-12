import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/StudentDashboard.module.css';
import AttendanceChart from '../components/Studentpage/AttendanceChart';
import ExamSchedule from '../components/Studentpage/ExamSchedule';
import MarksTable from '../components/Studentpage/MarksTable';
import Notifications from '../components/Studentpage/Notifications';
import OverallAttendance from '../components/Studentpage/OverallAttendance';
import ProfilePopup from '../components/Studentpage/ProfilePopup';
import ScheduleCalendar from '../components/Studentpage/ScheduleCalendar';
import SubjectPerformance from '../components/Studentpage/SubjectPerformance';
import TodayAttendance from '../components/Studentpage/TodayAttendance';
import { api } from '../Api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedSemester, setSelectedSemester] = useState(7);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(9); // October
  const [currentYear, setCurrentYear] = useState(2025);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState({});
  const [calendarData, setCalendarData] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date(2025, 9, 11);

  useEffect(() => {
    document.title = 'Attenitix - Student Dashboard';
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/user/profile');
        setStudentData(response.data);
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
          navigate('/login/student_login');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    setNotifications([
      { id: 1, type: 'absent', message: 'You were marked absent in Web Development on Monday', date: '2025-10-04', read: false },
      { id: 2, type: 'low-attendance', message: 'Your attendance in Data Structures is below 75%', date: '2025-10-03', read: false },
      { id: 3, type: 'exam', message: 'Web Development exam is tomorrow', date: '2025-10-06', read: true },
      { id: 4, type: 'fail', message: 'You failed in Database Systems', date: '2025-10-02', read: false },
      { id: 5, type: 'absent', message: 'You were marked absent in Operating Systems on Friday', date: '2025-10-01', read: true },
    ]);
  }, []);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const canGoNext = () => {
    let nextMonthVal = currentMonth + 1;
    let nextYearVal = currentYear;
    if (nextMonthVal > 11) {
      nextMonthVal = 0;
      nextYearVal += 1;
    }
    if (nextYearVal > today.getFullYear()) return false;
    if (nextYearVal === today.getFullYear() && nextMonthVal > today.getMonth()) return false;
    return true;
  };

  const prevSemester = () => setSelectedSemester(Math.max(1, selectedSemester - 1));
  const nextSemester = () => setSelectedSemester(Math.min(8, selectedSemester + 1));

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleComplete = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = () => {
    setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, text: editingText } : todo)));
    setEditingId(null);
    setEditingText('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)));
  };

  const generateCalendarData = () => {
    const calendar = [];
    const firstDayDate = new Date(currentYear, currentMonth, 1);
    const firstDay = firstDayDate.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }

    while (calendar.length % 7 !== 0) {
      calendar.push(null);
    }

    return calendar;
  };

  const generateMonthlyAttendance = () => {
    const data = {};
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d);
      const dateStr = date.toISOString().split('T')[0];
      const dow = date.getDay();
      if (dow === 0) continue;
      const periods = Array.from({ length: 7 }, () => Math.random() > 0.2);
      data[dateStr] = { periods };
    }
    return data;
  };

  useEffect(() => {
    setCalendarData(generateCalendarData());
    setMonthlyAttendance(generateMonthlyAttendance());
  }, [currentMonth, currentYear]);

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
          <button className={styles.closeBtn} onClick={() => navigate('/login/student_login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.studentDashboard}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.profileSection} onClick={() => setShowProfilePopup(true)}>
            <div className={styles.profileAvatar}>{studentData.name ? studentData.name.charAt(0) : 'U'}</div>
            <div className={styles.profileInfo}>
              <h3>{studentData.name || 'Unknown'}</h3>
              <p>{studentData.studentReg || 'N/A'}</p>
            </div>
          </div>

          <div className={styles.navigationTabs}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'attendance' ? styles.active : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              <span className={styles.tabIcon}>&#128202;</span> Attendance Details
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'academic' ? styles.active : ''}`}
              onClick={() => setActiveTab('academic')}
            >
              <span className={styles.tabIcon}>&#128214;</span> Academic Details
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'exam' ? styles.active : ''}`}
              onClick={() => setActiveTab('exam')}
            >
              <span className={styles.tabIcon}>&#128197;</span> Exam Schedule
            </button>
          </div>

          <Notifications />
        </div>

        <div className={styles.content}>
          {activeTab === 'attendance' ? (
            <>
              <div className={styles.contentHeader}>
                <h2>Attendance Dashboard</h2>
                <div className={styles.filters}>
                  <div className={styles.semesterFilter}>
                    <label>Semester:</label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                      className={styles.filterSelect}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.attendanceOverview}>
                <OverallAttendance />
                <TodayAttendance />
              </div>
              <SubjectPerformance />
              <AttendanceChart />
              <ScheduleCalendar />
            </>
          ) : activeTab === 'academic' ? (
            <>
              <div className={styles.contentHeader}>
                <h2>Academic Performance</h2>
              </div>
              <MarksTable />
            </>
          ) : (
            <ExamSchedule />
          )}
        </div>
      </div>

      {showProfilePopup && <ProfilePopup setShowProfilePopup={setShowProfilePopup} />}
    </div>
  );
};

export default StudentDashboard;