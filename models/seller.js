import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    bio: String,
    image: String,
    contactEmail: String,
  },
  { timestamps: true }
);

// Prevent OverwriteModelError in dev
const Seller = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);

export default Seller;
