// Example: /api/products/[id]/route.js

import { getProductById, updateProduct, deleteProduct } from "@/controllers/productcontroller";
import { productUpdateSchema } from "@/validation/validators";

export async function GET(request, { params }) {
  try {
    const { id } = await params;           // ✅ await params
    const product = await getProductById(id);
    if (!product) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json(product);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;           // ✅ await params
    const body = await request.json();
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(parsed.error, { status: 400 });
    }
    const updated = await updateProduct(id, parsed.data);
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;           // ✅ await params
    await deleteProduct(id);
    return Response.json({ message: "Deleted" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
