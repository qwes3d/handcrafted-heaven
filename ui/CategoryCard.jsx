'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import axios from "axios";

export default function CategoryCard({ category }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const normalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  // Fetch product images for this category
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await axios.get(`/api/products?category=${normalizedCategory}`);
        const products = res.data;

        // Collect the first valid image from each product
        const productImages = products
          .map(p => (p.images && p.images.length > 0 ? p.images[0] : null))
          .filter(Boolean); // remove null/undefined

        // Fallback if no images found
        setImages(productImages.length > 0 ? productImages : ["/images/categories/home1.jpg"]);
      } catch (err) {
        console.error("Error fetching category images:", err);
        setImages(["/images/categories/home1.jpg"]);
      }
    }

    fetchImages();
  }, [normalizedCategory]);

  // Rotate images every 4 seconds
  useEffect(() => {
    if (!images || images.length <= 1) return;

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

  // Cloudinary URL helper with safety check
  const cloudinaryUrl = (url, width = 400, height = 300) => {
    if (!url || typeof url !== "string") return "/images/categories/home1.jpg";
    if (!url.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", `/upload/w_${width},h_${height},c_fill/`);
  };

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
