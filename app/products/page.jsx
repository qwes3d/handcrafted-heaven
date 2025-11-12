"use client";

import { useState, useEffect } from "react";
import axios from "../lib/axiosInstance";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch products with optional filters
  useEffect(() => {
    async function fetchProducts() {
      try {
        let query = [];
        if (categoryFilter) query.push(`category=${categoryFilter}`);
        if (sellerFilter) query.push(`sellerId=${sellerFilter}`);
        if (minPrice) query.push(`minPrice=${minPrice}`);
        if (maxPrice) query.push(`maxPrice=${maxPrice}`);
        const queryString = query.length ? "?" + query.join("&") : "";

        const res = await axios.get(`/products${queryString}`);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProducts();
  }, [categoryFilter, sellerFilter, minPrice, maxPrice]);

 useEffect(() => {
  async function fetchMeta() {
    try {
      const resProducts = await axios.get("/products");
      const allCategories = Array.from(new Set(resProducts.data.map(p => p.category).filter(Boolean)));
      setCategories(allCategories);

      const resSellers = await axios.get("/sellers");
      setSellers(resSellers.data);
    } catch (err) {
      console.error(err);
    }
  }
  fetchMeta();
}, []);


  return (
    <section>
      <h1>Products</h1>

      {/* Filters */}
      <div className="filters">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={sellerFilter} onChange={(e) => setSellerFilter(e.target.value)}>
          <option value="">All Sellers</option>
          {sellers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* Product List */}
      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <Link href={`/products/${p._id}`}>
              <img src={p.images?.[0] || "/images/placeholder.jpg"} alt={p.title} />
              <h3>{p.title}</h3>
              <p>${p.price}</p>
            </Link>
          </div>
        ))}
        {products.length === 0 && <p>No products found.</p>}
      </div>
    </section>
  );
}
