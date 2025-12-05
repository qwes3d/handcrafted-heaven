import { auth } from "@/lib/authconfig"; // your NextAuth config

export async function requireAuth(req, res) {
  const session = await auth(); // ✅ Replaces getServerSession()

  if (!session?.user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  return session.user; // { id, email, role, sellerId }
}
