// controllers/productcontroller.js

import Product from "../models/products.js";

// CREATE PRODUCT
export async function CreateProduct(data, user) {
  const { title, category, price, discountPrice, description, images } = data;

  const product = await Product.create({
    sellerId: user.id,
    title,
    category,
    price,
    discountPrice,
    description,
    images, // must be array of URLs
  });

  return { message: "Product created successfully", product };
}

// GET ALL PRODUCTS FOR THIS SELLER
export async function getProducts(sellerId) {
  const products = await Product.find({ sellerId });
  return products;
}



/**
 * Get a product by its ID
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function getProductById(id) {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");
  return product;
}

/**
 * Update a product by ID
 * @param {string} id
 * @param {object} data
 * @param {object} user  // { id, role }
 * @returns {Promise<object>}
 */
export async function updateProduct(id, data, user) {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  // Check ownership if seller
  if (user.role === "seller" && product.sellerId !== user.id) {
    throw new Error("You can only update your own products");
  }

  Object.assign(product, data); // merge updates
  await product.save();

  return { message: "Product updated successfully", product };
}

/**
 * Delete a product by ID
 * @param {string} id
 * @param {object} user  // { id, role }
 * @returns {Promise<object>}
 */
export async function deleteProduct(id, user) {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  // Check ownership if seller
  if (user.role === "seller" && product.sellerId !== user.id) {
    throw new Error("You can only delete your own products");
  }

  await product.remove();

  return { message: "Product deleted successfully" };
}
