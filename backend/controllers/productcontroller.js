// src/controllers/productController.js
import Product from "../models/products.js";
import User from "../models/user.js";

// ==================== CREATE PRODUCT ====================
export const createProduct = async (req, res) => {
  try {
    const { sellerId, title, category, price, discountPrice, description, images } = req.body;

    // Optional: check that sellerId matches the logged-in user
    if (req.user.role === "seller" && req.user.id !== sellerId) {
      return res.status(403).json({ message: "You can only create products for your own account." });
    }

    const product = await Product.create({
      sellerId,
      title,
      category,
      price,
      discountPrice,
      description,
      images,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== GET ALL PRODUCTS ====================
export const getProducts = async (req, res) => {
  try {
    const { sellerId } = req.query; // <-- read query

    let filter = {};

    // if sellerId query is provided, filter result
    if (sellerId) {
      filter.sellerId = sellerId;
    }

    const products = await Product.find(filter);

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== UPDATE PRODUCT ====================
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check ownership: seller can only update their own product
    if (req.user.role === "seller" && req.user.id !== product.sellerId) {
      return res.status(403).json({ message: "You can only update your own products." });
    }

    // Update fields
    Object.assign(product, req.body);

    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== DELETE PRODUCT ====================
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check ownership: seller can only delete their own product
    if (req.user.role === "seller" && req.user.id !== product.sellerId) {
      return res.status(403).json({ message: "You can only delete your own products." });
    }

    await product.remove();

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ==================== GET PRODUCT BY ID ====================
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
