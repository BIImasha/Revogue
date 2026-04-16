const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,    // Must be provided
      trim: true         // Removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,      // No two users can have same email
      lowercase: true    // Always stored as lowercase
    },
    password: {
      type: String,
      required: true     // Must be provided
    },
    profilePic: {
      type: String,
      default: ""        // Empty by default
    },
    role: {
      type: String,
      enum:    ["user", "admin"], // Only these two values allowed
      default: "user"             // Everyone starts as normal user
    }
  },
  {
    timestamps: true     // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);