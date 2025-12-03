'use client';
//'

import { useState, useEffect } from 'react';
import axios from '@/lib/axiosInstance';
import ProductCard from '@/ui/ProductCard';
import Link from 'next/link';

export default function SellerPage({ params }) {
  const { id } = params; // sellerId from URL
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSellerData() {
      try {
        // Fetch seller info
        const sellerRes = await axios.get(`/sellers/${id}`);
        setSeller(sellerRes.data);

        // Fetch products by this seller
        const productsRes = await axios.get(`/products?sellerId=${id}`);
        setProducts(productsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSellerData();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading seller...</p>;
  if (!seller) return <p className="text-center mt-10">Seller not found.</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Seller Info */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
        {seller.bio && <p className="text-gray-700 mt-2">{seller.bio}</p>}
        {seller.website && (
          <a
            href={seller.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline mt-2 block"
          >
            Visit Website
          </a>
        )}
      </div>

      {/* Seller Products */}
      <h2 className="text-2xl font-bold mb-6">Products by {seller.name}</h2>
      {products.length === 0 ? (
        <p className="text-gray-600">No products available from this seller.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} addToCart={() => {}} inCart={false} />
          ))}
        </div>
        
      )}
      
      <Link href="/products" className="btn">Back to Products</Link>
    </section>
  );
}
