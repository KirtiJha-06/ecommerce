import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Star,
  Truck,
  ShieldCheck,
  Heart,
} from "lucide-react";

// ---------------- SAMPLE DATA ----------------
const CATEGORIES = [
  { name: "Mobiles", img: "https://unsplash.com/photos/black-apple-watch-on-iphone-x-1ae1taOtvTE" },
  { name: "Fashion", img: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?w=600" },
  { name: "Electronics", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600" },
  { name: "Home & Kitchen", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800" },
];

const PRODUCTS = [
  { id: 1, title: "iPhone 14 Pro", brand: "Apple", price: 129999, rating: 4.7, reviews: 2341, category: "Mobiles", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", desc: "Powerful A16 chip, ProMotion display and advanced camera." },
  { id: 2, title: "Sony WH-1000XM5", brand: "Sony", price: 29990, rating: 4.6, reviews: 981, category: "Electronics", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", desc: "Industry-leading noise cancellation & balanced sound." },
  { id: 3, title: "Nike Air Max", brand: "Nike", price: 7499, rating: 4.3, reviews: 512, category: "Fashion", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", desc: "Comfortable sneakers with signature Air cushioning." },
  { id: 4, title: "Fossil Gen 6", brand: "Fossil", price: 18999, rating: 4.4, reviews: 301, category: "Electronics", img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800", desc: "Stylish smartwatch with health tracking." },
  { id: 5, title: "MacBook Air M2", brand: "Apple", price: 114999, rating: 4.8, reviews: 1785, category: "Electronics", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", desc: "Thin, light laptop with M2 chipset." },
  { id: 6, title: "Non-stick Pan Set", brand: "CookWell", price: 2499, rating: 4.1, reviews: 219, category: "Home & Kitchen", img: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800", desc: "Durable non-stick pans, oven-safe." },
  { id: 7, title: "Skincare Combo", brand: "Glow", price: 1299, rating: 4.0, reviews: 142, category: "Beauty", img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800", desc: "Gentle, dermatologist-tested skincare." },
  { id: 8, title: "Organic Grocery Pack", brand: "NatureFresh", price: 899, rating: 4.2, reviews: 88, category: "Grocery", img: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800", desc: "Organic staples for everyday cooking." },
  { id: 9, title: "OnePlus 12", brand: "OnePlus", price: 64999, rating: 4.5, reviews: 744, category: "Mobiles", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800", desc: "Fast charging and flagship specs." },
];

const BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand))).slice(0, 8);

// ---------------- HELPERS ----------------
const currency = (n) => `₹${n.toLocaleString("en-IN")}`;

// ---------------- MAIN COMPONENT ----------------
export default function ShopEaseDesktopOnly({ onAddToCart }) {
  // UI state
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [priceRange, setPriceRange] = useState(null); // '0-5000','5000-20000','20000+'
  const [minRating, setMinRating] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState(new Set());

  // cart + UI
  const [cart, setCart] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // filter & sort (simple default sort by relevance)
  const [sortBy, setSortBy] = useState("");

  // filter logic
  const filtered = useMemo(() => {
    let out = PRODUCTS.filter((p) => (activeCat === "All" ? true : p.category === activeCat));

    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }

    if (priceRange === "0-5000") out = out.filter((p) => p.price <= 5000);
    if (priceRange === "5000-20000") out = out.filter((p) => p.price > 5000 && p.price <= 20000);
    if (priceRange === "20000+") out = out.filter((p) => p.price > 20000);

    if (minRating > 0) out = out.filter((p) => p.rating >= minRating);

    if (selectedBrands.size > 0) out = out.filter((p) => selectedBrands.has(p.brand));

    if (sortBy === "price-asc") out = out.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") out = out.sort((a, b) => b.price - a.price);
    if (sortBy === "rating-desc") out = out.sort((a, b) => b.rating - a.rating);

    return out;
  }, [query, activeCat, priceRange, minRating, selectedBrands, sortBy]);

  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const cartTotal = cart.reduce((a, c) => a + c.qty * c.price, 0);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + qty } : p));
      return [...prev, { ...product, qty }];
    });
    if (onAddToCart) onAddToCart(product);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const toggleBrand = (b) => {
    setSelectedBrands((prev) => {
      const s = new Set(prev);
      if (s.has(b)) s.delete(b);
      else s.add(b);
      return s;
    });
  };

  const clearFilters = () => {
    setPriceRange(null);
    setMinRating(0);
    setSelectedBrands(new Set());
    setQuery("");
    setActiveCat("All");
    setSortBy("");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* TOP SEARCH / HERO */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products or brands"
                className="w-full rounded-xl border px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Search className="w-5 h-5 absolute right-3 top-3 text-gray-500" />
            </div>
            <div className="mt-4">
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-2xl overflow-hidden">
                <div className="relative h-56 md:h-72 bg-gradient-to-r from-pink-600 to-red-500 rounded-2xl">
                  <img src="https://images.pexels.com/photos/6311655/pexels-photo-6311655.jpeg" alt="Heroine" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute left-10 top-10 text-white max-w-lg">
                    <h1 className="text-4xl font-bold">Mega Fashion Week</h1>
                    <p className="mt-2 text-lg">Flat <span className="font-extrabold">50% OFF</span> on curated picks</p>
                    <div className="mt-4 flex gap-3">
                      <motion.button whileTap={{ scale: 0.97 }} className="px-5 py-2 rounded-lg bg-white text-pink-600 font-semibold">Shop Women's</motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} className="px-5 py-2 rounded-lg bg-white/20 text-white border border-white/30">Explore</motion.button>
                    </div>
                  </div>
                  <div className="absolute right-8 bottom-6 bg-white/90 text-gray-900 px-4 py-2 rounded-lg shadow">Limited time • Ends soon</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* mini promo cards */}
          <div className="hidden lg:flex lg:flex-col gap-4 w-72">
            <PromoCard title="Free Delivery" subtitle="On orders over ₹499" icon={<Truck className="w-6 h-6" />} />
            <PromoCard title="Secure Payments" subtitle="Buyer protection" icon={<ShieldCheck className="w-6 h-6" />} />
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: SIDEBAR (desktop only) + GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-12 gap-6">
          {/* SIDEBAR - visible on md+ (desktop-focused) */}
          <aside className="col-span-3 hidden xl:block">
            <div className="bg-white rounded-2xl p-6 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-pink-600">Clear</button>
              </div>

              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Price</div>
                <div className="flex flex-col gap-2">
                  <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${priceRange === '0-5000' ? 'bg-pink-50' : 'hover:bg-gray-50'}`}>
                    <input type="radio" name="price" checked={priceRange === '0-5000'} onChange={() => setPriceRange('0-5000')} />
                    <span className="text-sm">₹0 - ₹5,000</span>
                  </label>
                  <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${priceRange === '5000-20000' ? 'bg-pink-50' : 'hover:bg-gray-50'}`}>
                    <input type="radio" name="price" checked={priceRange === '5000-20000'} onChange={() => setPriceRange('5000-20000')} />
                    <span className="text-sm">₹5,000 - ₹20,000</span>
                  </label>
                  <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${priceRange === '20000+' ? 'bg-pink-50' : 'hover:bg-gray-50'}`}>
                    <input type="radio" name="price" checked={priceRange === '20000+'} onChange={() => setPriceRange('20000+')} />
                    <span className="text-sm">₹20,000+</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Rating</div>
                <div className="flex flex-col gap-2">
                  <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${minRating === 4 ? 'bg-pink-50' : 'hover:bg-gray-50'}`}>
                    <input type="radio" name="rating" checked={minRating === 4} onChange={() => setMinRating(4)} />
                    <span className="text-sm">⭐ 4 & up</span>
                  </label>
                  <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${minRating === 3 ? 'bg-pink-50' : 'hover:bg-gray-50'}`}>
                    <input type="radio" name="rating" checked={minRating === 3} onChange={() => setMinRating(3)} />
                    <span className="text-sm">⭐ 3 & up</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Brands</div>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2">
                  {BRANDS.map((b) => (
                    <label key={b} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${selectedBrands.has(b) ? 'bg-pink-50' : 'hover:bg-gray-50'}`}>
                      <input type="checkbox" checked={selectedBrands.has(b)} onChange={() => toggleBrand(b)} />
                      <span className="text-sm">{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* small CTA below filters */}
            <div className="mt-4">
              <div className="bg-gradient-to-r from-pink-600 to-red-500 text-white p-4 rounded-2xl shadow-lg">
                <div className="font-semibold">Exclusive Recruiter Pack</div>
                <div className="text-sm mt-1">Showcase your product UI & interactions — downloadable assets included.</div>
                <div className="mt-3">
                  <button className="px-4 py-2 bg-white text-pink-600 rounded-lg font-semibold">Get Brochure</button>
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <main className="col-span-12 xl:col-span-9">
            {/* controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">{filtered.length}</span> products</div>
                <div className="hidden lg:flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm">
                  <div className="text-sm text-gray-500">Category</div>
                  <select value={activeCat} onChange={(e) => setActiveCat(e.target.value)} className="text-sm border rounded-md px-2 py-1 ml-2">
                    <option>All</option>
                    {CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">Sort</div>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border rounded-md px-2 py-1">
                  <option value="">Relevance</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating-desc">Rating: High → Low</option>
                </select>
              </div>
            </div>

            {/* grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer" onClick={() => setSelectedProduct(p)}>
                  <div className="relative">
                    <img src={p.img} alt={p.title} className="w-full h-44 object-cover rounded-xl mb-3" />
                    <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">{Math.round((p.price / (p.price + 20000)) * 50)}% OFF</div>
                    <button className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow"><Heart className="w-4 h-4" /></button>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{p.brand}</div>
                    <h3 className="font-medium mt-1 line-clamp-2">{p.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="text-amber-500 flex items-center">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < Math.round(p.rating) ? 'fill-current' : ''}`} />))}</div>
                      <div className="text-xs text-gray-500">{p.rating} • {p.reviews.toLocaleString()}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="font-bold text-lg">{currency(p.price)}</div>
                      <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="px-3 py-1.5 rounded-xl bg-pink-600 text-white text-sm hover:bg-pink-700 flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* pagination stub (visual) */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                <button className="px-3 py-1 rounded bg-gray-100">Prev</button>
                <button className="px-3 py-1 rounded bg-pink-600 text-white">1</button>
                <button className="px-3 py-1 rounded">2</button>
                <button className="px-3 py-1 rounded">3</button>
                <button className="px-3 py-1 rounded bg-gray-100">Next</button>
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* CART DRAWER */}
      <AnimatePresence>
        {drawer && (
          <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: "tween" }} className="fixed inset-y-0 right-0 w-full xl:w-[420px] bg-white z-50 shadow-2xl">
            <div className="h-16 border-b flex items-center justify-between px-4">
              <div className="font-semibold text-lg">Your Cart ({cartCount})</div>
              <button onClick={() => setDrawer(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-8rem)]">
              {cart.length === 0 && <div className="text-sm text-gray-500">Your cart is empty. Add some products!</div>}
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                  <img src={item.img} className="w-20 h-20 object-cover rounded-lg" alt={item.title} />
                  <div className="flex-1">
                    <div className="font-medium line-clamp-1">{item.title}</div>
                    <div className="text-sm text-gray-500">{currency(item.price)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, -1)} className="px-2 rounded-lg border">-</button>
                      <span className="text-sm w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, +1)} className="px-2 rounded-lg border">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-16 border-t px-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Subtotal</div>
                <div className="font-bold">{currency(cartTotal)}</div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-700">Checkout</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRODUCT DETAIL MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div className="fixed inset-0 z-60 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedProduct(null)}></div>
            <motion.div initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.98 }} transition={{ duration: 0.2 }} className="relative z-10 max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-4 flex items-center justify-center bg-gray-50">
                  <img src={selectedProduct.img} alt={selectedProduct.title} className="w-full h-80 object-contain" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{selectedProduct.title}</h3>
                      <div className="text-sm text-gray-500 mt-1">{selectedProduct.brand} • {selectedProduct.reviews.toLocaleString()} reviews</div>
                    </div>
                    <button onClick={() => setSelectedProduct(null)} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
                  </div>

                  <div className="flex items-center gap-2 text-amber-500 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(selectedProduct.rating) ? "fill-current" : ""}`} />
                    ))}
                    <span className="text-sm text-gray-500">{selectedProduct.rating} • {selectedProduct.reviews.toLocaleString()} reviews</span>
                  </div>

                  <div className="mt-4">
                    <div className="text-lg font-bold">{currency(selectedProduct.price)}</div>
                    <p className="text-gray-600 mt-3">{selectedProduct.desc}</p>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button onClick={() => { addToCart(selectedProduct, 1); setSelectedProduct(null); }} className="px-4 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-700 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Add to cart
                    </button>
                    <button onClick={() => { addToCart(selectedProduct, 1); setDrawer(true); setSelectedProduct(null); }} className="px-4 py-2 rounded-xl border">Buy now</button>
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">ShopEase</h4>
            <p className="text-sm">Your one-stop shop for fashion, electronics, and more. Clean UI, smooth interactions — showcase ready for recruiters.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>Help Center</li>
              <li>Returns</li>
              <li>Track Order</li>
              <li>Shipping Info</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">IG</div>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">FB</div>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">TW</div>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-8">© {new Date().getFullYear()} ShopEase. All rights reserved.</div>
      </footer>
    </div>
  );
}

// ---------------- SMALL COMPONENTS ----------------
function PromoCard({ title, subtitle, icon }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
      <div className="shrink-0 p-2 rounded-xl bg-pink-50 text-pink-600">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
}





