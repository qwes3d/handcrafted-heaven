import Product from "../models/products.js";

// ==================== CREATE PRODUCT ====================
export const sellerCreateProduct = async (req, res) => {
  try {
    const sellerId = req.user.id; // seller from auth token
    const { title, category, price, discountPrice, description } = req.body;

    // Only seller can create products for themselves
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can create products." });
    }

    // req.files is an array of uploaded files
    const images = req.files ? req.files.map((file) => "/uploads/" + file.filename) : [];

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

// ==================== GET ALL PRODUCTS FOR THIS SELLER ====================
export const sellerGetProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const products = await Product.find({ sellerId });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== UPDATE PRODUCT ====================
export const sellerUpdateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only the owner seller can update
    if (req.user.role !== "seller" || req.user.id !== product.sellerId) {
      return res.status(403).json({ message: "You can only update your own products." });
    }

    // Add new uploaded images if any
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => "/uploads/" + file.filename);
      product.images = [...product.images, ...newImages];
    }

    // Update other fields
    Object.assign(product, req.body);

    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== DELETE PRODUCT ====================
export const sellerDeleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.user.role !== "seller" || req.user.id !== product.sellerId) {
      return res.status(403).json({ message: "You can only delete your own products." });
    }

    await product.remove();

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
