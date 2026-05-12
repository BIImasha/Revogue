import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* LEFT SECTION */}
        <div className="footer-left">
          <h2 className="footer-logo">REVOGUE</h2>
          <p>
            At Revogue, elegance finds purpose in unity. Join our community of
            conscious fashion lovers who swap, share, and celebrate sustainable
            style.
          </p>
        </div>

        {/* MIDDLE SECTION */}
        <div className="footer-middle">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/items">Items</Link></li>
            <li><Link to="/upload">Upload</Link></li>
            <li><Link to="/requests">Requests</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>

        {/* RIGHT SECTION */}
        <div className="footer-right">
          <h3>Connect With Us</h3>
          <div className="social-icons">

            <FaFacebookF />

            <FaInstagram />

            <FaYoutube />

            {/* EMAIL ICON (CLICKABLE) */}
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=avabrooks0220@gmail.com"
             target="_blank"
             rel="noopener noreferrer"
             className="social-icon">
  <FaEnvelope />
</a>

          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Revogue. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;