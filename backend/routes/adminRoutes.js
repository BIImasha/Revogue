const express = require("express");
const router  = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllItems,
  deleteItem,
  getAllSwaps,
  getSustainabilityData  // ✅ Added
} = require("../controllers/adminController");

// Both middlewares required:
// protect    → must be logged in
// adminOnly  → must be admin role
const { protect }   = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// ── PROTECTED ROUTES (admin only) ────────────────────────
router.get("/stats",        protect, adminOnly, getDashboardStats);
router.get("/users",        protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.get("/items",        protect, adminOnly, getAllItems);
router.delete("/items/:id", protect, adminOnly, deleteItem);
router.get("/swaps",        protect, adminOnly, getAllSwaps);

// ── PUBLIC ROUTE (no login required) ─────────────────────
router.get("/sustainability/public", getSustainabilityData);

module.exports = router;