import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const exists = await User.findOne({ email });
    if (exists)
      return Response.json({ error: "User already exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: name,
      email,
      password: hashed,
      role: "user",
    });

    const { password: _, ...userData } = user.toObject();

    return Response.json({ message: "User registered", user: userData });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
