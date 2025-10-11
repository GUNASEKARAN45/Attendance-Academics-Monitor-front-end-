import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/StudentDashboard.module.css';

const AttendanceChart = () => {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const [animationProgress, setAnimationProgress] = useState(0);
  const [weekIndex, setWeekIndex] = useState(1);

  useEffect(() => {
    setAnimationProgress(0);
    const animate = () => {
      setAnimationProgress((prev) => Math.min(prev + 0.02, 1));
    };
    const animationFrame = requestAnimationFrame(function loop() {
      animate();
      if (animationProgress < 1) requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [weekIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;

    ctx.clearRect(0, 0, width, height);

    let labels, dataPoints;
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dataPoints = [
      [true, false, true, true, true, false, true],
      [true, true, true, false, true, true, true],
      [false, true, true, true, false, true, true],
      [true, true, true, true, true, true, false],
      [true, false, true, true, true, true, true],
      [true, true, false, true, true, true, false]
    ].map(day => (day.filter(p => p).length / day.length) * 100);

    const dataLength = labels.length;
    const pointSpacing = (width - padding * 2) / (dataLength - 1);
    const maxAttendance = 100;
    const points = dataPoints.map((value, i) => ({
      x: padding + i * pointSpacing,
      y: height - padding - (value / maxAttendance) * (height - padding * 2),
      value,
      label: labels[i]
    }));

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

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    points.forEach((point, i) => {
      ctx.fillText(labels[i], point.x, height - padding + 20);
    });

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
      ctx.quadraticCurveTo(points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].x, points[points.length - 1].y);
    }
    ctx.lineTo(points[Math.floor((points.length - 1) * animationProgress)].x, height - padding);
    ctx.lineTo(points[0].x, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

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
  }, [animationProgress]);

  return (
    <div className={styles.attendanceChart}>
      <div className={styles.chartHeader}>
        <h3>Day-wise Attendance</h3>
      </div>
      <div className={styles.chartContainer}>
        <canvas ref={canvasRef} width={800} height={350} />
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

export default AttendanceChart;