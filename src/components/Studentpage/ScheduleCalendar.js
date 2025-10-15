import React, { useState, useEffect } from 'react';
import styles from '../../styles/StudentDashboard.module.css';

const ScheduleCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(9); // October
  const [currentYear, setCurrentYear] = useState(2025);
  const [calendarData, setCalendarData] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date();

  const generateCalendarData = () => {
    const calendar = [];
    const firstDayDate = new Date(currentYear, currentMonth, 1);
    const firstDay = firstDayDate.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) calendar.push(null);
    for (let day = 1; day <= daysInMonth; day++) calendar.push(day);
    while (calendar.length % 7 !== 0) calendar.push(null);

    return calendar;
  };

  const generateMonthlyAttendance = () => {
    const data = {};
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d);
      const dateStr = date.toISOString().split('T')[0];
      const dow = date.getDay();
      if (dow === 0) continue; // skip Sundays
      const periods = Array.from({ length: 7 }, () => Math.random() > 0.2);
      data[dateStr] = { periods };
    }
    return data;
  };

  useEffect(() => {
    setCalendarData(generateCalendarData());
    setMonthlyAttendance(generateMonthlyAttendance());
  }, [currentMonth, currentYear]);

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

  // 🟢 Attendance Popup
  const DayAttendancePopup = () => {
    if (!selectedDate) return null;
    const dateStr = selectedDate.toISOString().split('T')[0];
    const attendance = monthlyAttendance[dateStr];
    const isFutureDate = selectedDate > today;

    return (
      <div className={styles.profilePopupOverlay} onClick={() => setSelectedDate(null)}>
        <div className={styles.profilePopup} onClick={(e) => e.stopPropagation()}>
          <h3>Attendance for {selectedDate.toLocaleDateString()}</h3>

          {isFutureDate ? (
            <p className={styles.futureText}>Classes not yet completed for this day.</p>
          ) : attendance ? (
            <div className={styles.periodsContainer}>
              {attendance.periods.map((present, index) => (
                <div key={index} className={styles.periodDot}>
                  <div className={`${styles.dot} ${present ? styles.present : styles.absent}`}>
                    {index + 1}
                  </div>
                  <span>P{index + 1}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No classes or data available for this day.</p>
          )}

          <button className={styles.closeBtn} onClick={() => setSelectedDate(null)}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.scheduleCalendar}>
      <h3>Month wise Attendance</h3>

      <div className={styles.calendarHeader}>
        <button className={styles.navBtn} onClick={prevMonth}>
          <span className={styles.navIcon}>&larr;</span>
        </button>
        <span className={styles.currentPeriod}>
          {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
        </span>
        <button className={styles.navBtn} onClick={nextMonth} disabled={!canGoNext()}>
          <span className={styles.navIcon}>&rarr;</span>
        </button>
      </div>

      <div className={styles.calendarGrid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
          <div key={dayName} className={styles.dayHeader}>{dayName}</div>
        ))}

        {calendarData.map((day, index) => {
          if (day === null) return <div key={index} className={styles.emptyCell} />;
          const dayDate = new Date(currentYear, currentMonth, day);
          const isToday = dayDate.toDateString() === today.toDateString();
          const isFuture = dayDate > today;
          const dateStr = dayDate.toISOString().split('T')[0];
          const attendance = monthlyAttendance[dateStr];

          let colorClass = '';
          if (!isFuture && attendance) {
            const presentCount = attendance.periods.filter((p) => p).length;
            const percentage = (presentCount / 7) * 100;
            colorClass = percentage >= 75 ? styles.present : percentage < 50 ? styles.absent : styles.partial;
          } else if (isFuture) {
            colorClass = styles.futureDay; // 👈 Optional gray style for future days
          }

          return (
            <div
              key={index}
              className={`${styles.dayCell} ${isToday ? styles.today : ''} ${colorClass}`}
              onClick={() => setSelectedDate(dayDate)}
              style={{ fontSize: '0.8rem', padding: '0.5rem', minHeight: '2rem' }}
            >
              <span className={styles.dayNumber}>{day}</span>
            </div>
          );
        })}
      </div>

      <DayAttendancePopup />
    </div>
  );
};

export default ScheduleCalendar;
