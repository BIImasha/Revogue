import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./items.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";
import SwapRequestModal from "../components/SwapRequestModal";

function Items() {
  const categories = [
    "All",
    "Women's Clothing",
    "Men's Clothing",
    "Kids' Clothing",
    "Footwear",
    "Accessories",
    "Jewelry",
    "Outerwear & Seasonal Wear",
    "Bags & Carry Items",
  ];

  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");

  // 🔍 Search state
  const [searchTerm, setSearchTerm]         = useState("");
  const [searchInput, setSearchInput]       = useState("");

  // Popup state
  const [showModal, setShowModal]           = useState(false);
  const [selectedItem, setSelectedItem]     = useState(null);
  const [successMsg, setSuccessMsg]         = useState("");

  const navigate    = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("revogueUser"));

  // Fetch items when category OR search term changes
  useEffect(() => {
    fetchItems();
  }, [activeCategory, searchTerm]);

  const fetchItems = async () => {
    setLoading(true);
    setError("");

    try {
      // Build URL with category and search params
      let url = "/items?";

      if (activeCategory !== "All") {
        url += `category=${encodeURIComponent(activeCategory)}&`;
      }

      if (searchTerm) {
        url += `search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await axiosInstance.get(url);
      setItems(response.data);

    } catch (err) {
      setError("Failed to load items. Please try again.");
    }

    setLoading(false);
  };

  // ── SEARCH HANDLERS ───────────────────────────────────
  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  // Handle clearing search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  // ── REQUEST EXCHANGE ──────────────────────────────────
  const handleRequestClick = (item) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (item.owner?._id === currentUser._id) {
      alert("This is your own item! You cannot request it.");
      return;
    }

    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSuccess = () => {
    setSuccessMsg("Swap request sent successfully! ✅ Check your Requests page.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <>
      <Navbar />

      <div className="items-container">
        <h1>Exchange Items</h1>
        <p className="items-subtitle">
          Browse and exchange pre-loved fashion items sustainably
        </p>

        {/* ── SEARCH BAR ── */}
        <form
          onSubmit={handleSearch}
          style={{
            display:       "flex",
            gap:           "10px",
            marginBottom:  "24px",
            maxWidth:      "500px",
            margin:        "0 auto 24px auto",
          }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            {/* Search Icon */}
            <span
              style={{
                position:   "absolute",
                left:       "14px",
                top:        "50%",
                transform:  "translateY(-50%)",
                fontSize:   "16px",
                color:      "#888",
              }}
            >
              🔍
            </span>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search items by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                width:        "100%",
                padding:      "12px 40px 12px 40px",
                borderRadius: "25px",
                border:       "2px solid #e0e0e0",
                fontSize:     "14px",
                outline:      "none",
                boxSizing:    "border-box",
                transition:   "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#000")}
              onBlur={(e)  => (e.target.style.borderColor = "#e0e0e0")}
            />

            {/* Clear button — shows when there is text */}
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  position:   "absolute",
                  right:      "14px",
                  top:        "50%",
                  transform:  "translateY(-50%)",
                  background: "none",
                  border:     "none",
                  cursor:     "pointer",
                  fontSize:   "16px",
                  color:      "#888",
                  padding:    "0",
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            style={{
              padding:      "12px 20px",
              background:   "#000",
              color:        "#fff",
              border:       "none",
              borderRadius: "25px",
              cursor:       "pointer",
              fontSize:     "14px",
              fontWeight:   "500",
              whiteSpace:   "nowrap",
            }}
          >
            Search
          </button>
        </form>

        {/* ── ACTIVE SEARCH INDICATOR ── */}
        {searchTerm && (
          <div
            style={{
              textAlign:    "center",
              marginBottom: "16px",
              fontSize:     "14px",
              color:        "#555",
            }}
          >
            Showing results for{" "}
            <strong>"{searchTerm}"</strong>
            {activeCategory !== "All" && (
              <span> in <strong>{activeCategory}</strong></span>
            )}
            <button
              onClick={handleClearSearch}
              style={{
                marginLeft:  "10px",
                background:  "none",
                border:      "none",
                color:       "#e53935",
                cursor:      "pointer",
                fontSize:    "13px",
                fontWeight:  "500",
              }}
            >
              ✕ Clear
            </button>
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {successMsg && (
          <div
            style={{
              background:   "#d4edda",
              color:        "#155724",
              padding:      "12px 20px",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign:    "center",
              fontSize:     "14px",
            }}
          >
            {successMsg}
            <span
              onClick={() => navigate("/requests")}
              style={{
                marginLeft:     "10px",
                cursor:         "pointer",
                fontWeight:     "600",
                textDecoration: "underline",
              }}
            >
              View Requests →
            </span>
          </div>
        )}

        {/* ── CATEGORY FILTER BUTTONS ── */}
        <div className="filter-container">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`filter-btn ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <p style={{ textAlign: "center", padding: "20px" }}>
            Loading items...
          </p>
        )}

        {/* ERROR STATE */}
        {error && (
          <p style={{ textAlign: "center", color: "red", padding: "20px" }}>
            {error}
          </p>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && items.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "40px" }}>🔍</p>
            <p style={{ fontSize: "16px", color: "#555" }}>
              {searchTerm
                ? `No items found for "${searchTerm}"`
                : "No items found in this category yet."}
            </p>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                style={{
                  marginTop:    "12px",
                  padding:      "10px 20px",
                  background:   "#000",
                  color:        "#fff",
                  border:       "none",
                  borderRadius: "20px",
                  cursor:       "pointer",
                  fontSize:     "14px",
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* ── ITEMS GRID ── */}
        <div className="items-grid">
          {items.map((item) => {
            const isMyItem =
              currentUser && item.owner?._id === currentUser._id;

            return (
              <div className="item-card" key={item._id}>

                {item.images && item.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000${item.images[0]}`}
                    alt={item.title}
                    className="item-image"
                    style={{
                      width:     "100%",
                      height:    "300px",   /* matches CSS */
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <div className="item-image">No Image</div>
                )}

                <h3>{item.title}</h3>

                {/* Description — show max 2 lines */}
                {item.description && (
                  <p style={{
                    fontSize:      "13px",
                    color:         "#555",
                    marginBottom:  "8px",
                    lineHeight:    "1.4",
                    // Show only 2 lines then cut off with "..."
                    display:             "-webkit-box",
                    WebkitLineClamp:     2,
                    WebkitBoxOrient:     "vertical",
                    overflow:            "hidden",
                  }}>
                    {item.description}
                  </p>
                )}

                <p style={{ fontSize: "12px", color: "black" }}>
                  Condition: {item.condition}
                </p>
                <p style={{ fontSize: "12px", color: "black" }}>
                  Size: {item.size}
                </p>
                <p style={{ fontSize: "12px", color: "#494949" }}>
                  By: {item.owner?.name}
                </p>

                {isMyItem ? (
                  <button
                    className="exchange-btn"
                    disabled
                    style={{
                      background: "#ccc",
                      cursor:     "not-allowed",
                    }}
                  >
                    Your Item
                  </button>
                ) : (
                  <button
                    className="exchange-btn"
                    onClick={() => handleRequestClick(item)}
                  >
                    Request Exchange
                  </button>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* SWAP REQUEST POPUP */}
      {showModal && selectedItem && (
        <SwapRequestModal
          selectedItem={selectedItem}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
          onSuccess={handleSuccess}
        />
      )}

      <Footer />
    </>
  );
}

export default Items;