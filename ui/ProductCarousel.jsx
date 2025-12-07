"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductCarousel({ products }) {
  const carouselRef = useRef(null);
  const [dragWidth, setDragWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      const totalScroll = carouselRef.current.scrollWidth;
      const visibleWidth = carouselRef.current.offsetWidth;
      setDragWidth(totalScroll - visibleWidth);
    }
  }, [products]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Top Products
      </h2>

      <div className="overflow-hidden">
        <motion.div
          ref={carouselRef}
          drag="x"
          dragConstraints={{ right: 0, left: -dragWidth }}
          className="flex gap-6 px-2 cursor-grab active:cursor-grabbing"
        >
          {products.map((p) => (
            <motion.div
              key={p._id}
              className="min-w-[240px] sm:min-w-[280px] md:min-w-[320px] bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition"
              whileHover={{ scale: 1.05 }}
            >
              <Link href={`/products/${p._id}`}>
                <img
                  src={p.images?.[0]}
                  className="w-full h-48 object-cover"
                  alt={p.title}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-indigo-600 font-bold">${p.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
