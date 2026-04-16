const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Which swap this message belongs to
    swap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Swap",
      required: true
    },
    // Who sent this message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // The message text
    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true // adds createdAt automatically
  }
);

module.exports = mongoose.model("Message", messageSchema);