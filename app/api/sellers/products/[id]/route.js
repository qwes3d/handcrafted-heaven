import { getUserFromRequest } from "@/lib/authconfig";
import { sellerUpdateProduct, sellerDeleteProduct } from "@/controllers/sellerproductcontroller";

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromRequest();
    if (!user || user.role !== "seller") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;           // ✅ Await params
    const data = await request.json();
    const result = await sellerUpdateProduct(id, data, user);

    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromRequest();
    if (!user || user.role !== "seller") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;           // ✅ Await params
    const result = await sellerDeleteProduct(id, user);

    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
