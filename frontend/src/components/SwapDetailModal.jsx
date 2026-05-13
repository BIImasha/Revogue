import React from "react";
import "./SwapDetailModal.css";

function SwapDetailModal({ swap, currentUserId, onClose, onAccept, onDecline, onCancel }) {
  const isIncoming = swap.receiver?._id === currentUserId;

  const requestedItem = swap.requestedItem; // item the requester WANTS
  const offeredItem   = swap.offeredItem;   // item the requester OFFERS

  // ── ITEM CARD ─────────────────────────────────────────────
  // Reusable card to show one item's full details
  const ItemCard = ({ item, label }) => (
    <div className="sdm-item-card">
      <span className="sdm-item-label">{label}</span>

      {/* Image */}
      <div className="sdm-img-wrap">
        {item?.images?.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item?.title}
            className="sdm-img"
          />
        ) : (
          <div className="sdm-img-placeholder">No Image</div>
        )}
      </div>

      {/* Details */}
      <div className="sdm-item-details">
        <h3 className="sdm-item-title">{item?.title || "—"}</h3>

        {/* Tags row */}
        <div className="sdm-tags">
          {item?.category  && <span className="sdm-tag">{item.category}</span>}
          {item?.condition && <span className="sdm-tag">{item.condition}</span>}
          {item?.size      && item.size !== "N/A" && (
            <span className="sdm-tag">Size {item.size}</span>
          )}
        </div>

        {/* Description */}
        {item?.description && (
          <p className="sdm-description">{item.description}</p>
        )}

        {/* Extra AI fields */}
        <div className="sdm-extra-fields">
          {item?.material && (
            <div className="sdm-extra-row">
              <span className="sdm-extra-key">Material</span>
              <span className="sdm-extra-val">{item.material}</span>
            </div>
          )}
          {item?.color && (
            <div className="sdm-extra-row">
              <span className="sdm-extra-key">Colour</span>
              <span className="sdm-extra-val">{item.color}</span>
            </div>
          )}
          {item?.style && (
            <div className="sdm-extra-row">
              <span className="sdm-extra-key">Style</span>
              <span className="sdm-extra-val">{item.style}</span>
            </div>
          )}
        </div>

        {/* Owner */}
        <p className="sdm-owner">
          👤 {item?.owner?.name || "Unknown"}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div className="sdm-overlay" onClick={onClose} />

      {/* Modal */}
      <div className="sdm-modal">

        {/* Header */}
        <div className="sdm-header">
          <div>
            <h2 className="sdm-title">Swap Details</h2>
            <p className="sdm-subtitle">
              {isIncoming
                ? `Request from ${swap.requester?.name}`
                : `Your request to ${swap.receiver?.name}`}
            </p>
          </div>
          <button className="sdm-close" onClick={onClose}>✕</button>
        </div>

        {/* Status badge */}
        <div className="sdm-status-row">
          <span className={`sdm-status sdm-status-${swap.status}`}>
            {swap.status === "pending"  && " Pending"}
            {swap.status === "accepted" && " Accepted"}
            {swap.status === "declined" && " Declined"}
          </span>
        </div>

        {/* Both item cards */}
        <div className="sdm-cards-row">
          <ItemCard
            item={requestedItem}
            label={isIncoming ? "They want your item" : "Item you want"}
          />

          {/* Swap arrow */}
          <div className="sdm-arrow">⇄</div>

          <ItemCard
            item={offeredItem}
            label={isIncoming ? "They offer this" : "You offer this"}
          />
        </div>

        {/* Message (if any) */}
        {swap.message && (
          <div className="sdm-message-box">
            <span className="sdm-message-label">💬 Message</span>
            <p className="sdm-message-text">{swap.message}</p>
          </div>
        )}

        {/* Action buttons — only for pending swaps */}
        {swap.status === "pending" && (
          <div className="sdm-actions">
            {isIncoming ? (
              <>
                <button
                  className="sdm-btn sdm-btn-accept"
                  onClick={() => { onAccept(swap._id); onClose(); }}
                >
                  Accept Swap
                </button>
                <button
                  className="sdm-btn sdm-btn-decline"
                  onClick={() => { onDecline(swap._id); onClose(); }}
                >
                  Decline
                </button>
              </>
            ) : (
              <button
                className="sdm-btn sdm-btn-cancel"
                onClick={() => { onCancel(swap._id); onClose(); }}
              >
                Cancel Request
              </button>
            )}
            <button className="sdm-btn sdm-btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        )}

        {swap.status !== "pending" && (
          <div className="sdm-actions">
            <button className="sdm-btn sdm-btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        )}

      </div>
    </>
  );
}

export default SwapDetailModal;