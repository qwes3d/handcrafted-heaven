'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axiosInstance';
import ProductCard from '@/ui/ProductCard';
import SkeletonCard from '@/ui/SkeletonCard';
import FilterBar from '@/ui/SidebarFilter';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products and categories on mount
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await axios.get('/products');
        const allProducts = res.data;

        setProducts(allProducts);
        setFilteredProducts(allProducts);

        const uniqueCategories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Apply filter from FilterBar
  const handleFilter = ({ category, minPrice, maxPrice }) => {
    let filtered = [...products];

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    if (minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* FilterBar - sticky under navbar */}
      <FilterBar categories={categories} applyFilter={handleFilter} />

      {/* Products */}
      <section className="mt-6">
        {loading ? (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 mt-16 text-lg">No products found.</p>
        ) : (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
