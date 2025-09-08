import React from "react";

export default function CartPage({ cartItems, onRemove, onUpdateQty }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.name} className="flex items-center justify-between mb-2">
              <span>{item.name}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => onUpdateQty(item.name, item.qty - 1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => onUpdateQty(item.name, item.qty + 1)}>+</button>
                <button onClick={() => onRemove(item.name)} className="text-red-500">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
