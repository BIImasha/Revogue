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
const { protect } = require("../middleware/authMiddleware");

// Image upload setup for item images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) =>
    cb(null, "item-" + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Public routes
router.get("/",        getAllItems);

// Protected routes
router.post("/",       protect, upload.array("images", 5), uploadItem);
router.get("/myitems", protect, getMyItems);
router.delete("/:id",  protect, deleteItem);
router.put("/:id",     protect, updateItem);

module.exports = router;