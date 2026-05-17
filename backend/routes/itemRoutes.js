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

// Upload a new item using Cloudinary
router.post(
  "/",
  protect,
  upload.array("images", 5),
  uploadItem
);

router.get("/myitems", protect, getMyItems);
router.delete("/:id",  protect, deleteItem);
router.put("/:id",     protect, updateItem);

module.exports = router;