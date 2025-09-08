import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";

export default function Navbar({ cartCount, onCartOpen }) {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow sticky top-0 z-20">
      <Link to="/home" className="text-2xl font-bold text-pink-600">
        ShopEase
      </Link>

      <div className="flex space-x-6 items-center">
        <Link to="/products" className="hover:text-pink-600">
          Products
        </Link>
       
        <Link to="/login" className="hover:text-pink-600">
          <User className="w-5 h-5 inline mr-1" />
          Login
        </Link>

        <button
          onClick={onCartOpen}
          className="relative hover:text-pink-600 transition"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full px-1.5">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
