<article className="rounded-xl overflow-hidden shadow-lg max-w-xs mx-auto bg-white">
  {/* Product image links to product details */}
  <Link href={`/products/${product._id}`}>
    <img
      src={product.images?.[0] || '/images/placeholder.jpg'}
      alt={product.title || product.name}
      loading="lazy"
      className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
    />
  </Link>

  {/* Product info */}
  <div className="p-4 text-center">
    <h3 className="text-lg font-semibold mb-2 text-gray-900">
      {product.title || product.name}
    </h3>
    <p className="text-gray-800 font-bold mb-4">${product.price}</p>

    {/* Action buttons */}
    <div className="flex flex-col gap-2 mt-3">
      {/* View Seller button */}
      {product.sellerId ? (
        <Link
          href={`/sellers/${product.sellerId}`}
          className="block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300 font-medium"
        >
          View Seller
        </Link>
      ) : (
        <span className="block px-4 py-2 rounded-lg bg-gray-300 text-gray-700 cursor-not-allowed">
          Seller Unavailable
        </span>
      )}

      {/* Add to Cart button */}
      {inCart ? (
        <button
          disabled
          aria-disabled="true"
          className="px-4 py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed"
        >
          In Cart
        </button>
      ) : (
        <button
          onClick={() => addToCart(product)}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-300 font-medium"
        >
          Add to Cart
        </button>
      )}
    </div>
  </div>
</article>
