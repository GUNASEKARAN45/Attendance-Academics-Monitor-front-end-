import React, { useState, useEffect, useRef, memo } from 'react';
import styles from '../styles/AdminDashboard.module.css';
import { api, setAuthToken } from "../Api";

// Memoized child components to prevent unnecessary re-renders
const AddStudent = memo(({ 
  studentReg, setStudentReg, 
  studentName, setStudentName, 
  studentPass, setStudentPass, 
  studentDegree, setStudentDegree, 
  studentYear, setStudentYear, 
  studentDept, setStudentDept, 
  studentSection, setStudentSection, 
  studentDOB, setStudentDOB, 
  studentEmail, setStudentEmail, 
  studentPhone, setStudentPhone, 
  yearOptions, departmentOptions, 
  allSections, addStudent 
}) => (
  <div className={styles.adminSection}>
    <div className={styles.formGroup}>
      {/* Row 1: Registration Number and Student Name */}
      <div>
        <label>Registration Number</label>
        <input className={styles.filterSelect} placeholder="Registration number" value={studentReg} onChange={e => setStudentReg(e.target.value)} required />
      </div>
      <div>
        <label>Student Name</label>
        <input className={styles.filterSelect} placeholder="Student name" value={studentName} onChange={e => setStudentName(e.target.value)} required />
      </div>

      {/* Row 2: Password and Degree */}
      <div>
        <label>Password</label>
        <input className={styles.filterSelect} type="password" placeholder="Password" value={studentPass} onChange={e => setStudentPass(e.target.value)} required />
      </div>
      <div>
        <label>Degree</label>
        <select className={styles.filterSelect} value={studentDegree} onChange={e => setStudentDegree(e.target.value)} required>
          <option value="">Select Degree</option>
          <option value="BE/BTech">BE/BTech</option>
          <option value="ME/MTech">ME/MTech</option>
          <option value="MCA">MCA</option>
          <option value="MBA">MBA</option>
        </select>
      </div>

      {/* Row 3: Year and Department */}
      <div>
        <label>Year</label>
        <select className={styles.filterSelect} value={studentYear} onChange={e => setStudentYear(e.target.value)} required>
          <option value="">Select Year</option>
          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label>Department</label>
        <select className={styles.filterSelect} value={studentDept} onChange={e => setStudentDept(e.target.value)} required>
          <option value="">Select Department</option>
          {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Row 4: Section and Date of Birth */}
      <div>
        <label>Section</label>
        <select className={styles.filterSelect} value={studentSection} onChange={e => setStudentSection(e.target.value)} required>
          <option value="">Select Section</option>
          {allSections.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label>Date of Birth</label>
        <input className={styles.filterSelect} type="date" value={studentDOB} onChange={e => setStudentDOB(e.target.value)} required />
      </div>

      {/* Row 5: Email and Phone Number */}
      <div>
        <label>Email</label>
        <input className={styles.filterSelect} type="email" placeholder="Email" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} required />
      </div>
      <div>
        <label>Phone Number</label>
        <input className={styles.filterSelect} type="tel" placeholder="Phone Number" value={studentPhone} onChange={e => setStudentPhone(e.target.value)} required />
      </div>

      {/* Button spans both columns */}
      <button className={styles.saveBtn} onClick={addStudent}>Add Student</button>
    </div>
  </div>
));

