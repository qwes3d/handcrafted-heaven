'use client';

import { useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "@/lib/axiosInstance";
import ProductCard from "@/ui/ProductCard";
import SkeletonCard from "@/ui/SkeletonCard";
import { CartContext } from "@/rev/CartContext";
import { motion } from "framer-motion";
import FilterBar from "@/ui/filterbar";
import Pagination from "@/ui/pagination";

export default function ProductsPage() {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const fetchProducts = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=5`;
      if (searchQuery) query += `&search=${encodeURIComponent(searchQuery)}`;
      if (filters.category) query += `&category=${encodeURIComponent(filters.category)}`;
      if (filters.minPrice) query += `&minPrice=${filters.minPrice}`;
      if (filters.maxPrice) query += `&maxPrice=${filters.maxPrice}`;

      const res = await axios.get(`/products${query}`);
      const data = res.data;

      setProducts(data.products);
      setCategories(data.categories);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, filters);
  }, [page, searchQuery, filters]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const toggleCart = (product) => {
    const alreadyInCart = cartItems.some((i) => i._id === product._id);
    alreadyInCart ? removeFromCart(product._id) : addToCart(product);
  };

  return (
    <div>
      <FilterBar categories={categories} onFilter={handleFilter} />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          {searchQuery ? `Search results for "${searchQuery}"` : "Products"}
        </h1>

        {loading ? (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 mt-16 text-lg">No products found.</p>
        ) : (
          <>
            <motion.div
              className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  addToCart={() => toggleCart(p)}
                  removeFromCart={removeFromCart}
                  inCart={cartItems.some((i) => i._id === p._id)}
                />
              ))}
            </motion.div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
}
