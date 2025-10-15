import React from 'react';
import styles from '../../styles/StudentDashboard.module.css';


const Notifications = () => {
  const mockNotifications = [
    { id: 1, type: 'absent', message: 'You were marked absent in Web Development on Monday', date: '2025-10-14', read: false },
    { id: 2, type: 'low-attendance', message: 'Your attendance in Data Structures is below 75%', date: '2025-10-14', read: false },
    { id: 3, type: 'exam', message: 'Web Development exam is tomorrow', date: '2025-10-13', read: true },
    { id: 4, type: 'fail', message: 'You failed in Database Systems', date: '2025-10-12', read: false },
    { id: 5, type: 'absent', message: 'You were marked absent in Operating Systems on Friday', date: '2025-10-11', read: true }
  ];

  const [notifications, setNotifications] = React.useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
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
};

export default Notifications;