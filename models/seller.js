import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessName: String,
  address: String,
  phone: String,
  bio: String,
  images: [String],
  email: String,
});

export default mongoose.models.Seller || mongoose.model("Seller", sellerSchema);
