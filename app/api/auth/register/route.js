// /app/api/auth/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {connectDB} from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req) {
  try {
    await connectDB();

    const { firstName, lastName, businessName, address, email, phone, password, role } = await req.json();

    // Basic validation
    if (!email || !password || !role || (role === "user" && (!firstName || !lastName)) || (role === "seller" && (!businessName || !address))) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      firstName,
      lastName,
      businessName: role === "seller" ? businessName : undefined,
      address: role === "seller" ? address : undefined,
      email,
      phone,
      password: hashedPassword,
      role,
      isSeller: role === "seller",
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          businessName: newUser.businessName,
          email: newUser.email,
          role: newUser.role,
          isSeller: newUser.isSeller,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
