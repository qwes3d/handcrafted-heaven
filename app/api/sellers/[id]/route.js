// app/api/sellers/[id]/route.js

import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Product from "@/models/products";
import mongoose from "mongoose";
import { getUserFromRequest } from "@/lib/authconfig";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req, ctx) {
  await connectDB();
  const { id } = await ctx.params;

  // Fetch logged-in seller info if id === "me"
  if (id === "me") {
    const user = await getUserFromRequest();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const products = await Product.find({ sellerId: user._id.toString() }).sort({ createdAt: -1 });

    return NextResponse.json({
      seller: {
        ...user.toObject(),
        profilePic: user.profilePic || "/images/placeholder-avatar.jpg",
      },
      products,
    }, { status: 200 });
  }

  // Validate MongoDB ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid seller ID" }, { status: 400 });
  }

  const seller = await User.findById(id).select("-password");
  if (!seller || seller.role !== "seller") {
    return NextResponse.json({ error: "Seller not found" }, { status: 404 });
  }
  const products = await Product.find({ sellerId:id })
  .populate("sellerId", "firstName lastName businessName address phone bio profilePic") // only fetch needed fields
   .sort({ createdAt: -1 }); 
   
   return NextResponse.json({
    seller: {
      ...seller.toObject(),
      profilePic: seller.profilePic || "/images/placeholder-avatar.jpg",
    },
    products,
  }, { status: 200 });
}

export async function PUT(req, ctx) {
  await connectDB();
  const { id } = await ctx.params;

  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Only allow seller to update their own profile
  if (user.role !== "seller" || user._id.toString() !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();

    // Upload profilePic to Cloudinary if present
    const file = formData.get("profilePic");
    if (file && typeof file === "object") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "sellers/profilePics" },
          (err, result) => (err ? reject(err) : resolve(result))
        ).end(buffer);
      });
      user.profilePic = uploaded.secure_url;
    }

    // Update allowed fields
    const fields = ["bio", "businessName", "phone", "address"];
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value) user[field] = value;
    });

    await user.save();

    return NextResponse.json(
      {
        message: "Seller profile updated",
        user: {
          ...user.toObject(),
          profilePic: user.profilePic || "/images/placeholder-avatar.jpg",
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update Seller Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
