const express = require("express");
const router  = express.Router();
const {
  sendMessage,
  getMessages
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

// All message routes require login
router.post("/",           protect, sendMessage);
router.get("/:swapId",     protect, getMessages);

module.exports = router;