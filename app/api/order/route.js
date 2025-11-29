import { getUserFromRequest } from "@/lib/auth";
import { createOrder, getOrders } from "@/controllers/orderController";

export async function POST(request) {
  try {
    const user = await getUserFromRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const result = await createOrder(data, user);

    return Response.json(result, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const result = await getOrders(user.id);
    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
