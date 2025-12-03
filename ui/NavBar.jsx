"use client";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { FiShoppingCart, FiMenu, FiX, FiUser } from "react-icons/fi";
import axios from "@/lib/axiosInstance";
import LogoutButton from "@/ui/LogoutButton";
import { CartContext } from "@/rev/CartContext";

export default function NavBar() {
  const { data: session } = useSession();
  const user = session?.user;

  const { cart } = useContext(CartContext);
  const cartCount = cart.length;

  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch unique categories
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

  // ---------- Helper Components ----------
  // ---------- Helper Components ----------
const UserLinks = () => {
  if (!user) return null; // safety check

  const isUser = user.role === "user";
  const isSeller = user.role === "seller";
  const isAdmin = user.role === "admin";

  return (
    <>
      {/* Become Seller - Only visible to NORMAL users */}
      {isUser && (
        <Link
          href="/become-seller"
          className="text-blue-600 font-medium hover:text-blue-800"
        >
          Become a Seller
        </Link>
      )}

      {/* Profile - Visible to ALL */}
      <Link
        href="/profile"
        className="flex items-center gap-1 hover:text-indigo-600"
      >
        <FiUser className="text-xl" />
        {user?.firstName || user?.email || "Profile"}
      </Link>

      {/* Seller Dashboard - Only for sellers */}
      {isSeller && (
        <Link
          href="/sellers/dashboard"
          className="hover:text-indigo-600 font-medium"
        >
          Seller Dashboard
        </Link>
      )}

      {/* Admin Dashboard - Only for admin */}
      {isAdmin && (
        <Link
          href="/admin/dashboard"
          className="hover:text-indigo-600 font-medium"
        >
          Admin Dashboard
        </Link>
      )}

      <LogoutButton />
    </>
  );
};


  const GuestLinks = () => (
    <>
      <Link href="/login" className="hover:text-indigo-600 font-medium">
        Sign In
      </Link>
      <Link href="/register" className="hover:text-indigo-600 font-medium">
        Register
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo + Desktop Categories */}
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

          {/* Desktop Categories dropdown */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="px-4 py-2 text-gray-700 hover:text-black flex items-center gap-2"
            >
              Categories ▼
            </button>
            {categoriesOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg border rounded-lg overflow-hidden">
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
            )}
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 mx-6">
          <input
            type="search"
            placeholder="Search handmade products..."
            className="w-full border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-indigo-600 text-white px-4 rounded-r-lg hover:bg-indigo-700 transition">
            Search
          </button>
        </div>

        {/* Right: User + Cart */}
        <div className="flex items-center gap-6 text-gray-700">
          {user ? <UserLinks /> : <GuestLinks />}

          <Link href="/cart" className="relative">
            <FiShoppingCart className="text-2xl hover:text-indigo-600 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <input
          type="search"
          placeholder="Search products..."
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gray-50 border-t px-6 py-4 space-y-3">
          <h4 className="font-semibold mb-2">Categories</h4>
          <div className="grid gap-2">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/category/${c.toLowerCase()}`}
                className="block py-1 text-gray-700 hover:text-indigo-600"
              >
                {c}
              </Link>
            ))}
          </div>

          <hr className="border-gray-300" />

          {user ? <UserLinks /> : <GuestLinks />}

          <Link href="/cart" className="block py-1 hover:text-indigo-600">
            Cart ({cartCount})
          </Link>
        </div>
      )}
    </header>
  );
}
