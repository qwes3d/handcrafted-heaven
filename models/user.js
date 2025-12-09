// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },

    // Seller-specific fields
    businessName: { type: String },     // Name of seller shop
    bio: { type: String, default: "" }, // About the seller
    images: { type: [String], default: [] }, // Seller gallery / brand images
    profilePic: { type: String },           // Profile picture
    address: { type: String },          // Seller shop location
    phone: { type: String },            // Contact phone

    // General fields
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      required: true,
      default: "user",
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError during dev
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
