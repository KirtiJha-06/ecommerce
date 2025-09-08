import React, { useState } from "react";
import { motion } from "framer-motion";

const allProducts = [
  { name: "Smartphone", category: "Mobiles", price: 14999, img: "https://m.media-amazon.com/images/I/81CgtwSII3L._SX679_.jpg" },
  { name: "Headphones", category: "Electronics", price: 2499, img: "https://m.media-amazon.com/images/I/61+V3c5g6ZL._SX679_.jpg" },
  { name: "Sneakers", category: "Fashion", price: 1799, img: "https://m.media-amazon.com/images/I/71MwNBEY0wL._SY695_.jpg" },
  { name: "Laptop", category: "Electronics", price: 49999, img: "https://m.media-amazon.com/images/I/71P+E7vK8hL._SX679_.jpg" },
];

export default function ProductListing({ onAddToCart }) {
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(60000);

  const filtered = allProducts.filter(
    (p) =>
      (category === "All" || p.category === category) && p.price <= maxPrice
  );

  return (
    <div className="px-8 py-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Products</h2>

      {/* Filters */}
      <div className="flex space-x-6 mb-8">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option>All</option>
          <option>Mobiles</option>
          <option>Fashion</option>
          <option>Electronics</option>
        </select>

        <input
          type="range"
          min="1000"
          max="60000"
          step="1000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <span>Max: ₹{maxPrice}</span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center"
          >
            <img src={item.img} alt={item.name} className="w-32 h-32 mb-4" />
            <h4 className="font-semibold text-lg">{item.name}</h4>
            <p className="text-pink-600 font-bold mb-3">₹{item.price}</p>
            <button
              onClick={() => onAddToCart(item)}
              className="px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            >
              Add to Cart
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

