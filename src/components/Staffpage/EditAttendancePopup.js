import React from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const EditAttendancePopup = ({ student, onClose, setTodayAttendanceData }) => {
  const handleStatusChange = (newStatus, isLate = false) => {
    setTodayAttendanceData(prev =>
      prev.map(s =>
        s.regNo === student.regNo
          ? { ...s, status: newStatus, late: isLate }
          : s
      )
    );
    onClose();
  };

  return (
    <div className={styles.studentPopupOverlay}>
      <div className={styles.studentPopup}>
        <h3>Edit Attendance for {student.regNo}</h3>
        <div className={styles.profileActions}>
          {student.status ? (
            <>
              <button
                className={styles.saveBtn}
                onClick={() => handleStatusChange(false)}
              >
                Mark as Absent
              </button>
              {student.late && (
                <button
                  className={styles.saveBtn}
                  onClick={() => handleStatusChange(true, false)}
                >
                  Mark as Present (Not Late)
                </button>
              )}
            </>
          ) : (
            <>
              <button
                className={styles.saveBtn}
                onClick={() => handleStatusChange(true, false)}
              >
                Mark as Present
              </button>
              <button
                className={styles.saveBtn}
                onClick={() => handleStatusChange(true, true)}
              >
                Mark as Late
              </button>
            </>
          )}
          <button
            className={`${styles.closeBtn} ${styles.redCloseBtn}`}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAttendancePopup;