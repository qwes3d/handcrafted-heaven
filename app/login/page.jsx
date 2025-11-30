"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  async function handleLogin(e) {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      alert("Invalid credentials");
      return;
    }
    // result.ok === true means sign‑in succeeded but session may update asynchronously
  }

  // Watch session change: when user signs in, session becomes available → redirect based on role
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = session.user.role;
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [status, session, router]);

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Login</h2>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
