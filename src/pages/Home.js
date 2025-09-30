import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % collegeEvents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const collegeEvents = [
    {
      id: 1,
      title: "Technical Symposium 2024",
      description: "Annual inter-college technical fest showcasing innovation and research",
      image: "🔬",
      date: "March 15, 2024",
      color: "#3B82F6",
    },
    {
      id: 2,
      title: "Industry-Academia Conclave",
      description: "Collaboration with leading industries for enhanced curriculum development",
      image: "🤝",
      date: "February 28, 2024",
      color: "#10B981",
    },
    {
      id: 3,
      title: "Research Paper Publication",
      description: "25 research papers published in international journals this academic year",
      image: "📄",
      date: "January 2024",
      color: "#8B5CF6",
    },
    {
      id: 4,
      title: "Campus Placement Drive",
      description: "95% placement record with top recruiters from IT and core engineering sectors",
      image: "💼",
      date: "December 2023",
      color: "#F59E0B",
    },
    {
      id: 5,
      title: "Sports Championship",
      description: "Inter-department sports festival promoting physical fitness and teamwork",
      image: "⚽",
      date: "November 2023",
      color: "#EF4444",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % collegeEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + collegeEvents.length) % collegeEvents.length);
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <div className={styles.logoPlaceholder}>ACE</div>
        </div>
        <div className={styles.collegeInfo}>
          <div className={styles.collegeName}>
            ADHIYAMAAN COLLEGE OF ENGINEERING (Autonomous)
          </div>
          <div className={styles.collegeDetails}>
            Dr. M.G.R. Nagar, Hosur - 635130, Krishnagiri District
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.homeTitle}>Attendance Management System</h1>
        <p className={styles.subtitle}>
          Adhiyamaan College of Engineering, established in 1997, is a premier institution
          committed to excellence in technical education. Recognized for its academic rigor,
          industry partnerships, and innovative research culture.
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
            {collegeEvents.map((event, index) => (
              <div
                key={event.id}
                className={`${styles.slide} ${index === currentSlide ? styles.active : ""}`}
                style={{ background: `linear-gradient(135deg, ${event.color}15, ${event.color}25)` }}
              >
                <div className={styles.slideContent}>
                  <div className={styles.slideIcon}>{event.image}</div>
                  <h3 className={styles.slideTitle}>{event.title}</h3>
                  <p className={styles.slideDescription}>{event.description}</p>
                  <div className={styles.slideDate}>{event.date}</div>
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
              {collegeEvents.map((_, index) => (
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
          <strong>Location:</strong> Dr. M.G.R. Nagar, Hosur - 635130, Krishnagiri District, Tamil
          Nadu, India<br />
          <strong>Established:</strong> 1997 | <strong>Powered by:</strong> Team Victoreign
        </div>
      </div>
    </div>
  );
}