'use client';

import Link from "next/link";
import { useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { CartContext } from "@/rev/CartContext";
import LogoutButton from "@/ui/LogoutButton";

export default function NavBar() {
  const { data: session } = useSession();
  const user = session?.user;

  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.length;

  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    setShowSearch(false);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT: Logo + Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl text-gray-700 p-1"
            aria-label="Toggle menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>

          <Link href="/" className="text-xl font-bold text-gray-900">
            Handcrafted Haven
          </Link>
        </div>

        {/* CENTER: About Us link (desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/about-us" className="hover:text-indigo-600 font-semibold">
            About Us
          </Link>
        </div>

        {/* RIGHT: Search + User + Cart */}
        <div className="flex items-center gap-4">

          {/* Mobile search toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden text-xl text-gray-700 p-1"
            aria-label="Search"
          >
            <FiSearch />
          </button>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-md w-full">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-l-lg px-3 py-2"
            />
            <button className="bg-indigo-600 text-white px-4 rounded-r-lg hover:bg-indigo-700">
              Search
            </button>
          </form>

          {/* Desktop User Links */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              {user.role === "user" && <Link href="/become-seller" className="hover:text-indigo-600">Become Seller</Link>}
              <Link href="/profile" className="hover:text-indigo-600">{user.firstName || user.email}</Link>
              {user.role === "seller" && <Link href="/sellers/dashboard" className="hover:text-indigo-600">Seller Dashboard</Link>}
              <LogoutButton />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="hover:text-indigo-600">Sign In</Link>
              <Link href="/register" className="hover:text-indigo-600">Register</Link>
            </div>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative p-2">
            <FiShoppingCart className="text-2xl text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {showSearch && (
        <div className="md:hidden bg-white border-t px-4 py-3">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-l-lg px-3 py-2"
            />
            <button className="bg-indigo-600 text-white px-4 rounded-r-lg">Go</button>
          </form>
        </div>
      )}

      {/* MOBILE MENU */}
      {open && (
        <nav className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          <Link href="/about-us" className="block py-2">About Us</Link>
          <Link href="/contact-us" className="block py-2">Contact Us</Link>

          {!user && (
            <>
              <Link href="/login" className="block py-2">Sign In</Link>
              <Link href="/register" className="block py-2">Register</Link>
            </>
          )}

          {user && (
            <>
              <Link href="/profile" className="block py-2">Profile</Link>
              {user.role === "seller" && <Link href="/sellers/dashboard" className="block py-2">Seller Dashboard</Link>}
              <LogoutButton />
            </>
          )}
        </nav>
      )}
    </header>
  );
}
