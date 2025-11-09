import express from "express";
import { validateBody } from "../middleware/validate.js"; // import validate from "../middleware/validate.js";
import verifyToken from "../middleware/verifyToken.js";
import { addToCartSchema } from "../validation/validators.js";
import { addToCart, getCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", verifyToken, validateBody(addToCartSchema), addToCart);
router.get("/", verifyToken, getCart);

export default router;
