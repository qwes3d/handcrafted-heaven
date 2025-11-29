import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@auth";

export async function POST(req) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { businessName, address, phone, image, bio } = await req.json();

  if (!businessName || !address || !phone) {
    return Response.json({ error: "Business name, address, and phone are required" }, { status: 400 });
  }

  const user = await User.findById(session.user.id);
  if (!user)
    return Response.json({ error: "User not found" }, { status: 404 });

  if (user.role === "seller") {
    return Response.json({ message: "You are already a seller!" });
  }

  user.role = "seller";
  user.sellerInfo = { businessName, address, phone, image, bio };
  await user.save();

  return Response.json({ message: "You are now a seller!", sellerInfo: user.sellerInfo });
}
