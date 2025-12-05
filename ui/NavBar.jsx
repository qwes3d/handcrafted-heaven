"use client";

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { FiShoppingCart, FiMenu, FiX, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import axios from "@/lib/axiosInstance";
import LogoutButton from "@/ui/LogoutButton";
import { CartContext } from "@/rev/CartContext";

export default function NavBar() {
  const { data: session } = useSession();
  const user = session?.user;

  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.length;

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("/products");
        const uniqueCategories = Array.from(
          new Set(res.data.map((p) => p.category).filter(Boolean))
        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50" role="banner">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-indigo-600 focus:text-white focus:p-2">
        Skip to main content
      </a>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Handcrafted Haven
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-gray-900 font-semibold" aria-label="Main navigation">
          {/* Categories */}
          <div className="relative group">
            <button 
              className="px-3 py-2 hover:text-indigo-600 flex items-center gap-1 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Categories ▼
            </button>
            <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg border rounded-lg overflow-hidden z-20 group-hover:block hidden" role="menu">
              {categories.map((c) => (
                <li key={c} role="none">
                  <Link
                    href={`/category/${c.toLowerCase()}`}
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-900 font-semibold focus:outline-none focus:bg-gray-100"
                    role="menuitem"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Contact */}
          <Link href="/about-us" className="text-gray-900 font-semibold hover:text-indigo-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
            About Us
          </Link>
          <Link href="/contact-us" className="text-gray-900 font-semibold hover:text-indigo-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
            Contact Us
          </Link>
        </nav>

        {/* User Links + Search + Cart */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex">
            <label htmlFor="search-products" className="sr-only">Search products</label>
            <input
              id="search-products"
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-l-lg px-3 py-2 text-base font-semibold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              aria-label="Submit search"
            >
              Search
            </button>
          </form>

          {/* User Links */}
          {user ? (
            <>
              {user.role === "user" && (
                <Link href="/become-seller" className="text-gray-900 font-semibold hover:text-indigo-600 px-2 py-1">
                  Become a Seller
                </Link>
              )}
              <Link href="/profile" className="text-gray-900 font-semibold hover:text-indigo-600 px-2 py-1">
                {user.firstName || user.email || "Profile"}
              </Link>
              {user.role === "seller" && (
                <Link href="/sellers/dashboard" className="text-gray-900 font-semibold hover:text-indigo-600 px-2 py-1">
                  Seller Dashboard
                </Link>
              )}
              {user.role === "admin" && (
                <Link href="/admin/dashboard" className="text-gray-900 font-semibold hover:text-indigo-600 px-2 py-1">
                  Admin Dashboard
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-900 font-semibold hover:text-indigo-600 px-2 py-1">
                Sign In
              </Link>
              <Link href="/register" className="text-gray-900 font-semibold hover:text-indigo-600 px-2 py-1">
                Register
              </Link>
            </>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded" aria-label={`Shopping cart with ${cartCount} items`}>
            <FiShoppingCart className="text-2xl text-gray-900 hover:text-indigo-600 transition" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold" aria-live="polite">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu (Transparent) */}
      {open && (
        <nav id="mobile-menu" className="md:hidden bg-white/70 backdrop-blur-md border-t shadow-lg px-4 py-4 space-y-2" aria-label="Mobile navigation">
          <Link
            href="/about-us"
            className="block px-2 py-2 text-gray-900 font-semibold hover:bg-gray-100 rounded focus:outline-none focus:bg-gray-100"
          >
            About Us
          </Link>
          <Link
            href="/contact-us"
            className="block px-2 py-2 text-gray-900 font-semibold hover:bg-gray-100 rounded focus:outline-none focus:bg-gray-100"
          >
            Contact Us
          </Link>
        </nav>
      )}
    </header>
  );
}
