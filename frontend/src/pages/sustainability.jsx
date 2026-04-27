import React, { useState, useEffect } from "react";
import "./sustainability.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ── CATEGORY COLORS ──────────────────────────────────────
const CATEGORY_COLORS = {
  "Women's Clothing":          "#4A7C59",
  "Men's Clothing":            "#2E5D3B",
  "Kids' Clothing":            "#76B890",
  "Footwear":                  "#A8D5B5",
  "Accessories":               "#F4A261",
  "Jewelry":                   "#E76F51",
  "Outerwear & Seasonal Wear": "#264653",
  "Bags & Carry Items":        "#2A9D8F",
};

// ── CUSTOM TOOLTIP FOR PIE CHART ─────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        background:   "#fff",
        border:       "1px solid #e0e0e0",
        borderRadius: "10px",
        padding:      "12px 16px",
        boxShadow:    "0 4px 16px rgba(0,0,0,0.10)",
        fontSize:     "13px",
        minWidth:     "160px"
      }}>
        <p style={{ fontWeight: 700, color: "#2E5D3B", margin: "0 0 6px 0" }}>
          {d.category}
        </p>
        <p style={{ margin: "2px 0", color: "#555" }}>♻️ {d.itemsReused} items reused</p>
        <p style={{ margin: "2px 0", color: "#555" }}>💨 {d.co2Saved} kg CO₂</p>
        <p style={{ margin: "2px 0", color: "#555" }}>💧 {d.waterSaved.toLocaleString()} L water</p>
        <p style={{ margin: "2px 0", color: "#555" }}>💰 £{d.moneySaved} saved</p>
      </div>
    );
  }
  return null;
};

