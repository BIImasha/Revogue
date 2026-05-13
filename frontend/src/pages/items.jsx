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

  const params = new URLSearchParams(window.location.search);
  const [activeCategory, setActiveCategory] = useState(params.get("category") || "All");
  const [items,          setItems]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [searchTerm,     setSearchTerm]     = useState("");
  const [searchInput,    setSearchInput]    = useState("");
  const [showModal,      setShowModal]      = useState(false);
  const [selectedItem,   setSelectedItem]   = useState(null);
  const [successMsg,     setSuccessMsg]     = useState("");

  const navigate    = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("revogueUser"));

  useEffect(() => { fetchItems(); }, [activeCategory, searchTerm]);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      let url = "/items?";
      if (activeCategory !== "All") url += `category=${encodeURIComponent(activeCategory)}&`;
      if (searchTerm)               url += `search=${encodeURIComponent(searchTerm)}`;
      const response = await axiosInstance.get(url);
      setItems(response.data);
    } catch {
      setError("Failed to load items. Please try again.");
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const handleRequestClick = (item) => {
    if (!currentUser) { navigate("/login"); return; }
    if (item.owner?._id === currentUser._id) {
      alert("This is your own item! You cannot request it.");
      return;
    }
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSuccess = () => {
    setSuccessMsg("Swap request sent successfully! Check your Requests page.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="items-page">
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <div className="items-header">
        
        <h1>Exchange <em>Items</em></h1>
        <div className="items-header-divider" />
        <p className="items-header-sub">
          Browse and exchange pre-loved fashion items sustainably
        </p>
      </div>

      {/* ── SUCCESS BANNER ── */}
      {successMsg && (
        <div className="success-banner">
          <span>{successMsg}</span>
          <button className="success-banner-link" onClick={() => navigate("/requests")}>
            View Requests →
          </button>
        </div>
      )}

      {/* ── CONTROLS ── */}
      <div className="items-controls">

        {/* Search */}
        <form
          onSubmit={handleSearch}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="search-row">
            <input
              type="text"
              placeholder="Search items by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button type="button" className="search-clear-btn" onClick={handleClearSearch}>
                ✕
              </button>
            )}
            <button type="submit" className="search-submit-btn">Search</button>
          </div>
        </form>

        {/* Active search indicator */}
        {searchTerm && (
          <div className="search-indicator">
            Results for <strong>"{searchTerm}"</strong>
            {activeCategory !== "All" && <> in <strong>{activeCategory}</strong></>}
            <button className="search-indicator-clear" onClick={handleClearSearch}>
              ✕ Clear
            </button>
          </div>
        )}

        {/* Category filters */}
        <div className="filter-container">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* ── BODY ── */}
      <div className="items-body">

        {/* Loading */}
        {loading && (
          <p className="state-msg">Loading items…</p>
        )}

        {/* Error */}
        {error && (
          <p className="state-msg" style={{ color: "var(--declined)" }}>{error}</p>
        )}

        {/* Empty */}
        {!loading && !error && items.length === 0 && (
          <div className="state-msg">
            <span>
              {searchTerm
                ? `No items found for "${searchTerm}"`
                : "No items found in this category yet."}
            </span>
            {searchTerm && (
              <div>
                <button className="state-clear-btn" onClick={handleClearSearch}>
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}

        {/* Items grid */}
        {!loading && !error && items.length > 0 && (
          <div className="items-grid">
            {items.map((item) => {
              const isMyItem = currentUser && item.owner?._id === currentUser._id;

              return (
                <div className="item-card" key={item._id}>

                  {/* Image */}
                  <div className="item-image">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                      />
                    ) : (
                      <span className="item-image-empty">No Image</span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="item-card-body">
                    <h3>{item.title}</h3>

                    {item.description && (
                      <p className="item-desc">{item.description}</p>
                    )}

                    <div className="item-meta">
                      <div className="item-meta-row">
                        <span className="item-meta-label">Condition:</span>
                        <span className="item-meta-value">{item.condition}</span>
                      </div>
                      <div className="item-meta-row">
                        <span className="item-meta-label">Size:</span>
                        <span className="item-meta-value">{item.size}</span>
                      </div>
                      {item.material && (
                      <div className="item-meta-row">
                        <span className="item-meta-label">Material:</span>
                        <span className="item-meta-value">{item.material}</span>
                      </div>
                      )}
                      {item.color && (
                      <div className="item-meta-row">
                        <span className="item-meta-label">Color:</span>
                        <span className="item-meta-value">{item.color}</span>
                      </div>
                      )}
                      {item.style && (
                      <div className="item-meta-row">
                        <span className="item-meta-label">Style:</span>
                        <span className="item-meta-value">{item.style}</span>
                      </div>
                      )}
                    </div>

                    <p className="item-owner">By {item.owner?.name}</p>

                    <button
                      className="exchange-btn"
                      disabled={isMyItem}
                      onClick={() => !isMyItem && handleRequestClick(item)}
                    >
                      {isMyItem ? "Your Item" : "Request Exchange"}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Swap modal */}
      {showModal && selectedItem && (
        <SwapRequestModal
          selectedItem={selectedItem}
          onClose={() => { setShowModal(false); setSelectedItem(null); }}
          onSuccess={handleSuccess}
        />
      )}

      <Footer />
    </div>
  );
}

export default Items;