import { getSeller, updateSeller, deleteSeller } from "@/controllers/sellercontroller";
import { getUserFromRequest } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const seller = await getSeller(params.id);
    return Response.json(seller);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const user = await getUserFromRequest(request);

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const result = await updateSeller(params.id, body, user);

    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const user = await getUserFromRequest(request);

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const result = await deleteSeller(params.id, user);
    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
