import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/StudentDashboard.module.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedSemester, setSelectedSemester] = useState(7);
  const [timeFilter, setTimeFilter] = useState('day');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Mock student data
  const studentData = {
    name: "Gunasekaran K",
    regNumber: "6176AC22UEC036",
    class: "B.E",
    department: "ECE",
    year: "4",
    section: "A",
    semester: 7
  };

  // Mock attendance data
  const attendanceData = {
    today: [true, false, true, true, true, false, true], // 7 periods
    day: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      data: [85, 92, 78, 95, 88, 70]
    },
    week: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [82, 88, 85, 90]
    },
    month: {
      labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
      data: [82, 85, 88, 90, 87, 89]
    },
    semester: {
      overall: 87.5,
      subjects: [
        { name: 'Web Development', percentage: 92 },
        { name: 'Data Structures', percentage: 85 },
        { name: 'Operating Systems', percentage: 82 },
        { name: 'Software Engineering', percentage: 88 },
        { name: 'Internet of Things', percentage: 82 },
        { name: 'Sensors & Actuators', percentage: 88 }
      ]
    }
  };

  // Mock academic data
  const academicData = {
    subjects: [
      {
        name: 'Web Dev',
        marks: {
          ut1: 45, ut2: 42, ut3: 48,
          model1: 85,
          sem: 90
        }
      },
      {
        name: 'Data Structures',
        marks: {
          ut1: 38, ut2: 40, ut3: 42,
          model1: 78,
          sem: 83
        }
      },
      {
        name: 'Database',
        marks: {
          ut1: 25, ut2: 22, ut3: 20,
          model1: 45,
          sem: 49
        }
      }
    ]
  };

  // Mock notifications data
  const mockNotifications = [
    { id: 1, type: 'absent', message: 'You were marked absent in Web Development on Monday', date: '2023-10-23', read: false },
    { id: 2, type: 'low-attendance', message: 'Your attendance in Data Structures is below 75%', date: '2023-10-22', read: false },
    { id: 3, type: 'exam', message: 'Web Development exam is tomorrow', date: '2023-10-21', read: true },
    { id: 4, type: 'fail', message: 'You failed in Database Systems', date: '2023-10-20', read: false },
    { id: 5, type: 'absent', message: 'You were marked absent in Operating Systems on Friday', date: '2023-10-19', read: true }
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

  // Generate calendar data for GitHub-like attendance
  const generateCalendarData = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    const calendar = [];
    let day = 1;
    
    // Create empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendar.push({ day: null, present: null });
    }
    
    // Fill in the days of the month with random attendance data
    for (let i = 1; i <= daysInMonth; i++) {
      // Randomly assign attendance (70% chance of being present)
      const present = Math.random() > 0.3;
      calendar.push({ day: i, present });
    }
    
    return calendar;
  };

  const [calendarData, setCalendarData] = useState(generateCalendarData());

  // Update calendar when month/year changes
  useEffect(() => {
    setCalendarData(generateCalendarData());
  }, [currentMonth, currentYear]);

  // Navigate to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Navigate to previous week
  const prevWeek = () => {
    // In a real app, this would fetch previous week's data
    alert("Fetching previous week's data...");
  };

  // Navigate to next week
  const nextWeek = () => {
    // In a real app, this would fetch next week's data
    alert("Fetching next week's data...");
  };

  const prevSemester = () => setSelectedSemester(Math.max(1, selectedSemester - 1));
  const nextSemester = () => setSelectedSemester(Math.min(8, selectedSemester + 1));

  // Profile Popup Component
  const ProfilePopup = () => (
    <div className={styles.profilePopupOverlay}>
      <div className={styles.profilePopup}>
        <h3>Student Profile</h3>
        <div className={styles.profileInfo}>
          <p><strong>Name:</strong> {studentData.name}</p>
          <p><strong>Reg Number:</strong> {studentData.regNumber}</p>
          <p><strong>Class:</strong> {studentData.class}</p>
          <p><strong>Department:</strong> {studentData.department}</p>
          <p><strong>Year:</strong> {studentData.year}</p>
          <p><strong>Section:</strong> {studentData.section}</p>
        </div>
        <div className={styles.profileActions}>
          <button className={styles.changePasswordBtn}>Change Password</button>
          <button className={styles.logoutBtn}>Logout</button>
        </div>
        <button className={styles.closeBtn} onClick={() => setShowProfilePopup(false)}>Close</button>
      </div>
    </div>
  );

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
                  {notification.type === 'absent' ? '❌' : 
                   notification.type === 'low-attendance' ? '⚠️' : 
                   notification.type === 'exam' ? '📝' : '🚫'}
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

  // Today's Attendance Component
  const TodayAttendance = () => (
    <div className={styles.todayAttendance}>
      <h3>Today's Attendance</h3>
      <div className={styles.periodsContainer}>
        {attendanceData.today.map((present, index) => (
          <div key={index} className={styles.periodDot}>
            <div className={`${styles.dot} ${present ? styles.present : styles.absent}`}>
              {index + 1}
            </div>
            <span>P{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Attendance Chart Component with Canvas
  const AttendanceChart = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const data = timeFilter === 'day' ? attendanceData.day.data : timeFilter === 'week' ? attendanceData.week.data : attendanceData.month.data;
      const labels = timeFilter === 'day' ? attendanceData.day.labels : timeFilter === 'week' ? attendanceData.week.labels : attendanceData.month.labels;
      const barWidth = canvas.width / (data.length * 3); // Increased multiplier to reduce bar width
      const maxHeight = canvas.height - 40; // Reserve space for labels
      const maxData = Math.max(...data);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bars
      data.forEach((value, index) => {
        const height = (value / maxData) * maxHeight;
        const x = index * (barWidth * 3) + 20; // Add spacing
        const y = canvas.height - height - 20; // 20px padding at bottom

        // Draw bar
        ctx.fillStyle = 'rgba(99, 102, 241, 0.8)';
        ctx.fillRect(x, y, barWidth, height);

        // Add border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, height);

        // Add label below bar
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x + barWidth / 2, canvas.height - 5);

        // Add percentage on top
        ctx.fillText(`${value}%`, x + barWidth / 2, y - 5);
      });

      // Draw axes
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.moveTo(10, 10);
      ctx.lineTo(10, canvas.height - 20);
      ctx.lineTo(canvas.width - 10, canvas.height - 20);
      ctx.stroke();

    }, [timeFilter]);

    const prevPeriod = () => {
      if (timeFilter === 'day') {
        prevWeek();
      } else if (timeFilter === 'week') {
        prevMonth();
      } else {
        prevSemester();
      }
    };

    const nextPeriod = () => {
      if (timeFilter === 'day') {
        nextWeek();
      } else if (timeFilter === 'week') {
        nextMonth();
      } else {
        nextSemester();
      }
    };

    return (
      <div className={styles.attendanceChart}>
        <div className={styles.chartHeader}>
          <button className={styles.navBtn} onClick={prevPeriod}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3>{timeFilter === 'day' ? 'Day-wise' : timeFilter === 'week' ? 'Week-wise' : 'Month-wise'} Attendance</h3>
          <button className={styles.navBtn} onClick={nextPeriod}>
            <i className="fas fa-chevron-right"></i>
          </button>
          <div className={styles.timeFilter}>
            <label>View:</label>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="day">Day-wise</option>
              <option value="week">Week-wise</option>
              <option value="month">Month-wise</option>
            </select>
          </div>
        </div>
        <canvas ref={canvasRef} width={600} height={300} style={{ width: '100%', height: 'auto' }} />
      </div>
    );
  };

  // Subject Performance Component
  const SubjectPerformance = () => (
    <div className={styles.subjectPerformance}>
      <h3>Subject-wise Performance</h3>
      <div className={styles.subjectsGrid}>
        {attendanceData.semester.subjects.map((subject, index) => (
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

  // GitHub-like Calendar Component with Black Absent Numbers
  const GitHubCalendar = () => (
    <div className={styles.githubCalendar}>
      <h3>Attendance Calendar</h3>
      <div className={styles.calendarHeader}>
        <button className={styles.navBtn} onClick={timeFilter === 'day' ? prevWeek : prevMonth}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <span className={styles.currentPeriod}>
          {timeFilter === 'day' ? 'Week of Oct 23, 2023' : 
           `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`}
        </span>
        <button className={styles.navBtn} onClick={timeFilter === 'day' ? nextWeek : nextMonth}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      <div className={styles.calendarGrid}>
        {calendarData.map((day, index) => (
          <div 
            key={index} 
            className={`${styles.calendarDay} ${day.present === null ? styles.empty : day.present ? styles.present : styles.absent}`}
            title={day.day ? `Day ${day.day}: ${day.present ? 'Present' : 'Absent'}` : ''}
          >
            <span style={{ color: day.present === false ? 'black' : 'inherit' }}>{day.day || ''}</span>
          </div>
        ))}
      </div>
      <div className={styles.calendarLegend}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor + ' ' + styles.present}></span>
          <span>Present</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor + ' ' + styles.absent}></span>
          <span>Absent</span>
        </div>
      </div>
    </div>
  );

  // Marks Table Component with Semester Dropdown
  const MarksTable = () => (
    <div className={styles.marksTable}>
      <div className={styles.contentHeader}>
        <h3>Subject-wise Marks</h3>
        <div className={styles.semesterFilter}>
          <label>Semester:</label>
          <select 
            value={selectedSemester} 
            onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
            className={styles.filterSelect}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>UT1</th>
            <th>UT2</th>
            <th>UT3</th>
            <th>Model1</th>
            <th>Sem</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {academicData.subjects.map((subject, index) => (
            <tr key={index} className={subject.marks.sem < 50 ? styles.fail : ''}>
              <td>{subject.name}</td>
              <td className={subject.marks.ut1 >= 25 ? styles.pass : styles.fail}>{subject.marks.ut1}/50</td>
              <td className={subject.marks.ut2 >= 25 ? styles.pass : styles.fail}>{subject.marks.ut2}/50</td>
              <td className={subject.marks.ut3 >= 25 ? styles.pass : styles.fail}>{subject.marks.ut3}/50</td>
              <td className={subject.marks.model1 >= 50 ? styles.pass : styles.fail}>{subject.marks.model1}/100</td>
              <td className={subject.marks.sem >= 50 ? styles.pass : styles.fail}>{subject.marks.sem}/100</td>
              <td>
                <span className={`${styles.status} ${subject.marks.sem >= 50 ? styles.pass : styles.fail}`}>
                  {subject.marks.sem >= 50 ? 'Pass' : 'Fail'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Overall Attendance Percentage Component
  const OverallAttendance = () => (
    <div className={styles.overallAttendance}>
      <div className={styles.attendanceCircle}>
        <div 
          className={styles.circleProgress}
          style={{
            background: `conic-gradient(#4CAF50 ${attendanceData.semester.overall * 3.6}deg, #e0e0e0 0deg)`
          }}
        >
          <span className={styles.percentage}>{attendanceData.semester.overall}%</span>
        </div>
      </div>
      <div className={styles.attendanceInfo}>
        <h4>Overall Attendance</h4>
        <p>Semester {selectedSemester}</p>
      </div>
    </div>
  );

  return (
    <div className={styles.studentDashboard}>
      <div className={styles.container}>
        {/* Left Sidebar - 25% */}
        <div className={styles.sidebar}>
          <div 
            className={styles.profileSection}
            onClick={() => setShowProfilePopup(true)}
          >
            <div className={styles.profileAvatar}>
              {studentData.name.charAt(0)}
            </div>
            <div className={styles.profileInfo}>
              <h3>{studentData.name}</h3>
              <p>{studentData.regNumber}</p>
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
              className={`${styles.tabBtn} ${activeTab === 'academic' ? styles.active : ''}`}
              onClick={() => setActiveTab('academic')}
            >
              <i className="fas fa-book"></i> Academic Details
            </button>
          </div>

          <Notifications />
        </div>

        {/* Right Content - 75% */}
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
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
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
              <GitHubCalendar />
            </>
          ) : (
            <>
              <div className={styles.contentHeader}>
                <h2>Academic Performance</h2>
              </div>

              <MarksTable />
            </>
          )}
        </div>
      </div>

      {showProfilePopup && <ProfilePopup />}
    </div>
  );
};

export default StudentDashboard;