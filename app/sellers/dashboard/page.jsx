"use client";

import { useEffect, useState, useContext } from "react";
import axios from "../../lib/axiosInstance";
import { AuthContext } from "../../../context/AuthContext"; // your chosen path (root/context)
import Image from "next/image";
import "./seller.css";

/**
 * Seller Dashboard - simple table with inline edit for:
 * title, description, category, price, image (single)
 */
export default function SellerDashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null); // product._id being edited
  const [formState, setFormState] = useState({}); // temp values while editing
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await axios.get("/seller/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed loading seller products", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function beginEdit(p) {
    setEditingId(p._id);
    setFormState({
      title: p.title || "",
      description: p.description || "",
      category: p.category || "",
      price: p.price || "",
      image: (p.images && p.images[0]) || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormState({});
  }

  function onChange(field, value) {
    setFormState((s) => ({ ...s, [field]: value }));
  }

  async function handleSave(id) {
    try {
      setSavingId(id);
      const body = {
        title: formState.title,
        description: formState.description,
        category: formState.category,
        price: Number(formState.price),
        images: [formState.image],
      };
      await axios.put(`/seller/updateproduct/${id}`, body);
      await loadProducts();
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update product", err);
      alert("Failed to save product");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await axios.delete(`/seller/deleteproduct/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete product");
    }
  }

  if (!user) return <p style={{ padding: 20 }}>Please log in to view your dashboard.</p>;
  if (user.role !== "seller") return <p style={{ padding: 20 }}>Access denied. Seller account required.</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Seller Dashboard</h1>
      <p>Welcome, {user.name || user.email}. Manage your handcrafted listings.</p>

      <div style={{ margin: "1rem 0" }}>
        <a href="/seller/new-product" style={{ background: "#111", color: "#fff", padding: "8px 12px", borderRadius: 6, textDecoration: "none" }}>
          + Add New Product
        </a>
      </div>

      {loading ? (
        <p>Loading your products...</p>
      ) : products.length === 0 ? (
        <p>You have no products yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="seller-table">
            <thead>
              <tr>
                <th style={{ minWidth: 140 }}>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th style={{ width: 120 }}>Price</th>
                <th style={{ width: 170 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const isEditing = editingId === p._id;
                return (
                  <tr key={p._id}>
                    <td>
                      {isEditing ? (
                        <input
                          value={formState.image || ""}
                          placeholder="Image URL"
                          onChange={(e) => onChange("image", e.target.value)}
                        />
                      ) : p.images && p.images[0] ? (
                        // simple <img>; Image can be used if external domains allowed in next.config.js
                        <img src={p.images[0]} alt={p.title} style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6 }} />
                      ) : (
                        <div style={{ width: 120, height: 80, background: "#f3f3f3", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          No Image
                        </div>
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input value={formState.title} onChange={(e) => onChange("title", e.target.value)} />
                      ) : (
                        p.title
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <textarea value={formState.description} onChange={(e) => onChange("description", e.target.value)} />
                      ) : (
                        <div style={{ maxWidth: 320, whiteSpace: "normal" }}>{p.description}</div>
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input value={formState.category} onChange={(e) => onChange("category", e.target.value)} />
                      ) : (
                        p.category || "—"
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input type="number" value={formState.price} onChange={(e) => onChange("price", e.target.value)} />
                      ) : (
                        `GH₵ ${p.price}`
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <>
                          <button className="btn" onClick={() => handleSave(p._id)} disabled={savingId === p._id}>
                            {savingId === p._id ? "Saving..." : "Save"}
                          </button>
                          <button className="btn btn-ghost" onClick={cancelEdit} style={{ marginLeft: 8 }}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn" onClick={() => beginEdit(p)}>
                            Edit
                          </button>
                          <button className="btn btn-danger" onClick={() => handleDelete(p._id)} style={{ marginLeft: 8 }}>
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      
    </main>
  );
}
