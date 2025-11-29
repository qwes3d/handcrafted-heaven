// app/api/admin/register/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

// const ADMIN_SECRET = process.env.ADMIN_SECRET; // you can keep or remove this as you prefer

export async function POST(request) {
  try {
    await connectDB();

    // Authorization by secret — commented out, so registration is open
    /*
    const authHeader = request.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    */

    const { email, password, phone } = await request.json();

    // Basic validation
    if (!email || !password || !email.includes("@") || password.length < 8) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ error: "Admin already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      email,
      password: hashedPassword,
      role: "admin",
      phone,  // store phone if provided
    });

    return new Response(JSON.stringify({ message: "Admin registered successfully" }), { status: 201 });
  } catch (err) {
    console.error("Admin registration error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
