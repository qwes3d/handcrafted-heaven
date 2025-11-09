
// File: app/products/page.jsx
"use client";
import ProductCard from '../../components/ProductCard';
import axios from '../lib/axiosInstance';
import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../../context/CartContext';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useContext(CartContext);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="products-page">
      <h2>Shop Handcrafted Creations</h2>
      <div className="product-grid">
        {products.map(p => (
          <ProductCard key={p._id} product={p} addToCart={addToCart} inCart={!!cart.find(i=>i._id===p._id)} />
        ))}
      </div>
    </div>
  );
}
