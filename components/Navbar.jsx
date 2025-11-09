
// File: components/Navbar.jsx
'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function NavBar(){
  const { cart } = useContext(CartContext);
  return (
    <header className="navbar">
      <h1><Link href="/">Handcrafted Haven</Link></h1>
      <nav>
        <Link href="/products">Products</Link>
        <Link href="/cart">Cart {cart.length > 0 ? `(${cart.length})` : ''}</Link>
      </nav>
    </header>
  );
}