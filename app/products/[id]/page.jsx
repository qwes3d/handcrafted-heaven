"use client";

import { useParams } from "next/navigation";
import axios from "@/lib/axiosInstance";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "@/rev/CartContext";
import Link from "next/link";
import RatingStars from "@/ui/RatingStars";
import ReviewList from "@/ui/ReviewList";
import ReviewForm from "@/ui/ReviewForm";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-gray-500">
        Loading product details…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-16 text-center text-red-500">
        Product not found.
      </div>
    );
  }

  // Cloudinary-safe image handling
  const imageSrc = Array.isArray(product.images)
    ? product.images[0]
    : product.images || "/images/placeholder.jpg";

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/products" className="hover:text-gray-700">
          Products
        </Link>
        {" "} / {" "}
        <span className="text-gray-700 font-medium">
          {product.title || product.name}
        </span>
      </nav>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* IMAGE */}
        <div className="sticky top-24">
          <div className="border rounded-xl overflow-hidden shadow-sm">
            <img
              src={imageSrc}
              alt={product.title || product.name}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col">

          <h1 className="text-3xl font-bold text-gray-900">
            {product.title || product.name}
          </h1>

          {/* CATEGORY */}
          <p className="mt-2 text-sm text-gray-500">
            Category: <span className="text-gray-800">{product.category}</span>
          </p>

          {/* RATING */}
          <div className="mt-4 flex items-center gap-2">
            <RatingStars productId={product._id} size="lg" />
            <span className="text-sm text-gray-600">Customer ratings</span>
          </div>

          {/* PRICE */}
          <p className="mt-6 text-4xl font-semibold text-indigo-600">
            ${product.price}
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => addToCart(product)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow transition"
            >
              Add to Cart
            </button>

            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              Buy Now
            </button>
          </div>

          {/* Back */}
          <Link
            href="/products"
            className="mt-6 text-indigo-600 hover:underline text-sm"
          >
            ← Back to all products
          </Link>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

        <ReviewList productId={product._id} />

        <div className="mt-10 p-6 bg-gray-50 border rounded-lg">
          <h3 className="text-lg font-medium mb-4">Write a review</h3>
          <ReviewForm productId={product._id} />
        </div>
      </section>
    </main>
  );
}
