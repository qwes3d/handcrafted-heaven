import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/authconfig";

export async function PUT(req) {
  await connectDB();
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();
  const user = await User.findById(session.user.id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  // ⬇️ Redirect after success
  return NextResponse.redirect(new URL("/", req.url));
}
