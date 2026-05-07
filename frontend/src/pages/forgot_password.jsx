import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgot_password.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirm) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.put("/users/forgot-password", {
        email,
        newPassword,
      });

      setSuccess("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="forgot-page">
      <Navbar />

      <div className="forgot-container">

        {/* LEFT PANEL */}
        <div className="forgot-left">
          <div className="forgot-overlay" />

          <span className="forgot-brand">Revogue</span>

          <div className="forgot-quote">
            <p>
              "Every change starts with a single step toward sustainability."
            </p>
            <span>Reset your account securely</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="forgot-right">
          <div className="forgot-card">

            <h2>Reset <span>Password</span></h2>
            <p className="forgot-subtitle">
              Create a new secure password for your account
            </p>

            <div className="forgot-divider" />

            {error && <div className="forgot-error">⚠ {error}</div>}
            {success && <div className="forgot-success">✓ {success}</div>}

            <form className="forgot-form" onSubmit={handleSubmit}>

              {/* Email */}
              <div className="form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* New Password */}
              <div className="form-field">
                <label>New Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-field">
                <label>Confirm Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <button className="forgot-btn" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>

            </form>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default ForgotPassword;