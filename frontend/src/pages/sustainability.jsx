import React, { useState, useEffect } from "react";
import "./sustainability.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ── CATEGORY COLORS (muted to fit dark theme) ────────────
const CATEGORY_COLORS = {
  "Womens Clothing": "#df45ea",        
  "Mens Clothing": "#3E5C76",          
  "Kids Clothing": "#F4C95D",         
  "Footwear": "#C08457",              
  "Accessories": "#8E7DBE",           
  "Jewelry": "#D4AF37",               
  "Outerwear & Seasonal Wear": "#2F3E46", 
  "Bags & Carry Items": "#4DB6AC"     
};

// ── CUSTOM TOOLTIP ────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="sustain-tooltip">
        <p className="sustain-tooltip-title">{d.category}</p>
        <p className="sustain-tooltip-row">{d.itemsReused} items reused</p>
        <p className="sustain-tooltip-row">{d.co2Saved} kg CO₂ saved</p>
        <p className="sustain-tooltip-row">{d.waterSaved.toLocaleString()} L water saved</p>
        <p className="sustain-tooltip-row">£{d.moneySaved} saved</p>
      </div>
    );
  }
  return null;
};

// ── STAT CARD ─────────────────────────────────────────────
function StatCard({ value, label, highlight }) {
  return (
    <div className={`sustain-stat-card${highlight ? " highlight" : ""}`}>
      <p className="sustain-stat-value">{value}</p>
      <p className="sustain-stat-label">{label}</p>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────
function Sustainability() {
  const [data,         setData]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [selectedCats, setSelectedCats] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("revogueUser"));

  useEffect(() => { fetchSustainabilityData(); }, []);

  const fetchSustainabilityData = async () => {
    try {
      const res = await axiosInstance.get("/admin/sustainability/public");
      setData(res.data);
    } catch {
      setError("Failed to load sustainability data.");
    }
    setLoading(false);
  };

  const myStats = data?.userStats?.find(u => u.email === currentUser?.email);

  const toggleCategory = (cat) => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredBreakdown = data
    ? (selectedCats.length === 0
        ? data.categoryBreakdown
        : data.categoryBreakdown.filter(c => selectedCats.includes(c.category)))
    : [];

  const filteredSummary = filteredBreakdown.reduce(
    (acc, c) => ({
      itemsReused: acc.itemsReused + c.itemsReused,
      co2Saved:    Math.round((acc.co2Saved + c.co2Saved) * 10) / 10,
      waterSaved:  acc.waterSaved + c.waterSaved,
      moneySaved:  acc.moneySaved + c.moneySaved,
    }),
    { itemsReused: 0, co2Saved: 0, waterSaved: 0, moneySaved: 0 }
  );

  const pieData = filteredBreakdown.filter(c => c.itemsReused > 0);

  // ── LOADING / ERROR ───────────────────────────────────
  if (loading) return (
    <div className="sustain-page">
      <Navbar />
      <p className="sustain-loading">Loading sustainability data…</p>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="sustain-page">
      <Navbar />
      <p className="sustain-loading" style={{ color: "var(--error)" }}>{error}</p>
      <Footer />
    </div>
  );

  return (
    <div className="sustain-page">
      <Navbar />

      {/* ── HEADER ── */}
      <div className="sustain-header">
        <h1 className="sustain-title">Sustainability <em>Impact</em></h1>
        <div className="sustain-header-divider" />
        <p className="sustain-subtitle">
          See how Revogue is making a real difference for our planet
        </p>
      </div>

      <div className="sustain-container">

        {/* ══════════════════════════════════════════════ */}
        {/* INTERACTIVE DASHBOARD                         */}
        {/* ══════════════════════════════════════════════ */}
        <div className="sustain-block">
          <p className="sustain-block-title">Interactive Dashboard</p>
          <div className="sustain-block-divider" />

          {/* Category filter */}
          <div className="filter-strip">
            <span className="filter-strip-label">Filter by Category</span>
            <div className="filter-btns">
              <button
                className={`filter-cat-btn all-btn${selectedCats.length === 0 ? " active" : ""}`}
                onClick={() => setSelectedCats([])}
              >
                All Categories
              </button>
              {data.categoryBreakdown.map(cat => (
                <button
                  key={cat.category}
                  className={`filter-cat-btn${selectedCats.includes(cat.category) ? " active" : ""}`}
                  style={selectedCats.includes(cat.category) ? {
                    background: CATEGORY_COLORS[cat.category],
                    borderColor: CATEGORY_COLORS[cat.category],
                    color: "#0D0C0A"
                  } : {
                    borderColor: CATEGORY_COLORS[cat.category],
                    color: CATEGORY_COLORS[cat.category]
                  }}
                  onClick={() => toggleCategory(cat.category)}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          </div>

          {/* Stat cards */}
          <div className="sustain-stats-grid">
            <StatCard
              value={filteredSummary.itemsReused}
              label="Total Items Reused"
              highlight
            />
            <StatCard
              value={`${filteredSummary.co2Saved} kg`}
              label="CO₂ Saved"
            />
            <StatCard
              value={`${filteredSummary.waterSaved.toLocaleString()} L`}
              label="Water Saved"
            />
            <StatCard
              value={`£${filteredSummary.moneySaved}`}
              label="Community Savings"
            />
          </div>

          {/* Pie chart */}
          <p className="chart-panel-title">
              Items Reused by Category
            </p>
          <div className="chart-panel">
            {pieData.length === 0 ? (
              <p className="chart-empty">No swaps in selected categories yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="itemsReused"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={50}
                    paddingAngle={3}
                    label={({ category, percent }) =>
                      `${category.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={CATEGORY_COLORS[entry.category] || "#7AAB8A"}
                        opacity={0.85}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{
                        fontSize: "0.68rem",
                        fontFamily: "'Jost', sans-serif",
                        color: "#B8B4AC",
                        letterSpacing: "0.04em"
                      }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Table */}
          <p className="sustain-block-title" style={{ marginBottom: "0.8rem" }}>
            Impact by Category
          </p>
          <div className="sustain-table-card">
            <table className="sustain-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Items Reused</th>
                  <th>CO₂ Saved (kg)</th>
                  <th>Water Saved (L)</th>
                  <th>Money Saved (£)</th>
                </tr>
              </thead>
              <tbody>
                {filteredBreakdown
                  .sort((a, b) => b.itemsReused - a.itemsReused)
                  .map((cat, i) => (
                    <tr key={i} style={{ opacity: cat.itemsReused === 0 ? 0.4 : 1 }}>
                      <td>
                        <span
                          className="cat-dot"
                          style={{ background: CATEGORY_COLORS[cat.category] || "#7AAB8A" }}
                        />
                        {cat.category}
                      </td>
                      <td style={{ textAlign: "center" }}>{cat.itemsReused}</td>
                      <td style={{ textAlign: "center" }}>{cat.co2Saved}</td>
                      <td style={{ textAlign: "center" }}>{cat.waterSaved.toLocaleString()}</td>
                      <td style={{ textAlign: "center" }}>£{cat.moneySaved}</td>
                    </tr>
                  ))}
                <tr className="total-row">
                  <td>Total</td>
                  <td style={{ textAlign: "center" }}>{filteredSummary.itemsReused}</td>
                  <td style={{ textAlign: "center" }}>{filteredSummary.co2Saved}</td>
                  <td style={{ textAlign: "center" }}>{filteredSummary.waterSaved.toLocaleString()}</td>
                  <td style={{ textAlign: "center" }}>£{filteredSummary.moneySaved}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ══════════════════════════════════════════════ */}
        {/* PERSONAL IMPACT                               */}
        {/* ══════════════════════════════════════════════ */}
        {currentUser && (
          <div className="sustain-block">
            <p className="sustain-block-title">Your Personal Impact</p>
            <div className="sustain-block-divider" />

            <div className="personal-stats-card">
              {myStats ? (
                <>
                  <p className="personal-stats-intro">
                    Based on your {myStats.swapCount} completed swap{myStats.swapCount !== 1 ? "s" : ""} — {myStats.itemsReused} items reused.
                  </p>
                  <div className="personal-stats-grid">
                    <div className="personal-stat-item">
                      <p className="personal-stat-value">{myStats.itemsReused}</p>
                      <p className="personal-stat-label">Items Reused</p>
                    </div>
                    <div className="personal-stat-item">
                      <p className="personal-stat-value">{myStats.co2Saved} kg</p>
                      <p className="personal-stat-label">CO₂ Saved</p>
                    </div>
                    <div className="personal-stat-item">
                      <p className="personal-stat-value">{myStats.waterSaved.toLocaleString()} L</p>
                      <p className="personal-stat-label">Water Saved</p>
                    </div>
                    <div className="personal-stat-item">
                      <p className="personal-stat-value">£{myStats.moneySaved}</p>
                      <p className="personal-stat-label">Money Saved</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="personal-empty">
                  <p>No swaps completed yet.</p>
                  <small>Start swapping to see your personal sustainability impact here.</small>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* RESEARCH SOURCES                              */}
        {/* ══════════════════════════════════════════════ */}
        <div className="sustain-block">
          <p className="sustain-block-title">Research Sources</p>
          <div className="sustain-block-divider" />

          <div className="sources-card">
            <p className="sources-intro">
              All sustainability figures are based on peer-reviewed academic research.
            </p>
            <ul>
              {data.sources.map((source, i) => (
                <li key={i}>{source}</li>
              ))}
            </ul>
            <p className="sources-disclaimer">
              All figures are industry-average estimates. Actual values may vary by item type and material.
            </p>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Sustainability;