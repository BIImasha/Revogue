import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = () => {
      const user = JSON.parse(localStorage.getItem("revogueUser"));
      setCurrentUser(user);
    };
    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("revogueUser");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* ── LOGO ── */}
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Revogue" className="logo-img" />
        </Link>
      </div>

      {/* ── RIGHT: links + user ── */}
      <div className="nav-right">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/items">Items</Link></li>

          {currentUser && (
            <>
              <li><Link to="/upload">Upload</Link></li>
              <li><Link to="/requests">Requests</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              {currentUser.role === "admin" && (
                <li><Link to="/admin">Admin</Link></li>
              )}
            </>
          )}
        </ul>

        {/* ── USER / LOGIN ── */}
        {currentUser ? (
          <div className="nav-user">
            <NotificationBell />
            <span className="nav-greeting">
              Hello, <span>{currentUser.name}</span>
            </span>
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        )}
      </div>

    </nav>
  );
}

export default Navbar;