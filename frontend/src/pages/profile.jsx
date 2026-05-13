import React, { useState, useEffect } from "react";
import "./profile.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";

const Profile = () => {
  const [user,            setUser]            = useState({ name: "", email: "", profilePic: "" });
  const [editing,         setEditing]         = useState(false);
  const [wardrobeItems,   setWardrobeItems]   = useState([]);
  const [newFeedback,     setNewFeedback]     = useState("");
  const [rating,          setRating]          = useState(5);
  const [myFeedbacks,     setMyFeedbacks]     = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editText,        setEditText]        = useState("");
  const [editRating,      setEditRating]      = useState(5);
  const [profileFile,     setProfileFile]     = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [message,         setMessage]         = useState("");

  useEffect(() => {
    fetchProfile();
    fetchMyItems();
    fetchMyFeedbacks();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/profile");
      setUser(res.data);
    } catch { console.error("Failed to load profile"); }
    setLoading(false);
  };

  const fetchMyFeedbacks = async () => {
    try {
      const res = await axiosInstance.get("/feedback/myfeedbacks");
      setMyFeedbacks(res.data);
    } catch { console.error("Failed to load feedbacks"); }
  };

  const fetchMyItems = async () => {
    try {
      const res = await axiosInstance.get("/items/myitems");
      setWardrobeItems(res.data);
    } catch { console.error("Failed to load wardrobe"); }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      if (profileFile) formData.append("profilePic", profileFile);
      const res = await axiosInstance.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("revogueUser", JSON.stringify(res.data));
      setUser(res.data);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch { setMessage("Failed to update profile."); }
  };

  const deleteItem = async (id) => {
    try {
      await axiosInstance.delete(`/items/${id}`);
      setWardrobeItems(wardrobeItems.filter((item) => item._id !== id));
    } catch { alert("Failed to delete item."); }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/feedback", { text: newFeedback, rating });
      setNewFeedback("");
      setRating(5);
      fetchMyFeedbacks();
      setMessage("Feedback submitted.");
      setTimeout(() => setMessage(""), 3000);
    } catch { setMessage("Failed to submit feedback."); }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await axiosInstance.delete(`/feedback/${id}`);
      setMyFeedbacks(myFeedbacks.filter((fb) => fb._id !== id));
      setMessage("Feedback deleted.");
      setTimeout(() => setMessage(""), 3000);
    } catch { setMessage("Failed to delete feedback."); }
  };

  const handleEditStart = (fb) => {
    setEditingFeedback(fb._id);
    setEditText(fb.text);
    setEditRating(fb.rating);
  };

  const handleEditSave = async (id) => {
    try {
      await axiosInstance.put(`/feedback/${id}`, { text: editText, rating: editRating });
      setMyFeedbacks(myFeedbacks.map((fb) =>
        fb._id === id ? { ...fb, text: editText, rating: editRating } : fb
      ));
      setEditingFeedback(null);
      setMessage("Feedback updated.");
      setTimeout(() => setMessage(""), 3000);
    } catch { setMessage("Failed to update feedback."); }
  };

  const renderStars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  if (loading) return (
    <div className="profile-page">
      <Navbar />
      <p className="profile-loading">Loading profile…</p>
      <Footer />
    </div>
  );

  return (
    <div className="profile-page">
      <Navbar />

      {/* ── HEADER ── */}
      <div className="profile-header">
        <h1>My <em>Profile</em></h1>
        <div className="profile-header-divider" />
        <p className="profile-header-sub">Manage your personal information and preferences</p>
      </div>

      <div className="profile-container">
        {message && <p className="profile-message">{message}</p>}

        {/* ── PROFILE CARD ── */}
        <h2 className="section-title">Personal <em>Info</em></h2>
        <div className="section-divider" />

        <div className="profile-card">
          <div className="profile-avatar">
            {user.profilePic ? (
              <img src={user.profilePic} alt="Profile" />
            ) : (
              <div className="avatar-placeholder" />
            )}
            {editing && (
              <label className="avatar-upload-label">
                Change Photo
                <input type="file" hidden onChange={(e) => setProfileFile(e.target.files[0])} />
              </label>
            )}
          </div>

          <div className="profile-info">
            {editing ? (
              <>
                <input
                  className="profile-input"
                  value={user.name}
                  placeholder="Full name"
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <input
                  className="profile-input"
                  value={user.email}
                  placeholder="Email address"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <div className="profile-actions">
                  <button className="save-btn" onClick={handleSave}>Save Changes</button>
                  <button className="edit-profile-btn" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <div className="profile-actions">
                  <button className="edit-profile-btn" onClick={() => setEditing(true)}>Edit Profile</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── WARDROBE ── */}
        <div className="wardrobe-section">
          <h2 className="section-title">My <em>Wardrobe</em></h2>
          <div className="section-divider" />

          {wardrobeItems.length === 0 ? (
            <p className="wardrobe-empty">No items yet — upload something!</p>
          ) : (
            <div className="wardrobe-grid">
              {wardrobeItems.map((item) => (
                <div className="wardrobe-card" key={item._id}>
                  <div className="wardrobe-image">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.title} />
                    ) : null}
                  </div>
                  <div className="wardrobe-card-body">
                    <p className="item-name">{item.title}</p>
                    <p className="item-code">{item.condition} · {item.size}</p>
                    <div className="wardrobe-buttons">
                      <button className="black-btn" onClick={() => deleteItem(item._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── FEEDBACK ── */}
        <div className="feedback-section-wrap">
          <h2 className="section-title">Community <em>Feedback</em></h2>
          <div className="section-divider" />

          <div className="feedback-layout">

            {/* Form */}
            <div className="feedback-form-card">
              <label className="feedback-form-label">Share your experience</label>
              <form onSubmit={handleFeedbackSubmit}>
                <textarea
                  placeholder="Write your feedback…"
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  required
                />
                <label className="feedback-form-label">Rating</label>
                <select
                  className="rating-select"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="5">★★★★★ — 5 Stars</option>
                  <option value="4">★★★★☆ — 4 Stars</option>
                  <option value="3">★★★☆☆ — 3 Stars</option>
                  <option value="2">★★☆☆☆ — 2 Stars</option>
                  <option value="1">★☆☆☆☆ — 1 Star</option>
                </select>
                <button type="submit" className="feedback-submit-btn">
                  Submit Feedback
                </button>
              </form>
            </div>

            {/* List */}
            <div className="feedback-list">
              {myFeedbacks.length === 0 ? (
                <p className="feedback-empty">No feedback shared yet.</p>
              ) : (
                myFeedbacks.map((fb) => (
                  <div className="feedback-item" key={fb._id}>
                    {editingFeedback === fb._id ? (
                      <div className="edit-mode-container">
                        <textarea
                          className="edit-textarea"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="edit-row">
                          <select
                            className="rating-select"
                            value={editRating}
                            onChange={(e) => setEditRating(Number(e.target.value))}
                          >
                            <option value="5">★★★★★</option>
                            <option value="4">★★★★☆</option>
                            <option value="3">★★★☆☆</option>
                            <option value="2">★★☆☆☆</option>
                            <option value="1">★☆☆☆☆</option>
                          </select>
                          <button className="submit-btn" onClick={() => handleEditSave(fb._id)}>
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="stars">{renderStars(fb.rating)}</div>
                        <p className="feedback-text">"{fb.text}"</p>
                        <div className="feedback-actions">
                          <button className="edit-btn" onClick={() => handleEditStart(fb)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDeleteFeedback(fb._id)}>Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;