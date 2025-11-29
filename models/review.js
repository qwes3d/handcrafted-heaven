import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError in dev mode
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
