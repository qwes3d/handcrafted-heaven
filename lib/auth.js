//lib/auth.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const {auth, handler} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        // Find the user in the database
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Ensure user is an admin
        if (user.role !== "admin") return null;

        // Return user object for session
        return { id: user._id, email: user.email, role: user.role };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role; // attach role to JWT
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role; // attach role to session
      return session;
    },
  },
  pages: {
    signIn: "/admin/login", // your login page
  },
});