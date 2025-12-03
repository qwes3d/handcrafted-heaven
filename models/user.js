// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    businessName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      required: true,
      default: "user",
    },
    avatar: { type: String },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError in dev
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
