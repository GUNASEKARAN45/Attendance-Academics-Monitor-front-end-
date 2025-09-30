import React, { useEffect, useState } from "react";
import { api } from "../Api";

export default function CaptchaBox({ onChange, disabled }) {
  const [captchaId, setCaptchaId] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [input, setInput] = useState("");

  const fetchCaptcha = async () => {
    try {
      const res = await api.get("/api/captcha");
      setCaptchaId(res.data.id);
      setCaptchaText(res.data.captcha);
      setInput("");
      console.log("Fetched CAPTCHA:", { id: res.data.id, captcha: res.data.captcha });
      onChange && onChange({ captchaId: res.data.id, captchaInput: "" });
    } catch (err) {
      console.error("Error fetching CAPTCHA:", err);
      alert("Failed to load CAPTCHA. Please try again.");
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  useEffect(() => {
    onChange && onChange({ captchaId, captchaInput: input });
  }, [input, captchaId]);

  return (
    <>
      <style>
        {`
          .captcha-box {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
          }

          .captcha-image {
            flex: 1;
            background: #ffffff;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 45px;
            font-weight: bold;
            font-size: 1.2rem;
            letter-spacing: 2px;
            color: #1f2937;
            user-select: none;
          }

          .refresh-button {
            background: #667eea;
            border: none;
            border-radius: 8px;
            padding: 10px;
            width: 40px;
            height: 40px;
            cursor: pointer;
            transition: background 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.1rem;
          }

          .refresh-button:hover:not(:disabled) {
            background: #5a6fd8;
          }

          .refresh-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .captcha-input {
            width: 95%;
            padding: 10px 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            background: white;
          }

          .captcha-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
          }

          .captcha-input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}
      </style>

      <div className="captcha-box">
        <div className="captcha-image">{captchaText || "Loading..."}</div>
        <button
          className="refresh-button"
          onClick={fetchCaptcha}
          title="Refresh CAPTCHA"
          disabled={disabled}
        >
          🔄
        </button>
      </div>
      <input
        className="captcha-input"
        placeholder="Enter CAPTCHA text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
      />
    </>
  );
}