// src/routes/sellerRoute.js
import express from "express";
import { getSeller, updateSeller, deleteSeller } from "../controllers/sellercontroller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();


// GET all sellers
router.get("/", async (req, res) => {
  try {
    const sellers = await Seller.find().select("id name"); // only send needed fields
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get seller by ID (public)
router.get("/:id", getSeller);

// Update seller (protected)
router.put("/:id", auth, updateSeller);

// Delete seller (protected)
router.delete("/:id", auth, deleteSeller);

export default router;
