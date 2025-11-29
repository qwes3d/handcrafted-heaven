import Seller from "../models/seller.js";

// ==================== GET SELLER BY ID (public) ====================
export const getSeller = async (id) => {
  const seller = await Seller.findById(id);
  if (!seller) throw new Error("Seller not found");
  return seller;
};

// ==================== UPDATE SELLER (protected) ====================
export const updateSeller = async (id, data, user) => {
  if (!user || user.id !== id) {
    throw new Error("Unauthorized to update seller account");
  }

  const seller = await Seller.findById(id);
  if (!seller) throw new Error("Seller not found");

  Object.assign(seller, data);
  await seller.save();

  return {
    message: "Seller updated successfully",
    seller
  };
};

// ==================== DELETE SELLER (protected) ====================
export const deleteSeller = async (id, user) => {
  if (!user || user.id !== id) {
    throw new Error("Unauthorized to delete seller account");
  }

  const seller = await Seller.findById(id);
  if (!seller) throw new Error("Seller not found");

  await seller.remove();

  return {
    message: "Seller deleted successfully"
  };
};
