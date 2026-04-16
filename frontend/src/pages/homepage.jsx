import React, { useState, useEffect } from "react";
import "./homepage.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";

function Homepage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  // Load feedbacks when homepage opens
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axiosInstance.get("/feedback");
      // Only show latest 3 feedbacks on homepage
      setFeedbacks(res.data.slice(0, 3));
    } catch (err) {
      console.error("Failed to load feedbacks");
    }
    setLoadingFeedbacks(false);
  };

  // Helper to render stars
  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <>
      <Navbar />

      {/* Hero section */}
      <section className="hero">
        <div className="hero-left">
          <h1>Welcome to REVOGUE</h1>
          <h2>Style Meets Sustainability</h2>
          <p>
            At Revogue, elegance finds purpose in unity.
            We bring together a community of conscious fashion lovers who swap,
            share, and celebrate style — where every exchange nurtures the
            planet and every choice reflects mindful living.
          </p>
          <button
            className="hero-btn"
            onClick={() => (window.location.href = "/items")}
          >
            Explore Now
          </button>
        </div>

        <div className="hero-right">
          <div className="hero-image">
            <img src="/src/assets/homepg1.jpg" alt="Hero" />
          </div>
        </div>
      </section>

      {/* WHY CHOOSE REVOGUE */}
      <section className="why-section">
        <h2>Why Choose Revogue?</h2>
        <p className="why-sub">
          Join a movement that combines style with sustainability
        </p>

        <div className="why-grid">
          <div className="why-card">
            <h3>Eco-Friendly</h3>
            <p>
              Reduce fashion waste and contribute to a more sustainable planet
              with every swap.
            </p>
          </div>

          <div className="why-card">
            <h3>Community Driven</h3>
            <p>
              Connect with like-minded fashion enthusiasts who share your
              values and style.
            </p>
          </div>

          <div className="why-card">
            <h3>Endless Variety</h3>
            <p>
              Refresh your wardrobe constantly without the environmental cost
              of new purchases.
            </p>
          </div>

          <div className="why-card">
            <h3>Quality First</h3>
            <p>
              Every item is pre-loved and carefully curated to ensure quality
              and style.
            </p>
          </div>
        </div>
      </section>

      {/* REWEAR RACK */}
      <section className="rewear-section">
        <h2>Rewear Rack</h2>
        <p>
          Where pre-loved fashion finds new life. Discover timeless pieces that
          blend style, sustainability, and second chances — because great style
          deserves to be worn again.
        </p>
      </section>

      {/* CATEGORY GRID */}
      <section className="category-section">
        <div className="category-grid">
          <div className="category-card">
            <img src="/src/assets/women_clothing.jpg" alt="Women's Clothing" />
            <p>Women's Clothing</p>
          </div>

          <div className="category-card">
            <img src="/src/assets/men_clothing.jpg" alt="Men's Clothing" />
            <p>Men's Clothing</p>
          </div>

          <div className="category-card">
            <img src="/src/assets/kids_clothing.png" alt="Kids' Clothing" />
            <p>Kids' Clothing</p>
          </div>

          <div className="category-card">
            <img src="/src/assets/footwear.jpg" alt="Footwear" />
            <p>Footwear</p>
          </div>

          <div className="category-card">
            <img src="/src/assets/accessories.png" alt="Accessories" />
            <p>Accessories</p>
          </div>

          <div className="category-card">
            <img src="/src/assets/jewelry.jpg" alt="Jewelry" />
            <p>Jewelry</p>
          </div>

          <div className="category-card">
            <img
              src="/src/assets/outwear&seasonalwear.png"
              alt="Outerwear & Seasonal Wear"
            />
            <p>Outerwear & Seasonal Wear</p>
          </div>

          <div className="category-card">
            <img
              src="/src/assets/bags&carryitems.png"
              alt="Bags & Carry Items"
            />
            <p>Bags & Carry Items</p>
          </div>
        </div>
      </section>

      {/* COMMUNITY REVIEWS — Now shows REAL data! */}
      <section className="review-section">
        <h2>What Our Community Says</h2>
        <p className="review-sub">
          Join thousands of satisfied members who are making a difference
        </p>

        {/* Loading state */}
        {loadingFeedbacks && (
          <p style={{ textAlign: "center", color: "#888" }}>
            Loading reviews...
          </p>
        )}

        {/* No feedbacks yet */}
        {!loadingFeedbacks && feedbacks.length === 0 && (
          <p style={{ textAlign: "center", color: "#888" }}>
            No reviews yet. Be the first to share your experience!
          </p>
        )}

        {/* Real feedbacks from database */}
        <div className="review-grid">
          {feedbacks.map((fb) => (
            <div className="review-card" key={fb._id}>
              <p>"{fb.text}"</p>
              <div className="stars">{renderStars(fb.rating)}</div>
              <h4>- {fb.user?.name}</h4>
              <small style={{ color: "#aaa", fontSize: "12px" }}>
                {new Date(fb.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Homepage;