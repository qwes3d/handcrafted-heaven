
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProductCarousel({ products }) {
  return (
    <div className="overflow-hidden relative py-8">
      <motion.div
        className="flex gap-4"
        drag="x"
        dragConstraints={{ left: -products.length * 250 + 1000, right: 0 }}
      >
        {products.map((p) => (
          <motion.div
            key={p._id}
            className="min-w-[250px] bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden"
          >
            <Link href={`/products/${p._id}`}>
              <img
                src={p.images?.[0] || '/images/placeholder.jpg'}
                alt={p.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-yellow-600 font-bold">${p.price}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
