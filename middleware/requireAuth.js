import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authconfig"; // your NextAuth config

export async function requireAuth(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return session.user; // { id, email, role }
}
