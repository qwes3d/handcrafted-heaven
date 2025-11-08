
// File: app/products/[id]/page.jsx
import axios from '../../../lib/axiosInstance';
import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../../../context/CartContext';
import Link from 'next/link';
import RatingStars from '../../../components/RatingStars.jsx';
import ReviewList from '../../../components/ReviewList';
import ReviewForm from '../../../components/ReviewForm';

export default function ProductDetail({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useContext(CartContext);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <section className="product-detail">
      <h2>{product.title || product.name}</h2>
      <img src={product.images?.[0] || '/images/placeholder.jpg'} alt={product.title || product.name} />
      <p>Category: {product.category}</p>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>

      <button onClick={() => addToCart(product)}>Add to Cart</button>
      <Link href="/products" className="btn">Back to Products</Link>

      <h3>Ratings & Reviews</h3>
      <RatingStars productId={product._id} />
      <ReviewList productId={product._id} />
      <ReviewForm productId={product._id} />
    </section>
  );
}