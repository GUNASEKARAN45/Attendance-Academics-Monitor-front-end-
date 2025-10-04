import React, { useState, useEffect, useRef, memo } from 'react';
import styles from '../styles/StudentDashboard.module.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedSemester, setSelectedSemester] = useState(7);
  const [timeFilter, setTimeFilter] = useState('day');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // September (8) as of 2025-09-30
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // 2025
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [showTodoPopup, setShowTodoPopup] = useState(false);

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
      data: [
        [true, false, true, true, true, false, true],
        [true, true, true, false, true, true, true],
        [false, true, true, true, false, true, true],
        [true, true, true, true, true, true, false],
        [true, false, true, true, true, true, true],
        [true, true, false, true, true, true, false]
      ]
    },
    week: {
      months: [
        {
          name: 'September',
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [82, 88, 85, 90]
        },
        {
          name: 'October',
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [78, 85, 82, 87]
        }
      ]
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
        marks: { ut1: 45, ut2: 42, ut3: 48, model1: 85, sem: 90 }
      },
      {
        name: 'Data Structures',
        marks: { ut1: 38, ut2: 40, ut3: 42, model1: 78, sem: 83 }
      },
      {
        name: 'Database',
        marks: { ut1: 25, ut2: 22, ut3: 20, model1: 45, sem: 49 }
      }
    ]
  };

  // Mock notifications data
  const mockNotifications = [
    { id: 1, type: 'absent', message: 'You were marked absent in Web Development on Monday', date: '2025-09-29', read: false },
    { id: 2, type: 'low-attendance', message: 'Your attendance in Data Structures is below 75%', date: '2025-09-28', read: false },
    { id: 3, type: 'exam', message: 'Web Development exam is tomorrow', date: '2025-09-30', read: true },
    { id: 4, type: 'fail', message: 'You failed in Database Systems', date: '2025-09-27', read: false },
    { id: 5, type: 'absent', message: 'You were marked absent in Operating Systems on Friday', date: '2025-09-26', read: true }
  ];

  // Mock exam data with exam type
  const exams = [
    { id: 1, subject: 'Web Development', date: '2025-10-05', type: 'Semester', status: 'upcoming' },
    { id: 2, subject: 'Data Structures', date: '2025-09-28', type: 'UT', status: 'finished' },
    { id: 3, subject: 'Operating Systems', date: '2025-10-10', type: 'Model', status: 'upcoming' },
    { id: 4, subject: 'Software Engineering', date: '2025-09-20', type: 'UT', status: 'finished' },
    { id: 5, subject: 'Internet of Things', date: '2025-10-15', type: 'Semester', status: 'upcoming' }
  ];
