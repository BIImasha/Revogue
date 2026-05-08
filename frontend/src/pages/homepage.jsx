import React, { useState, useEffect } from "react";
import "./homepage.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";

function Homepage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axiosInstance.get("/feedback");
      setFeedbacks(res.data.slice(0, 3));
    } catch (err) {
      console.error("Failed to load feedbacks");
    }
    setLoadingFeedbacks(false);
  };

  const renderStars = (rating) =>
    "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            Welcome to<br /><em>REVOGUE</em>
          </h1>
          <h2>Style Meets Sustainability</h2>
          <p>
            At Revogue, elegance finds purpose in unity. We bring together a
            community of conscious fashion lovers who swap, share, and celebrate
            style — where every exchange nurtures the planet and every choice
            reflects mindful living.
          </p>
          <div className="hero-btns">
            <button
              className="explore-btn"
              onClick={() => (window.location.href = "/items")}
            >
              Explore Now
            </button>
            <button
              className="impact-btn"
              onClick={() => (window.location.href = "/sustainability")}
            >
              View Impact
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image">
            <img src="/src/assets/homepg1.jpg" alt="Sustainable fashion" />
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE REVOGUE ── */}
      <section className="why-section">
        <h2>Why Choose <em>Revogue?</em></h2>
        <p className="why-sub">
          A movement that combines style with sustainability
        </p>
        <div className="why-grid">
          {[
            {
              num: "01",
              title: "Eco-Friendly",
              text: "Reduce fashion waste and contribute to a more sustainable planet with every swap.",
            },
            {
              num: "02",
              title: "Community Driven",
              text: "Connect with like-minded fashion enthusiasts who share your values and style.",
            },
            {
              num: "03",
              title: "Endless Variety",
              text: "Refresh your wardrobe constantly without the environmental cost of new purchases.",
            },
            {
              num: "04",
              title: "Quality First",
              text: "Every item is pre-loved and carefully curated to ensure quality and style.",
            },
          ].map((card) => (
            <div className="why-card" key={card.num}>
              <div className="why-card-num">{card.num}</div>
              <div className="why-card-line" />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REWEAR RACK ── */}
      <section className="category-section">
        <div className="category-section-header">
          <h2><em>Rewear</em> Rack</h2>
        <p>
          Where pre-loved fashion finds new life. Discover timeless pieces that
          blend style, sustainability, and second chances — because great style
          deserves to be worn again.
        </p>
          
        </div>

        <div className="category-grid">
          {[
            { src: "/src/assets/women_clothing.jpg",        label: "Women's Clothing" },
            { src: "/src/assets/men_clothing.jpg",          label: "Men's Clothing" },
            { src: "/src/assets/kids_clothing.png",         label: "Kids' Clothing" },
            { src: "/src/assets/footwear.jpg",              label: "Footwear" },
            { src: "/src/assets/accessories.png",           label: "Accessories" },
            { src: "/src/assets/jewelry.jpg",               label: "Jewelry" },
            { src: "/src/assets/outwear&seasonalwear.png",  label: "Outerwear & Seasonal" },
            { src: "/src/assets/bags&carryitems.png",       label: "Bags & Carry Items" },
          ].map((cat) => (
            <div
              className="category-card"
              key={cat.label}
              onClick={() => (window.location.href = `/items?category=${encodeURIComponent(cat.label)}`)}
            >
              <div className="category-card-img">
                <img src={cat.src} alt={cat.label} />
              </div>
              <div className="category-card-label">{cat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMUNITY REVIEWS ── */}
      <section className="review-section">
        <h2>What Our <em>Community</em> Says</h2>
        <p className="review-sub">Together, we grow Revogue.</p>
      

        {loadingFeedbacks && (
          <p className="review-empty">Loading reviews...</p>
        )}

        {!loadingFeedbacks && feedbacks.length === 0 && (
          <p className="review-empty">
            No reviews yet. Be the first to share your experience!
          </p>
        )}

        <div className="review-grid">
          {feedbacks.map((fb) => (
            <div className="review-card" key={fb._id}>
              <p>{fb.text}</p>
              <div className="stars">{renderStars(fb.rating)}</div>
              <h4>— {fb.user?.name}</h4>
              <small>{new Date(fb.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Homepage;