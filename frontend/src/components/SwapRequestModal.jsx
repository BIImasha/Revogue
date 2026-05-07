import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function SwapRequestModal({ selectedItem, onClose, onSuccess }) {
  // selectedItem = the item the user wants to get
  // onClose = function to close the popup
  // onSuccess = function called after successful request

  const [myItems, setMyItems]       = useState([]); // User's own items
  const [offeredItem, setOfferedItem] = useState(""); // Item they choose to offer
  const [message, setMessage]       = useState(""); // Optional message
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [fetchingItems, setFetchingItems] = useState(true);

  // Load user's own items when popup opens
  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const res = await axiosInstance.get("/items/myitems");

      // Only show items that are still available
      // Also remove the item they are requesting
      // (can't offer the same item you're requesting)
      const available = res.data.filter(
        (item) =>
          item.status === "available" &&
          item._id !== selectedItem._id
      );

      setMyItems(available);
    } catch (err) {
      setError("Failed to load your items.");
    }
    setFetchingItems(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Make sure they selected an item to offer
    if (!offeredItem) {
      setError("Please select an item to offer!");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/swaps", {
        requestedItemId: selectedItem._id,
        offeredItemId:   offeredItem,
        message:         message,
      });

      onSuccess(); // Tell parent it worked
      onClose();   // Close the popup

    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* ── DARK BACKGROUND OVERLAY ── */}
      <div
        onClick={onClose}
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          width:           "100%",
          height:          "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex:          999,
        }}
      />

      {/* ── POPUP BOX ── */}
      <div
        style={{
          position:        "fixed",
          top:             "50%",
          left:            "50%",
          transform:       "translate(-50%, -50%)",
          backgroundColor: "#fff",
          borderRadius:    "12px",
          padding:         "32px",
          width:           "90%",
          maxWidth:        "480px",
          zIndex:          1000,
          boxShadow:       "0 10px 40px rgba(0,0,0,0.2)",
        }}
      >
        {/* ── CLOSE BUTTON ── */}
        <button
          onClick={onClose}
          style={{
            position:   "absolute",
            top:        "16px",
            right:      "16px",
            background: "none",
            border:     "none",
            fontSize:   "20px",
            cursor:     "pointer",
            color:      "#666",
          }}
        >
          ✕
        </button>

        {/* ── TITLE ── */}
        <h2 style={{ marginBottom: "8px", fontSize: "20px" , color: "black"}}>
          Request Exchange
        </h2>
        <p style={{ color: "#666", marginBottom: "20px", fontSize: "14px" }}>
          You are requesting:
        </p>

        {/* ── ITEM THEY WANT ── */}
        <div
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          "12px",
            padding:      "12px",
            background:   "#f9f9f9",
            borderRadius: "8px",
            marginBottom: "20px",
            color:        "black",
          }}
        >
          {/* Item image */}
          {selectedItem.images && selectedItem.images.length > 0 ? (
            <img
              src={`http://localhost:5000${selectedItem.images[0]}`}
              alt={selectedItem.title}
              style={{
                width:        "60px",
                height:       "60px",
                objectFit:    "cover",
                borderRadius: "6px",
              }}
            />
          ) : (
            <div
              style={{
                width:           "60px",
                height:          "60px",
                background:      "#ddd",
                borderRadius:    "6px",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                fontSize:        "11px",
                color:           "#888",
              }}
            >
              No Image
            </div>
          )}

          <div>
            <p style={{ fontWeight: "600", margin: 0 }}>
              {selectedItem.title}
            </p>
            <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
              Condition: {selectedItem.condition} · Size: {selectedItem.size}
            </p>

              {/* Material, Colour, Style — only show if they exist */}
              {(selectedItem.material || selectedItem.color || selectedItem.style) && (
            <p style={{ color: "#888", fontSize: "13px", margin: "3px 0 0 0" }}>
            {[
              selectedItem.material && `Material: ${selectedItem.material}`,
              selectedItem.color    && `Colour: ${selectedItem.color}`,
              selectedItem.style    && `Style: ${selectedItem.style}`,
             ]
               .filter(Boolean)
               .join(" · ")}
            </p>
              )}
            <p style={{ color: "#888", fontSize: "13px", margin: "3px 0 0 0" }}>
             Owner: {selectedItem.owner?.name}
            </p>  
          </div>
        </div>
        {/* ── ITEM DESCRIPTION ── */}
        {selectedItem.description && (
          <div
            style={{
              background: "#f9f9f9",
              borderRadius: "8px",
              padding: "12px 14px",
              marginBottom: "16px",
            }}
          >
            <p style={{
              fontSize: "13px",
              fontWeight: "600",
              margin: "0 0 6px 0",
              color: "#333",
            }}>
               Description:
            </p>

            <p style={{
              fontSize: "13px",
              color: "#555",
              margin: 0,
              lineHeight: "1.5",
            }}>
              {selectedItem.description}
            </p>
          </div>
        )}


        {/* ── ERROR MESSAGE ── */}
        {error && (
          <p style={{ color: "red", marginBottom: "12px", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          {/* ── SELECT ITEM TO OFFER ── */}
          <label
            style={{
              display:      "block",
              marginBottom: "8px",
              fontWeight:   "300",
              fontSize:     "14px",
              color:        "black",
            }}
          >
            Select your item to offer in return:
          </label>

          {fetchingItems ? (
            <p style={{ color: "#888", fontSize: "14px" }}>
              Loading your items...
            </p>
          ) : myItems.length === 0 ? (
            // ── NO ITEMS TO OFFER ──
            <div
              style={{
                padding:      "12px",
                background:   "#fff3cd",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize:     "14px",
                color:        "#856404",
              }}
            >
              ⚠️ You have no available items to offer.
              Please upload an item first before requesting an exchange!
            </div>
          ) : (
            // ── DROPDOWN OF THEIR ITEMS ──
            <select
              value={offeredItem}
              onChange={(e) => setOfferedItem(e.target.value)}
              style={{
                width:        "100%",
                padding:      "10px 12px",
                borderRadius: "8px",
                border:       "1px solid #ddd",
                marginBottom: "16px",
                fontSize:     "14px",
                appearance:   "auto",
              }}
            >
              <option value="">-- Choose an item --</option>
              {myItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title} ({item.condition} · {item.size})
                </option>
              ))}
            </select>
          )}

          {/* ── OPTIONAL MESSAGE ── */}
          <label
            style={{
              display:      "block",
              marginBottom: "8px",
              fontWeight:   "300",
              fontSize:     "14px",
              color:        "black",
            }}
          >
            Add a message (optional):
          </label>
          <textarea
            placeholder="Hi! I'd love to swap this item with you..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            style={{
              width:        "100%",
              padding:      "10px 12px",
              borderRadius: "8px",
              border:       "1px solid #ddd",
              marginBottom: "20px",
              fontSize:     "14px",
              resize:       "vertical",
              boxSizing:    "border-box",
            }}
          />

          {/* ── BUTTONS ── */}
          <div style={{ display: "flex", gap: "12px" }}>

            <button
              type="button"
              onClick={onClose}
              style={{
                flex:         1,
                padding:      "12px",
                borderRadius: "8px",
                border:       "1px solid #ddd",
                background:   "#fff",
                cursor:       "pointer",
                fontSize:     "14px",
                fontWeight:   "500",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || myItems.length === 0}
              style={{
                flex:         1,
                padding:      "12px",
                borderRadius: "8px",
                border:       "none",
                background:   myItems.length === 0 ? "#ccc" : "#000",
                color:        "#fff",
                cursor:       myItems.length === 0 ? "not-allowed" : "pointer",
                fontSize:     "14px",
                fontWeight:   "500",
              }}
            >
              {loading ? "Sending..." : "Send Request ✉️"}
            </button>

          </div>
        </form>
      </div>
    </>
  );
}

export default SwapRequestModal;