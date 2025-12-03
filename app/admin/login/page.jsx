"use client";
//app/admin/login/page.jsx
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();

    // Perform credentials sign-in without redirect
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      alert("Invalid credentials");
      return;
    }

    if (result?.ok) {
      // Get session to read role
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (!session?.user) {
        alert("Could not get session info");
        return;
      }

      // Redirect based on role
      const role = session.user.role;
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/"); // regular user goes to homepage
      }
    }
  }

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Login</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
