import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { validateBody } from "../middleware/validate.js"; // import validate from "../middleware/validate.js";
import { reviewSchema } from "../validation/validators.js";
import { addReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", verifyToken, validateBody(reviewSchema), addReview);
router.get("/:productId", getReviews);

export default router;