useEffect(() => {
          document.title = "Attenitix - Student Dashboard";
        }, []);

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
      notification.id === id ? { ...notification, read: true } : notification
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
    
    for (let i = 0; i < firstDay; i++) {
      calendar.push({ day: null, present: null });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isSunday = date.getDay() === 0;
      const present = isSunday ? null : Math.random() > 0.3;
      calendar.push({ day: i, present, isSunday });
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

  const prevSemester = () => setSelectedSemester(Math.max(1, selectedSemester - 1));
  const nextSemester = () => setSelectedSemester(Math.min(8, selectedSemester + 1));

  // To-Do List Functions
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = () => {
    setTodos(todos.map(todo => 
      todo.id === editingId ? { ...todo, text: editingText } : todo
    ));
    setEditingId(null);
    setEditingText('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

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

  // Memoized To-Do Popup Component
  const TodoPopup = memo(() => {
    const inputRef = useRef(null);

    // Focus input when adding a new todo
    useEffect(() => {
      if (inputRef.current && !editingId) {
        inputRef.current.focus();
      }
    }, [newTodo, editingId]);

    return (
      <div className={styles.profilePopupOverlay}>
        <div className={styles.todoPopup}>
          <h3>To-Do List</h3>
          <div className={styles.todoInput}>
            <input 
              ref={inputRef}
              type="text" 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add new task..."
              className={styles.input}
            />
            <button onClick={addTodo} className={styles.addBtn}>Add</button>
          </div>
          <div className={styles.todoList}>
            {todos.map(todo => (
              <div key={todo.id} className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
                {editingId === todo.id ? (
                  <input 
                    type="text" 
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className={styles.editInput}
                    autoFocus
                  />
                ) : (
                  <span onClick={() => toggleComplete(todo.id)} className={styles.todoText}>
                    {todo.text}
                  </span>
                )}
                <div className={styles.todoActions}>
                  {editingId === todo.id ? (
                    <button onClick={saveEdit} className={styles.saveBtn}>Save</button>
                  ) : (
                    <button onClick={() => startEdit(todo.id, todo.text)} className={styles.editBtn}>Edit</button>
                  )}
                  <button onClick={() => deleteTodo(todo.id)} className={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            ))}
            {todos.length === 0 && <p className={styles.noExams}>No tasks yet</p>}
          </div>
          <button className={styles.closeBtn} onClick={() => setShowTodoPopup(false)}>Close</button>
        </div>
      </div>
    );
  });

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

  // Attendance Chart Component
  const AttendanceChart = () => {
    const canvasRef = useRef(null);
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
    const [animationProgress, setAnimationProgress] = useState(0);
    const [weekIndex, setWeekIndex] = useState(0); // Start with September

    useEffect(() => {
      // Reset animation progress
      setAnimationProgress(0);

      const animate = () => {
        setAnimationProgress((prev) => Math.min(prev + 0.02, 1));
      };

      const animationFrame = requestAnimationFrame(function loop() {
        animate();
        if (animationProgress < 1) {
          requestAnimationFrame(loop);
        }
      });

      return () => cancelAnimationFrame(animationFrame);
    }, [timeFilter, weekIndex]);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      const padding = 60; // Increased for month name below x-axis

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Calculate attendance percentages
      let labels, dataPoints;
      if (timeFilter === 'day') {
        labels = attendanceData.day.labels;
        dataPoints = attendanceData.day.data.map(day => {
          const presentCount = day.filter(p => p).length;
          return (presentCount / day.length) * 100;
        });
      } else {
        labels = attendanceData.week.months[weekIndex].labels;
        dataPoints = attendanceData.week.months[weekIndex].data;
      }

      const dataLength = labels.length;
      const pointSpacing = (width - padding * 2) / (dataLength - 1);
      const maxAttendance = 100; // Max percentage
      const points = dataPoints.map((value, i) => ({
        x: padding + i * pointSpacing,
        y: height - padding - (value / maxAttendance) * (height - padding * 2),
        value,
        label: labels[i]
      }));

      // Draw grid lines
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

      // Draw labels
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px Inter';
      ctx.textAlign = 'center';
      points.forEach((point, i) => {
        ctx.fillText(labels[i], point.x, height - padding + 20);
      });
      if (timeFilter === 'week') {
        ctx.font = 'bold 12px Inter';
        ctx.fillText(
          attendanceData.week.months[weekIndex].name,
          width / 2,
          height - padding + 40
        );
      }

      // Draw animated line and filled area
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length * animationProgress; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const xc = (prev.x + curr.x) / 2;
        const yc = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
      }
      if (animationProgress >= 1) {
        ctx.quadraticCurveTo(
          points[points.length - 1].x,
          points[points.length - 1].y,
          points[points.length - 1].x,
          points[points.length - 1].y
        );
      }
      ctx.lineTo(points[Math.floor((points.length - 1) * animationProgress)].x, height - padding);
      ctx.lineTo(points[0].x, height - padding);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length * animationProgress; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const xc = (prev.x + curr.x) / 2;
        const yc = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
      }
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points
      points.forEach((point, i) => {
        if (i <= points.length * animationProgress) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Handle tooltips
      const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let closestPoint = null;
        let minDistance = Infinity;
        points.forEach(point => {
          const distance = Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2);
          if (distance < minDistance && distance < 15) {
            minDistance = distance;
            closestPoint = point;
          }
        });

        if (closestPoint) {
          setTooltip({
            visible: true,
            x: closestPoint.x,
            y: closestPoint.y - 20,
            content: `${closestPoint.label}: ${closestPoint.value.toFixed(1)}%`
          });
        } else {
          setTooltip({ visible: false, x: 0, y: 0, content: '' });
        }
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', () => setTooltip({ visible: false, x: 0, y: 0, content: '' }));

      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', () => setTooltip({ visible: false, x: 0, y: 0, content: '' }));
      };
    }, [timeFilter, animationProgress, weekIndex]);

    return (
      <div className={styles.attendanceChart}>
        <div className={styles.chartHeader}>
          <h3>{timeFilter === 'day' ? 'Day-wise Attendance' : 'Week-wise Attendance'}</h3>
          <div className={styles.chartControls}>
            {timeFilter === 'week' && (
              <div className={styles.weekNav}>
                <button
                  onClick={() => setWeekIndex(prev => Math.max(0, prev - 1))}
                  disabled={weekIndex === 0}
                  className={styles.navBtn}
                >
                  &larr;
                </button>
                <span>{attendanceData.week.months[weekIndex].name}</span>
                <button
                  onClick={() => setWeekIndex(prev => Math.min(attendanceData.week.months.length - 1, prev + 1))}
                  disabled={weekIndex === attendanceData.week.months.length - 1}
                  className={styles.navBtn}
                >
                  &rarr;
                </button>
              </div>
            )}
            <div className={styles.timeFilter}>
              <label>View:</label>
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="day">Day-wise</option>
                <option value="week">Week-wise</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <canvas ref={canvasRef} width={800} height={280} />
          {tooltip.visible && (
            <div
              className={styles.tooltip}
              style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
            >
              {tooltip.content}
            </div>
          )}
        </div>
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
                style={{ background: `conic-gradient(#10b981 ${subject.percentage * 3.6}deg, #e0e0e0 0deg)` }}
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

  // GitHubCalendar Component
  const GitHubCalendar = () => (
    <div className={styles.githubCalendar}>
      <h3>Attendance Calendar</h3>
      <div className={styles.calendarHeader}>
        <button className={styles.navBtn} onClick={prevMonth}>
          <span className={styles.navIcon}>&larr;</span>
        </button>
        <span className={styles.currentPeriod}>
          {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
        </span>
        <button className={styles.navBtn} onClick={nextMonth}>
          <span className={styles.navIcon}>&rarr;</span>
        </button>
      </div>
      <div className={styles.calendarGrid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className={styles.calendarDayLabel}>{day}</div>
        ))}
        {calendarData.map((day, index) => (
          <div 
            key={index} 
            className={`${styles.calendarDay} ${day.present === null ? styles.empty : day.isSunday ? styles.holiday : day.present ? styles.present : styles.absent}`}
            title={day.day ? `Day ${day.day}: ${day.isSunday ? 'Holiday' : day.present ? 'Present' : 'Absent'}` : ''}
          >
            <span>{day.day || ''}</span>
          </div>
        ))}
      </div>
      <div className={styles.calendarLegend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.present}`}></span>
          <span>Present</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.absent}`}></span>
          <span>Absent</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.holiday}`}></span>
          <span>Holiday</span>
        </div>
      </div>
    </div>
  );

  // MarksTable Component
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

  // ExamSchedule Component
  const ExamSchedule = () => {
    const upcomingExams = exams.filter(exam => exam.status === 'upcoming');
    const finishedExams = exams.filter(exam => exam.status === 'finished');

    return (
      <div className={styles.examSchedule}>
        <div className={styles.contentHeader}>
          <h2>Exam Schedule</h2>
          <button 
            className={styles.todoBtn}
            onClick={() => setShowTodoPopup(true)}
            title="Manage To-Do List"
          >
            <span className={styles.todoIcon}>&#128203;</span>
            <p>Add your tasks here!</p>
          </button>
        </div>
        <div className={styles.examSection}>
          <h3>Upcoming Exams</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingExams.map(exam => (
                <tr key={exam.id} className={styles.upcoming}>
                  <td>{exam.date}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.type}</td>
                  <td>
                    <span className={`${styles.status} ${styles.upcoming}`}>
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {upcomingExams.length === 0 && (
                <tr>
                  <td colSpan="4" className={styles.noExams}>No upcoming exams</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.examSection}>
          <h3>Finished Exams</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {finishedExams.map(exam => (
                <tr key={exam.id} className={styles.finished}>
                  <td>{exam.date}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.type}</td>
                  <td>
                    <span className={`${styles.status} ${styles.finished}`}>
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {finishedExams.length === 0 && (
                <tr>
                  <td colSpan="4" className={styles.noExams}>No finished exams</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showTodoPopup && <TodoPopup />}
      </div>
    );
  };

  // OverallAttendance Component
  const OverallAttendance = () => (
    <div className={styles.overallAttendance}>
      <div className={styles.attendanceCircle}>
        <div 
          className={styles.circleProgress}
          style={{ background: `conic-gradient(#10b981 ${attendanceData.semester.overall * 3.6}deg, #e0e0e0 0deg)` }}
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
        {/* Sidebar */}
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

        {/* Content */}
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

      {showProfilePopup && <ProfilePopup />}
    </div>
  );
};

export default StudentDashboard;