'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from '@/app/lib/axiosInstance';
import ProductCarousel from '@/components/ProductCarousel';
import CategoryCard from '@/components/CategoryCard';



export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resProducts = await axios.get('/products');

        const allCategories = Array.from(new Set(resProducts.data.map(p => p.category).filter(Boolean)));
        setCategories(allCategories);

        const top = resProducts.data.slice(0, 10);
        setTopProducts(top);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-br from-purple-700 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Handcrafted Haven</h1>
          <p className="text-lg md:text-2xl mb-8">
            Unique handmade crafts from talented artisans.
          </p>
          <Link
            href="/products"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition"
          >
            Browse Products
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="my-12 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
         {categories.map(cat => (
          <CategoryCard key={cat} category={cat} />
  ))}
</div>


        
      </section>

      {/* Top Products Carousel */}
      <section className="my-12 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Top Products</h2>
        <ProductCarousel products={topProducts} />
      </section>
    </div>
  );
}
