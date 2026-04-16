const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    // Who wrote this feedback
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,   // Minimum 1 star
      max: 5    // Maximum 5 stars
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);