// ── ANIMATED STAT CARD ───────────────────────────────────
function StatCard({ icon, value, label, sub, highlight }) {
  return (
    <div
      style={{
        background:    highlight ? "linear-gradient(135deg, #2E5D3B, #4A7C59)" : "#fff",
        color:         highlight ? "#fff" : "#1a1a1a",
        borderRadius:  "16px",
        padding:       "24px 20px",
        boxShadow:     highlight
          ? "0 8px 32px rgba(46,93,59,0.25)"
          : "0 2px 12px rgba(0,0,0,0.07)",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        gap:           "6px",
        transition:    "transform 0.2s, box-shadow 0.2s",
        cursor:        "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = highlight
          ? "0 16px 40px rgba(46,93,59,0.35)"
          : "0 8px 24px rgba(0,0,0,0.13)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = highlight
          ? "0 8px 32px rgba(46,93,59,0.25)"
          : "0 2px 12px rgba(0,0,0,0.07)";
      }}
    >
      <span style={{ fontSize: "32px" }}>{icon}</span>
      <p style={{
        fontSize:   "36px",
        fontWeight: "800",
        margin:     "4px 0 0 0",
        color:      highlight ? "#fff" : "#2E5D3B",
        lineHeight: 1,
      }}>{value}</p>
      <p style={{
        fontSize:  "13px",
        fontWeight: "600",
        margin:    "2px 0 0 0",
        color:     highlight ? "rgba(255,255,255,0.9)" : "#444",
        textAlign: "center",
      }}>{label}</p>
      {sub && (
        <p style={{
          fontSize: "11px",
          margin:   "2px 0 0 0",
          color:    highlight ? "rgba(255,255,255,0.65)" : "#999",
        }}>{sub}</p>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────
function Sustainability() {
  const [data, setData]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [selectedCats, setSelectedCats] = useState([]); // empty = show all

  const currentUser = JSON.parse(localStorage.getItem("revogueUser"));

  useEffect(() => { fetchSustainabilityData(); }, []);

  const fetchSustainabilityData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/sustainability/public");
      setData(res.data);
    } catch (err) {
      setError("Failed to load sustainability data.");
    }
    setLoading(false);
  };

  const myStats = data?.userStats?.find(u => u.email === currentUser?.email);

  // ── FILTER LOGIC ─────────────────────────────────────
  const toggleCategory = (cat) => {
    setSelectedCats(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
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

  // Only show categories with data in pie chart
  const pieData = filteredBreakdown.filter(c => c.itemsReused > 0);

  // ── LOADING / ERROR ───────────────────────────────────
  if (loading) return (
    <>
      <Navbar />
      <div className="sustain-loading"> Loading sustainability data...</div>
      <Footer />
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="sustain-loading" style={{ color: "red" }}>{error}</div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className="sustain-container">

        {/* HEADER */}
        <h1 className="sustain-title">Sustainability Impact</h1>
        <p className="sustain-subtitle">
          See how Revogue is making a real difference for our planet
        </p>

        {/* ══════════════════════════════════════════════ */}
        {/* INTERACTIVE DASHBOARD                         */}
        {/* ══════════════════════════════════════════════ */}
        <div className="powerbi-section">
          <p className="sustain-section-title"> Interactive Sustainability Dashboard</p>

          {/* ── CATEGORY FILTER SLICER ── */}
          <div style={{
            background:   "#f8faf9",
            border:       "1px solid #d4e8da",
            borderRadius: "14px",
            padding:      "18px 20px",
            marginBottom: "24px"
          }}>
            <p style={{
              fontSize:      "13px",
              fontWeight:    "700",
              color:         "#2E5D3B",
              margin:        "0 0 12px 0",
              textTransform: "uppercase",
              letterSpacing: "0.08em"
            }}>
               Filter by Category
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>

              {/* Select All button */}
              <button
                onClick={() => setSelectedCats([])}
                style={{
                  padding:      "7px 16px",
                  borderRadius: "20px",
                  border:       "2px solid #2E5D3B",
                  background:   selectedCats.length === 0 ? "#2E5D3B" : "transparent",
                  color:        selectedCats.length === 0 ? "#fff" : "#2E5D3B",
                  fontWeight:   "700",
                  fontSize:     "12px",
                  cursor:       "pointer",
                  transition:   "all 0.2s",
                }}
              >
                All Categories
              </button>

              {data.categoryBreakdown.map(cat => {
                const isSelected = selectedCats.includes(cat.category);
                const color = CATEGORY_COLORS[cat.category] || "#4A7C59";
                return (
                  <button
                    key={cat.category}
                    onClick={() => toggleCategory(cat.category)}
                    style={{
                      padding:      "7px 14px",
                      borderRadius: "20px",
                      border:       `2px solid ${color}`,
                      background:   isSelected ? color : "transparent",
                      color:        isSelected ? "#fff" : color,
                      fontWeight:   "600",
                      fontSize:     "12px",
                      cursor:       "pointer",
                      transition:   "all 0.2s",
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "5px",
                    }}
                  >
                    {isSelected && <span>✓</span>}
                    {cat.category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── FILTERED STAT CARDS ── */}
          <div className="sustain-stats-grid" style={{ marginBottom: "28px" }}>
            <StatCard 
              /*icon="♻️"*/
              value={filteredSummary.itemsReused}
              label="Total Items Reused"
              /*sub="1 swap = 2 items reused"*/
              highlight={true}
            />
            <StatCard
              /*icon="💨"*/
              value={`${filteredSummary.co2Saved} kg`}
              label="CO₂ Saved"
              /*sub="Both items combined"*/
            />
            <StatCard
              /*icon="💧"*/
              value={`${filteredSummary.waterSaved.toLocaleString()} L`}
              label="Water Saved"
              /*sub="Both items combined"*/
            />
            <StatCard
              /*icon="💰"*/
              value={`£${filteredSummary.moneySaved}`}
              label="Community Savings"
              /*sub="Both items combined"*/
            />
          </div>

          {/* ── PIE CHART ── */}
          <div style={{
            background:   "#fff",
            borderRadius: "16px",
            padding:      "24px",
            boxShadow:    "0 2px 12px rgba(0,0,0,0.07)",
            marginBottom: "28px"
          }}>
            <p style={{ fontSize: "20px", fontWeight: "700", color: "#333", margin: "0 0 16px 0" }}>
               Items Reused by Category
            </p>

            {pieData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#aaa" }}>
                <p style={{ fontSize: "32px", margin: "0 0 8px 0" }}>🌱</p>
                <p style={{ margin: 0 }}>No swaps in selected categories yet!</p>
              </div>
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
                    labelLine={true}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={CATEGORY_COLORS[entry.category] || "#4A7C59"}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: "12px", color: "#444" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── CATEGORY BREAKDOWN TABLE ── */}
          <p className="sustain-section-title" style={{ marginTop: "8px" }}>
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
                    <tr key={i} style={{ opacity: cat.itemsReused === 0 ? 0.45 : 1, transition: "opacity 0.2s" }}>
                      <td>
                        <span style={{
                          display:       "inline-block",
                          width:         "10px",
                          height:        "10px",
                          borderRadius:  "50%",
                          background:    CATEGORY_COLORS[cat.category] || "#4A7C59",
                          marginRight:   "8px",
                          verticalAlign: "middle"
                        }} />
                        <strong>{cat.category}</strong>
                      </td>
                      <td style={{ textAlign: "center" }}>{cat.itemsReused}</td>
                      <td style={{ textAlign: "center" }}>{cat.co2Saved}</td>
                      <td style={{ textAlign: "center" }}>{cat.waterSaved.toLocaleString()}</td>
                      <td style={{ textAlign: "center" }}>£{cat.moneySaved}</td>
                    </tr>
                  ))}
                <tr style={{ fontWeight: "700", background: "#f0f7f2" }}>
                  <td>TOTAL</td>
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
          <div className="personal-stats-card">
            <p className="sustain-section-title"> Your Personal Impact</p>
            {myStats ? (
              <>
                <p style={{ color: "#666", fontSize: "13px", marginBottom: "16px" }}>
                  Based on your {myStats.swapCount} completed swap{myStats.swapCount !== 1 ? "s" : ""} , {myStats.itemsReused} items reused! 
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
              <div style={{
                textAlign: "center", padding: "30px",
                color: "#888", background: "#f9f9f9", borderRadius: "10px"
              }}>
                <p style={{ fontSize: "30px", margin: "0 0 8px 0" }}>🌱</p>
                <p style={{ margin: 0, fontWeight: "500" }}>You haven't completed any swaps yet!</p>
                <p style={{ margin: "6px 0 0 0", fontSize: "13px" }}>
                  Start swapping to see your personal sustainability impact here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* RESEARCH SOURCES                              */}
        {/* ══════════════════════════════════════════════ */}
        <div className="sources-card">
          <h3> Research Sources</h3>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "12px" }}>
            All sustainability figures are based on peer-reviewed academic research:
          </p>
          <ul>
            {data.sources.map((source, i) => (
              <li key={i}>{source}</li>
            ))}
          </ul>
          <p style={{ fontSize: "12px", color: "#aaa", marginTop: "12px", fontStyle: "italic" }}>
            ⚠️ All figures are industry-average estimates based on peer-reviewed research.
            Actual values may vary by item type and material.
          </p>
        </div>

      </div>
      <Footer />
    </>
  );
}

export default Sustainability;