const AddStaff = memo(({ 
  staffId, setStaffId, 
  staffName, setStaffName, 
  staffPass, setStaffPass, 
  staffEmail, setStaffEmail, 
  staffPhone, setStaffPhone, 
  staffDepartment, setStaffDepartment, 
  staffDesignation, setStaffDesignation, 
  allDepartments, addStaff 
}) => (
  <div className={styles.adminSection}>
    <div className={styles.formGroup}>
      {/* Row 1: Staff ID and Staff Name */}
      <div>
        <label>Staff ID</label>
        <input className={styles.filterSelect} placeholder="Staff ID" value={staffId} onChange={e => setStaffId(e.target.value)} required />
      </div>
      <div>
        <label>Staff Name</label>
        <input className={styles.filterSelect} placeholder="Staff name" value={staffName} onChange={e => setStaffName(e.target.value)} required />
      </div>

      {/* Row 2: Password and Email */}
      <div>
        <label>Password</label>
        <input className={styles.filterSelect} type="password" placeholder="Password" value={staffPass} onChange={e => setStaffPass(e.target.value)} required />
      </div>
      <div>
        <label>Email</label>
        <input className={styles.filterSelect} type="email" placeholder="Email" value={staffEmail} onChange={e => setStaffEmail(e.target.value)} required />
      </div>

      {/* Row 3: Phone Number and Department */}
      <div>
        <label>Phone Number</label>
        <input className={styles.filterSelect} type="tel" placeholder="Phone Number" value={staffPhone} onChange={e => setStaffPhone(e.target.value)} required />
      </div>
      <div>
        <label>Department</label>
        <select className={styles.filterSelect} value={staffDepartment} onChange={e => setStaffDepartment(e.target.value)} required>
          <option value="">Select Department</option>
          {allDepartments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Row 4: Designation */}
      <div>
        <label>Designation</label>
        <select className={styles.filterSelect} value={staffDesignation} onChange={e => setStaffDesignation(e.target.value)} required>
          <option value="">Select Designation</option>
          <option value="Assistant Professor">Assistant Professor</option>
          <option value="Associate Professor">Associate Professor</option>
          <option value="Professor">Professor</option>
        </select>
      </div>
      <div></div> {/* Empty div to balance the grid */}

      {/* Button spans both columns */}
      <button className={styles.saveBtn} onClick={addStaff}>Add Staff</button>
    </div>
  </div>
));

