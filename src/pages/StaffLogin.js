// import React, { useState } from "react";
import React, { useState, useEffect, useRef } from 'react';

import { api, setAuthToken } from "../Api";
import { useNavigate } from "react-router-dom";
import CaptchaBox from "../components/CaptchaBox";
import styles from "../styles/StaffLogIn.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function StaffLogin() {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [captchaData, setCaptchaData] = useState({ captchaId: "", captchaInput: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!staffId || !password || !captchaData.captchaInput) {
      alert("Please fill all fields");
      console.log("Missing fields:", { staffId, password, captchaInput: captchaData.captchaInput });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending login request with payload:", {
        role: "staff",
        identifier: staffId,
        password,
        captchaId: captchaData.captchaId,
        captchaInput: captchaData.captchaInput,
      });
      const res = await api.post("/api/auth/login", {
        role: "staff",
        identifier: staffId,
        password,
        captchaId: captchaData.captchaId,
        captchaInput: captchaData.captchaInput,
      });
      console.log("Login response:", res.data);
      setAuthToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      navigate("/staff_dashboard");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error ||
        "Login failed. Please check your credentials or try again later.";
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

  useEffect(() => {
          document.title = "Attenitix - Staff Login";
        }, []);

  return (
    <div className={styles.staffLoginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <div className={styles.logoText}>ACE</div>
          </div>
          <h1 className={styles.loginTitle}>Staff Login</h1>
          <p className={styles.loginSubtitle}>Access your staff dashboard</p>
        </div>

        {/* Staff ID */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Staff ID</label>
          <input
            className={styles.formInput}
            placeholder="Enter your staff ID"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value.trim())}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              className={styles.formInput}
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Captcha */}
        <div className={styles.captchaContainer}>
          <div className={styles.captchaTitle}>Security Verification</div>
          <CaptchaBox onChange={(data) => setCaptchaData(data)} disabled={isLoading} />
        </div>

        {/* Login Button */}
        <button
          className={`${styles.loginButton} ${
            isLoading ? styles.buttonLoading : ""
          }`}
          onClick={handleLogin}
          disabled={isLoading || !staffId || !password || !captchaData.captchaInput}
        >
          {isLoading ? "" : "Login to Dashboard"}
        </button>

        {/* Footer */}
        <div className={styles.loginFooter}>
          <p className={styles.footerText}>
            Adhiyamaan College of Engineering • Staff Access Only
          </p>
        </div>
      </div>
    </div>
  );
}
