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
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl text-gray-700"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Handcrafted Haven
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-gray-700">
          {/* Categories */}
          <div className="relative">
            <button className="px-3 py-2 hover:text-black flex items-center gap-1">
              Categories ▼
            </button>
            <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg border rounded-lg overflow-hidden z-20">
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    href={`/category/${c.toLowerCase()}`}
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Contact */}
          <Link href="/about-us" className="hover:text-indigo-600 px-3 py-2">
            About Us
          </Link>
          <Link href="/contact-us" className="hover:text-indigo-600 px-3 py-2">
            Contact Us
          </Link>
        </div>

        {/* User Links + Search + Cart */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-l-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-3 rounded-r-lg hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </form>

          {/* User Links */}
          {user ? (
            <>
              {user.role === "user" && (
                <Link href="/become-seller" className="hover:text-gray-900 px-2 py-1">
                  Become a Seller
                </Link>
              )}
              <Link href="/profile" className="hover:text-gray-800 px-2 py-1">
                {user.firstName || user.email || "Profile"}
              </Link>
              {user.role === "seller" && (
                <Link href="/sellers/dashboard" className="hover:text-grsy-900 px-2 py-1">
                  Seller Dashboard
                </Link>
              )}
              {user.role === "admin" && (
                <Link href="/admin/dashboard" className="hover:text-indigo-600 px-2 py-1">
                  Admin Dashboard
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-600 px-2 py-1">
                Sign In
              </Link>
              <Link href="/register" className="hover:text-indigo-600 px-2 py-1">
                Register
              </Link>
            </>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative px-3 py-2">
            <FiShoppingCart className="text-2xl hover:text-indigo-600 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu (Transparent) */}
      {open && (
        <div className="md:hidden bg-white/70 backdrop-blur-md border-t shadow-lg px-4 py-4 space-y-2">
          <Link
            href="/about-us"
            className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            About Us
          </Link>
          <Link
            href="/contact-us"
            className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
