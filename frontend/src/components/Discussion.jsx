import React, { useState, useEffect, useRef } from "react";
import "./Discussion.css";
import axiosInstance from "../api/axiosInstance";

function Discussion({ swap }) {
  const [messages, setMessages]   = useState([]);
  const [newText, setNewText]     = useState("");
  const [loading, setLoading]     = useState(true);
  const [sending, setSending]     = useState(false);
  const [isOpen, setIsOpen]       = useState(false);

  // Get current logged in user
  const currentUser = JSON.parse(localStorage.getItem("revogueUser"));

  // This ref is used to auto scroll to bottom
  const messagesEndRef = useRef(null);

  // Load messages when discussion is opened
  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/messages/${swap._id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages");
    }
    setLoading(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    // Don't send empty messages
    if (!newText.trim()) return;

    setSending(true);
    try {
      const res = await axiosInstance.post("/messages", {
        swapId: swap._id,
        text:   newText.trim()
      });

      // Add new message to list immediately
      setMessages([...messages, res.data]);
      setNewText("");

    } catch (err) {
      alert("Failed to send message.");
    }
    setSending(false);
  };

  // Format time nicely
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour:   "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div>
      {/* TOGGLE BUTTON */}
      <button
        className="discussion-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Hide Discussion ▲" : "💬 Open Discussion ▼"}
      </button>

      {/* DISCUSSION PANEL */}
      {isOpen && (
        <div className="discussion-container">
          <p className="discussion-title">
            💬 Discussion with{" "}
            {swap.requester?._id === currentUser?._id
              ? swap.receiver?.name    // I am requester → show receiver name
              : swap.requester?.name}  {/* I am receiver → show requester name */}
          </p>

          {/* MESSAGES AREA */}
          <div className="messages-area">

            {loading ? (
              <p className="no-messages">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="no-messages">
                No messages yet. Say hello! 👋
              </p>
            ) : (
              messages.map((msg) => {
                // Is this message sent by me?
                const isMyMessage =
                  msg.sender?._id === currentUser?._id;

                return (
                  <div
                    key={msg._id}
                    className={`message-bubble ${
                      isMyMessage ? "mine" : "theirs"
                    }`}
                  >
                    <span className="message-sender">
                      {isMyMessage ? "You" : msg.sender?.name}
                    </span>
                    <div className="message-text">{msg.text}</div>
                    <span className="message-time">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                );
              })
            )}

            {/* This div helps us scroll to bottom */}
            <div ref={messagesEndRef} />
          </div>

          {/* MESSAGE INPUT */}
          <form className="message-input-area" onSubmit={handleSend}>
            <textarea
              className="message-input"
              placeholder="Type a message..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              rows={1}
              // Send on Enter key (Shift+Enter for new line)
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={sending || !newText.trim()}
            >
              {sending ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Discussion;