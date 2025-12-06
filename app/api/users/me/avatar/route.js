// app/api/users/me/avatar/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { requireAuth } from "@/middleware/requireAuth";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Ensure Node.js runtime (required for Cloudinary)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req) {
  await connectDB();

  const sessionUser = await requireAuth(req);
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("avatar");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload directly to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload_stream(
      {
        folder: "avatars",
        resource_type: "image",
      },
      async (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    // Cloudinary upload via stream
    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "avatars" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    const avatarUrl = uploadResponse.secure_url;

    // Update user avatar in DB
    const user = await User.findByIdAndUpdate(
      sessionUser.id,
      { avatar: avatarUrl },
      { new: true }
    ).select("-password");

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
