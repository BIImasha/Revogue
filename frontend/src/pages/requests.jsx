import React, { useState, useEffect } from "react";
import "./requests.css";
import Navbar          from "../components/navbar";
import Footer          from "../components/footer";
import axiosInstance   from "../api/axiosInstance";
import Discussion      from "../components/Discussion";
import SwapDetailModal from "../components/SwapDetailModal";

const Requests = () => {
  const [requests,     setRequests]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [message,      setMessage]      = useState("");
  const [selectedSwap, setSelectedSwap] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("revogueUser"));

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/swaps");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to load requests");
    }
    setLoading(false);
  };

  const handleAccept = async (id) => {
    try {
      await axiosInstance.put(`/swaps/${id}/accept`);
      setMessage("Swap accepted successfully.");
      fetchRequests();
    } catch { setMessage("Failed to accept swap."); }
  };

  const handleDecline = async (id) => {
    try {
      await axiosInstance.put(`/swaps/${id}/decline`);
      setMessage("Swap declined.");
      fetchRequests();
    } catch { setMessage("Failed to decline swap."); }
  };

  const handleCancel = async (id) => {
    try {
      await axiosInstance.delete(`/swaps/${id}/cancel`);
      setMessage("Swap cancelled.");
      fetchRequests();
    } catch { setMessage("Failed to cancel swap."); }
  };

  const pending  = requests.filter((r) => r.status === "pending");
  const accepted = requests.filter((r) => r.status === "accepted");
  const declined = requests.filter((r) => r.status === "declined");

  const renderCard = (req) => {
    const isIncoming = req.receiver?._id === currentUser?._id;

    return (
      <div key={req._id}>
        <div
          className={`request-card request-card--${req.status}`}
          onClick={() => setSelectedSwap(req)}
          title="Click to view full details"
        >
          {/* Content */}
          <div className="request-middle">
            <h4>
              {isIncoming ? "From" : "To"}:{" "}
              <span>{isIncoming ? req.requester?.name : req.receiver?.name}</span>
            </h4>
            <p>
              Wants: <strong>{req.requestedItem?.title}</strong>
              {" · "}
              Offers: <strong>{req.offeredItem?.title}</strong>
            </p>
            <p className="card-meta">
              {req.status}&nbsp;&nbsp;
              <span className="card-meta__cta">View full details →</span>
            </p>
          </div>

          {/* Actions */}
          <div className="request-actions" onClick={(e) => e.stopPropagation()}>
            {req.status === "pending" && (
              isIncoming ? (
                <>
                  <button className="btn accept-btn"  onClick={() => handleAccept(req._id)}>Accept</button>
                  <button className="btn decline-btn" onClick={() => handleDecline(req._id)}>Decline</button>
                </>
              ) : (
                <button className="btn cancel-btn" onClick={() => handleCancel(req._id)}>Cancel</button>
              )
            )}
            {req.status === "accepted" && <span className="badge accepted">Accepted</span>}
            {req.status === "declined" && <span className="badge declined">Declined</span>}
            {req.status === "accepted" && <Discussion swap={req} />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="requests-page">
      <Navbar />

      {/* ── HEADER ── */}
      <div className="requests-header">
        <h2 className="requests-title">Swap <em>Requests</em></h2>
        <div className="requests-header-divider" />
        <p className="requests-subtitle">Manage your incoming and outgoing swap requests</p>
      </div>

      {/* ── BODY ── */}
      {loading ? (
        <p className="requests-loading">Loading requests…</p>
      ) : (
        <div className="requests-container">

          {message && <p className="requests-message">{message}</p>}

          {requests.length === 0 ? (
            <p className="requests-empty">No swap requests yet.</p>
          ) : (
            <>
              {/* Pending */}
              <section className="requests-section">
                <h3 className="section-heading section-heading--pending">
                  Pending
                  <span className="section-count">{pending.length}</span>
                </h3>
                {pending.length === 0
                  ? <p className="section-empty">No pending requests.</p>
                  : pending.map(renderCard)
                }
              </section>

              {/* Accepted */}
              <section className="requests-section">
                <h3 className="section-heading section-heading--accepted">
                  Accepted
                  <span className="section-count">{accepted.length}</span>
                </h3>
                {accepted.length === 0
                  ? <p className="section-empty">No accepted requests.</p>
                  : accepted.map(renderCard)
                }
              </section>

              {/* Declined */}
              <section className="requests-section">
                <h3 className="section-heading section-heading--declined">
                  Declined
                  <span className="section-count">{declined.length}</span>
                </h3>
                {declined.length === 0
                  ? <p className="section-empty">No declined requests.</p>
                  : declined.map(renderCard)
                }
              </section>
            </>
          )}
        </div>
      )}

      {selectedSwap && (
        <SwapDetailModal
          swap={selectedSwap}
          currentUserId={currentUser?._id}
          onClose={() => setSelectedSwap(null)}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onCancel={handleCancel}
        />
      )}

      <Footer />
    </div>
  );
};

export default Requests;