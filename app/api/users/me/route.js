// app/api/users/me/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { auth, getUserFromRequest } from "@/lib/authconfig";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import formidable from "formidable";

export const runtime = "nodejs";       // Required for fs operations
export const dynamic = "force-dynamic"; // Required for file uploads


await connectDB();

// Helper: Save uploaded file to /public/uploads
const saveFile = (file) => {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.originalFilename}`;
  const filePath = path.join(uploadDir, fileName);

  fs.renameSync(file.filepath, filePath);
  return `/uploads/${fileName}`;
};

// GET /api/users/me
export const GET = async () => {
  const sessionUser = await getUserFromRequest();
  if (!sessionUser)
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const user = await User.findById(sessionUser.id).select("-password");
  if (!user)
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

  return new Response(JSON.stringify(user), { status: 200 });
};

// PUT /api/users/me
export const PUT = async (req) => {
  const sessionUser = await getUserFromRequest();
  if (!sessionUser)
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const contentType = req.headers.get("content-type") || "";
  let updateData = {};

  if (contentType.includes("multipart/form-data")) {
    // Handle file upload
    const form = formidable({ multiples: false });
    const { fields, files } = await new Promise((resolve, reject) =>
      form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })))
    );

    updateData = { ...fields };

    if (files.file) {
      const fileUrl = saveFile(files.file);
      updateData.profilePic = fileUrl;
    }
  } else {
    // JSON body
    const body = await req.json();
    updateData = { ...body };
  }

  // Password change
  if (updateData.newPassword) {
    if (!updateData.currentPassword)
      return new Response(JSON.stringify({ error: "Current password required" }), { status: 400 });

    const user = await User.findById(sessionUser.id);
    const isValid = await bcrypt.compare(updateData.currentPassword, user.password);
    if (!isValid)
      return new Response(JSON.stringify({ error: "Current password incorrect" }), { status: 400 });

    updateData.password = await bcrypt.hash(updateData.newPassword, 10);
  }

  // Prevent sensitive changes
  delete updateData.role;
  delete updateData.currentPassword;
  delete updateData.newPassword;
  delete updateData.confirmPassword;

  const updatedUser = await User.findByIdAndUpdate(sessionUser.id, updateData, { new: true }).select("-password");
  return new Response(JSON.stringify(updatedUser), { status: 200 });
};

// DELETE /api/users/me
export const DELETE = async () => {
  const sessionUser = await getUserFromRequest();
  if (!sessionUser)
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  await User.findByIdAndDelete(sessionUser.id);
  return new Response(JSON.stringify({ message: "User deleted" }), { status: 200 });
};