const AssignStaff = memo(({ 
  assignStaffId, setAssignStaffId, 
  assignStaffName, setAssignStaffName, 
  assignDept, setAssignDept, 
  assignYear, setAssignYear, 
  assignSection, setAssignSection, 
  assignSubject, setAssignSubject, 
  allStaffs, allDepartments, allYears, allSections, allSubjects, assignStaff 
}) => (
  <div className={styles.adminSection}>
    <div className={styles.formGroup}>
      {/* Row 1: Staff */}
      <div>
        <label>Staff</label>
        <select className={styles.filterSelect} value={assignStaffId} onChange={e => {
          const staff = allStaffs.find(s => s.staffId === e.target.value);
          setAssignStaffId(staff?.staffId || '');
          setAssignStaffName(staff?.name || '');
        }} required>
          <option value="">Select Staff</option>
          {allStaffs.map(s => <option key={s.staffId} value={s.staffId}>{s.name} ({s.staffId})</option>)}
        </select>
      </div>
      <div>
        <label>Department</label>
        <select className={styles.filterSelect} value={assignDept} onChange={e => setAssignDept(e.target.value)} required>
          <option value="">Select Department</option>
          {allDepartments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Row 2: Year and Section */}
      <div>
        <label>Year</label>
        <select className={styles.filterSelect} value={assignYear} onChange={e => setAssignYear(e.target.value)} required>
          <option value="">Select Year</option>
          {allYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label>Section</label>
        <select className={styles.filterSelect} value={assignSection} onChange={e => setAssignSection(e.target.value)} required>
          <option value="">Select Section</option>
          {allSections.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Row 3: Subject */}
      <div>
        <label>Subject</label>
        <select className={styles.filterSelect} value={assignSubject} onChange={e => setAssignSubject(e.target.value)} required>
          <option value="">Select Subject</option>
          {allSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>
      </div>
      <div></div> {/* Empty div to balance the grid */}

      {/* Button spans both columns */}
      <button className={styles.saveBtn} onClick={assignStaff}>Assign Staff</button>
    </div>
  </div>
));
const SendNotification = memo(({ 
  notificationTarget, setNotificationTarget, 
  notificationMessage, setNotificationMessage, 
  sendNotification 
}) => (
  <div className={styles.adminSection}>
    <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Field 1: Target */}
      <div>
        <label>Target</label>
        <select 
          className={styles.filterSelect} 
          value={notificationTarget} 
          onChange={e => setNotificationTarget(e.target.value)} 
          required
        >
          <option value="student">To Students</option>
          <option value="staff">To Staff</option>
          <option value="both">To Both</option>
        </select>
      </div>

      {/* Field 2: Message */}
      <div>
        <label>Message</label>
        <textarea 
          className={styles.filterSelect} 
          style={{ height: '120px' }} 
          placeholder="Notification Message" 
          value={notificationMessage} 
          onChange={e => setNotificationMessage(e.target.value)} 
          required
        />
      </div>

      {/* Button */}
      <button className={styles.saveBtn} onClick={sendNotification}>Send Notification</button>
    </div>
  </div>
));


const AdminDashboard = () => {
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

  // Admin-specific states
  const [token] = useState(localStorage.getItem("token") || "");
  const [allStaffs, setAllStaffs] = useState([]);
  const [allDepartments] = useState(['ECE', 'CSE', 'MECH']);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [allYears] = useState(['1', '2', '3', '4']);
  const [yearOptions, setYearOptions] = useState([]);
  const [allSections] = useState(['A', 'B', 'C']);
  const [allSubjects, setAllSubjects] = useState([]);
  const [users, setUsers] = useState([]);

  // Student add states
  const [studentReg, setStudentReg] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPass, setStudentPass] = useState("");
  const [studentDegree, setStudentDegree] = useState("");
  const [studentYear, setStudentYear] = useState("");
  const [studentDept, setStudentDept] = useState("");
  const [studentSection, setStudentSection] = useState("");
  const [studentDOB, setStudentDOB] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");

  // Staff add states
  const [staffId, setStaffId] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffPass, setStaffPass] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffDepartment, setStaffDepartment] = useState("");
  const [staffDesignation, setStaffDesignation] = useState("");

  // Staff assignment states
  const [assignStaffId, setAssignStaffId] = useState("");
  const [assignStaffName, setAssignStaffName] = useState("");
  const [assignDept, setAssignDept] = useState("");
  const [assignYear, setAssignYear] = useState("");
  const [assignSection, setAssignSection] = useState("");
  const [assignSubject, setAssignSubject] = useState("");

  // Notification states
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationTarget, setNotificationTarget] = useState('student');

  const canvasRef = useRef(null);

  // Mock admin data
  const adminData = {
    adminId: "ADM001",
    name: "Admin User",
    designation: "Administrator"
  };

  // Adjusted mock today's attendance data
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
    { regNo: "EC011", status: false },
    { regNo: "EC012", status: true, late: true },
    { regNo: "EC013", status: true },
    { regNo: "EC014", status: false },
    { regNo: "EC015", status: true },
    { regNo: "EC016", status: true },
    { regNo: "EC017", status: false },
    { regNo: "EC018", status: true },
    { regNo: "EC019", status: true, late: true },
    { regNo: "EC020", status: false },
  ]);

  // Calculate attendance stats
  // const totalStudents = todayAttendanceData.length;
  // const presentCount = todayAttendanceData.filter(s => s.status).length;
  // const lateCount = todayAttendanceData.filter(s => s.late && s.status).length;
  // const absentCount = totalStudents - presentCount;
  // const livecount = presentCount + lateCount;


  const totalStudents = todayAttendanceData.length; // Total number of students
