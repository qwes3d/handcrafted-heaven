"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Helper to transform Cloudinary URL (optional)
const getCloudinaryUrl = (url, width = 400, height = 300) => {
  if (!url) return "/images/placeholder.jpg";
  // Add Cloudinary transformations if URL contains "res.cloudinary.com"
  if (url.includes("res.cloudinary.com")) {
    return url.replace(
      "/upload/",
      `/upload/w_${width},h_${height},c_fill/`
    );
  }
  return url;
};

export default function ProductCarousel({ products }) {
  const carouselRef = useRef(null);
  const [dragWidth, setDragWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const offsetWidth = carouselRef.current.offsetWidth;
      setDragWidth(scrollWidth - offsetWidth);
    }
  }, [products]);

  return (
    <div className="overflow-hidden relative py-8">
      <motion.div
        ref={carouselRef}
        className="flex gap-4 cursor-grab"
        drag="x"
        dragConstraints={{ left: -dragWidth, right: 0 }}
        whileTap={{ cursor: "grabbing" }}
      >
        {products.map((p) => (
          <motion.div
            key={p._id}
            className="min-w-[250px] sm:min-w-[300px] md:min-w-[350px] bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link href={`/products/${p._id}`} className="block">
              <img
                src={getCloudinaryUrl(p.images?.[0])}
                alt={p.title}
                className="w-full h-48 sm:h-56 md:h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-yellow-600 font-bold">${p.price}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
