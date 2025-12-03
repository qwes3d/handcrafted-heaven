//app/api/users/me/password.js

import dbConnect from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/moiddleware/requireAuth";

export default async function handler(req, res) {
  await dbConnect();
  const sessionUser = await requireAuth(req, res);
  if (!sessionUser) return;

  if (req.method !== "PUT") return res.status(405).end();

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(sessionUser.id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(400).json({ error: "Current password incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
}
