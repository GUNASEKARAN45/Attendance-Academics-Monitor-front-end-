import React, { memo } from 'react';
import styles from '../../styles/AdminDashboard.module.css';


const SendNotification = memo(({ 
  notificationTarget, setNotificationTarget, 
  notificationMessage, setNotificationMessage, 
  sendNotification 
}) => (
  <div className={styles.adminSection}>
    <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
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
      <button className={styles.saveBtn} onClick={sendNotification}>Send Notification</button>
    </div>
  </div>
));

export default SendNotification;