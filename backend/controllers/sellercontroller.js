// src/controllers/sellerController.js
import Seller from "../models/seller.js";

// ==================== GET SELLER BY ID ====================
export const getSeller = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const seller = await Seller.findById(sellerId);

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    res.status(200).json(seller);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== UPDATE SELLER ====================
export const updateSeller = async (req, res) => {
  try {
    const sellerId = req.params.id;

    // Only seller can update their own profile
    if (req.user.role !== "seller" || req.user.id !== sellerId) {
      return res.status(403).json({ message: "You can only update your own profile." });
    }

    const seller = await Seller.findByIdAndUpdate(sellerId, req.body, { new: true });

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    res.status(200).json({ message: "Seller updated successfully", seller });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== DELETE SELLER ====================
export const deleteSeller = async (req, res) => {
  try {
    const sellerId = req.params.id;

    // Only seller can delete their own profile
    if (req.user.role !== "seller" || req.user.id !== sellerId) {
      return res.status(403).json({ message: "You can only delete your own profile." });
    }

    await Seller.findByIdAndDelete(sellerId);

    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
