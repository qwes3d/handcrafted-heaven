"use client";

import { useState, useContext } from "react";
import axios from "@/app/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/rev/AuthContext";

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [role, setRole] = useState("user");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    address: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare payload based on role
    const payload = { role, email: form.email, phone: form.phone, password: form.password };
    if (role === "user") {
      payload.firstName = form.firstName;
      payload.lastName = form.lastName;
    }
    if (role === "seller") {
      payload.businessName = form.businessName;
      payload.address = form.address;
    }

    try {
      const res = await axios.post("/auth/register", payload);
      login(res.data); // store user
      router.push("/"); // redirect
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>

        {role === "user" && (
          <>
            <label>First Name:</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required />

            <label>Last Name:</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </>
        )}

        {role === "seller" && (
          <>
            <label>Business Name:</label>
            <input name="businessName" value={form.businessName} onChange={handleChange} required />

            <label>Address:</label>
            <input name="address" value={form.address} onChange={handleChange} required />
          </>
        )}

        <label>Email:</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Phone:</label>
        <input name="phone" value={form.phone} onChange={handleChange} required />

        <label>Password:</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />

        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </main>
  );
}
