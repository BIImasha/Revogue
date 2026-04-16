const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    // Who uploaded this item
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",       // Links to User model
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [            // Only these categories allowed
        "Women's Clothing",
        "Men's Clothing",
        "Kids' Clothing",
        "Footwear",
        "Accessories",
        "Jewelry",
        "Outerwear & Seasonal Wear",
        "Bags & Carry Items"
      ]
    },
    condition: {
      type: String,
      required: true,
      enum: ["Like New", "Excellent", "Good", "Fair"]
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "One Size", "N/A"],
      default: "N/A"
    },
    images: {
      type: [String],    // Array of image file paths
      default: []
    },
    // Is this item still available or already swapped?
    status: {
      type: String,
      enum: ["available", "pending", "swapped"],
      default: "available"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Item", itemSchema);