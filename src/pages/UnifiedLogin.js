// src/pages/UnifiedLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../Api";
import CaptchaBox from "../components/CaptchaBox";
import styles from "../styles/UnifiedLogin.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineDown } from "react-icons/ai";

const roleOptions = [
  { value: "student", label: "Student", placeholder: "e.g. 21BCE0001" },
  { value: "staff",   label: "Staff",   placeholder: "e.g. STF001" },
  { value: "admin",   label: "Admin",   placeholder: "e.g. admin" }
];

const redirects = {
  student: "/student_dashboard",
  staff: "/staff_dashboard",
  admin: "/admin_dashboard"
};

export default function UnifiedLogin() {
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [captchaData, setCaptchaData] = useState({ captchaId: "", captchaInput: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const currentOption = roleOptions.find(opt => opt.value === role) || roleOptions[0];

  const handleLogin = async () => {
    if (!identifier || !password || !captchaData.captchaInput) {
      setError("Please fill all fields and complete the captcha");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/login", {
        role,
        identifier: identifier.trim(),
        password,
        captchaId: captchaData.captchaId,
        captchaInput: captchaData.captchaInput,
      });

      setAuthToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", role);
      navigate(redirects[role]);
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed. Please check your credentials.");
      // Optional: refresh captcha will auto-refresh on error if your CaptchaBox supports it
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Attenitix - Login";
  }, []);

  return (
    <div className={styles.studentLoginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <div className={styles.logoText}>A</div>
          </div>
          <h1 className={styles.loginTitle}>Attenitix Login</h1>
          <p className={styles.loginSubtitle}>Welcome back! Please login to your account</p>
        </div>

        {/* User ID / Username */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>User ID / Username</label>
          <input
            className={styles.formInput}
            type="text"
            placeholder={currentOption.placeholder}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleLogin()}
            disabled={isLoading}
            autoComplete="username"
          />
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              className={styles.formInput}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleLogin()}
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              tabIndex="-1"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
        </div>

        {/* Role Dropdown */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Login As</label>
          <div className={styles.dropdownWrapper}>
            <button
              type="button"
              className={styles.dropdownToggle}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isLoading}
            >
              <span>{currentOption.label}</span>
              <AiOutlineDown className={isDropdownOpen ? styles.rotate : ""} />
            </button>

            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                {roleOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={`${styles.dropdownItem} ${role === opt.value ? styles.selected : ""}`}
                    onClick={() => {
                      setRole(opt.value);
                      setIsDropdownOpen(false);
                      setError(""); // Clear any previous error when role changes
                      // ID is NOT cleared anymore → user keeps what they typed!
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Captcha */}
        <div className={styles.captchaContainer}>
          <div className={styles.captchaTitle}>Security Verification</div>
          <CaptchaBox onChange={setCaptchaData} disabled={isLoading} />
        </div>

        {/* Login Button */}
        <button
          className={`${styles.loginButton} ${isLoading ? styles.buttonLoading : ""}`}
          onClick={handleLogin}
          disabled={isLoading || !identifier || !password || !captchaData.captchaInput}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className={styles.loginFooter}>
          <p className={styles.footerText}>Attenitix • Secure Access Portal</p>
        </div>
      </div>
    </div>
  );
}