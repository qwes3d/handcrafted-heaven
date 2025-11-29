"use client";

import { useEffect, useState, useContext } from "react";
import axios from "@/lib/axiosInstance";
import { AuthContext } from "@/rev/AuthContext";

export default function SellerDashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({});

  useEffect(() => {
    if (!user) return;
    loadSellerProducts();
  }, [user]);

  async function loadSellerProducts() {
    try {
      setLoading(true);
      const res = await axios.get(`/seller/my-products`); // backend returns ONLY seller’s own products
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed loading seller products", err);
    } finally {
      setLoading(false);
    }
  }

  function beginEdit(p) {
    setEditingId(p._id);
    setFormState({
      title: p.title,
      description: p.description,
      category: p.category,
      price: p.price,
      image: p.images?.[0] || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormState({});
  }

  async function saveEdit(id) {
    try {
      setSavingId(id);
      await axios.put(`/seller/update/${id}`, {
        ...formState,
        images: [formState.image],
      });
      await loadSellerProducts();
      cancelEdit();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed saving product");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Delete permanently?")) return;
    try {
      await axios.delete(`/seller/delete/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  }

  if (!user) return <p>Please log in</p>;
  if (user.role !== "seller") return <p>Access Denied</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Seller Dashboard</h1>

      <a href="/seller/new-product" className="btn">+ Add New Product</a>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <table className="seller-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => {
              const editing = p._id === editingId;
              return (
                <tr key={p._id}>
                  <td>
                    {editing ? (
                      <input
                        value={formState.image}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            image: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <img
                        src={p.images?.[0]}
                        style={{ width: 120, height: 80, objectFit: "cover" }}
                      />
                    )}
                  </td>

                  <td>
                    {editing ? (
                      <input
                        value={formState.title}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            title: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      p.title
                    )}
                  </td>

                  <td>
                    {editing ? (
                      <textarea
                        value={formState.description}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            description: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      p.description
                    )}
                  </td>

                  <td>
                    {editing ? (
                      <input
                        value={formState.category}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            category: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      p.category
                    )}
                  </td>

                  <td>
                    {editing ? (
                      <input
                        type="number"
                        value={formState.price}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            price: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      `GH₵ ${p.price}`
                    )}
                  </td>

                  <td>
                    {!editing ? (
                      <>
                        <button onClick={() => beginEdit(p)}>Edit</button>
                        <button
                          onClick={() => deleteProduct(p._id)}
                          className="btn-danger"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => saveEdit(p._id)}
                          disabled={savingId === p._id}
                        >
                          {savingId === p._id ? "Saving..." : "Save"}
                        </button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
