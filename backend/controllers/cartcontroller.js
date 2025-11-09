import Cart from "../models/cart.js";

// ADD ITEM TO CART
export const addToCart = async (req, res) => {
  try {
    const { userId, product, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [{ product, quantity }] });
    } else {
      const existingIndex = cart.items.findIndex(
        (item) => item.product.name === product.name
      );
      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += quantity;
      } else {
        cart.items.push({ product, quantity });
      }
      await cart.save();
    }

    res.json({ message: "Product added to cart", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER CART
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
