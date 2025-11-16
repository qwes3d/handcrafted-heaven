
// File: components/ReviewForm.jsx

import { useState } from 'react';
export default function ReviewForm({ productId }){
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [score, setScore] = useState(5);
  function submit(e){
    e.preventDefault();
    const key = `reviews:${productId}`;
    const raw = localStorage.getItem(key);
    const arr = raw?JSON.parse(raw):[];
    arr.unshift({ name, text, score });
    localStorage.setItem(key, JSON.stringify(arr));
    setName(''); setText(''); setScore(5);
    // optional: trigger event or state lift to refresh ReviewList
    window.dispatchEvent(new Event('reviews-updated'));
  }
  return (
    <form onSubmit={submit} className="review-form">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required />
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write a review" required />
      <label>Rating</label>
      <select value={score} onChange={e=>setScore(Number(e.target.value))}>
        {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n}</option>)}
      </select>
      <button className="btn" type="submit">Submit Review</button>
    </form>
  );
}
