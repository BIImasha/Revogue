import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import NotificationBell from "./NotificationBell";

function Navbar() {
  // Check if someone is logged in
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Read user info from localStorage
    const user = JSON.parse(localStorage.getItem("revogueUser"));
    setCurrentUser(user);
  }, []);

  // ── LOGOUT ──────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("revogueUser");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* Left Side - Logo */}
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Revogue Logo" className="logo-img" />
        </Link>
      </div>

      {/* Right Side - Navigation */}
      <div className="nav-right">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/items">Items</Link></li>

          {/* Only show these links when logged in */}
          {currentUser && (
            <>
              <li><Link to="/upload">Upload</Link></li>
              <li><Link to="/requests">Requests</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              {/* Only show Admin link for admin users */}
              {currentUser.role === "admin" && (
                <li><Link to="/admin">Admin</Link></li>
              )}
            </>
          )}
        </ul>

        {/* Login / User Section */}
        {currentUser ? 
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* 🔔 Notification Bell */}
            <NotificationBell />

            {/* Login / User Section */}
        
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end"
          }}>
            <span style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#222"
            }}>
               Hello, {currentUser.name}
            </span>

            <button
              className="login-btn"
              onClick={handleLogout}
              style={{
                marginTop: "15px",
                padding: "8px 20px",
                fontSize: "15px",
                alignSelf: "center" //  centers button under text
              }}
            >
              Logout
            </button>
          </div>
          </div>
          
         : (
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;