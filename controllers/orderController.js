import Order from "@/models/order";
import dbConnect from "@/lib/dbConnect";

export async function createOrder(data, user) {
  await dbConnect();

  // Map cart items to correct structure
  const items = data.items.map((item) => ({
    productId: item._id || item.productId, // fallback if _id present
    title: item.title,
    price: item.price,
    quantity: item.quantity || 1,
    image: item.image || item.images?.[0],
    sellerId: item.sellerId,
  }));

  const order = await Order.create({
    userId: user.id,
    items,
    total: data.total,
    shipping: data.shipping,
    paymentStatus: "pending",
  });

  return order;
}

export async function getOrders(userId) {
  await dbConnect();

  // Fetch orders for a specific user
  const orders = await Order.find({ userId }).sort({ createdAt: -1 });

  return orders;
}
