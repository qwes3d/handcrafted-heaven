import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    sellerId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, optional: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    description: { type: String, required: true },
    images: { type: [String], required: true },
  },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
