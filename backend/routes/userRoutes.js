const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const path    = require("path");
const {
  registerUser,
  loginUser,
  forgotPassword,
  getProfile,
  updateProfile
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Image upload setup for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) =>
    cb(null, "profile-" + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Public routes (no login needed)
router.post("/register",        registerUser);
router.post("/login",           loginUser);
router.put("/forgot-password",  forgotPassword);

// Protected routes (login required)
router.get("/profile",  protect, getProfile);
router.put("/profile",  protect, upload.single("profilePic"), updateProfile);

module.exports = router;