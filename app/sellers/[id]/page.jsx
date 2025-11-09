
// File: app/sellers/[id]/page.jsx

"use client";
import axios from '../../lib/axiosInstance';
import { useEffect, useState, useContext } from 'react';
import SellerProduct from '../../../components/SellerProduct';
import { CartContext } from '../../../context/CartContext';
import Link from 'next/link';

export default function SellerPage({ params }) {
  const { id } = params;
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const { addToCart, cart } = useContext(CartContext);

  useEffect(() => {
    async function load() {
      try {
        const resSeller = await axios.get(`/sellers/${id}`);
        setSeller(resSeller.data);
        const resProducts = await axios.get(`/products?sellerId=${id}`);
        setProducts(resProducts.data);
      } catch (err) { console.error(err); }
    }
    load();
  }, [id]);

  if (!seller) return <p>Seller not found.</p>;

  return (
    <section>
      <h2>{seller.name}</h2>
      <p>{seller.bio}</p>
      <div className="product-grid">
        {products.map(p => (
          <SellerProduct key={p._id} product={p} addToCart={addToCart} inCart={!!cart.find(i=>i._id===p._id)} />
        ))}
      </div>
      <Link href="/products" className="btn">Back to Products</Link>
    </section>
  );
}
