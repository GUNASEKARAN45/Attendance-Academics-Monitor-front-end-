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
  const [selectedSubject, setSelectedSubject] = useState('Web Development');
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
  const [faceEmbedding, setFaceEmbedding] = useState(null);

  // Dynamic Attendance States (Real from DB)
  const [todayAttendanceData, setTodayAttendanceData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Admin-specific states
  const [token] = useState(localStorage.getItem('token') || '');
  const [allStaffs, setAllStaffs] = useState([]);
  const [allDepartments] = useState(['ECE', 'CSE', 'IT']);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [allYears] = useState(['1', '2', '3', '4']);
  const [yearOptions, setYearOptions] = useState([]);
  const [allSections] = useState(['A', 'B', 'C']);
  const [allSubjects, setAllSubjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [marksData, setMarksData] = useState([]);
const [analysisStudents, setAnalysisStudents] = useState([]);

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

  // Mock data for other tabs (kept as-is)
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
    { regNo: 'AC22UEC001', name: 'Student A', marks: { ut1: 45, ut2: 42, ut3: 48, model1: 85, sem: 90 }, attendancePercentage: 95, insights: ['Behavior is good'] },
    { regNo: 'AC22UEC002', name: 'Student B', marks: { ut1: 38, ut2: 40, ut3: 42, model1: 78, sem: 83 }, attendancePercentage: 85, insights: ['Needs improvement'] },
    { regNo: 'AC22UEC003', name: 'Student C', marks: { ut1: 25, ut2: 22, ut3: 20, model1: 45, sem: 49 }, attendancePercentage: 60, insights: ['Requires counseling'] },
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

  // Auto-select ECE, Year 1, Section A on first load
  useEffect(() => {
    setSelectedDepartment('ECE');
    setSelectedYear('1');
    setSelectedSection('A');
  }, []);

  // Fetch real students from DB when filters change
 // Fetch real students from DB when filters change
useEffect(() => {
  if (!selectedDepartment || !selectedYear || !selectedSection) return;

  const fetchRealStudents = async () => {
    try {
      setAttendanceLoading(true);

      const params = new URLSearchParams({
        department: selectedDepartment,
        year: selectedYear,
        section: selectedSection
      });

      const res = await api.get(`/api/admin/filtered-students?${params}`);
      
      // This is the key: your backend already sends `regNo`, `name`, `status`, `late`
      const attendanceList = res.data.attendance || [];

      setTodayAttendanceData(attendanceList);

      // Use the counts sent from backend
      setTotalStudents(res.data.totalStudents || attendanceList.length);
      setPresentCount(res.data.presentCount || 0);
      setLateCount(res.data.lateCount || 0);
      setAbsentCount(res.data.absentCount || attendanceList.length);
      setLiveCount(res.data.presentCount + res.data.lateCount || 0);

    } catch (err) {
      console.error("Failed to fetch students:", err);
      alert("Could not load students from database.");
      setTodayAttendanceData([]);
      setTotalStudents(0);
      setAbsentCount(0);
    } finally {
      setAttendanceLoading(false);
    }
  };

  fetchRealStudents();
}, [selectedDepartment, selectedYear, selectedSection]);
// Add this state near the top (with other states)



// Fetch marks when filters change
// State for marks table

// Fetch marks when any filter changes
useEffect(() => {
  if (!selectedDepartment || !selectedYear || !selectedSection || !selectedSubject) {
    setMarksData([]);
    return;
  }

  const fetchMarks = async () => {
    try {
      const params = new URLSearchParams({
        department: selectedDepartment,
        year: selectedYear,
        section: selectedSection,
        subject: selectedSubject
      });

      const res = await api.get(`/api/admin/marks?${params}`);
      setMarksData(res.data);
    } catch (err) {
      console.error("Failed to load marks:", err);
      setMarksData([]);
    }
  };

  fetchMarks();
}, [selectedDepartment, selectedYear, selectedSection, selectedSubject]);

// State for Students Analysis tab

// Fetch students for "Students Analysis" tab
useEffect(() => {
  if (!selectedDepartment || !selectedYear || !selectedSection) {
    setAnalysisStudents([]);
    return;
  }

  const fetchAnalysisStudents = async () => {
    try {
      // Get real students
      const studentRes = await api.get('/api/admin/filtered-students', {
        params: { department: selectedDepartment, year: selectedYear, section: selectedSection }
      });

      const students = studentRes.data.attendance || [];

      // For each student, try to get marks for selected subject (or all)
      const enriched = await Promise.all(
        students.map(async (s) => {
          let marks = { ut1: 0, ut2: 0, ut3: 0, model1: 0, sem: 0 };

          if (selectedSubject) {
            try {
              const marksRes = await api.get('/api/admin/marks', {
                params: {
                  department: selectedDepartment,
                  year: selectedYear,
                  section: selectedSection,
                  subject: selectedSubject
                }
              });
              const found = marksRes.data.find(m => m.regNo === s.regNo);
              if (found) marks = found.marks;
            } catch (e) { /* ignore */ }
          }

          // Hardcoded predictive insights
          const insights = [];
          if (marks.sem < 50) insights.push("At risk of failing semester exam");
          if (marks.ut1 + marks.ut2 + marks.ut3 < 90) insights.push("Weak performance in unit tests");
          if (marks.sem >= 90) insights.push("Top performer – excellent consistency!");
          insights.push("Regular attendance recommended");
          if (marks.model1 < 70) insights.push("Needs to improve in model exam");

          return {
            regNo: s.regNo,
            name: s.name,
            attendancePercentage: 0, // will be real later
            marks,
            insights: insights.length > 0 ? insights : ["Good standing", "Keep it up!"]
          };
        })
      );

      setAnalysisStudents(enriched);
    } catch (err) {
      console.error(err);
      setAnalysisStudents([]);
    }
  };

  fetchAnalysisStudents();
}, [selectedDepartment, selectedYear, selectedSection, selectedSubject]);


  // Profile fetch
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
          err.response?.status === 401 ? 'Session expired, please log in again' :
          err.response?.status === 502 ? 'Server is down, please try again later' :
          err.response?.status === 404 ? 'User profile not found' : 'Failed to load profile data'
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
  }, [token]);

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
    if (!studentReg || !studentName || !studentPass || !studentDegree || 
        !studentYear || !studentDept || !studentSection || !studentDOB || 
        !studentEmail || !studentPhone) {
      return alert('Please fill all student fields');
    }
    if (!faceEmbedding || faceEmbedding.length !== 512) {
      return alert('Please capture Face ID first!');
    }
    try {
      await api.post('/api/admin/add-student', {
        studentReg, name: studentName, password: studentPass,
        degree: studentDegree, year: parseInt(studentYear),
        department: studentDept.toUpperCase(), section: studentSection.toUpperCase(),
        dob: studentDOB, email: studentEmail, phone: studentPhone,
        faceEmbedding
      });
      alert("Student added successfully with Face Recognition!");
      setStudentReg(''); setStudentName(''); setStudentPass(''); setStudentDegree('');
      setStudentYear(''); setStudentDept(''); setStudentSection(''); setStudentDOB('');
      setStudentEmail(''); setStudentPhone(''); setFaceEmbedding(null);
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to add student');
    }
  }

  async function addStaff() {
    if (!staffId || !staffName || !staffPass || !staffEmail || !staffPhone || !staffDepartment || !staffDesignation) {
      return alert('Please fill all staff fields');
    }
    try {
      await api.post('/api/admin/add-staff', {
        staffId, name: staffName, password: staffPass,
        email: staffEmail, phone: staffPhone,
        department: staffDepartment, designation: staffDesignation,
      });
      alert('Staff added');
      setStaffId(''); setStaffName(''); setStaffPass(''); setStaffEmail('');
      setStaffPhone(''); setStaffDepartment(''); setStaffDesignation('');
      fetchUsers(); fetchStaffList();
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
        staffId: assignStaffId, staffName: assignStaffName,
        department: assignDept, year: assignYear,
        section: assignSection, subject: assignSubject,
      });
      alert('Staff assigned successfully');
      setAssignStaffId(''); setAssignStaffName(''); setAssignDept('');
      setAssignYear(''); setAssignSection(''); setAssignSubject('');
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
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const drawChart = () => { /* your existing chart code - unchanged */ };

  if (loading) {
    return (
      <div className={styles.profilePopupOverlay}>
        <div className={styles.profilePopup}><p>Loading...</p></div>
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
            <div className={styles.profileAvatar}>{adminData?.name?.[0] || 'U'}</div>
            <div className={styles.profileInfo}>
              <h3>{adminData?.name || 'Unknown'}</h3>
              <p>{adminData?.adminId || 'N/A'}</p>
            </div>
          </div>

          <div className={styles.navigationTabs}>
            <button className={`${styles.tabBtn} ${activeTab === 'attendance' ? styles.active : ''}`} onClick={() => setActiveTab('attendance')}>
              Attendance Details
            </button>
            <button className={`${styles.tabBtn} ${activeTab === 'marks' ? styles.active : ''}`} onClick={() => setActiveTab('marks')}>
              View Marks
            </button>
            <button className={`${styles.tabBtn} ${activeTab === 'analysis' ? styles.active : ''}`} onClick={() => setActiveTab('analysis')}>
              Academic Insights
            </button>
            <button className={`${styles.tabBtn} ${activeTab === 'students' ? styles.active : ''}`} onClick={() => setActiveTab('students')}>
              Students Analysis
            </button>
            <button className={`${styles.tabBtn} ${activeTab === 'addStudent' ? styles.active : ''}`} onClick={() => setActiveTab('addStudent')}>
              Add Student
            </button>
            <button className={`${styles.tabBtn} ${activeTab === 'addStaff' ? styles.active : ''}`} onClick={() => setActiveTab('addStaff')}>
              Add Staff
            </button>
            <button className={`${styles.tabBtn} ${activeTab === 'assignStaff' ? styles.active : ''}`} onClick={() => setActiveTab('assignStaff')}>
              Assign Staff
            </button>
            <button className={`${styles.tabBtn} ${activeTab === 'sendNotification' ? styles.active : ''}`} onClick={() => setActiveTab('sendNotification')}>
              Send Notification
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
                      <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={styles.filterSelect}>
                        <option value="department">Department Wise</option>
                        <option value="staff">Staff Wise</option>
                      </select>
                    </div>

                    <div className={styles.filters} style={{ flexWrap: 'wrap' }}>
                      {filterType === 'department' && (
                        <>
                          <div className={styles.filterGroup}>
                            <label>Department:</label>
                            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className={styles.filterSelect}>
                              <option value="">Select</option>
                              {allDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>
                          <div className={styles.filterGroup}>
                            <label>Year:</label>
                            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className={styles.filterSelect}>
                              <option value="">Select</option>
                              {allYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                          <div className={styles.filterGroup}>
                            <label>Section:</label>
                            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className={styles.filterSelect}>
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
    <option value="">Select Subject</option>
    <option value="Web Development">Web Development</option>
    <option value="Data Structures">Data Structures</option>
    <option value="Database Systems">Database Systems</option>
    <option value="Operating Systems">Operating Systems</option>
    <option value="Signals & Systems">Signals & Systems</option>
    <option value="Computer Networks">Computer Networks</option>
    <option value="Software Engineering">Software Engineering</option>
    <option value="Machine Learning">Machine Learning</option>
    <option value="Digital Electronics">Digital Electronics</option>
    <option value="Microprocessors">Microprocessors</option>
  </select>
</div>
                        </>
                      )}
                      {filterType === 'staff' && (
                        <>
                          <div className={styles.filterGroup}>
                            <label>Staff:</label>
                            <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} className={styles.filterSelect}>
                              <option value="">Select</option>
                              {allStaffs.map(s => <option key={s.staffId} value={s.staffId}>{s.name}</option>)}
                            </select>
                          </div>
                          <div className={styles.filterGroup}>
                            <label>Handled Subject:</label>
                            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={styles.filterSelect}>
                              <option value="">Select</option>
                              {allSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
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
              <TodayAttendance
                totalStudents={totalStudents}
                presentCount={presentCount}
                liveCount={liveCount}
                lateCount={lateCount}
                absentCount={absentCount}
                todayAttendanceData={todayAttendanceData}
                loading={attendanceLoading}
              />
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

{activeTab === 'marks' && (
  <MarksTable 
    studentsData={marksData}
    selectedSubject={selectedSubject} 
  />
)}       
   {activeTab === 'analysis' && <AcademicInsights attendanceInsights={attendanceInsights} marksInsights={marksInsights} />}
{activeTab === 'students' && (
  <StudentsList
    studentsData={analysisStudents}
    selectedSubject={selectedSubject}
    setSelectedStudent={setSelectedStudent}
    setShowStudentPopup={setShowStudentPopup}
  />
)}
          {activeTab === 'addStudent' && (
            <AddStudent
              studentReg={studentReg} setStudentReg={setStudentReg}
              studentName={studentName} setStudentName={setStudentName}
              studentPass={studentPass} setStudentPass={setStudentPass}
              studentDegree={studentDegree} setStudentDegree={setStudentDegree}
              studentYear={studentYear} setStudentYear={setStudentYear}
              studentDept={studentDept} setStudentDept={setStudentDept}
              studentSection={studentSection} setStudentSection={setStudentSection}
              studentDOB={studentDOB} setStudentDOB={setStudentDOB}
              studentEmail={studentEmail} setStudentEmail={setStudentEmail}
              studentPhone={studentPhone} setStudentPhone={setStudentPhone}
              yearOptions={yearOptions} departmentOptions={departmentOptions} allSections={allSections}
              faceEmbedding={faceEmbedding} setFaceEmbedding={setFaceEmbedding}
              addStudent={addStudent}
            />
          )}
          {activeTab === 'addStaff' && <AddStaff staffId={staffId} setStaffId={setStaffId} staffName={staffName} setStaffName={setStaffName} staffPass={staffPass} setStaffPass={setStaffPass} staffEmail={staffEmail} setStaffEmail={setStaffEmail} staffPhone={staffPhone} setStaffPhone={setStaffPhone} staffDepartment={staffDepartment} setStaffDepartment={setStaffDepartment} staffDesignation={staffDesignation} setStaffDesignation={setStaffDesignation} allDepartments={allDepartments} addStaff={addStaff} />}
          {activeTab === 'assignStaff' && <AssignStaff assignStaffId={assignStaffId} setAssignStaffId={setAssignStaffId} assignStaffName={assignStaffName} setAssignStaffName={setAssignStaffName} assignDept={assignDept} setAssignDept={setAssignDept} assignYear={assignYear} setAssignYear={setAssignYear} assignSection={assignSection} setAssignSection={setAssignSection} assignSubject={assignSubject} setAssignSubject={setAssignSubject} allStaffs={allStaffs} allDepartments={allDepartments} allYears={allYears} allSections={allSections} allSubjects={allSubjects} assignStaff={assignStaff} />}
          {activeTab === 'sendNotification' && <SendNotification notificationTarget={notificationTarget} setNotificationTarget={setNotificationTarget} notificationMessage={notificationMessage} setNotificationMessage={setNotificationMessage} sendNotification={sendNotification} />}
          {activeTab === 'allUsers' && <AllUsers users={users} />}
        </div>
      </div>

      {showProfilePopup && <ProfilePopup setShowProfilePopup={setShowProfilePopup} />}
      {showStudentPopup && <StudentPopup selectedStudent={selectedStudent} setShowStudentPopup={setShowStudentPopup} setSelectedStudent={setSelectedStudent} />}
      <Notifications notifications={notifications} showNotifications={showNotifications} setShowNotifications={setShowNotifications} unreadCount={unreadCount} markAsRead={markAsRead} deleteNotification={deleteNotification} />
    </div>
  );
};

export default AdminDashboard;