import React, { useState, useEffect } from "react";
import "./admin.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";

function Admin() {
  const [activeTab,     setActiveTab]     = useState("dashboard");
  const [stats,         setStats]         = useState(null);
  const [users,         setUsers]         = useState([]);
  const [items,         setItems]         = useState([]);
  const [swaps,         setSwaps]         = useState([]);
  const [loadingStats,  setLoadingStats]  = useState(true);
  const [loadingUsers,  setLoadingUsers]  = useState(false);
  const [loadingItems,  setLoadingItems]  = useState(false);
  const [loadingSwaps,  setLoadingSwaps]  = useState(false);
  const [message,       setMessage]       = useState("");
  const [messageType,   setMessageType]   = useState("success");

  const currentUser = JSON.parse(localStorage.getItem("revogueUser"));

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "items") fetchItems();
    if (activeTab === "swaps") fetchSwaps();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/admin/stats");
      setStats(res.data);
    } catch { console.error("Failed to load stats"); }
    setLoadingStats(false);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch { console.error("Failed to load users"); }
    setLoadingUsers(false);
  };

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const res = await axiosInstance.get("/admin/items");
      setItems(res.data);
    } catch { console.error("Failed to load items"); }
    setLoadingItems(false);
  };

  const fetchSwaps = async () => {
    setLoadingSwaps(true);
    try {
      const res = await axiosInstance.get("/admin/swaps");
      setSwaps(res.data);
    } catch { console.error("Failed to load swaps"); }
    setLoadingSwaps(false);
  };

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      showMessage("User deleted successfully.");
      fetchStats();
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to delete user.", "error");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axiosInstance.delete(`/admin/items/${id}`);
      setItems(items.filter((i) => i._id !== id));
      showMessage("Item deleted successfully.");
      fetchStats();
    } catch {
      showMessage("Failed to delete item.", "error");
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric"
    });

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "users",     label: "Users"     },
    { key: "items",     label: "Items"     },
    { key: "swaps",     label: "Swaps"     },
  ];

  // Highlight first two stat cards
  const statCards = stats ? [
    { icon: "👥", value: stats.totalUsers,     label: "Total Users",      highlight: true  },
    { icon: "👕", value: stats.totalItems,     label: "Total Items",      highlight: true  },
    { icon: "🔄", value: stats.totalSwaps,     label: "Total Swaps",      highlight: false },
    { icon: "💬", value: stats.totalFeedbacks, label: "Total Feedbacks",  highlight: false },
    { icon: "⏳", value: stats.pendingSwaps,   label: "Pending Swaps",    highlight: false },
    { icon: "✅", value: stats.acceptedSwaps,  label: "Accepted Swaps",   highlight: false },
    { icon: "🟢", value: stats.availableItems, label: "Available Items",  highlight: false },
    { icon: "🎉", value: stats.swappedItems,   label: "Swapped Items",    highlight: false },
  ] : [];

  if (!currentUser) {
    return (
      <div className="admin-page">
        <Navbar />
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>Please log in to continue.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Navbar />

      {/* ── HEADER ── */}
      <div className="admin-header">
        <h1 className="admin-title">Admin <em>Panel</em></h1>
        <div className="admin-header-divider" />
        <p className="admin-subtitle">Manage users, items, and platform activity</p>
      </div>

      <div className="admin-container">

        {/* Message */}
        {message && (
          <div className={`admin-message ${messageType}`}>{message}</div>
        )}

        {/* ── TABS ── */}
        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`admin-tab-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════ DASHBOARD ══════════════════════════ */}
        {activeTab === "dashboard" && (
          <div>
            <p className="admin-section-title">Platform <em>Overview</em></p>

            {loadingStats ? (
              <p className="admin-loading">Loading stats…</p>
            ) : stats ? (
              <div className="stats-grid">
                {statCards.map((card, i) => (
                  <div className={`stat-card${card.highlight ? " highlight" : ""}`} key={i}>
                    <span className="stat-icon">{card.icon}</span>
                    <p className="stat-number">{card.value}</p>
                    <p className="stat-label">{card.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-loading">Failed to load stats.</p>
            )}
          </div>
        )}

        {/* ══════════════════════════ USERS ══════════════════════════════ */}
        {activeTab === "users" && (
          <div>
            <p className="admin-section-title">
              All <em>Users</em>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", marginLeft: "0.6rem", fontFamily: "Jost, sans-serif", fontWeight: 300 }}>
                ({users.length})
              </span>
            </p>

            {loadingUsers ? (
              <p className="admin-loading">Loading users…</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td><strong style={{ fontWeight: 500 }}>{user.name}</strong></td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>{user.role}</span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <button
                            className="admin-delete-btn"
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={user._id === currentUser._id}
                          >
                            {user._id === currentUser._id ? "You" : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════ ITEMS ══════════════════════════════ */}
        {activeTab === "items" && (
          <div>
            <p className="admin-section-title">
              All <em>Items</em>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", marginLeft: "0.6rem", fontFamily: "Jost, sans-serif", fontWeight: 300 }}>
                ({items.length})
              </span>
            </p>

            {loadingItems ? (
              <p className="admin-loading">Loading items…</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Owner</th>
                      <th>Category</th>
                      <th>Condition</th>
                      <th>Status</th>
                      <th>Uploaded</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id}>
                        <td>
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="admin-item-img"
                            />
                          ) : (
                            <div className="admin-no-img">No img</div>
                          )}
                        </td>
                        <td><strong style={{ fontWeight: 500 }}>{item.title}</strong></td>
                        <td>{item.owner?.name}</td>
                        <td>{item.category}</td>
                        <td>{item.condition}</td>
                        <td>
                          <span className={`status-badge ${item.status}`}>{item.status}</span>
                        </td>
                        <td>{formatDate(item.createdAt)}</td>
                        <td>
                          <button
                            className="admin-delete-btn"
                            onClick={() => handleDeleteItem(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════ SWAPS ══════════════════════════════ */}
        {activeTab === "swaps" && (
          <div>
            <p className="admin-section-title">
              All <em>Swaps</em>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", marginLeft: "0.6rem", fontFamily: "Jost, sans-serif", fontWeight: 300 }}>
                ({swaps.length})
              </span>
            </p>

            {loadingSwaps ? (
              <p className="admin-loading">Loading swaps…</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Requester</th>
                      <th>Receiver</th>
                      <th>Wants</th>
                      <th>Offers</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {swaps.map((swap) => (
                      <tr key={swap._id}>
                        <td>{swap.requester?.name}</td>
                        <td>{swap.receiver?.name}</td>
                        <td>{swap.requestedItem?.title}</td>
                        <td>{swap.offeredItem?.title}</td>
                        <td>
                          <span className={`status-badge ${swap.status}`}>{swap.status}</span>
                        </td>
                        <td>{formatDate(swap.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default Admin;