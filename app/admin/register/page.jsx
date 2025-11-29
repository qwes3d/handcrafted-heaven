"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, phone }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Admin registered successfully");
        router.push("/admin/login");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 border rounded shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Admin Register</h1>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="block border p-2 w-full"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="block border p-2 w-full"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          className="block border p-2 w-full"
        />
        <input
          type="phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="phone"
          required
          className="block border p-2 w-full"
        />

        <button type="submit" className="w-full px-4 py-2 bg-green-600 text-white">
          Register
        </button>
      </form>
    </div>
  );
}
