// src/routes/sellerProductRoutes.js
import express from "express";
import {
  sellerCreateProduct,
  sellerGetProducts,
  sellerUpdateProduct,
  sellerDeleteProduct,
} from "../controllers/sellerproductcontroller.js";

import { auth, requireRole } from "../middleware/auth.js"; // your auth middleware
import { upload } from "../middleware/upload.js";

const router = express.Router();

// All routes require seller authentication
router.use(auth, requireRole("seller"));

// Create product with image upload (multiple images)
router.post("/", upload.array("images", 5), sellerCreateProduct);

// Get all products for logged-in seller
router.get("/", sellerGetProducts);

// Update product by ID (optional new images)
router.put("/:id", upload.array("images", 5), sellerUpdateProduct);

// Delete product
router.delete("/:id", sellerDeleteProduct);

export default router;
