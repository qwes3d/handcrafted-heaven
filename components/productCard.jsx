
// File: components/ProductCard.jsx
'use client';
import Link from 'next/link';
export default function ProductCard({ product, addToCart, inCart }){
  return (
    <article className="product-card">
      <img src={product.images?.[0] || '/images/placeholder.jpg'} alt={product.title || product.name} />
      <h3>{product.title || product.name}</h3>
      <p>${product.price}</p>
      <div className="actions">
        <Link href={`/products/${product._id}`} className="btn">View Details</Link>
        <Link href={`/sellers/${product.sellerId}`} className="btn">View Seller</Link>
        {inCart ? <button className="remove-btn">In Cart</button> : <button onClick={()=>addToCart(product)}>Add to Cart</button>}
      </div>
    </article>
  );
}