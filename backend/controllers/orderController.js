import Order from "../models/order.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { userId, products, totalPrice } = req.body;

    const order = await Order.create({
      userId,
      products,
      totalPrice,
    });

    res.status(201).json({ message: "Order created", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER ORDERS
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
