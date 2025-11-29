import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    sellerId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String }, // optional by default
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    description: { type: String, required: true },
    images: { type: [String], required: true },
  },
  quantity: { type: Number, required: true, min: 1 },
});

export default cartItemSchema;
