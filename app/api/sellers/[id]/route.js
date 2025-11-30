import { getSeller, updateSeller, deleteSeller } from "@/controllers/sellercontroller";
import { getUserFromRequest } from "@/lib/authconfig";
import { connectDB } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;              // ✅ await params
    const seller = await getSeller(id);
    return Response.json(seller);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const user = await getUserFromRequest(request);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;              // ✅ await params
    const body = await request.json();
    const result = await updateSeller(id, body, user);

    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = await getUserFromRequest(request);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;              // ✅ await params
    const result = await deleteSeller(id, user);
    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
