// src/components/Shared/Notifications.jsx
import React from 'react';
import styles from '../../styles/StaffDashboard.module.css';

const Notifications = ({
  notifications,
  showNotifications,
  setShowNotifications,
  unreadCount,
  markAsRead,
  deleteNotification
}) => {

  const toggle = (e) => {
    e.stopPropagation();                 // ← Critical
    setShowNotifications(prev => !prev);
  };

  return (
    <div className={styles.notificationsSection} onClick={e => e.stopPropagation()}>
      
      {/* Bell Icon */}
      <div className={styles.notificationBell} onClick={toggle}>
        🔔
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </div>

      {/* Dropdown - only render when open */}
      {showNotifications && (
        <div className={styles.notificationsPopup}>
          {notifications.length === 0 ? (
            <p className={styles.noNotifications}>No notifications</p>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className={`${styles.notificationItem} ${notif.read ? '' : styles.unread}`}>
                <div className={styles.notificationContent}>
                  <span className={`${styles.notificationIcon} ${styles[notif.type]}`}>
                    {notif.type === 'low-attendance' ? '⚠️' : 
                 notif.type === 'exam' ? '📝' : 
                 notif.type === 'fail' ? '🚫' : 
                 notif.type === 'meeting' ? '🗓️' : '🔄'}
                    {!['low-attendance','exam','meeting','fail'].includes(notif.type) && 'Update'}
                  </span>
                  <div>
                    <p className={styles.notificationMessage}>{notif.message}</p>
                    <small className={styles.notificationDate}>{notif.date}</small>
                  </div>
                </div>

                <div className={styles.notificationActions}>
                  {!notif.read && (
                    <button onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}>
                      ✓
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}>
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;