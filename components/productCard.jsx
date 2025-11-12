'use client';
import Link from 'next/link';

export default function ProductCard({ product, addToCart, inCart }) {
  return (
    <article className="relative rounded-xl overflow-hidden shadow-lg max-w-xs mx-auto group">
      {/* Image */}
      <img
        src={product.images?.[0] || '/images/placeholder.jpg'}
        alt={product.title || product.name}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Overlay with buttons */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2 p-4">
        <Link
          href={`/products/${product._id}`}
          className="w-full text-center text-white bg-blue-600 hover:bg-blue-700 py-2 rounded transition"
        >
          View Details
        </Link>
        <Link
          href={`/sellers/${product.sellerId}`}
          className="w-full text-center text-white bg-green-600 hover:bg-green-700 py-2 rounded transition"
        >
          View Seller
        </Link>
        {inCart ? (
          <button
            className="w-full text-gray-700 bg-gray-300 py-2 rounded cursor-not-allowed"
            disabled
          >
            In Cart
          </button>
        ) : (
          <button
            onClick={() => addToCart(product)}
            className="w-full text-white bg-yellow-500 hover:bg-yellow-600 py-2 rounded transition"
          >
            Add to Cart
          </button>
        )}
      </div>

      {/* Product info at bottom */}
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold mb-1 text-gray-900">{product.title || product.name}</h3>
        <p className="text-gray-800 font-bold">${product.price}</p>
      </div>
    </article>
  );
}
