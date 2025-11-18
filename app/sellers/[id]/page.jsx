'use client';

import axios from '@/app/lib/axiosInstance';
import { useEffect, useState, useContext } from 'react';
import SellerProduct from '@/ui/SellerProduct';
import { CartContext } from '@/rev/CartContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';


export default function SellerPage() {
  const { id } = useParams();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<[]>([]);
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

      <p>Some of the products by {seller.name}</p>
      <div className="product-grid">
        {products.map((p, index) => (
          <SellerProduct
            key={index} // use index if no unique id
            product={p}
            addToCart={addToCart}
            inCart={!!cart.find(i => i.sellerId === p.sellerId && i.title === p.title)} // optional: check uniqueness by sellerId + title
          />
        ))}
      </div>

      <Link href="/products" className="btn">Back to Products</Link>
    </section>
  );
}
