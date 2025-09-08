import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const allProducts = [
  { id: 1, name: "iPhone 14 Pro", price: 129999, category: "Mobiles", img: "https://m.media-amazon.com/images/I/61bK6PMOC3L._SX679_.jpg" },
  { id: 2, name: "Samsung Galaxy S23", price: 74999, category: "Mobiles", img: "https://m.media-amazon.com/images/I/61RZDb2mQxL._SX679_.jpg" },
  { id: 3, name: "Sony WH-1000XM5", price: 29990, category: "Electronics", img: "https://m.media-amazon.com/images/I/61+V3c5g6ZL._SX679_.jpg" },
  { id: 4, name: "Nike Air Max", price: 7499, category: "Fashion", img: "https://m.media-amazon.com/images/I/71X5f04B7nL._UY695_.jpg" },
  { id: 5, name: "Fossil Gen 6 Smartwatch", price: 18999, category: "Electronics", img: "https://m.media-amazon.com/images/I/71wsr5HziIL._SX679_.jpg" },
  { id: 6, name: "Wooden Coffee Table", price: 5999, category: "Home & Kitchen", img: "https://m.media-amazon.com/images/I/81Y+q0hz5ZL._SX679_.jpg" },
  { id: 7, name: "MacBook Air M2", price: 114999, category: "Electronics", img: "https://m.media-amazon.com/images/I/71fVoqRC0wL._SX679_.jpg" },
];

export default function ListingPage({ onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(150000);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Mobiles", "Fashion", "Electronics", "Home & Kitchen"];

  const filteredProducts = allProducts.filter((p) => {
    return (
      (selectedCategory === "All" || p.category === selectedCategory) &&
      p.price <= maxPrice &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar Filters */}
      <aside className="w-64 bg-white p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4">Filters</h3>

        {/* Search */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Search</label>
          <input
            type="text"
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div>
          <label className="block font-medium mb-2">Max Price: ₹{maxPrice}</label>
          <input
            type="range"
            min="1000"
            max="150000"
            step="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </aside>

      {/* Product Grid */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Products</h2>
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-all flex flex-col items-center"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-40 h-40 object-contain mb-4"
                />
                <h4 className="font-semibold text-lg mb-2">{item.name}</h4>
                <p className="text-pink-600 font-bold mb-2">₹{item.price}</p>
                <button
                  onClick={() => onAddToCart(item)}
                  className="mt-2 flex items-center space-x-2 px-5 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
