'use client';
// app/page.jsx

import { useState, useEffect } from 'react';
import axios from '@/lib/axiosInstance';
import ProductCarousel from '@/ui/ProductCarousel';

export default function HomePage() {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    async function fetchTopProducts() {
      try {
        const res = await axios.get('/products?top=true');
        setTopProducts(res.data.products); // always ≤ 4
      } catch (err) {
        console.error('Error fetching top products:', err);
      }
    }
    fetchTopProducts();
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
          <a
            href="/products"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition"
          >
            Browse Products
          </a>
        </div>
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
