import express from "express";
import Seller from "../models/Seller.js";

const router = express.Router();

// GET /sellers/:id
router.get("/:id", async (req, res) => {
  try {
    // use findOne, not findById
    const seller = await Seller.findOne({ _id: req.params.id });

    if (!seller) return res.status(404).json({ msg: "Seller not found" });
    res.json(seller);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
