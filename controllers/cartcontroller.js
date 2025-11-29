import Cart from "../models/cart.js"; // your Cart model
import Product from "../models/products.js";

// ADD TO CART
export async function addToCart(data, user) {
  const { productId, quantity } = data;

  // Optional: check if product exists
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  let cart = await Cart.findOne({ userId: user.id });
  if (!cart) {
    cart = await Cart.create({ userId: user.id, items: [] });
  }

  // Check if product is already in cart
  const existing = cart.items.find((item) => item.productId.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();

  return { message: "Added to cart", cart };
}

// GET CART
export async function getCart(userId) {
  const cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart) return { items: [] };
  return cart;
}
