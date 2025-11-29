import { getUserFromRequest, requireRole } from "@/lib/auth";
import { sellerCreateProduct, sellerGetProducts } from "@/controllers/sellerproductcontroller";

export async function POST(request) {
  const user = await getUserFromRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    requireRole(user, "seller");
    const data = await request.json();
    const result = await sellerCreateProduct(data, user);
    return Response.json(result, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}

export async function GET(request) {
  const user = await getUserFromRequest(request);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    requireRole(user, "seller");
    const result = await sellerGetProducts(user.id);
    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}
