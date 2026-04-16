const express = require("express");
const router  = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// All notification routes require login
router.get("/",                  protect, getNotifications);
router.get("/unread-count",      protect, getUnreadCount);
router.put("/mark-all-read",     protect, markAllAsRead);
router.put("/:id/read",          protect, markAsRead);

module.exports = router;