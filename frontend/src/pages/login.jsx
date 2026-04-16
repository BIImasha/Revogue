import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./login.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const navigate  = useNavigate();
  const location  = useLocation();

  // Where did they come from? If redirected, go back there after login
  // If came directly, go to homepage
  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

  // Tell navbar to update immediately
  window.dispatchEvent(new Event("storage"));

  // Go back to where they were trying to go
  // Or homepage if they came directly
  navigate(redirectTo);

    try {
      // Send email and password to backend
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });

      // Save user info (including token) to localStorage
      localStorage.setItem("revogueUser", JSON.stringify(response.data));


    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="login-container">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">
            Login to continue your sustainable fashion journey
          </p>

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-bt" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="login-footer-text">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Login;