// app/api/auth/register/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { role, firstName, lastName, businessName, address, email, phone, password } = body;

    // basic validation
    if (!email || !phone || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      phone,
      password: hashed,
      role,
      ...(role === "user" ? { firstName, lastName } : {}),
      ...(role === "seller" ? { businessName, address } : {}),
    });

    await newUser.save();

    // Return safe user data (no password)
    const { _id, email: uEmail, role: uRole } = newUser;
    return new Response(JSON.stringify({ user: { id: _id, email: uEmail, role: uRole } }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
