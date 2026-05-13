const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    // Who uploaded this item
    /*owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },*/
    title: {
      type: String,
      
      trim: true
    },
    description: {
      type: String,
      
    },
    category: {
      type: String,
      
      enum: [
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
      
      enum: ["Like New", "Excellent", "Good", "Fair"]
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "One Size", "N/A"],
      default: "N/A"
    },

    // ── NEW AI-DETECTED FIELDS ──────────────────────────
    material: {
      type: String,
      default: ""   // e.g. "Cotton", "Leather", "Polyester"
    },
    color: {
      type: String,
      default: ""   // e.g. "Navy Blue", "Cream White"
    },
    style: {
      type: String,
      default: ""   // e.g. "Vintage", "Minimalist", "Streetwear"
    },
    // ────────────────────────────────────────────────────

    images: {
      type: [String],
      default: []
    },
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