const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Who receives this notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // What type of notification
    type: {
      type: String,
      enum: [
        "swap_request_received",  // Someone sent you a request
        "swap_request_accepted",  // Someone accepted your request
        "swap_request_declined",  // Someone declined your request
        "swap_request_cancelled", // Someone cancelled their request
        "new_message"             // New message in discussion
      ],
      required: true
    },
    // The message to display
    message: {
      type: String,
      required: true
    },
    // Has the user read this notification?
    isRead: {
      type: Boolean,
      default: false
    },
    // Link to the related swap
    swap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Swap",
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Notification", notificationSchema);