'use client';

import { useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "@/lib/axiosInstance";
import ProductCard from "@/ui/ProductCard";
import SkeletonCard from "@/ui/SkeletonCard";
import { CartContext } from "@/rev/CartContext";
import { motion } from "framer-motion";
import FilterBar from "@/ui/SidebarFilter"; // updated horizontal filter

export default function ProductsPage() {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Fetch products and categories
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryString = searchQuery
          ? `?search=${encodeURIComponent(searchQuery)}`
          : "";

        const res = await axios.get(`/products${queryString}`);
        const allProducts = res.data;

        setProducts(allProducts);
        setFilteredProducts(allProducts);

        const uniqueCategories = [
          ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery]);

  // Filter handler for FilterBar
  const handleFilter = ({ category, minPrice, maxPrice }) => {
    let filtered = [...products];

    if (category) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    setFilteredProducts(filtered);
  };

  const toggleCart = (product) => {
    const alreadyInCart = cartItems.some((i) => i._id === product._id);
    alreadyInCart ? removeFromCart(product._id) : addToCart(product);
  };

  return (
    <div>
      {/* FilterBar full-width under navbar */}
      <FilterBar categories={categories} applyFilter={handleFilter} />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          {searchQuery ? `Search results for "${searchQuery}"` : "Products"}
        </h1>

        {loading ? (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 mt-16 text-lg">
            No products found.
          </p>
        ) : (
          <motion.div
            className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {filteredProducts.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                addToCart={() => toggleCart(p)}
                removeFromCart={removeFromCart}
                inCart={cartItems.some((i) => i._id === p._id)}
              />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
