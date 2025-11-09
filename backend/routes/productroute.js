// backend/routes/productroute.js
import express from "express";
import { productCreateSchema, productUpdateSchema } from "../validation/validators.js";
import { validateBody } from "../middleware/validate.js"; // <- use named import
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", validateBody(productCreateSchema), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", validateBody(productUpdateSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
