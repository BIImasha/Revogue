import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import axiosInstance from "../api/axiosInstance";

function Chatbot() {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [isTyping, setIsTyping]   = useState(false);
  const messagesEndRef            = useRef(null);

  // Quick question suggestions
  const quickQuestions = [
    "How do I swap an item? 🔄",
    "How do I upload an item? 📸",
    "Is Revogue free? 💰",
    "Sustainability tips 🌱",
  ];

  // Welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role:    "assistant",
          content: "Hi! I'm Reva, your Revogue assistant! 👋\n\nI can help you with swapping items, sustainability tips, and anything about Revogue. How can I help you today? 😊",
          time:    getCurrentTime()
        }
      ]);
    }
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour:   "2-digit",
      minute: "2-digit"
    });
  };

  // ── SEND MESSAGE ───────────────────────────────────────
  const handleSend = async (text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message to chat
    const userMessage = {
      role:    "user",
      content: messageText,
      time:    getCurrentTime()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      // Send to backend
      // We send only role + content to backend (not time)
      const res = await axiosInstance.post("/chat", {
        messages: updatedMessages.map((m) => ({
          role:    m.role,
          content: m.content
        }))
      });

      // Add Reva's reply
      setMessages([
        ...updatedMessages,
        {
          role:    "assistant",
          content: res.data.reply,
          time:    getCurrentTime()
        }
      ]);

    } catch (err) {
      // Show error message in chat
      setMessages([
        ...updatedMessages,
        {
          role:    "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🙏",
          time:    getCurrentTime()
        }
      ]);
    }

    setIsTyping(false);
  };

  // Send on Enter key (Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Clear chat when closing
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* ── CHAT WINDOW ── */}
      {isOpen && (
        <div className="chatbot-window">

          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <h4>Reva</h4>
                <p>Revogue AI Assistant</p>
              </div>
            </div>
            <button className="chatbot-close" onClick={handleClose}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${msg.role}`}
              >
                <div className="bubble-text">
                  {/* Render newlines properly */}
                  {msg.content.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < msg.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
                <span className="bubble-time">{msg.time}</span>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="chat-bubble assistant">
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="quick-questions">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  className="quick-btn"
                  onClick={() => handleSend(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="chatbot-input-area">
            <textarea
              className="chatbot-input"
              placeholder="Ask Reva anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className="chatbot-send"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* ── FLOATING TOGGLE BUTTON ── */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Reva"
      >
        {isOpen ? "✕" : "🤖"}
      </button>
    </>
  );
}

export default Chatbot;