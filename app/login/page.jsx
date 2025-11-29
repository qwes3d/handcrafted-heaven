"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,      // so you control redirect manually
      email,
      password,
    });

    if (!result || result.error) {
      alert("Login failed");
      return;
    }

    // After signIn, fetch session or rely on the result
    const session = await fetch("/api/auth/session").then(r => r.json());

    const role = session?.user?.role;
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "seller") {
      router.push("/seller/dashboard");
    } else {
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
