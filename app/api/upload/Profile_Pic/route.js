// app/api/upload/Profile_Pic/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { getUserFromRequest } from "@/lib/authconfig";

export async function POST(req) {
  try {
    await connectDB();

    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("image");

    if (!file || typeof file !== "object") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    await User.findByIdAndUpdate(user.id, { avatar: base64 });

    return NextResponse.json({ message: "Profile picture updated", avatar: base64 });
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
