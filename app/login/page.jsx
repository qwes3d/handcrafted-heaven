"use client";

import { useState, useContext } from "react";
import axios from "@/app/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/rev/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", form);
      login(res.data); // store user
      router.push("/"); // redirect
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>Email:</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Password:</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />

        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
