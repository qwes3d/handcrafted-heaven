"use client";
// ui/ReviewList.jsx
import { useEffect, useState } from "react";

export default function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);

  function load() {
    try {
      const raw = localStorage.getItem(`reviews:${productId}`);
      setReviews(raw ? JSON.parse(raw) : []);
    } catch {}
  }

  useEffect(() => {
    load();
    window.addEventListener("reviews-updated", load);
    return () => window.removeEventListener("reviews-updated", load);
  }, [productId]);

  if (reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet.</p>;
  }

  return (
    <ul className="space-y-4 mt-4">
      {reviews.map((r, idx) => (
        <li
          key={idx}
          className="border p-4 rounded-lg bg-white shadow-sm"
        >
          <div className="flex justify-between items-center mb-1">
            <strong className="text-gray-800">{r.name}</strong>
            <span className="text-yellow-500 text-sm">{r.score} ★</span>
          </div>

          <p className="text-gray-700 leading-relaxed">
            {r.text}
          </p>
        </li>
      ))}
    </ul>
  );
}
