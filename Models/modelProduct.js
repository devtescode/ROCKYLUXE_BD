// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageURLs: [String], // array of image URLs
    price: { type: Number, required: true },
    description: String,
    category: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Coming Soon", "Made to Order"],
      default: "In Stock",
    },      
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);