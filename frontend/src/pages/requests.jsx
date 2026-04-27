import React, { useState, useEffect } from "react";
import "./requests.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";
import Discussion from "../components/Discussion";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [message, setMessage]   = useState("");

  // Get current logged in user
  const currentUser = JSON.parse(localStorage.getItem("revogueUser"));

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/swaps");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to load requests");
    }
    setLoading(false);
  };

  // ── ACCEPT ─────────────────────────────────────────────
  const handleAccept = async (id) => {
    try {
      await axiosInstance.put(`/swaps/${id}/accept`);
      setMessage("Swap accepted! ✅");
      fetchRequests(); // Reload list
    } catch (err) {
      setMessage("Failed to accept swap.");
    }
  };

  // ── DECLINE ────────────────────────────────────────────
  const handleDecline = async (id) => {
    try {
      await axiosInstance.put(`/swaps/${id}/decline`);
      setMessage("Swap declined.");
      fetchRequests();
    } catch (err) {
      setMessage("Failed to decline swap.");
    }
  };
// ── CANCEL ─────────────────────────────────────────────
  const handleCancel = async (id) => {
    try {
      // Changed from PUT to DELETE
      await axiosInstance.delete(`/swaps/${id}/cancel`);
      setMessage("Swap cancelled and removed! ✅");
      fetchRequests(); // Reload list — cancelled request disappears
    } catch (err) {
      setMessage("Failed to cancel swap.");
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", padding: "50px" }}>Loading requests...</p>;
  }

  return (
    <>
      <Navbar />

      <div className="requests-container">
        <h2 className="requests-title">Swap Requests</h2>
        <p className="requests-subtitle">
          Browse and exchange pre-loved fashion items sustainably
        </p>
        
        {message && (
          <p style={{ textAlign: "center", color: "green", marginBottom: "15px" }}>
            {message}
          </p>
        )}

        {requests.length === 0 ? (
          <p style={{ textAlign: "center" }}>No swap requests yet.</p>
        ) : (
          requests.map((req) => {
            // Is this request sent BY me or TO me?
            const isIncoming = req.receiver?._id === currentUser?._id;

            return (
              <div className="request-card" key={req._id}>
                <div className="request-left">
                  <div className="image-placeholder"></div>
                </div>

                <div className="request-middle">
                  <h4>
                    {isIncoming ? "From" : "To"} :{" "}
                    <span>
                      {isIncoming
                        ? req.requester?.name
                        : req.receiver?.name}
                    </span>
                  </h4>
                  <p>
                    Wants: {req.requestedItem?.title} | Offers:{" "}
                    {req.offeredItem?.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "#888" }}>
                    Status: {req.status}
                  </p>
                </div>

               <div className="request-actions">
                  {/* Pending requests → Accept/Decline/Cancel */}
                  {req.status === "pending" && (
                    <>
                      {isIncoming ? (
                        <>
                          <button
                            className="btn accept-btn"
                            onClick={() => handleAccept(req._id)}
                          >
                            Accept
                          </button>
                          <button
                            className="btn decline-btn"
                            onClick={() => handleDecline(req._id)}
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn cancel-btn"
                          onClick={() => handleCancel(req._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}

                  {/* Accepted swaps → show status badge */}
                  {req.status === "accepted" && (
                    <span style={{
                      background:   "#d4edda",
                      color:        "#155724",
                      padding:      "4px 12px",
                      borderRadius: "20px",
                      fontSize:     "13px",
                      fontWeight:   "500"
                    }}>
                      ✅ Accepted
                    </span>
                  )}

                  {/* Declined swaps → show status badge */}
                  {req.status === "declined" && (
                    <span style={{
                      background:   "#f8d7da",
                      color:        "#721c24",
                      padding:      "4px 12px",
                      borderRadius: "20px",
                      fontSize:     "13px",
                      fontWeight:   "500"
                    }}>
                      ❌ Declined
                    </span>
                  )}
                </div>

              {/* Discussion section — only for accepted swaps */}
              {req.status === "accepted" && (
                <Discussion swap={req} />
              )}
              </div>
            );
          })
        )}
      </div>

      <Footer />
    </>
  );
};

export default Requests;
