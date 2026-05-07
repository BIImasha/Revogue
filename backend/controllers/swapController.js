const Swap         = require("../models/Swap");
const Item         = require("../models/Item");
const Notification = require("../models/Notification");

// ─── HELPER: Create notification ──────────────────────────
const createNotification = async (recipient, type, message, swapId) => {
  try {
    await Notification.create({
      recipient,
      type,
      message,
      swap: swapId
    });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

// ─── SEND SWAP REQUEST ────────────────────────────────────
// POST /api/swaps
const sendSwapRequest = async (req, res) => {
  const { requestedItemId, offeredItemId, message } = req.body;

  try {
    const requestedItem = await Item.findById(requestedItemId)
      .populate("owner", "name");

    if (!requestedItem) {
      return res.status(404).json({ message: "Requested item not found" });
    }

    const swap = await Swap.create({
      requester:     req.user._id,
      receiver:      requestedItem.owner._id,
      requestedItem: requestedItemId,
      offeredItem:   offeredItemId,
      message:       message || ""
    });

    await Item.findByIdAndUpdate(requestedItemId, { status: "pending" });
    await Item.findByIdAndUpdate(offeredItemId,   { status: "pending" });

    // 🔔 Notify the receiver
    await createNotification(
      requestedItem.owner._id,
      "swap_request_received",
      `${req.user.name} sent you a swap request for "${requestedItem.title}"`,
      swap._id
    );

    res.status(201).json(swap);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET MY REQUESTS ──────────────────────────────────────
// GET /api/swaps
const getMySwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [
        { requester: req.user._id },
        { receiver:  req.user._id }
      ]
    })
      .populate("requester", "name profilePic")
      .populate("receiver",  "name profilePic")
      // ── FIX: populate all item fields + owner name ──
      .populate({
        path:   "requestedItem",
        select: "title images description category condition size material color style owner",
        populate: { path: "owner", select: "name" }
      })
      .populate({
        path:   "offeredItem",
        select: "title images description category condition size material color style owner",
        populate: { path: "owner", select: "name" }
      })
      .sort({ createdAt: -1 });

    res.json(swaps);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── ACCEPT SWAP ──────────────────────────────────────────
// PUT /api/swaps/:id/accept
const acceptSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate("receiver", "name");

    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    if (swap.receiver._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    swap.status = "accepted";
    await swap.save();

    await Item.findByIdAndUpdate(swap.requestedItem, { status: "swapped" });
    await Item.findByIdAndUpdate(swap.offeredItem,   { status: "swapped" });

    // 🔔 Notify the requester
    await createNotification(
      swap.requester,
      "swap_request_accepted",
      `${swap.receiver.name} accepted your swap request! 🎉`,
      swap._id
    );

    res.json({ message: "Swap accepted!", swap });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DECLINE SWAP ─────────────────────────────────────────
// PUT /api/swaps/:id/decline
const declineSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate("receiver", "name");

    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    if (swap.receiver._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    swap.status = "declined";
    await swap.save();

    await Item.findByIdAndUpdate(swap.requestedItem, { status: "available" });
    await Item.findByIdAndUpdate(swap.offeredItem,   { status: "available" });

    // 🔔 Notify the requester
    await createNotification(
      swap.requester,
      "swap_request_declined",
      `${swap.receiver.name} declined your swap request.`,
      swap._id
    );

    res.json({ message: "Swap declined", swap });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── CANCEL SWAP ──────────────────────────────────────────
// DELETE /api/swaps/:id/cancel
const cancelSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate("requester", "name");

    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    if (swap.requester._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Item.findByIdAndUpdate(swap.requestedItem, { status: "available" });
    await Item.findByIdAndUpdate(swap.offeredItem,   { status: "available" });

    // 🔔 Notify the receiver
    await createNotification(
      swap.receiver,
      "swap_request_cancelled",
      `${swap.requester.name} cancelled their swap request.`,
      swap._id
    );

    await swap.deleteOne();

    res.json({ message: "Swap cancelled and removed from database" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendSwapRequest,
  getMySwaps,
  acceptSwap,
  declineSwap,
  cancelSwap
};