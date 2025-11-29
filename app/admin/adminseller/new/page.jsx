"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSellerPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/sellers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Date.now().toString(), name, bio, image, contactEmail })
    });
    if (res.ok) {
      alert("Seller created!");
      router.refresh();
    } else {
      alert("Error creating seller");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
      <input value={bio} onChange={e => setBio(e.target.value)} placeholder="Bio" />
      <input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL" />
      <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Contact Email" />
      <button type="submit">Create Seller</button>
    </form>
  );
}
