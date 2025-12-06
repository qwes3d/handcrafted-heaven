import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { requireAuth } from "@/middleware/requireAuth";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure folder exists
    const uploadDir = path.join(process.cwd(), "public/uploads/avatars");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
    await fs.writeFile(filePath, buffer);

    const publicPath = `/uploads/avatars/${path.basename(filePath)}`;

    const user = await User.findByIdAndUpdate(
      sessionUser.id,
      { avatar: publicPath },
      { new: true }
    ).select("-password");

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
