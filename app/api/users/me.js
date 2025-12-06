//app/api/users/me.js

import {connectDB} from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/middleware/requireAuth";

export default async function handler(req, res) {
  await connectDB();

  const sessionUser = await requireAuth(req, res);
  if (!sessionUser) return;

  switch (req.method) {
    case "GET":
      const user = await User.findById(sessionUser.id).select("-password");
      return res.status(200).json(user);

    case "PUT":
      const { firstName, lastName, businessName, phone, address, email } = req.body;

      const updated = await User.findByIdAndUpdate(
        sessionUser.id,
        { firstName, lastName, businessName, phone, address, email },
        { new: true, runValidators: true }
      ).select("-password");

      return res.status(200).json(updated);

    case "DELETE":
      await User.findByIdAndDelete(sessionUser.id);
      return res.status(200).json({ message: "Account deleted" });

    default:
      return res.status(405).end();
  }
}
