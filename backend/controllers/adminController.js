const User     = require("../models/User");
const Item     = require("../models/Item");
const Swap     = require("../models/Swap");
const Feedback = require("../models/Feedback");

// ─── GET DASHBOARD STATS ──────────────────────────────────
// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    // Count everything in parallel (faster)
    const [
      totalUsers,
      totalItems,
      totalSwaps,
      totalFeedbacks,
      pendingSwaps,
      acceptedSwaps,
      availableItems,
      swappedItems
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Swap.countDocuments(),
      Feedback.countDocuments(),
      Swap.countDocuments({ status: "pending"  }),
      Swap.countDocuments({ status: "accepted" }),
      Item.countDocuments({ status: "available" }),
      Item.countDocuments({ status: "swapped"  })
    ]);

    res.json({
      totalUsers,
      totalItems,
      totalSwaps,
      totalFeedbacks,
      pendingSwaps,
      acceptedSwaps,
      availableItems,
      swappedItems
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL USERS ────────────────────────────────────────
// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // Never send passwords
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE USER ──────────────────────────────────────────
// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own admin account!"
      });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL ITEMS ────────────────────────────────────────
// GET /api/admin/items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE ITEM ──────────────────────────────────────────
// DELETE /api/admin/items/:id
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL SWAPS ────────────────────────────────────────
// GET /api/admin/swaps
const getAllSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find()
      .populate("requester",     "name email")
      .populate("receiver",      "name email")
      .populate("requestedItem", "title")
      .populate("offeredItem",   "title")
      .sort({ createdAt: -1 });

    res.json(swaps);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllItems,
  deleteItem,
  getAllSwaps
};