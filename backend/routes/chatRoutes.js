const express    = require("express");
const router     = express.Router();
const { chat }   = require("../controllers/chatController");

// Chat is PUBLIC — even non-logged-in users can use chatbot
router.post("/", chat);

module.exports = router;