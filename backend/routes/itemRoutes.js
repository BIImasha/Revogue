const express = require("express");
const router  = express.Router();
const path    = require("path");
const fs      = require("fs");
const multer  = require("multer");
const { upload, cloudinary } = require("../config/cloudinary");
const {
  uploadItem,
  getAllItems,
  getMyItems,
  deleteItem,
  updateItem
} = require("../controllers/itemController");
const { analyzeImage } = require("../controllers/aiTagController");
const { protect }      = require("../middleware/authMiddleware");

// ── STORAGE FOR AI ANALYSIS (memory) ───────────────────────────────
const uploadTemp = multer({ storage: multer.memoryStorage() });

// ── PUBLIC ROUTES ───────────────────────────────────────────────────
router.get("/", getAllItems);

// ── PROTECTED ROUTES ────────────────────────────────────────────────
router.post(
  "/analyze-image",
  protect,
  uploadTemp.single("image"),
  analyzeImage
);

router.post(
  "/",
  protect,
  (req, res, next) => {
    upload.array("images", 5)(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary upload error:", err.message, err);
        return res.status(500).json({ message: err.message });
      }
      next();
    });
  },
  uploadItem
);

router.get("/myitems", protect, getMyItems);
router.delete("/:id",  protect, deleteItem);
router.put("/:id",     protect, updateItem);

module.exports = router;