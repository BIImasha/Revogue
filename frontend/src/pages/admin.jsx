import React, { useState, useEffect } from "react";
import "./admin.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";

function Admin() {
  // Active tab state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data states
  const [stats, setStats]   = useState(null);
  const [users, setUsers]   = useState([]);
  const [items, setItems]   = useState([]);
  const [swaps, setSwaps]   = useState([]);

  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingSwaps, setLoadingSwaps] = useState(false);

  const [message, setMessage] = useState("");

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("revogueUser"));

  // Load stats when page opens
  useEffect(() => {
    fetchStats();
  }, []);

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "items") fetchItems();
    if (activeTab === "swaps") fetchSwaps();
  }, [activeTab]);

  // ── FETCH FUNCTIONS ──────────────────────────────────
  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats");
    }
    setLoadingStats(false);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users");
    }
    setLoadingUsers(false);
  };

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const res = await axiosInstance.get("/admin/items");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load items");
    }
    setLoadingItems(false);
  };

  const fetchSwaps = async () => {
    setLoadingSwaps(true);
    try {
      const res = await axiosInstance.get("/admin/swaps");
      setSwaps(res.data);
    } catch (err) {
      console.error("Failed to load swaps");
    }
    setLoadingSwaps(false);
  };

  // ── DELETE FUNCTIONS ─────────────────────────────────
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      setMessage("User deleted successfully! ✅");
      setTimeout(() => setMessage(""), 3000);
      fetchStats(); // Update stats
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axiosInstance.delete(`/admin/items/${id}`);
      setItems(items.filter((i) => i._id !== id));
      setMessage("Item deleted successfully! ✅");
      setTimeout(() => setMessage(""), 3000);
      fetchStats(); // Update stats
    } catch (err) {
      setMessage("Failed to delete item.");
    }
  };

  // ── FORMAT DATE ───────────────────────────────────────
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day:   "2-digit",
      month: "short",
      year:  "numeric"
    });
  };

  // ── ACCESS DENIED ─────────────────────────────────────
  // This is a frontend check — backend also blocks non-admins
  if (!currentUser) {
    return (
      <>
        <Navbar />
        <div className="access-denied">
          <h2>🔒</h2>
          <h2>Access Denied</h2>
          <p>Please login to continue.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="admin-container">
        <h1 className="admin-title">🛡️ Admin Panel</h1>
        <p className="admin-subtitle">
          Manage users, items, and platform activity
        </p>

        {/* SUCCESS / ERROR MESSAGE */}
        {message && (
          <div style={{
            padding:       "12px 16px",
            background:    message.includes("✅") ? "#d4edda" : "#f8d7da",
            color:         message.includes("✅") ? "#155724" : "#721c24",
            borderRadius:  "8px",
            marginBottom:  "20px",
            fontSize:      "14px"
          }}>
            {message}
          </div>
        )}

        {/* ── TAB BUTTONS ── */}
        <div className="admin-tabs">
          {["dashboard", "users", "items", "swaps"].map((tab) => (
            <button
              key={tab}
              className={`admin-tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "dashboard" && "📊 Dashboard"}
              {tab === "users"     && "👥 Users"}
              {tab === "items"     && "👕 Items"}
              {tab === "swaps"     && "🔄 Swaps"}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════ */}
        {/* TAB 1 — DASHBOARD                             */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === "dashboard" && (
          <div>
            <p className="admin-section-title">Platform Overview</p>

            {loadingStats ? (
              <p className="admin-loading">Loading stats...</p>
            ) : stats ? (
              <div className="stats-grid">

                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <p className="stat-number">{stats.totalUsers}</p>
                  <p className="stat-label">Total Users</p>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">👕</div>
                  <p className="stat-number">{stats.totalItems}</p>
                  <p className="stat-label">Total Items</p>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🔄</div>
                  <p className="stat-number">{stats.totalSwaps}</p>
                  <p className="stat-label">Total Swaps</p>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">💬</div>
                  <p className="stat-number">{stats.totalFeedbacks}</p>
                  <p className="stat-label">Total Feedbacks</p>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <p className="stat-number">{stats.pendingSwaps}</p>
                  <p className="stat-label">Pending Swaps</p>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <p className="stat-number">{stats.acceptedSwaps}</p>
                  <p className="stat-label">Accepted Swaps</p>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🟢</div>
                  <p className="stat-number">{stats.availableItems}</p>
                  <p className="stat-label">Available Items</p>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🎉</div>
                  <p className="stat-number">{stats.swappedItems}</p>
                  <p className="stat-label">Swapped Items</p>
                </div>

              </div>
            ) : (
              <p className="admin-loading">Failed to load stats.</p>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* TAB 2 — USERS                                 */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === "users" && (
          <div>
            <p className="admin-section-title">
              All Users ({users.length})
            </p>

            {loadingUsers ? (
              <p className="admin-loading">Loading users...</p>
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
                        <td>
                          <strong>{user.name}</strong>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <button
                            className="admin-delete-btn"
                            onClick={() => handleDeleteUser(user._id)}
                            // Disable delete button for own account
                            disabled={user._id === currentUser._id}
                          >
                            {user._id === currentUser._id
                              ? "You"
                              : "Delete"}
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

        {/* ══════════════════════════════════════════════ */}
        {/* TAB 3 — ITEMS                                 */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === "items" && (
          <div>
            <p className="admin-section-title">
              All Items ({items.length})
            </p>

            {loadingItems ? (
              <p className="admin-loading">Loading items...</p>
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
                              src={`http://localhost:5000${item.images[0]}`}
                              alt={item.title}
                              className="admin-item-img"
                            />
                          ) : (
                            <div className="admin-no-img">No img</div>
                          )}
                        </td>
                        <td><strong>{item.title}</strong></td>
                        <td>{item.owner?.name}</td>
                        <td>{item.category}</td>
                        <td>{item.condition}</td>
                        <td>
                          <span className={`status-badge ${item.status}`}>
                            {item.status}
                          </span>
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

        {/* ══════════════════════════════════════════════ */}
        {/* TAB 4 — SWAPS                                 */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === "swaps" && (
          <div>
            <p className="admin-section-title">
              All Swaps ({swaps.length})
            </p>

            {loadingSwaps ? (
              <p className="admin-loading">Loading swaps...</p>
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
                          <span className={`status-badge ${swap.status}`}>
                            {swap.status}
                          </span>
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
    </>
  );
}

export default Admin;