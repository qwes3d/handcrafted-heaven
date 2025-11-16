'use client'
import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';

export default function NavBar() {
  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-white text-2xl font-bold">
          <Link href="/">Handcrafted Haven</Link>
        </h1>
        <nav className="flex gap-4 items-center">
          <Link className="text-white hover:text-yellow-300 transition" href="/products">
            Products
          </Link>
          {user?.role === 'seller' && (
            <Link className="text-white hover:text-yellow-300 transition" href="/seller/dashboard">
              Seller Dashboard
            </Link>
          )}
          {user ? (
            <>
              <Link className="text-white hover:text-yellow-300 transition" href="/profile">
                Profile
              </Link>
              <Link className="text-white hover:text-yellow-300 transition" href="/auth/logout">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link className="text-white hover:text-yellow-300 transition" href="/auth/login">
                Login
              </Link>
              <Link className="text-white hover:text-yellow-300 transition" href="/auth/register">
                Register
              </Link>
            </>
          )}
          <Link className="relative text-white hover:text-yellow-300 transition" href="/cart">
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 rounded-full px-2 text-xs">
                {cart.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
