//seller [id] page
"use client";

import axios from '@/app/lib/axiosInstance';
import { useEffect, useState, useContext } from 'react';
import SellerProduct from '@/components/SellerProduct';
import { CartContext } from '@/rev/CartContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';  // <-- import the hook


export default function SellerPage() {
  const params = useParams();   // <-- get params
  const { id } = params;        // <-- now you can access id
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
      } catch (err) {
        console.error(err);
      }
    }
    if (id) load();
  }, [id]);

  if (!seller) return <p>Loading seller...</p>;

  return (
    <section>
       <img src={seller.image || '/images/placeholder.jpg'} alt={seller.name} />

      <h2>{seller.name || seller.businessName}</h2>
      <p>{seller.bio || seller.address}</p>
      <p>Contact: {seller.contactEmail || seller.phone}</p>
      <p> Some of the product by {seller.name}</p>
      <div className="product-grid">
        {products.map(p => (
          <SellerProduct
            key={p._id}
            product={p}
            addToCart={addToCart}
            inCart={!!cart.find(i => i._id === p._id)}
          />
        ))}
      </div>
      <Link href="/products" className="btn">Back to Products</Link>
    </section>
  );
}
