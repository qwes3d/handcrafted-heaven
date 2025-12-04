import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Product from "@/models/products";
import { getUserFromRequest } from "@/lib/authconfig";
import { updateSeller, deleteSeller } from "@/controllers/sellercontroller";

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  // Logged-in seller requesting own data
  if (id === "me") {
    const user = await getUserFromRequest(req);
    if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const products = await Product.find({ sellerId: user.sellerId }).sort({ createdAt: -1 });
    return Response.json(
      {
        seller: { name: user.name, email: user.email, sellerId: user.sellerId },
        products,
      },
      { status: 200 }
    );
  }

  // Public view: get seller by sellerId
  const seller = await User.findOne({ sellerId: id }).select("-password");
  if (!seller) return Response.json({ error: "Seller not found" }, { status: 404 });

  const products = await Product.find({ sellerId: id }).sort({ createdAt: -1 });
  return Response.json({ seller, products }, { status: 200 });
}

export async function PUT(req, { params }) {
  await connectDB();
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  if (user.sellerId !== id) return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const updated = await updateSeller(id, body, user);
  return Response.json(updated, { status: 200 });
}

export async function DELETE(req, { params }) {
  await connectDB();
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  if (user.sellerId !== id) return Response.json({ error: "Forbidden" }, { status: 403 });

  const result = await deleteSeller(id, user);
  return Response.json(result, { status: 200 });
}
