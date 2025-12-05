"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axiosInstance";
import { useParams } from "next/navigation";

export default function SellerPage() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
     console.log("SellerPage ID:", id);
    if (!id) return;

    async function loadSeller() {
      try {
        const res = await axios.get(`/sellers/${id}`);
        setSeller(res.data.seller);
        setProducts(res.data.products);
      } catch (err) {
        console.error(err);
      }
    }

    loadSeller();
  }, [id]);

  if (!seller) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading seller...
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">

      {/* -------- ✨ Seller Hero Section ✨ -------- */}
      <section className="relative mb-12 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-12 px-8">

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

        <div className="relative z-10 flex gap-8 items-center">

          {/* Profile Image */}
          <img
            src={seller.profilePic || "/images/default-user.WEBP"}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
          />

          {/* Info */}
          <div>
            <h1 className="text-4xl font-bold drop-shadow-md">
              {seller.businessName}
            </h1>
            <p className="mt-2 max-w-xl text-white/90 leading-relaxed">
              {seller.bio || "This seller has not written a bio yet."}
            </p>

            {/* Contact */}
            <div className="mt-4 flex flex-col gap-1 text-white/90">
              {seller.phone && <p>📞 {seller.phone}</p>}
              {seller.address && <p>📍 {seller.address}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* -------- 🛍️ Seller Products Section -------- */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Products by {seller.businessName}
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">This seller has no products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={p.images?.[0] || "/images/default-product.jpg"}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">{p.title}</h3>

                <p className="text-indigo-600 font-semibold mt-2">${p.price}</p>

                <a
                  href={`/products/${p._id}`}
                  className="block mt-4 text-sm text-indigo-600 hover:underline"
                >
                  View Product →
                </a>
              </div>
            </div>
          ))}

        </div>
      )}
    </main>
  );
}
