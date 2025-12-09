// app/api/users/me/avatar/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { requireAuth } from "@/middleware/requireAuth";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req) {
  try {
    await connectDB();

    const sessionUser = await requireAuth(req);
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("image"); // Important: field name is "image"

    if (!file || typeof file !== "object") {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    // Convert file
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "users/profilePics" },
        (err, result) => (err ? reject(err) : resolve(result))
      ).end(buffer);
    });

    // Save the URL into profilePic field
    const updatedUser = await User.findByIdAndUpdate(
      sessionUser.id,
      { profilePic: uploadResult.secure_url },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "Profile picture updated",
      profilePic: updatedUser.profilePic
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
