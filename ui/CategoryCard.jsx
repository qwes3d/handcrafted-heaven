'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Category images (replace with Cloudinary URLs)
const categoryImages = {
  "Decor": [
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/decor1.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/decor.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/decor23.jpg"
  ],
  "Jewelry": [
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/jewelry1.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/jewelry.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/beaded-necklace.jpg"
  ],
  "Footwear": [
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/sandals.webp",
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/sandals2.webp"
  ],
  "Kitchenware": [
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/kitchen1.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/bowl.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/kitchen23.jpg"
  ],
  "Musical instruments": [
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/ekwe.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/drum.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/ogene.jpg"
  ],
  "Accessories": [
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/blanket.jpg",
    "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1690000000/accessory1.jpg"
  ]
};

// Helper: Cloudinary resizing (optional)
const cloudinaryUrl = (url, width = 400, height = 300) => {
  if (!url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${width},h_${height},c_fill/`);
};

export default function CategoryCard({ category }) {
  const normalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  const images = categoryImages[normalizedCategory] || ["/images/categories/home1.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        let next;
        do {
          next = Math.floor(Math.random() * images.length);
        } while (next === prev && images.length > 1);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="text-center">
      <Link
        href={`/products?category=${normalizedCategory}`}
        aria-label={`Browse ${normalizedCategory} products`}
      >
        <div className="w-64 h-44 rounded-2xl overflow-hidden shadow-lg cursor-pointer relative group">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={cloudinaryUrl(images[currentIndex])}
              alt={normalizedCategory}
              className="w-full h-full object-cover absolute top-0 left-0 group-hover:scale-105 transition-transform duration-700"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        </div>
      </Link>
      <p className="mt-3 font-semibold text-lg text-gray-800">{normalizedCategory}</p>
    </div>
  );
}
