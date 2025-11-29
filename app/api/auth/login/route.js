import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "Invalid email or password" }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json({ error: "Invalid email or password" }, { status: 400 });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(
      JSON.stringify({ message: "Login successful", user }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
