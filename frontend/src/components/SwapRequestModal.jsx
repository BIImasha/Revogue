import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

function SwapRequestModal({ selectedItem, onClose, onSuccess }) {

  const [myItems, setMyItems] = useState([]);
  const [offeredItem, setOfferedItem] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingItems, setFetchingItems] = useState(true);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const res = await axiosInstance.get("/items/myitems");

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

    if (!offeredItem) {
      setError("Please select an item to offer!");
      return;
    }

    setLoading(true);

    try {

      await axiosInstance.post("/swaps", {
        requestedItemId: selectedItem._id,
        offeredItemId: offeredItem,
        message: message,
      });

      onSuccess();
      onClose();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to send request."
      );

    }

    setLoading(false);
  };

  return (
    <>
      {/* ───────────────── OVERLAY ───────────────── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 999,
        }}
      />

      {/* ───────────────── MODAL WRAPPER ───────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* ───────────────── MODAL ───────────────── */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="swapModalTitle"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "520px",
            maxHeight: "95vh",
            overflowY: "auto",
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            boxSizing: "border-box",
          }}
        >

          {/* ───────────────── CLOSE BUTTON ───────────────── */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              fontSize: "22px",
              cursor: "pointer",
              color: "#666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>

          {/* ───────────────── TITLE ───────────────── */}
          <h2
            id="swapModalTitle"
            style={{
              marginBottom: "8px",
              fontSize: "clamp(18px, 3vw, 22px)",
              color: "black",
              lineHeight: "1.3",
              paddingRight: "40px",
            }}
          >
            Request Exchange
          </h2>

          <p
            style={{
              color: "#666",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            You are requesting:
          </p>

          {/* ───────────────── SELECTED ITEM ───────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "12px",
              background: "#f9f9f9",
              borderRadius: "8px",
              marginBottom: "20px",
              color: "black",
              flexWrap: "wrap",
            }}
          >

            {/* IMAGE */}
            {selectedItem.images &&
            selectedItem.images.length > 0 ? (

              <img
                src={selectedItem.images[0]}
                alt={selectedItem.title}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  flexShrink: 0,
                }}
              />

            ) : (

              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "#ddd",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  color: "#888",
                  flexShrink: 0,
                }}
              >
                No Image
              </div>

            )}

            {/* ITEM INFO */}
            <div
              style={{
                flex: 1,
                minWidth: "180px",
              }}
            >

              <p
                style={{
                  fontWeight: "600",
                  margin: 0,
                  wordBreak: "break-word",
                }}
              >
                {selectedItem.title}
              </p>

              <p
                style={{
                  color: "#888",
                  fontSize: "13px",
                  margin: "4px 0 0 0",
                  lineHeight: "1.5",
                }}
              >
                Condition: {selectedItem.condition}
                {" · "}
                Size: {selectedItem.size}
              </p>

              {(selectedItem.material ||
                selectedItem.color ||
                selectedItem.style) && (

                <p
                  style={{
                    color: "#888",
                    fontSize: "13px",
                    margin: "3px 0 0 0",
                    lineHeight: "1.5",
                  }}
                >
                  {[
                    selectedItem.material &&
                      `Material: ${selectedItem.material}`,

                    selectedItem.color &&
                      `Colour: ${selectedItem.color}`,

                    selectedItem.style &&
                      `Style: ${selectedItem.style}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>

              )}

              <p
                style={{
                  color: "#888",
                  fontSize: "13px",
                  margin: "3px 0 0 0",
                }}
              >
                Owner: {selectedItem.owner?.name}
              </p>

            </div>
          </div>

          {/* ───────────────── DESCRIPTION ───────────────── */}
          {selectedItem.description && (

            <div
              style={{
                background: "#f9f9f9",
                borderRadius: "8px",
                padding: "12px 14px",
                marginBottom: "16px",
              }}
            >

              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  margin: "0 0 6px 0",
                  color: "#333",
                }}
              >
                Description:
              </p>

              <p
                style={{
                  fontSize: "13px",
                  color: "#555",
                  margin: 0,
                  lineHeight: "1.6",
                  wordBreak: "break-word",
                }}
              >
                {selectedItem.description}
              </p>

            </div>

          )}

          {/* ───────────────── ERROR ───────────────── */}
          {error && (

            <p
              style={{
                color: "red",
                marginBottom: "12px",
                fontSize: "14px",
              }}
            >
              {error}
            </p>

          )}

          {/* ───────────────── FORM ───────────────── */}
          <form onSubmit={handleSubmit}>

            {/* LABEL */}
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "400",
                fontSize: "14px",
                color: "black",
              }}
            >
              Select your item to offer in return:
            </label>

            {/* LOADING */}
            {fetchingItems ? (

              <p
                style={{
                  color: "#888",
                  fontSize: "14px",
                }}
              >
                Loading your items...
              </p>

            ) : myItems.length === 0 ? (

              <div
                style={{
                  padding: "12px",
                  background: "#fff3cd",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "14px",
                  color: "#856404",
                  lineHeight: "1.6",
                }}
              >
                ⚠️ You have no available items to offer.
                Please upload an item first before requesting
                an exchange!
              </div>

            ) : (

              <select
                value={offeredItem}
                onChange={(e) =>
                  setOfferedItem(e.target.value)
                }
                aria-label="Select an item to offer"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  marginBottom: "16px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >

                <option value="">
                  -- Choose an item --
                </option>

                {myItems.map((item) => (

                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.title}
                    {" ("}
                    {item.condition}
                    {" · "}
                    {item.size}
                    {")"}
                  </option>

                ))}

              </select>

            )}

            {/* MESSAGE */}
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "400",
                fontSize: "14px",
                color: "black",
              }}
            >
              Add a message (optional):
            </label>

            <textarea
              placeholder="Hi! I'd love to swap this item with you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              aria-label="Swap request message"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginBottom: "20px",
                fontSize: "14px",
                resize: "vertical",
                boxSizing: "border-box",
                lineHeight: "1.5",
              }}
            />

            {/* ───────────────── BUTTONS ───────────────── */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >

              {/* CANCEL */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cancel swap request"
                style={{
                  flex: "1 1 180px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  minHeight: "48px",
                }}
              >
                Cancel
              </button>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={
                  loading || myItems.length === 0
                }
                aria-label="Send swap request"
                style={{
                  flex: "1 1 180px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  background:
                    myItems.length === 0
                      ? "#ccc"
                      : "#000",
                  color: "#fff",
                  cursor:
                    myItems.length === 0
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  minHeight: "48px",
                }}
              >
                {loading
                  ? "Sending..."
                  : "Send Request ✉️"}
              </button>

            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SwapRequestModal;