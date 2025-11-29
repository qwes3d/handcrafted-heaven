import { getUserFromRequest } from "@/lib/auth";
import { sellerUpdateProduct, sellerDeleteProduct } from "@/controllers/sellerproductcontroller";

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromRequest();
    if (!user || user.role !== "seller") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const result = await sellerUpdateProduct(params.id, data, user);

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

    const result = await sellerDeleteProduct(params.id, user);

    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
