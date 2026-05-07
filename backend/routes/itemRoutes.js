const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const path    = require("path");
const {
  uploadItem,
  getAllItems,
  getMyItems,
  deleteItem,
  updateItem
} = require("../controllers/itemController");
const { analyzeImage } = require("../controllers/aiTagController");
const { protect }      = require("../middleware/authMiddleware");

// ── STORAGE FOR FINAL ITEM IMAGES ─────────────────────────
// Saved permanently to uploads/ folder
const itemStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) =>
    cb(null, "item-" + Date.now() + path.extname(file.originalname))
});
const uploadItem_multer = multer({ storage: itemStorage });

// ── STORAGE FOR AI ANALYSIS (temporary) ───────────────────
// Saved to uploads/temp/ — deleted immediately after Gemini reads it
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, "../uploads/temp");
    // Create temp folder if it doesn't exist
    const fs = require("fs");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: (req, file, cb) =>
    cb(null, "temp-" + Date.now() + path.extname(file.originalname))
});
const uploadTemp = multer({ storage: tempStorage });

// ── PUBLIC ROUTES ──────────────────────────────────────────
router.get("/", getAllItems);

// ── PROTECTED ROUTES ───────────────────────────────────────

// NEW: AI image analysis — user uploads photo, Gemini returns tags
// Must be BEFORE /:id routes to avoid route conflicts
router.post(
  "/analyze-image",
  protect,
  uploadTemp.single("image"),   // single image for analysis
  analyzeImage
);

// Upload a new item (final submission with all fields)
router.post(
  "/",
  protect,
  uploadItem_multer.array("images", 5),
  uploadItem
);

router.get("/myitems", protect, getMyItems);
router.delete("/:id",  protect, deleteItem);
router.put("/:id",     protect, updateItem);

module.exports = router;