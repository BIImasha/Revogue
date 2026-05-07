import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("revogueUser", JSON.stringify(response.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="signup-page">
      <Navbar />

      <div className="signup-container">

        {/* LEFT PANEL */}
        <div className="signup-left">
          <div className="signup-overlay" />

          <span className="signup-brand">Revogue</span>

          <div className="signup-quote">
            <p>
              "Sustainable fashion is not a trend, it's a responsibility."
            </p>
            <h6>— Revogue Community</h6>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="signup-right">
          <div className="signup-card">

            <h2>Create <span>Account</span></h2>
            <p className="signup-subtitle">
              Join the sustainable fashion movement
            </p>
            <div className="signup-divider" />

            {error && <div className="signup-error">⚠ {error}</div>}

            <form onSubmit={handleSubmit} className="signup-form">

              <div className="form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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

              <div className="form-field">
                <label>Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

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

              <button className="signup-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

            </form>

            <p className="signup-footer">
              Already have an account? <Link to="/login">Login</Link>
            </p>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Signup;