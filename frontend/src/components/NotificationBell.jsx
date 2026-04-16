import React, { useState, useEffect, useRef } from "react";
import "./NotificationBell.css";
import axiosInstance from "../api/axiosInstance";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [isOpen, setIsOpen]               = useState(false);
  const dropdownRef                       = useRef(null);

  // Load unread count every 30 seconds automatically
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await axiosInstance.get("/notifications/unread-count");
      setUnreadCount(res.data.count);
    } catch (err) {
      // User might not be logged in — that's fine
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications");
    }
  };

  // When bell is clicked → open/close dropdown
  const handleBellClick = async () => {
    if (!isOpen) {
      await fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await axiosInstance.put("/notifications/mark-all-read");
      setUnreadCount(0);
      // Update all notifications to read in UI
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  // Mark single notification as read when clicked
  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await axiosInstance.put(`/notifications/${notif._id}/read`);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications(
          notifications.map((n) =>
            n._id === notif._id ? { ...n, isRead: true } : n
          )
        );
      } catch (err) {
        console.error("Failed to mark notification as read");
      }
    }
  };

  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case "swap_request_received":  return "🔄";
      case "swap_request_accepted":  return "✅";
      case "swap_request_declined":  return "❌";
      case "swap_request_cancelled": return "🚫";
      case "new_message":            return "💬";
      default:                       return "🔔";
    }
  };

  // Format time nicely
  const formatTime = (dateString) => {
    const now      = new Date();
    const date     = new Date(dateString);
    const diffMins = Math.floor((now - date) / 60000);

    if (diffMins < 1)  return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef}>

      {/* ── BELL BUTTON ── */}
      <button className="bell-btn" onClick={handleBellClick}>
        🔔
        {/* Red badge showing unread count */}
        {unreadCount > 0 && (
          <span className="bell-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── DROPDOWN CARD ── */}
      {isOpen && (
        <div className="notification-dropdown">

          {/* Header */}
          <div className="notification-header">
            <h4>🔔 Notifications</h4>
            {unreadCount > 0 && (
              <button
                className="mark-read-btn"
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <p>No notifications yet! 🎉</p>
                <p>We'll let you know when something happens.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`notification-item ${
                    !notif.isRead ? "unread" : ""
                  }`}
                  onClick={() => handleNotifClick(notif)}
                >
                  {/* Icon */}
                  <span className="notif-icon">
                    {getIcon(notif.type)}
                  </span>

                  {/* Message + Time */}
                  <div className="notif-content">
                    <p className="notif-message">{notif.message}</p>
                    <span className="notif-time">
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>

                  {/* Blue dot for unread */}
                  {!notif.isRead && (
                    <div className="unread-dot" />
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default NotificationBell;