const Message = require("../models/Message");
const Swap    = require("../models/Swap");

// ─── SEND A MESSAGE ───────────────────────────────────────
// POST /api/messages
const sendMessage = async (req, res) => {
  const { swapId, text } = req.body;

  try {
    // Find the swap
    const swap = await Swap.findById(swapId);

    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    // Only users involved in this swap can send messages
    const isInvolved =
      swap.requester.toString() === req.user._id.toString() ||
      swap.receiver.toString()  === req.user._id.toString();

    if (!isInvolved) {
      return res.status(403).json({
        message: "You are not part of this swap"
      });
    }

    // Swap must be accepted before messaging
    if (swap.status !== "accepted") {
      return res.status(400).json({
        message: "You can only message after swap is accepted"
      });
    }

    // Create the message
    const message = await Message.create({
      swap:   swapId,
      sender: req.user._id,
      text:   text
    });

    // Populate sender name before sending back
    const populated = await message.populate("sender", "name profilePic");

    res.status(201).json(populated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET MESSAGES FOR A SWAP ──────────────────────────────
// GET /api/messages/:swapId
const getMessages = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.swapId);

    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    // Only users involved in this swap can read messages
    const isInvolved =
      swap.requester.toString() === req.user._id.toString() ||
      swap.receiver.toString()  === req.user._id.toString();

    if (!isInvolved) {
      return res.status(403).json({
        message: "You are not part of this swap"
      });
    }

    // Get all messages for this swap
    const messages = await Message.find({ swap: req.params.swapId })
      .populate("sender", "name profilePic")
      .sort({ createdAt: 1 }); // oldest first

    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages };