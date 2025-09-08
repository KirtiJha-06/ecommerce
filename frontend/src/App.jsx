import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import ListingPage from "./pages/ListingPage";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.name === product.name);
      if (existing) {
        return prev.map((p) =>
          p.name === product.name ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (name) => {
    setCartItems((prev) => prev.filter((p) => p.name !== name));
  };

  const updateQty = (name, qty) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((p) => (p.name === name ? { ...p, qty } : p))
    );
  };

  return (
    <div className="font-sans">
      <Navbar cartCount={cartItems.length} onCartOpen={() => setCartOpen(true)} />

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home onAddToCart={addToCart} />} />
        <Route
          path="/products"
          element={<ListingPage onAddToCart={addToCart} />}
        />
        <Route path="/cart" element={<CartPage cartItems={cartItems} onRemove={removeFromCart} onUpdateQty={updateQty} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
      />
    </div>
  );
}
