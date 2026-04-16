import React, { useState, useEffect } from "react";
import "./profile.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", profilePic: "" });
  const [editing, setEditing] = useState(false);
  const [wardrobeItems, setWardrobeItems] = useState([]);

  const [newFeedback, setNewFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [myFeedbacks, setMyFeedbacks] = useState([]);

  // Edit feedback states
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load everything when page opens
  useEffect(() => {
    fetchProfile();
    fetchMyItems();
    fetchMyFeedbacks();
  }, []);

  // ── FETCH PROFILE ──────────────────────────────────────
  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load profile");
    }
    setLoading(false);
  };

  // ── FETCH MY FEEDBACKS ─────────────────────────────────
  const fetchMyFeedbacks = async () => {
    try {
      const res = await axiosInstance.get("/feedback/myfeedbacks");
      setMyFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to load feedbacks");
    }
  };

  // ── FETCH MY WARDROBE ITEMS ────────────────────────────
  const fetchMyItems = async () => {
    try {
      const res = await axiosInstance.get("/items/myitems");
      setWardrobeItems(res.data);
    } catch (err) {
      console.error("Failed to load wardrobe");
    }
  };

  // ── SAVE PROFILE ───────────────────────────────────────
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      if (profileFile) {
        formData.append("profilePic", profileFile);
      }

      const res = await axiosInstance.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("revogueUser", JSON.stringify(res.data));
      setUser(res.data);
      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Failed to update profile.");
    }
  };

  // ── DELETE WARDROBE ITEM ───────────────────────────────
  const deleteItem = async (id) => {
    try {
      await axiosInstance.delete(`/items/${id}`);
      setWardrobeItems(wardrobeItems.filter((item) => item._id !== id));
    } catch (err) {
      alert("Failed to delete item.");
    }
  };

  // ── SUBMIT FEEDBACK ────────────────────────────────────
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/feedback", {
        text: newFeedback,
        rating: rating,
      });

      setNewFeedback("");
      setRating(5);

      // refresh feedback list
      fetchMyFeedbacks();

      setMessage("Feedback submitted! ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to submit feedback.");
    }
  };

  // ── DELETE FEEDBACK ────────────────────────────────────
  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await axiosInstance.delete(`/feedback/${id}`);
      setMyFeedbacks(myFeedbacks.filter((fb) => fb._id !== id));
      setMessage("Feedback deleted! ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to delete feedback.");
    }
  };

  // ── START EDITING FEEDBACK ─────────────────────────────
  const handleEditStart = (feedback) => {
    setEditingFeedback(feedback._id);
    setEditText(feedback.text);
    setEditRating(feedback.rating);
  };

  // ── SAVE EDITED FEEDBACK ───────────────────────────────
  const handleEditSave = async (id) => {
    try {
      await axiosInstance.put(`/feedback/${id}`, {
        text: editText,
        rating: editRating,
      });

      setMyFeedbacks(
        myFeedbacks.map((fb) =>
          fb._id === id ? { ...fb, text: editText, rating: editRating } : fb
        )
      );

      setEditingFeedback(null);
      setMessage("Feedback updated! ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update feedback.");
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", padding: "50px" }}>Loading profile...</p>;
  }

  return (
    <>
      <Navbar />

      <div className="profile-container">
        {message && (
          <p style={{ textAlign: "center", color: "green", marginBottom: "10px" }}>
            {message}
          </p>
        )}

        {/* PROFILE */}
        <h2 className="section-title">My Profile</h2>
        <div className="profile-card">
          <div className="profile-avatar">
            {user.profilePic ? (
              <img src={`http://localhost:5000${user.profilePic}`} alt="Profile" />
            ) : (
              <div className="avatar-placeholder"></div>
            )}

            {editing && (
              <input type="file" onChange={(e) => setProfileFile(e.target.files[0])} />
            )}
          </div>

          {editing ? (
            <>
              <input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="profile-input"
              />
              <input
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="profile-input"
              />
              <button onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <button onClick={() => setEditing(true)}>Edit Profile</button>
            </>
          )}
        </div>

        {/* WARDROBE SECTION */}
        <h2 className="section-title wardrobe-title">My Wardrobe</h2>
        <div className="wardrobe-grid">
          {wardrobeItems.length === 0 ? (
            <p>No items in your wardrobe yet. Upload some!</p>
          ) : (
            wardrobeItems.map((item) => (
              <div className="wardrobe-card" key={item._id}>

                {/* Item image */}
                {item.images && item.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000${item.images[0]}`}
                    alt={item.title}
                    className="wardrobe-image"
                    style={{ width: "100%", height: "150px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="wardrobe-image"></div>
                )}

                <p className="item-name">{item.title}</p>
                <p className="item-code">{item.condition} · {item.size}</p>

                <div className="wardrobe-buttons">
                  <button
                    className="black-btn"
                    onClick={() => deleteItem(item._id)}
                  >
                    Delete
                  </button>
                  
                </div>
              </div>
            ))
          )}
        </div>

        {/* FEEDBACK SECTION */}
        <h2 className="section-title feedback-title">Community Feedback</h2>
        <div className="feedback-section">

          {/* FORM */}
          <div className="feedback-form-card">
            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                required
              />
              <select className="rating-select" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              
              <button type="submit" style={{ padding: "8px 16px", background: "#769376", color: "#fff", border: "none", borderRadius: "6px", position: "relative", left: "78%", transform: "translateX(-50%)" }}>
               Submit
              </button>
              
            </form>
          </div>

          {/* LIST */}
          <div className="feedback-list">
          {myFeedbacks.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center" }}>No feedback shared yet.</p>
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
      <option value="5">5 Stars</option>
      <option value="4">4 Stars</option>
      <option value="3">3 Stars</option>
      <option value="2">2 Stars</option>
      <option value="1">1 Star</option>
    </select>

    <button
      className="submit-btn"
      onClick={() => handleEditSave(fb._id)}
    >
      Save Changes
    </button>
  </div>
</div>
        ) : (
          <>
            <div className="stars">{"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}</div>
            <p className="feedback-text">{fb.text}</p>
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

      <Footer />
    </>
  );
};

export default Profile;