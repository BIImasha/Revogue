const express = require("express");
const router  = express.Router();
const {
  sendSwapRequest,
  getMySwaps,
  acceptSwap,
  declineSwap,
  cancelSwap
} = require("../controllers/swapController");
const { protect } = require("../middleware/authMiddleware");

// All swap routes require login
router.post("/",           protect, sendSwapRequest);
router.get("/",            protect, getMySwaps);
router.put("/:id/accept",  protect, acceptSwap);
router.put("/:id/decline", protect, declineSwap);
router.delete("/:id/cancel",  protect, cancelSwap);

module.exports = router;