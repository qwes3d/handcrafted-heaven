import connectDB from "@/lib/db";
import Order from "@/models/order";

export async function POST(req) {
  try {
    await connectDB();

    const { userId, items, total, shipping } = await req.json();

    // Validation
    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return Response.json({ error: "Cart items missing" }, { status: 400 });
    }

    if (!total) {
      return Response.json({ error: "Missing total amount" }, { status: 400 });
    }

    // Create order
    const newOrder = await Order.create({
      userId,
      items,
      total,
      shipping: shipping || {},
      paymentStatus: "pending",
      paymentId: null,
    });

    return Response.json(newOrder, { status: 201 });

  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export function GET() {
  return Response.json({ error: "GET not allowed" }, { status: 405 });
}
