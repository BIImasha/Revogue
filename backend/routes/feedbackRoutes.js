const express = require("express");
const router  = express.Router();
const {
  submitFeedback,
  getAllFeedback,
  getMyFeedbacks,
  editFeedback,
  deleteFeedback
} = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");

router.get("/",              getAllFeedback);              // Public
router.post("/",   protect,  submitFeedback);             // Login required
router.get("/myfeedbacks", protect, getMyFeedbacks);      // Login required
router.put("/:id",  protect, editFeedback);               // Login required
router.delete("/:id", protect, deleteFeedback);           // Login required

module.exports = router;