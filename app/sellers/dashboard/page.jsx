"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";

export default function SellerDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "seller") return;
    loadProducts();
  }, [user]);

  async function loadProducts() {
    try {
      setLoading(true);
      const res = await axios.get("/products");
      setProducts(res.data.filter((p) => p.sellerId === user.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function beginEdit(p) {
    setEditingId(p._id);
    setFormState({
      title: p.title,
      sellerId: p.sellerId,
      description: p.description,
      category: p.category,
      price: p.price,
      image: p.images?.[0] || "",
      file: null,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormState({});
  }

  async function saveEdit(id) {
    try {
      setSavingId(id);
      const data = new FormData();
      data.append("title", formState.title);
      data.append("sellerId", formState.sellerId);
      data.append("description", formState.description);
      data.append("category", formState.category);
      data.append("price", formState.price);
      if (formState.file) data.append("image", formState.file);

      await axios.put(`/sellers/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await loadProducts();
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`/sellers/delete/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  }

  if (!user) return <p>Please log in</p>;
  if (user.role !== "seller") return <p>Access Denied</p>;

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <a
          href="/sellers/newproduct"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          + Add Product
        </a>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => {
            const editing = editingId === p._id;
            return (
              <div
                key={p._id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition relative p-2 flex flex-col"
              >
                {editing ? (
                  <>
                    <input
                      type="text"
                      value={formState.title}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, title: e.target.value }))
                      }
                      placeholder="Title"
                      className="w-full border px-2 py-1 rounded mb-1 text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={formState.sellerId}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          sellerId: e.target.value,
                        }))
                      }
                      placeholder="Seller ID"
                      className="w-full border px-2 py-1 rounded mb-1 text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <textarea
                      value={formState.description}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Description"
                      className="w-full border px-2 py-1 rounded mb-1 text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={formState.category}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, category: e.target.value }))
                      }
                      placeholder="Category"
                      className="w-full border px-2 py-1 rounded mb-1 text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="number"
                      value={formState.price}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, price: e.target.value }))
                      }
                      placeholder="Price"
                      className="w-full border px-2 py-1 rounded mb-1 text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {formState.image && (
                      <img
                        src={formState.image}
                        alt="Preview"
                        className="h-32 w-full object-cover mb-1 rounded"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setFormState((s) => ({ ...s, file }));
                        const reader = new FileReader();
                        reader.onload = () =>
                          setFormState((s) => ({ ...s, image: reader.result }));
                        reader.readAsDataURL(file);
                      }}
                      className="w-full mb-1 text-base font-semibold text-gray-900 placeholder-gray-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(p._id)}
                        disabled={savingId === p._id}
                        className="flex-1 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {savingId === p._id ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-300 px-2 py-1 rounded hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={p.images?.[0]}
                      alt={p.title}
                      className="h-48 w-full object-cover mb-2 rounded"
                    />
                    <h2 className="font-semibold text-lg">{p.title}</h2>
                    <p className="text-gray-500 text-sm">{p.category}</p>
                    <p className="mt-1 font-medium">GH₵ {p.price}</p>
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={() => beginEdit(p)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition flex-1 mr-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition flex-1 ml-1"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
