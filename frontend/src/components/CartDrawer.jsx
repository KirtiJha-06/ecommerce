import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemove,
  onUpdateQty,
}) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "tween", duration: 0.4 }}
      className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-30 p-6 flex flex-col"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <button onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {cartItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between mb-4 border-b pb-2"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-16 h-16 object-contain rounded"
              />
              <div className="flex-1 px-3">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-pink-600 font-bold">{item.price}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <button
                    onClick={() => onUpdateQty(item.name, item.qty - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => onUpdateQty(item.name, item.qty + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => onRemove(item.name)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="mt-4 w-full py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
        Checkout
      </button>
    </motion.div>
  );
}
