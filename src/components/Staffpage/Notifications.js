import React from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const Notifications = ({ notifications, unreadCount, onDelete, onMarkAsRead }) => {
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
                  <button className={styles.markReadBtn} onClick={() => onMarkAsRead(notification.id)} title="Mark as read">✓</button>
                )}
                <button className={styles.deleteBtn} onClick={() => onDelete(notification.id)} title="Delete notification">×</button>
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