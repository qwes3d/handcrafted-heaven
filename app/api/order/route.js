import { getUserFromRequest } from "@/lib/authconfig";
import { createOrder, getOrders } from "@/controllers/orderController";

export async function POST(request) {
  try {
    // Authenticate user
    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Read JSON body
    const data = await request.json();

    // Create order
    const result = await createOrder(data, user);

    return Response.json(result, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(request) {
  try {
    // Authenticate user
    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's orders
    const result = await getOrders(user.id);

    return Response.json(result, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
