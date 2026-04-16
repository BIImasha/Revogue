const Notification = require("../models/Notification");

// ─── GET MY NOTIFICATIONS ─────────────────────────────────
// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id
    })
      .sort({ createdAt: -1 }) // Newest first
      .limit(20);              // Max 20 notifications

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET UNREAD COUNT ─────────────────────────────────────
// GET /api/notifications/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead:    false
    });

    res.json({ count });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── MARK ALL AS READ ─────────────────────────────────────
// PUT /api/notifications/mark-all-read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: "All notifications marked as read" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── MARK ONE AS READ ─────────────────────────────────────
// PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true }
    );

    res.json({ message: "Notification marked as read" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead
};