
// File: components/RatingStars.jsx
'use client';
import { useEffect, useState } from 'react';
export default function RatingStars({ productId }){
  const [rating, setRating] = useState(0);
  useEffect(()=>{
    try{ const r = localStorage.getItem(`rating:${productId}`); if(r) setRating(Number(r)); }catch(e){}
  },[productId]);
  function save(r){ setRating(r); localStorage.setItem(`rating:${productId}`, String(r)); }
  return (
    <div className="rating-stars">
      {[1,2,3,4,5].map(n=> (
        <button key={n} onClick={()=>save(n)} aria-label={`${n} stars`}>{n <= rating ? '★' : '☆'}</button>
      ))}
    </div>
  );
}