'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Category images (make sure these paths exist)
const categoryImages = {
  "Decor": [
    "/images/categories/decor1.jpg",
    "/images/categories/decor.jpg",
    "/images/categories/decor23.jpg"
  ],
  "Jewelry": [
    "/images/categories/jewelry1.jpg",
    "/images/categories/jewelry.jpg",
    "/images/categories/beaded-necklace.jpg"
  ],
  "Footwear": [
    "/images/categories/sandals.webp",
    "/images/categories/sandals2.webp"
  ],
  "Kitchenware": [
    "/images/categories/kitchen1.jpg",
    "/images/categories/bowl.jpg",
    "/images/categories/kitchen23.jpg"
  ],
  "Musical instruments": [
    "/images/categories/ekwe.jpg",
    "/images/categories/drum.jpg",
    "/images/categories/ogene.jpg"
  ],
  "Accessories": [
    "/images/categories/blanket.jpg",
    "/images/categories/accessory1.jpg"
  ]
};

export default function CategoryCard({ category }) {
  // ✅ Normalize category name (case-insensitive)
  const normalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  // ✅ Always define images (fallback)
  const images = categoryImages[normalizedCategory] || ["/images/categories/home1.jpg"];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * images.length);
      } while (nextIndex === currentIndex && images.length > 1);
      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, images]);

  return (
    <div className="text-center">
      <Link href={`/products?category=${normalizedCategory}`}>
        <div className="w-64 h-44 rounded-2xl overflow-hidden shadow-lg cursor-pointer relative group">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={normalizedCategory}
              className="w-full h-full object-cover absolute top-0 left-0 group-hover:scale-105 transition-transform duration-700"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </AnimatePresence>

          {/* Optional overlay for style */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        </div>
      </Link>
      <p className="mt-3 font-semibold text-lg text-gray-800">{normalizedCategory}</p>
    </div>
  );
}
