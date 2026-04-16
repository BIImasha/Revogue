import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgot_password.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";

function ForgotPassword() {
  const [email, setEmail]           = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check passwords match
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

      setSuccess("Password reset successful! Redirecting to login...");

      // Wait 2 seconds then go to login page
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="forgot-container">
        <div className="forgot-card">
          <h2>Change Your Password</h2>
          <p className="forgot-subtitle">
            Enter a new password below to change your password.
          </p>

          {error   && <p style={{ color: "red",   marginBottom: "10px" }}>{error}</p>}
          {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}

          <form className="forgot-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Re-Enter Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            <button type="submit" className="forgot-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ForgotPassword;