// app/api/sellers/[id]/route.js

import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Product from "@/models/products";
import mongoose from "mongoose";
import { getUserFromRequest } from "@/lib/authconfig";

//
// GET — Public seller page OR logged-in seller "me"
// ---------------------------------------------------
export async function GET(req, ctx) {
  await connectDB();
  const { id } = await ctx.params;

  // If the frontend requests /api/sellers/me
  if (id === "me") {
    const user = await getUserFromRequest();
    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const products = await Product.find({ sellerId: user._id.toString() })
                                  .sort({ createdAt: -1 });

    return Response.json(
      {
        seller: user,
        products,
      },
      { status: 200 }
    );
  }

  // Validate Mongo ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid seller ID" }, { status: 400 });
  }

  // Get seller info
  const seller = await User.findById(id).select("-password");
  if (!seller || seller.role !== "seller") {
    return Response.json({ error: "Seller not found" }, { status: 404 });
  }

  // Get all products tied to this seller
  const products = await Product.find({ sellerId: seller._id.toString() })
                                .sort({ createdAt: -1 });

  return Response.json({ seller, products }, { status: 200 });
}

//
// PUT — Only the seller can update his own profile
// ---------------------------------------------------
export async function PUT(req, ctx) {
  await connectDB();
  const { id } = await ctx.params;

  const user = await getUserFromRequest();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Only the seller can update their own account
  if (user.role !== "seller" || user._id.toString() !== id) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await req.json();
  const { profilePic, bio, businessName, phone, address } = data;

  // Update allowed fields
  if (profilePic !== undefined) user.profilePic = profilePic;
  if (bio !== undefined) user.bio = bio;
  if (businessName !== undefined) user.businessName = businessName;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;

  await user.save();

  return Response.json(
    { message: "Seller profile updated", user },
    { status: 200 }
  );
}

//
// DELETE — Seller deletes his account + all products
// ---------------------------------------------------
export async function DELETE(req, ctx) {
  await connectDB();
  const { id } = await ctx.params;

  const user = await getUserFromRequest();
  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Only the seller can delete himself
  if (user.role !== "seller" || user._id.toString() !== id) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Remove seller’s products first
  await Product.deleteMany({ sellerId: user._id.toString() });

  // Remove seller account
  await User.findByIdAndDelete(user._id);

  return Response.json(
    { message: "Seller account and products deleted." },
    { status: 200 }
  );
}
