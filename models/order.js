import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    items: [
      {
        // use _id from Product as the reference
        productId: { type: String, required: true }, 
        title: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        image: String,
        sellerId: { type: String }, // optional if you want seller info
      }
    ],

    total: Number,

    shipping: {
      name: String,
      email: String,
      address: String,
      city: String,
      country: String,
      postalCode: String,
    },

    paymentStatus: { type: String, default: "pending" },
    paymentId: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
