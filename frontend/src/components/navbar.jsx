import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <>
      <nav className="navbar">

        <div className="logo">
          <Link to="/">
            <img src="/images/logo.png" alt="Revogue" className="logo-img" />
          </Link>
        </div>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-right ${menuOpen ? "mobile-open" : ""}`}>
          <ul className="nav-links">
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/items" onClick={() => setMenuOpen(false)}>Items</Link></li>

            {currentUser && (
              <>
                <li><Link to="/upload" onClick={() => setMenuOpen(false)}>Upload</Link></li>
                <li><Link to="/requests" onClick={() => setMenuOpen(false)}>Requests</Link></li>
                <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>

                {currentUser.role === "admin" && (
                  <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link></li>
                )}
              </>
            )}
          </ul>

          {currentUser ? (
            <div className="nav-user">
              <NotificationBell />

              <span className="nav-greeting">
                Hello,
                <span>{currentUser.name}</span>
              </span>

              <button className="login-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="login-btn">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div
          className="nav-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;