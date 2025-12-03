

import { getSeller, updateSeller, deleteSeller } from "@/controllers/sellercontroller";
import { getUserFromRequest } from "@/lib/authconfig";
import { connectDB } from "@/lib/db";

// ----------------------------------
// GET /api/sellers/:id
// ----------------------------------
export async function GET(req, { params }) {
  const { id } = params;
  const seller = await getSeller(id);

  if (!seller) {
    return Response.json({ error: "Seller not even found" }, { status: 404 });
  }

  return Response.json(seller);
}


// ----------------------------------
// PUT /api/sellers/:id
// ----------------------------------
export async function PUT(request, { params: paramsPromise }) {
  try {
    await connectDB();

    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await paramsPromise;   // ← required
    const body = await request.json();

    const updated = await updateSeller(id, body, user);
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ----------------------------------
// DELETE /api/sellers/:id
// ----------------------------------
export async function DELETE(request, { params: paramsPromise }) {
  try {
    await connectDB();

    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await paramsPromise;   // ← required

    const result = await deleteSeller(id, user);
    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
