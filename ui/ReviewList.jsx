
// File: components/ReviewList.jsx
'use client';
import { useEffect, useState } from 'react';
export default function ReviewList({ productId }){
  const [reviews, setReviews] = useState([]);
  useEffect(()=>{
    try{ const raw = localStorage.getItem(`reviews:${productId}`); setReviews(raw?JSON.parse(raw):[]); }catch(e){}
  },[productId]);
  if(reviews.length===0) return <p>No reviews yet.</p>;
  return (
    <ul>
      {reviews.map((r,idx)=> (
        <li key={idx}><strong>{r.name}</strong>: {r.text} — <em>{r.score}★</em></li>
      ))}
    </ul>
  );
}