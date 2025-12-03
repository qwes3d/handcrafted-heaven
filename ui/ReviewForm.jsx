"use client";

import { useState } from "react";

export default function ReviewForm({ productId }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [score, setScore] = useState(5);

  function submit(e) {
    e.preventDefault();
    const key = `reviews:${productId}`;
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift({ name, text, score });
    localStorage.setItem(key, JSON.stringify(arr));

    setName("");
    setText("");
    setScore(5);

    window.dispatchEvent(new Event("reviews-updated"));
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 w-full"
    >
      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Your Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Enter your name"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-700">Your Review</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="border rounded-lg px-4 py-2 min-h-[120px] resize-none focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Write your review…"
        />
      </div>

      <div className="flex flex-col gap-1 w-32">
        <label className="font-medium text-gray-700">Rating</label>
        <select
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
        >
          {[5,4,3,2,1].map((n) => (
            <option key={n} value={n}>{n} Stars</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow"
      >
        Submit Review
      </button>
    </form>
  );
}
