import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SuggestionCard({ suggestion }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded shadow p-4 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{suggestion.name}</h2>
          <p className="text-sm text-gray-600">{suggestion.description}</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:underline text-sm"
        >
          {expanded ? "Hide Products ▲" : "View Products ▼"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {suggestion.products.map((product, i) => (
              <div key={i} className="border rounded p-2 shadow-sm overflow-hidden">
                <img
                  src={product.Image}
                  alt={product.Name}
                  className="h-32 object-contain mx-auto mb-2"
                />
                <p className="text-sm font-medium line-clamp-2">{product.Name}</p>
                <p className="text-green-600 text-sm">{product.Price}</p>
                <p className="text-yellow-600 text-xs">{product.Rating} ⭐</p>
                <p className="text-gray-500 text-xs">{product.Reviews} reviews</p>
                <a
                  href={product.Link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 text-sm underline block mt-2"
                >
                  View on Amazon
                </a>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
