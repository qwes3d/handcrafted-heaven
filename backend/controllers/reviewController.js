import Review from "../models/review.js";

// ADD REVIEW
export const addReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    const review = await Review.create({ productId, userId, rating, comment });

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET REVIEWS FOR PRODUCT
export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
