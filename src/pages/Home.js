import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

 useEffect(() => {
    document.title = "Attenitix - Home Page";
  }, []);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % systemFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const systemFeatures = [
    {
      id: 1,
      title: "Role-Based Dashboards",
      description: "Customized dashboards for students, staff, and admins providing tailored views and functionalities",
      image: "📊",
      date: "Key Feature",
      color: "#3B82F6",
    },
    {
      id: 2,
      title: "Automated Attendance",
      description: "Eliminates manual work and reduces proxy attendance with smart, automated tracking systems",
      image: "🤖",
      date: "Core Functionality",
      color: "#10B981",
    },
    {
      id: 3,
      title: "Smart Analytics",
      description: "In-depth performance analytics and insights based on user attendance and engagement data",
      image: "📈",
      date: "Advanced Tool",
      color: "#8B5CF6",
    },
    {
      id: 4,
      title: "Secure and Efficient",
      description: "Robust security measures ensuring data privacy while streamlining administrative processes",
      image: "🔒",
      date: "System Benefit",
      color: "#F59E0B",
    },
    {
      id: 5,
      title: "Empower Your Institution",
      description: "Streamline attendance, eliminate errors, and unlock powerful insights for better decision-making",
      image: "🚀",
      date: "Our Slogan",
      color: "#EF4444",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % systemFeatures.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + systemFeatures.length) % systemFeatures.length);
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <div className={styles.logoPlaceholder}>A</div>
        </div>
        <div className={styles.collegeInfo}>
          <div className={styles.collegeName}>
            ATTENITIX
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.homeTitle}>Automated Attendance and Smart Analytics System</h1>
        <p className={styles.subtitle}>
          Attenitix is a cutting-edge Attendance and Analytics System designed to streamline attendance tracking and provide actionable insights for educational institutions. With real-time data, intuitive dashboards, and secure access for students, staff, and admins, it enhances efficiency and decision-making.
        </p>

        <div className={styles.buttonGroup}>
          <Link to="/login/student_login" className={`${styles.loginButton} ${styles.studentButton}`}>
            Student Login
          </Link>
          <Link to="/login/staff_login" className={`${styles.loginButton} ${styles.staffButton}`}>
            Staff Login
          </Link>
          <Link to="/login/admin_login" className={`${styles.loginButton} ${styles.adminButton}`}>
            Admin Login
          </Link>
        </div>

        <div className={styles.slideshowContainer}>
          <div className={styles.slideshow}>
            {systemFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className={`${styles.slide} ${index === currentSlide ? styles.active : ""}`}
                style={{ background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}25)` }}
              >
                <div className={styles.slideContent}>
                  <div className={styles.slideIcon}>{feature.image}</div>
                  <h3 className={styles.slideTitle}>{feature.title}</h3>
                  <p className={styles.slideDescription}>{feature.description}</p>
                  <div className={styles.slideDate}>{feature.date}</div>
                </div>
              </div>
            ))}

            <button className={styles.navBtn + " " + styles.prevBtn} onClick={prevSlide}>
              ‹
            </button>
            <button className={styles.navBtn + " " + styles.nextBtn} onClick={nextSlide}>
              ›
            </button>

            <div className={styles.slideshowControls}>
              {systemFeatures.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.controlBtn} ${index === currentSlide ? styles.active : ""}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <strong>Powered by:</strong> Team Victoreign
        </div>
      </div>
    </div>
  );
}