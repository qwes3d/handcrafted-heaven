// File: components/Navbar.jsx
'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function NavBar(){
  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext); // <-- HERE

  return (
    <header className="navbar">
      <h1><Link href="/">Handcrafted Haven</Link></h1>

      <nav>
        <Link href="/products">Products</Link>
        
        {user && (
          <>
            {/* show seller dashboard ONLY if user.role === 'seller' */}
            {user.role === "seller" && (
              <Link href="/seller/dashboard">Seller Dashboard</Link>
            )}

            <Link href="/profile">Profile</Link>
            <Link href="/auth/logout">Logout</Link>
          </>
        )}

        {!user && (
          <Link href="/auth/login">Login</Link>
        )}

        <Link href="/cart">
          Cart {cart?.length > 0 ? `(${cart.length})` : ''}
        </Link>
      </nav>
    </header>
  );
}
