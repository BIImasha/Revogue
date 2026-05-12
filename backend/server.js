const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

// Create the Express app
const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────
// Allows frontend to talk to backend
app.use(cors({
  origin: "https://willowy-mooncake-2066ef.netlify.app", // Your React app address
  credentials: true
}));

// Allows backend to read JSON data sent from frontend
app.use(express.json());

// Makes the uploads folder publicly accessible (for images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── ROUTES ───────────────────────────────────────────────
const userRoutes         = require("./routes/userRoutes");
const itemRoutes         = require("./routes/itemRoutes");
const swapRoutes         = require("./routes/swapRoutes");
const feedbackRoutes     = require("./routes/feedbackRoutes");
const messageRoutes      = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes        = require("./routes/adminRoutes");
const chatRoutes         = require("./routes/chatRoutes");

app.use("/api/users",         userRoutes);
app.use("/api/items",         itemRoutes);
app.use("/api/swaps",         swapRoutes);
app.use("/api/feedback",      feedbackRoutes);
app.use("/api/messages",      messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/chat",          chatRoutes);

// ─── TEST ROUTE ───────────────────────────────────────────
// Visit http://localhost:5000/api/test to check if server works
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Revogue Backend is Running!" });
});

// ─── START SERVER ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
