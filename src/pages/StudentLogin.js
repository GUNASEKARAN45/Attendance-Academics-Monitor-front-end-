import React, { useState } from "react";
import { api, setAuthToken } from "../Api";
import { useNavigate } from "react-router-dom";
import CaptchaBox from "../components/CaptchaBox";
import styles from "../styles/StudentLogIn.module.css";

export default function StudentLogin() {
  const [reg, setReg] = useState("");
  const [password, setPassword] = useState("");
  const [captchaData, setCaptchaData] = useState({ captchaId: "", captchaInput: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!reg || !password || !captchaData.captchaInput) {
      alert("Please fill all fields");
      console.log("Missing fields:", { reg, password, captchaInput: captchaData.captchaInput });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending login request with payload:", {
        role: "student",
        identifier: reg,
        password,
        captchaId: captchaData.captchaId,
        captchaInput: captchaData.captchaInput,
      });
      const res = await api.post("/api/auth/login", {
        role: "student",
        identifier: reg,
        password,
        captchaId: captchaData.captchaId,
        captchaInput: captchaData.captchaInput,
      });
      console.log("Login response:", res.data);
      setAuthToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      navigate("/student_dashboard");
    } catch (err) {
      const errorMessage = err?.response?.data?.error || "Login failed. Please check your credentials or try again later.";
      alert(errorMessage);
      console.error("Login error:", err?.response?.data || err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className={styles.studentLoginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <div className={styles.logoText}>ACE</div>
          </div>
          <h1 className={styles.loginTitle}>Student Login</h1>
          <p className={styles.loginSubtitle}>Access your student dashboard</p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Registration Number</label>
          <input
            className={styles.formInput}
            placeholder="Enter your registration number"
            value={reg}
            onChange={(e) => setReg(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Password</label>
          <input
            className={styles.formInput}
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>

        <div className={styles.captchaContainer}>
          <div className={styles.captchaTitle}>Security Verification</div>
          <CaptchaBox
            onChange={(data) => setCaptchaData(data)}
            disabled={isLoading}
          />
        </div>

        <button
          className={`${styles.loginButton} ${isLoading ? styles.buttonLoading : ""}`}
          onClick={handleLogin}
          disabled={isLoading || !reg || !password || !captchaData.captchaInput}
        >
          {isLoading ? "" : "Login to Dashboard"}
        </button>

        <div className={styles.loginFooter}>
          <p className={styles.footerText}>
            Adhiyamaan College of Engineering • Student Access Only
          </p>
        </div>
      </div>
    </div>
  );
}