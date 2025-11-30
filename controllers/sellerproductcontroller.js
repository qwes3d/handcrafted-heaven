//controllers/sellerproductcontroller.js

import Product from "../models/products.js";

// ==================== UPDATE PRODUCT ====================
export async function sellerUpdateProduct(productId, data, user) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // Only owner seller can update
  if (user.role !== "seller" || user.id !== product.sellerId.toString()) {
    throw new Error("Unauthorized to update this product");
  }

  // Merge new fields
  Object.assign(product, data);

  // If images provided, append to existing array
  if (data.images && Array.isArray(data.images)) {
    product.images = [...product.images, ...data.images];
  }

  await product.save();

  return { message: "Product updated successfully", product };
}

// ==================== DELETE PRODUCT ====================
export async function sellerDeleteProduct(productId, user) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // Only owner seller can delete
  if (user.role !== "seller" || user.id !== product.sellerId.toString()) {
    throw new Error("Unauthorized to delete this product");
  }

  await product.remove();

  return { message: "Product deleted successfully" };
}
