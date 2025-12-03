// ui/ProductCard.jsx
"use client";

import Link from "next/link";

export default function ProductCard({ product, addToCart, inCart }) {
  return (
    <article className="
      rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl 
      transition duration-300 max-w-xs mx-auto border border-gray-200
    ">
      
      {/* Image */}
      <Link href={`/products/${product._id}`}>
        <div className="relative group">
          <img
            src={product.images?.[0] || "/images/placeholder.jpg"}
            alt={product.title || product.name}
            loading="lazy"
            className="
              w-full h-64 object-cover 
              group-hover:scale-105 transition-transform duration-300
            "
          />

          {/* Price Badge */}
          <span className="
            absolute top-3 left-3 bg-black text-white text-sm 
            px-2 py-1 rounded-md shadow-md
          ">
            ${product.price}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col items-center text-center">

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {product.title || product.name}
        </h3>

        {/* Optional rating preview */}
        {product.rating && (
          <div className="mt-1 text-yellow-500 text-sm">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full mt-4">

          {/* Seller Button */}
          {product.sellerId ? (
            <Link
              href={`/sellers/${product.sellerId}`}
              className="
                w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-medium
                hover:bg-blue-700 transition duration-300
              "
            >
              View Seller
            </Link>
          ) : (
            <span className="
              w-full py-2 rounded-lg bg-gray-300 text-gray-700 text-sm 
              cursor-not-allowed
            ">
              Seller Unavailable
            </span>
          )}

          {/* Add to Cart */}
          {inCart ? (
            <button
              disabled
              className="
                w-full py-2 rounded-lg bg-gray-400 text-white text-sm 
                cursor-not-allowed
              "
            >
              In Cart
            </button>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="
                w-full py-2 rounded-lg bg-green-600 text-white text-sm font-medium
                hover:bg-green-700 transition duration-300
              "
            >
              Add to Cart
            </button>
          )}

        </div>
      </div>
    </article>
  );
}
