import { connectDB } from "@/lib/db";
import Product from "@/models/products";
import { getUserFromRequest } from "@/lib/authconfig";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req) {
  await connectDB();

  // Get the logged-in user
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // Only sellers can delete their own products
  if (user.role !== "seller") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    await Product.deleteMany({ sellerId: user._id });
    return NextResponse.json(
      { message: "All your products have been deleted successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete All Products Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
