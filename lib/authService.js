// lib/authService.js
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function verifyUserCredentials(email, password) {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    _id: user._id,
    email: user.email,
    role: user.role, // must be "admin" for admin login page
  };
}
