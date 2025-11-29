"use client";

import axios from "@/lib/axiosInstance";
import { useState } from "react";

export default function BecomeSeller() {
  const [form, setForm] = useState({
    businessName: "",
    address: "",
    phone: "",
    image: "",
    bio: "",
  });

  async function submit(e) {
    e.preventDefault();
    await axios.post("/api/auth/become-seller", form);
    alert("You are now a seller!");
    window.location.href = "/seller/dashboard";
  }

  return (
    <form onSubmit={submit} className="auth-form">
      <h2>Become a Seller</h2>

      <input placeholder="Business Name" onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
      <input placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <input placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="Image URL" onChange={(e) => setForm({ ...form, image: e.target.value })} />
      <textarea placeholder="Bio" onChange={(e) => setForm({ ...form, bio: e.target.value })} />

      <button>Submit</button>
    </form>
  );
}
