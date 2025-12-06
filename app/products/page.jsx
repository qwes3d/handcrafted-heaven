"use client";

import { useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "@/lib/axiosInstance";
import ProductCard from "@/ui/ProductCard";
import { CartContext } from "@/rev/CartContext";

export default function ProductsPage() {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryString = searchQuery
          ? `?search=${encodeURIComponent(searchQuery)}`
          : "";

        // Fixed — API path must be "/api/products"
        const res = await axios.get(`/products${queryString}`);

        setProducts(res.data);
      } catch (err) {
        console.error("Failed fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery]);

  const handleCartToggle = (product) => {
    const inCart = cartItems.some((item) => item._id === product._id);
    inCart ? removeFromCart(product._id) : addToCart(product);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        {searchQuery ? `Search results for "${searchQuery}"` : "Products"}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No products found.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              addToCart={handleCartToggle}
              inCart={cartItems.some((item) => item._id === p._id)}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}
