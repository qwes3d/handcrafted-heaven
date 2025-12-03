"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "@/lib/axiosInstance";

export default function NewProduct() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  if (!user) return <p className="text-center mt-20">Please log in</p>;
  if (user.role !== "seller") return <p className="text-center mt-20">Unauthorized</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, file }));

    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("category", form.category);
      data.append("price", form.price);
      if (form.file) data.append("image", form.file);

      await axios.post("/seller/add-product", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added successfully");
      router.push("/sellers/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg grid gap-4"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Title"
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product Description"
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={4}
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category (optional)"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (GH₵)"
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="h-48 w-full object-cover rounded-lg mt-2 border"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Saving…" : "Add Product"}
        </button>
      </form>
    </main>
  );
}
