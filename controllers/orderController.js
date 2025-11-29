import Order from "../models/order.js";
import Product from "../models/products.js";

// CREATE ORDER
export async function createOrder(data, user) {
  const { items, address, paymentMethod } = data;

  if (!items || items.length === 0) throw new Error("No items in order");

  // Optional: validate product existence and calculate total
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);
    total += product.price * item.quantity;
  }

  const order = await Order.create({
    userId: user.id,
    items,
    address,
    paymentMethod,
    total,
    status: "pending",
  });

  return { message: "Order created", order };
}

// GET ORDERS FOR LOGGED-IN USER
export async function getOrders(userId) {
  const orders = await Order.find({ userId }).populate("items.productId ");
  return orders;
}

