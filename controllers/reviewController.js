import Review from "../models/review.js";
import Product from "../models/products.js";

// ADD REVIEW
export async function addReview(data, user) {
  const { productId, rating, comment } = data;

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  const review = await Review.create({
    userId: user.id,
    productId,
    rating,
    comment,
  });

  return { message: "Review added", review };
}

// GET REVIEWS FOR A PRODUCT
export async function getReviews(productId) {
  const reviews = await Review.find({ productId }).populate("userId", "firstName email");
  return reviews;
}
