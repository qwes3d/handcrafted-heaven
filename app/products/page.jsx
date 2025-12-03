"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axiosInstance";
import Link from "next/link";
import ProductCard from "@/ui/ProductCard"; // ⭐ use your upgraded card

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);

  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Fetch filtered products
  useEffect(() => {
    async function fetchProducts() {
      try {
        let query = [];
        if (categoryFilter) query.push(`category=${categoryFilter}`);
        if (sellerFilter) query.push(`sellerId=${sellerFilter}`);
        if (minPrice) query.push(`minPrice=${minPrice}`);
        if (maxPrice) query.push(`maxPrice=${maxPrice}`);

        const queryString = query.length ? `?${query.join("&")}` : "";
        const res = await axios.get(`/products${queryString}`);

        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryFilter, sellerFilter, minPrice, maxPrice]);

  // Fetch categories + sellers
  useEffect(() => {
    async function fetchMeta() {
      try {
        const resProducts = await axios.get("/products");
        const uniqueCategories = Array.from(
          new Set(resProducts.data.map((p) => p.category).filter(Boolean))
        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.error(err);
      }

      try {
        const resSellers = await axios.get("/sellers");
        setSellers(resSellers.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchMeta();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Products</h1>

      {/* FILTER PANEL */}
      <div className="mb-10 bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-end">

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Category</label>
          <select
            className="border rounded-lg px-3 py-2"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Seller */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Seller</label>
          <select
            className="border rounded-lg px-3 py-2"
            value={sellerFilter}
            onChange={(e) => setSellerFilter(e.target.value)}
          >
            <option value="">All</option>
            {sellers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Min Price</label>
          <input
            type="number"
            className="border rounded-lg px-3 py-2"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
          />
        </div>

        {/* Max Price */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Max Price</label>
          <input
            type="number"
            className="border rounded-lg px-3 py-2"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="999"
          />
        </div>
      </div>

      {/* PRODUCT GRID */}
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} addToCart={() => {}} inCart={false} />
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <p className="text-center text-gray-600 mt-10">No products found.</p>
      )}
    </section>
  );
}
