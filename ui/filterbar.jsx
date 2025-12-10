'use client';

import { useState } from "react";

export default function FilterBar({ categories = [], onFilter }) {
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ category, minPrice, maxPrice });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center justify-between gap-4 bg-gray-100 p-4 rounded-lg mb-6"
    >
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="p-2 border rounded w-24"
      />

      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="p-2 border rounded w-24"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Apply
      </button>
    </form>
  );
}
