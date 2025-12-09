'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axiosInstance';
import CategoryCard from '@/ui/CategoryCard';
import ProductCarousel from '@/ui/ProductCarousel';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/products');
        const products = res.data;

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(products.map((p) => p.category).filter(Boolean))
        );
        setCategories(uniqueCategories);

        // Top 10 products for carousel
        setTopProducts(products.slice(0, 10));
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-br from-purple-700 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Handcrafted Haven</h1>
          <p className="text-lg md:text-2xl mb-8">
            Discover unique handmade crafts from talented artisans.
          </p>
          {/* CTA button now in hero */}
          <a
            href="/products"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition"
          >
            Browse Products
          </a>
        </div>
      </section>

      {/* Categories Section */}
      <section className="my-12 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Explore Categories</h2>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {categories.map((cat) => (
              <CategoryCard key={cat} category={cat} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">Loading categories...</p>
        )}
      </section>

      {/* Top Products Carousel */}
      {topProducts.length > 0 && (
        <section className="my-12 container mx-auto px-4">
          <ProductCarousel products={topProducts} />
        </section>
      )}
    </div>
  );
}
