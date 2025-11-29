"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products Admin</h1>

      <div className="mb-4">
        <Link href="/admin/adminproduct/new">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            + New Product
          </button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td className="border p-2">{p._id}</td>
                <td className="border p-2">{p.title}</td>
                <td className="border p-2">${p.price}</td>
                <td className="border p-2 space-x-2">
                  <Link href={`/admin/adminproduct/${p._id}/edit`}>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded">
                      Edit
                    </button>
                  </Link>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
