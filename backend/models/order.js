import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
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

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
