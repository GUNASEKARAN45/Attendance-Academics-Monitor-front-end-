import React, { memo } from 'react';
import styles from '../../styles/AdminDashboard.module.css';


const Notifications = memo((props) => (
  <div className={styles.notificationsSection}>
    <div className={props.showNotifications ? styles.notificationBell : styles.notificationBell} onClick={() => props.setShowNotifications(!props.showNotifications)}>
      🔔
      {props.unreadCount > 0 && <span className={styles.badge}>{props.unreadCount}</span>}
    </div>
    <div className={`${styles.notificationsPopup} ${props.showNotifications ? styles.active : ''}`}>
      {props.notifications.length > 0 ? (
        props.notifications.map(notification => (
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
                  onClick={() => props.markAsRead(notification.id)}
                  title="Mark as read"
                >
                  ✓
                </button>
              )}
              <button 
                className={styles.deleteBtn}
                onClick={() => props.deleteNotification(notification.id)}
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

export default Notifications;