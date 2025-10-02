import React, { useState } from "react";
import { api, setAuthToken } from "../Api";
import { useNavigate } from "react-router-dom";
import CaptchaBox from "../components/CaptchaBox";
import styles from "../styles/AdminLogIn.module.css"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [captchaData, setCaptchaData] = useState({ captchaId: "", captchaInput: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!adminId || !password || !captchaData.captchaInput) {
      alert("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/api/auth/login", {
        role: "admin",
        identifier: adminId,
        password,
        captchaId: captchaData.captchaId,
        captchaInput: captchaData.captchaInput,
      });

      setAuthToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      navigate("/admin_dashboard");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error ||
        "Login failed. Please check your credentials or try again later.";
      alert(errorMessage);
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
    <div className={styles.adminLoginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <div className={styles.logoText}>ACE</div>
          </div>
          <h1 className={styles.loginTitle}>Admin Login</h1>
          <p className={styles.loginSubtitle}>Access the administration dashboard</p>
        </div>

        {/* Admin Username */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Admin Username</label>
          <input
            className={styles.formInput}
            placeholder="Enter your username"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value.trim())}
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
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
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
          className={`${styles.loginButton} ${isLoading ? styles.buttonLoading : ""}`}
          onClick={handleLogin}
          disabled={isLoading || !adminId || !password || !captchaData.captchaInput}
        >
          {isLoading ? "" : "Login to Dashboard"}
        </button>

        {/* Footer */}
        <div className={styles.loginFooter}>
          <p className={styles.footerText}>
            Adhiyamaan College of Engineering • Administrative Access Only
          </p>
        </div>
      </div>
    </div>
  );
}
