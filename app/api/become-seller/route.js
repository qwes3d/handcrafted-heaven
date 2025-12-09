// app/api/become-seller/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { auth } from "@/lib/authconfig";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    const session = await auth();
    if (!session || !session.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id || session.user._id;
    const user = await User.findById(userId);

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const formData = await req.formData();

    const businessName = formData.get("businessName");
    const address = formData.get("address");
    const phone = formData.get("phone");
    const bio = formData.get("bio");

    if (!businessName || !address || !phone || !bio) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // === Upload images to Cloudinary ===
    const uploadedImages = [];

    const files = formData.getAll("image");
    for (const file of files) {
      if (typeof file === "string") continue; // ignore text fields

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "seller-profiles" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        ).end(buffer);
      });

      uploadedImages.push(result.secure_url);
    }

    // === Update user ===
    user.role = "seller";
    user.businessName = businessName;
    user.address = address;
    user.phone = phone;
    user.bio = bio;

    if (uploadedImages.length > 0) {
      user.sellerImages = uploadedImages;
    }

    await user.save();

    return NextResponse.json(
      { success: true, message: "Seller profile created", user },
      { status: 201 }
    );
  } catch (err) {
    console.error("BecomeSeller API Error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
