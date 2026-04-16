import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";

function Signup() {
  // These store what the user types
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");

  // These handle loading and error messages
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  // This is used to redirect after signup
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stops page from refreshing
    setError("");

    // Check passwords match
    if (password !== confirm) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Send data to backend
      const response = await axiosInstance.post("/users/register", {
        name,
        email,
        password,
      });

      // Save user info to localStorage (keeps user logged in)
      localStorage.setItem("revogueUser", JSON.stringify(response.data));

      // Go to homepage after successful signup
      navigate("/");

    } catch (err) {
      // Show error message if something went wrong
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="signup-container">
        <div className="signup-card">
          <h2>Create Account</h2>
          <p className="signup-subtitle">
            Join the Revogue sustainable fashion community
          </p>

          {/* Show error message if any */}
          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="signup-footer-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Signup;