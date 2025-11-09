import Seller from "../models/seller.js";

export const getSellerById = async (req, res) => {
  try {
    // IMPORTANT: your seller id is custom string, not Mongo ObjectId
    const seller = await Seller.findOne({ id: req.params.id });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json(seller);
  } catch (error) {
    console.error("Error getting seller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
