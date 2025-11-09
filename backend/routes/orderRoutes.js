import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { validateBody } from "../middleware/validate.js"; // import validate from "../middleware/validate.js";
import { orderSchema } from "../validation/validators.js";
import { createOrder, getOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", verifyToken, validateBody(orderSchema), createOrder);
router.get("/", verifyToken, getOrders);

export default router;
