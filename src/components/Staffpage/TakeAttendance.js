import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import styles from '../../styles/StaffDashboard.module.css';

const TakeAttendance = ({ selectedDepartment, selectedYear, selectedSection, selectedSubject }) => {
  const [classType, setClassType] = useState('offline');
  const [period, setPeriod] = useState('Period 1');
  const [endTime, setEndTime] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [pairing, setPairing] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const cameras = ['Camera1 (MAC: 00:14:22:01:23:45) [ECE-A]', 'Camera2 (MAC: 00:14:22:01:23:46) [ECE-B]', 'Camera3 (MAC: 00:14:22:01:23:47) [CN LAB]'];
  const [endTimeOptions, setEndTimeOptions] = useState([]);

  const periodStartTimes = {
    'Period 1': { hour: 8, min: 30, ampm: 'AM' },
    'Period 2': { hour: 9, min: 25, ampm: 'AM' },
    'Period 3': { hour: 10, min: 30, ampm: 'AM' },
    'Period 4': { hour: 11, min: 25, ampm: 'AM' },
    'Period 5': { hour: 1, min: 20, ampm: 'PM' },
    'Period 6': { hour: 2, min: 15, ampm: 'PM' },
    'Period 7': { hour: 3, min: 5, ampm: 'PM' },
  };

  const periodOrder = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7'];

  const generateSessionToken = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  useEffect(() => {
    if (!sessionToken) {
      setSessionToken(generateSessionToken());
    }
  }, []);

  const addMinutesToTime = (hour, min, ampm, addMin) => {
    let totalMin = hour * 60 + min + addMin;
    let newHour = Math.floor(totalMin / 60) % 24;
    let newMin = totalMin % 60;
    let newAmpm = ampm;
    if (newHour >= 12) {
      newAmpm = 'PM';
      if (newHour > 12) newHour -= 12;
    } else {
      newAmpm = 'AM';
    }
    if (newHour === 0) newHour = 12;
    return `${newHour}:${newMin < 10 ? '0' + newMin : newMin} ${newAmpm}`;
  };

  useEffect(() => {
    const currentStart = periodStartTimes[period];
    const currentIndex = periodOrder.indexOf(period);
    const nextStart = currentIndex < periodOrder.length - 1 ? periodStartTimes[periodOrder[currentIndex + 1]] : { hour: 4, min: 0, ampm: 'PM' };

    let currentHour = currentStart.hour;
    if (currentStart.ampm === 'PM' && currentStart.hour !== 12) currentHour += 12;

    let nextHour = nextStart.hour;
    if (nextStart.ampm === 'PM' && nextStart.hour !== 12) nextHour += 12;

    const currentTotalMin = currentHour * 60 + currentStart.min;
    const nextTotalMin = nextHour * 60 + nextStart.min;

    const options = [];
    for (let time = currentTotalMin + 5; time < nextTotalMin; time += 5) {
      let optHour = Math.floor(time / 60) % 24;
      let optMin = time % 60;
      let optAmpm = optHour < 12 ? 'AM' : 'PM';
      if (optHour > 12) optHour -= 12;
      if (optHour === 0) optHour = 12;
      options.push(`${optHour}:${optMin < 10 ? '0' + optMin : optMin} ${optAmpm}`);
    }

    setEndTimeOptions(options);
    setEndTime(options[0] || '');
  }, [period]);

  const handlePair = () => {
    setPairing(true);
    setTimeout(() => {
      setPairing(false);
      if (inputToken === sessionToken) {
        alert('Pairing successful. Taking attendance now...');
      } else {
        alert('Invalid token!');
      }
    }, 2000);
  };

  const generateQrCode = () => {
    const data = `${selectedDepartment}-${selectedYear}-${selectedSection}-${selectedSubject}`;
    setQrCode(data);
  };

  return (
    <div className={styles.takeAttendance}>
      <h3>Take Attendance</h3>
      <div className={styles.attendanceFilters}>
        <div className={styles.filterGroup}>
          <label>Class Type:</label>
          <select value={classType} onChange={(e) => setClassType(e.target.value)} className={styles.filterSelect}>
            <option value="offline">Offline</option>
            <option value="online">Online</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Period:</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className={styles.filterSelect}>
            <option value="Period 1">Period 1 (8:30 AM)</option>
            <option value="Period 2">Period 2 (9:25 AM)</option>
            <option value="Period 3">Period 3 (10:30 AM)</option>
            <option value="Period 4">Period 4 (11:25 AM)</option>
            <option value="Period 5">Period 5 (1:20 PM)</option>
            <option value="Period 6">Period 6 (2:15 PM)</option>
            <option value="Period 7">Period 7 (3:05 PM)</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>End Time:</label>
          <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className={styles.filterSelect}>
            {endTimeOptions.map((opt, index) => (
              <option key={index} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
      {classType === 'offline' && (
        <div className={styles.pairingSection}>
          <p>Session Token: <span className={styles.sessionToken}>{sessionToken}</span></p>
          <div className={styles.pairInput}>
            <select className={styles.filterSelect}>
              {cameras.map((cam, index) => <option key={index} value={cam}>{cam}</option>)}
            </select>
            <input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Enter Session Token"
              className={styles.filterSelect}
              style={{ width: '200px' }}
            />
            <button
              className={styles.pairBtn}
              onClick={handlePair}
              disabled={!sessionToken || pairing}
            >
              {pairing ? 'Pairing...' : 'Pair'}
            </button>
          </div>
          {pairing && <p className={styles.pairStatus}>Pairing successful. Taking attendance now...</p>}
        </div>
      )}
      {classType === 'online' && (
        <div className={styles.qrCode}>
          <div className={styles.qrPlaceholder}>
            {qrCode ? <QRCodeCanvas value={qrCode} size={140} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : 'Generate QR Code'}
          </div>
          <button className={styles.shareQrBtn} onClick={generateQrCode} disabled={!!qrCode}>
            {qrCode ? 'Share QR' : 'Generate QR'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TakeAttendance;