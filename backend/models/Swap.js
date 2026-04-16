const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema(
  {
    // Person sending the swap request
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Person receiving the swap request
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Item the requester WANTS
    requestedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true
    },
    // Item the requester OFFERS in return
    offeredItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true
    },
    // Current status of the swap
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "cancelled"],
      default: "pending"
    },
    // Optional message with the swap request
    message: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Swap", swapSchema);