const presentCount = todayAttendanceData.filter(s => s.status && !s.late).length; // Only on-time present students (green)
const lateCount = todayAttendanceData.filter(s => s.late && s.status).length; // Latecomers (orange)
const absentCount = todayAttendanceData.filter(s => !s.status ).length; // Absent students (red)
const liveCount = presentCount + lateCount; // Total present students (on-time + late)

  // Mock subject-wise percentage
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
  const [studentsData, setStudentsData] = useState([
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
  ]);

  // Mock insights
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
      document.title = "Attenitix - Admin Dashboard";
    }, []);

  useEffect(() => {
    if (token) setAuthToken(token);
    fetchUsers();
    fetchStaffList();
    setNotifications(mockNotifications);
    fetchFilteredData();
  }, [selectedDepartment, selectedYear, selectedSection, selectedSubject, selectedStaff, filterType, token]);

  useEffect(() => {
    const departmentMap = {
      'BE/BTech': ['ECE', 'CSE', 'MECH'],
      'ME/MTech': ['ECE', 'CSE', 'MECH'],
      'MCA': ['Computer Applications'],
      'MBA': ['Business Administration'],
    };
    setDepartmentOptions(departmentMap[studentDegree] || []);

    const yearMap = {
      'BE/BTech': ['1', '2', '3', '4'],
      'ME/MTech': ['1', '2'],
      'MCA': ['1', '2', '3'],
      'MBA': ['1', '2'],
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
        { regNo: "EC011", status: false },
        { regNo: "EC012", status: true, late: true },
        { regNo: "EC013", status: true },
        { regNo: "EC014", status: false },
        { regNo: "EC015", status: true },
        { regNo: "EC016", status: true },
        { regNo: "EC017", status: false },
        { regNo: "EC018", status: true },
        { regNo: "EC019", status: true, late: true },
        { regNo: "EC020", status: false },
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
  if (!studentReg || !studentName || !studentPass || !studentDegree || !studentYear || !studentDept || !studentSection || !studentDOB || !studentEmail || !studentPhone) {
    return alert("Please fill all student fields");
  }
  try {
    await api.post("/api/admin/add-student", {
      studentReg,
      name: studentName,
      password: studentPass,
      degree: studentDegree,
      year: studentYear,
      department: studentDept,
      section: studentSection,
      dob: studentDOB,
      email: studentEmail,
      phone: studentPhone
    });
    alert("Student added");
    setStudentReg(""); setStudentName(""); setStudentPass("");
    setStudentDegree(""); setStudentYear(""); setStudentDept(""); setStudentSection("");
    setStudentDOB(""); setStudentEmail(""); setStudentPhone("");
    fetchUsers();
  } catch (err) {
    alert(err?.response?.data?.error || "Failed");
  }
}

async function addStaff() {
  if (!staffId || !staffName || !staffPass || !staffEmail || !staffPhone || !staffDepartment || !staffDesignation) {
    return alert("Please fill all staff fields");
  }
  try {
    await api.post("/api/admin/add-staff", {
      staffId,
      name: staffName,
      password: staffPass,
      email: staffEmail,
      phone: staffPhone,
      department: staffDepartment,
      designation: staffDesignation
    });
    alert("Staff added");
    setStaffId(""); setStaffName(""); setStaffPass(""); setStaffEmail(""); setStaffPhone(""); setStaffDepartment(""); setStaffDesignation("");
    fetchUsers(); fetchStaffList();
  } catch (err) {
    alert(err?.response?.data?.error || "Failed");
  }
}

async function assignStaff() {
  if (!assignStaffId || !assignDept || !assignYear || !assignSection || !assignSubject) {
    return alert("Please fill all fields");
  }
  try {
    await api.post("/api/admin/assign-staff", {
      staffId: assignStaffId,
      staffName: assignStaffName,
      department: assignDept,
      year: assignYear,
      section: assignSection,
      subject: assignSubject
    });
    alert("Staff assigned successfully");
    setAssignStaffId(""); setAssignStaffName(""); setAssignDept(""); setAssignYear(""); setAssignSection(""); setAssignSubject("");
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

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
      label: labels[i]
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
      ctx.fillText(
        combinedAttendanceData.monthly.months?.[currentWeek]?.name || 'Month',
        width / 2,
        height - padding + 40
      );
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach(point => ctx.lineTo(point.x, point.y));
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

    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  // Profile Popup Component
  const ProfilePopup = memo(() => (
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
  ));

  // Student Popup Component
  const StudentPopup = memo(() => {
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
            className={`${styles.closeBtn} ${styles.redCloseBtn}`} 
            onClick={() => { setShowStudentPopup(false); setSelectedStudent(null); }}
          >
            Close
          </button>
        </div>
      </div>
    );
  });

  // Notifications Component
  const Notifications = memo(() => (
    <div className={styles.notificationsSection}>
      <div className={styles.notificationBell} onClick={() => setShowNotifications(!showNotifications)}>
        🔔
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </div>
      <div className={`${styles.notificationsPopup} ${showNotifications ? styles.active : ''}`}>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div key={notification.id} className={`${styles.notificationItem} ${notification.read ? '' : styles.unread}`}>
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
  ));

  // Today's Attendance Component
  const TodayAttendance = memo(() => (
    <div className={styles.todayAttendance}>
      <h3>Today's Student Attendance</h3>
      <div className={styles.attendanceStats}>
        <p>Total Students: {totalStudents}</p>
        <p>Present: {presentCount}</p>
        <p>Live Headcount: {liveCount}</p>
        <p>Latecomers: {lateCount}</p>
        <p>Absent: {absentCount}</p>
      </div>
      <div className={styles.attendanceGrid}>
        {todayAttendanceData.map((student, index) => (
          <div key={student.regNo} className={styles.studentIcon}>
            <div
              className={`${styles.icon} ${student.status ? (student.late ? styles.late : styles.present) : styles.absent}`}
              style={{ backgroundImage: `url(https://static.thenounproject.com/png/1594252-200.png)`, backgroundSize: 'cover' }}
            >
              {student.late && <span className={styles.tooltip}>Late Comer</span>}
            </div>
            <span>{student.regNo}</span>
          </div>
        ))}
      </div>
    </div>
  ));

  // Subject Wise Percentage Component
  const SubjectWisePercentage = memo(() => (
    <div className={styles.subjectPerformance}>
      <h3>Subject-wise Average Attendance</h3>
      <div className={styles.subjectsGrid}>
        {subjectStats.map((subject, index) => (
          <div key={subject.name} className={styles.subjectCard}>
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
  ));

  // Combined Attendance Chart Component
  const CombinedAttendanceChart = memo(() => {
    const handlePrev = () => setCurrentWeek(prev => Math.max(prev - 1, 0));
    const handleNext = () => setCurrentWeek(prev => prev + 1);

    useEffect(() => {
      if (activeTab === 'attendance' && canvasRef.current) {
        drawChart();
      }
    }, [activeTab, timeFilter, currentWeek, selectedSubject]);

    return (
      <div className={styles.attendanceChart}>
        <div className={styles.chartHeader}>
          <h3>{timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Combined Attendance</h3>
          <div className={styles.filters}>
            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className={styles.filterSelect}>
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
        <div className={styles.chartContainer}>
          <canvas ref={canvasRef} width={800} height={350} />
        </div>
      </div>
    );
  });

  // Marks Table Component
  const MarksTable = memo(() => (
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
          {studentsData.map((student) => (
            <tr key={student.regNo} className={student.marks.sem < 50 ? styles.fail : ''}>
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
  ));

  // Academic Insights Component
  const AcademicInsights = memo(() => (
    <div className={styles.academicInsights}>
      <h3>Academic Insights</h3>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h4 style={{ fontSize: '1rem', color: '#bfdbfe', marginBottom: '0.8rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>Attendance Insights</h4>
          <ul className={styles.insightsList} style={{ listStyle: 'none', padding: 0 }}>
            {attendanceInsights.map((insight, index) => (
              <li key={index} style={{ marginBottom: '0.8rem', padding: '0.8rem', background: '#374151', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {insight.message}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h4 style={{ fontSize: '1rem', color: '#bfdbfe', marginBottom: '0.8rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>Marks Insights</h4>
          <ul className={styles.insightsList} style={{ listStyle: 'none', padding: 0 }}>
            {marksInsights.map((insight, index) => (
              <li key={index} style={{ marginBottom: '0.8rem', padding: '0.8rem', background: '#374151', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                
                {insight.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ));

  // Students List Component
  const StudentsList = memo(() => (
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
          {studentsData.map((student) => (
            <tr key={student.regNo} onClick={() => { setSelectedStudent(student); setShowStudentPopup(true); }} style={{ cursor: 'pointer' }}>
              <td>{student.regNo}</td>
              <td>{student.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ));

  // All Users Component
  const AllUsers = memo(() => (
    <div className={styles.marksTable}>
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
  ));

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
          <br/>
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
                    </div>
                  </div>
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

          {activeTab === 'marks' && <MarksTable />}

          {activeTab === 'analysis' && <AcademicInsights />}

          {activeTab === 'students' && <StudentsList />}

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

          {activeTab === 'allUsers' && <AllUsers />}
        </div>
      </div>

      {showProfilePopup && <ProfilePopup />}
      {showStudentPopup && <StudentPopup />}
      <Notifications />
    </div>
  );
};

export default AdminDashboard;