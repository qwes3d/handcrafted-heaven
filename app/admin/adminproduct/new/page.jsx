"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const [sellerId, setSellerId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState("");  // comma-separated URLs
  const [price, setPrice] = useState(0);

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const imageArray = images.split(",").map(url => url.trim());
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sellerId, title, description, images: imageArray, price })
    });
    if (res.ok) {
      alert("Product created");
      router.refresh();
    } else {
      alert("Error creating product");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input value={sellerId} onChange={e => setSellerId(e.target.value)} placeholder="Seller Id" required />
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
      <input value={images} onChange={e => setImages(e.target.value)} placeholder="Image URLs (comma separated)" required />
      <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price" required />
      <button type="submit">Create Product</button>
    </form>
  );
}
