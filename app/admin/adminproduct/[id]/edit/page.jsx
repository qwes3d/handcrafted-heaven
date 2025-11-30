"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function EditProductPage() {
  const { id } = useParams();         // get dynamic product id from URL
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    images: "",   // will hold comma‑separated URLs or a newline-separated list
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch product on mount
  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/products/${id}`)
      .then(res => {
        const p = res.data;
        setProduct(p);
        setForm({
          title: p.title || "",
          description: p.description || "",
          category: p.category || "",
          price: p.price != null ? p.price : "",
          discountPrice: p.discountPrice != null ? p.discountPrice : "",
          images: (p.images || []).join("\n"),  // join image URLs for editing
        });
      })
      .catch(err => {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product");
      });
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Loading …</div>;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Prepare data
    const updated = {
      title: form.title,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      discountPrice: form.discountPrice === "" ? 0 : Number(form.discountPrice),
      images: form.images.split("\n").map(s => s.trim()).filter(s => s),
    };

    try {
      await axios.put(`/api/products/${id}`, updated);
      router.push("/admin/adminproduct"); // or wherever your product list page is
    } catch (err) {
      console.error("Update failed:", err);
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Edit Product</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Category</label>
          <input
            type="text"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Discount Price</label>
          <input
            type="number"
            value={form.discountPrice}
            onChange={e => setForm({ ...form, discountPrice: e.target.value })}
          />
        </div>

        <div>
          <label>Image URLs (one per line)</label>
          <textarea
            value={form.images}
            onChange={e => setForm({ ...form, images: e.target.value })}
            required
          />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
