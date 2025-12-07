"use client";

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import axios from "@/lib/axiosInstance";
import LogoutButton from "@/ui/LogoutButton";
import { CartContext } from "@/rev/CartContext";

export default function NavBar() {
  const { data: session } = useSession();
  const user = session?.user;

  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.length;

  const [open, setOpen] = useState(false);          // mobile menu
  const [showSearch, setShowSearch] = useState(false); // mobile search toggle
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("/products");
        const uniqueCategories = [...new Set(res.data.map((p) => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    setShowSearch(false);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>

      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between w-full">
        
        {/* LEFT: Logo + Hamburger */}
        <div className="flex items-center gap-3">
          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl text-gray-700 p-1"
            aria-label="Toggle menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900 whitespace-nowrap">
            Handcrafted Haven
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 text-gray-900 font-semibold">
          <div className="relative group">
            <button className="px-3 py-2 hover:text-indigo-600 flex items-center gap-1">
              Categories ▼
            </button>

            {/* Dropdown */}
            <ul className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block z-20">
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    href={`/category/${c.toLowerCase()}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/about-us" className="hover:text-indigo-600">About Us</Link>
          <Link href="/contact-us" className="hover:text-indigo-600">Contact Us</Link>
        </nav>

        {/* RIGHT: Search toggle (mobile) + Cart + User */}
        <div className="flex items-center gap-4">

          {/* Mobile search toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden text-xl text-gray-700 p-1"
            aria-label="Search"
          >
            <FiSearch />
          </button>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center max-w-md w-full"
          >
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

          {/* User Logged In */}
          {user ? (
            <>
              {user.role === "user" && (
                <Link href="/become-seller" className="hidden md:block hover:text-indigo-600">
                  Become Seller
                </Link>
              )}

              <Link href="/profile" className="hidden md:block hover:text-indigo-600">
                {user.firstName || user.email}
              </Link>

              {user.role === "seller" && (
                <Link href="/sellers/dashboard" className="hidden md:block hover:text-indigo-600">
                  Seller Dashboard
                </Link>
              )}

              {/* Logout */}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hidden md:block hover:text-indigo-600">Sign In</Link>
              <Link href="/register" className="hidden md:block hover:text-indigo-600">Register</Link>
            </>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative p-2">
            <FiShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* MOBILE SEARCH BAR (SLIDE DOWN) */}
      {showSearch && (
        <div className="md:hidden bg-white border-t px-4 py-3 animate-slide-in">
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
        <nav className="md:hidden bg-white border-t px-4 py-4 space-y-3 animate-slide-in">
          <Link href="/about-us" className="block py-2">About Us</Link>
          <Link href="/contact-us" className="block py-2">Contact Us</Link>

          {categories.map((c) => (
            <Link
              key={c}
              href={`/category/${c.toLowerCase()}`}
              className="block py-2"
            >
              {c}
            </Link>
          ))}

          {!user && (
            <>
              <Link href="/login" className="block py-2">Sign In</Link>
              <Link href="/register" className="block py-2">Register</Link>
            </>
          )}

          {user && (
            <>
              <Link href="/profile" className="block py-2">Profile</Link>
              {user.role === "seller" && (
                <Link href="/sellers/dashboard" className="block py-2">Seller Dashboard</Link>
              )}
              <LogoutButton />
            </>
          )}
        </nav>
      )}
    </header>
  );
}
