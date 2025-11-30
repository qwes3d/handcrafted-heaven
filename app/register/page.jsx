"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
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
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { role, email: form.email, phone: form.phone, password: form.password };
      if (role === "user") {
        payload.firstName = form.firstName;
        payload.lastName = form.lastName;
      } else if (role === "seller") {
        payload.businessName = form.businessName;
        payload.address = form.address;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        // redirect based on role
        if (role === "seller") {
          router.push("/seller/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div>
          <label>Role:</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {role === "user" && (
          <>
            <div>
              <label>First name:</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div>
              <label>Last name:</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
          </>
        )}

        {role === "seller" && (
          <>
            <div>
              <label>Business name:</label>
              <input name="businessName" value={form.businessName} onChange={handleChange} required />
            </div>
            <div>
              <label>Address:</label>
              <input name="address" value={form.address} onChange={handleChange} required />
            </div>
          </>
        )}

        <div>
          <label>Email:</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Phone:</label>
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </div>

        <div>
          <label>Password:</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registering…" : "Register"}
        </button>
      </form>
    </div>
  );
}
