"use client";
// ui/RatingStars.jsx
import { useEffect, useState } from "react";

export default function RatingStars({ productId, size = "md" }) {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(`rating:${productId}`);
    if (saved) setRating(Number(saved));
  }, [productId]);

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  function save(r) {
    setRating(r);
    localStorage.setItem(`rating:${productId}`, String(r));
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => save(n)}
          aria-label={`${n} stars`}
          className={`${sizeClasses[size]} transition text-yellow-500 hover:scale-110`}
        >
          {n <= rating ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
