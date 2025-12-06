// app/api/users/me/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { getUserFromRequest } from "@/lib/authconfig";
import bcrypt from "bcryptjs";
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

// GET /api/users/me
export async function GET() {
  await connectDB();

  const sessionUser = await getUserFromRequest();
  if (!sessionUser)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const user = await User.findById(sessionUser.id).select("-password");

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

// PUT /api/users/me
export async function PUT(req) {
  await connectDB();

  const sessionUser = await getUserFromRequest();
  if (!sessionUser)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const contentType = req.headers.get("content-type") || "";
  const updateData = {};

  // --- 1) Handle multipart form (image + fields) ---
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();

    // Extract all fields except the file
    form.forEach((value, key) => {
      if (key !== "profilePic") updateData[key] = value;
    });

    const file = form.get("profilePic");

    if (file && typeof file === "object") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        ).end(buffer);
      });

      updateData.profilePic = uploadResult.secure_url;
    }

  } else {
    // --- 2) JSON body ---
    const body = await req.json();
    Object.assign(updateData, body);
  }

  // --- 3) Password change ---
  if (updateData.newPassword) {
    const user = await User.findById(sessionUser.id);

    if (!await bcrypt.compare(updateData.currentPassword, user.password)) {
      return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });
    }

    updateData.password = await bcrypt.hash(updateData.newPassword, 10);
  }

  // Prevent dangerous field updates
  delete updateData.role;
  delete updateData.newPassword;
  delete updateData.currentPassword;
  delete updateData.confirmPassword;

  // --- 4) Save updated user ---
  const updatedUser = await User.findByIdAndUpdate(
    sessionUser.id,
    updateData,
    { new: true }
  ).select("-password");

  return NextResponse.json(updatedUser);
}

// DELETE /api/users/me
export async function DELETE() {
  await connectDB();

  const sessionUser = await getUserFromRequest();
  if (!sessionUser)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  await User.findByIdAndDelete(sessionUser.id);

  return NextResponse.json({ message: "User deleted" });
}
