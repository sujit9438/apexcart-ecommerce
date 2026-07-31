import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Shield, Truck, RefreshCw, Lock, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white text-sm font-semibold">Free Global Shipping</h5>
              <p className="text-xs text-slate-500 mt-0.5">On all orders over $100</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white text-sm font-semibold">2-Year Warranty</h5>
              <p className="text-xs text-slate-500 mt-0.5">Comprehensive product guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white text-sm font-semibold">30-Day Easy Returns</h5>
              <p className="text-xs text-slate-500 mt-0.5">No questions asked refund policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white text-sm font-semibold">Secure Checkout</h5>
              <p className="text-xs text-slate-500 mt-0.5">256-Bit SSL Encrypted</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">ApexCart</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Production-ready full-stack enterprise e-commerce platform built with modern Java 21 Spring Boot, MySQL 8, React 19, and Tailwind CSS.
            </p>
            <div className="pt-2">
              <h6 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Subscribe to VIP Offers</h6>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 flex-1"
                />
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop Categories</h6>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products?category=1" className="hover:text-indigo-400 transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=2" className="hover:text-indigo-400 transition-colors">Fashion & Apparel</Link></li>
              <li><Link to="/products?category=3" className="hover:text-indigo-400 transition-colors">Home & Living</Link></li>
              <li><Link to="/products?category=4" className="hover:text-indigo-400 transition-colors">Sports & Outdoors</Link></li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h6 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Support</h6>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/order-tracking" className="hover:text-indigo-400 transition-colors">Order Tracking</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">My Profile</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/dashboard?tab=addresses" className="hover:text-indigo-400 transition-colors">Saved Addresses</Link></li>
            </ul>
          </div>

          {/* Tech Stack Info */}
          <div>
            <h6 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Enterprise Stack</h6>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>Java 21 / Spring Boot 3</li>
              <li>Spring Security + JWT</li>
              <li>React 19 + TypeScript</li>
              <li>Tailwind CSS + Lucide</li>
              <li>MySQL 8 + Hibernate</li>
              <li>Docker Containerized</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 ApexCart Inc. Production-Ready Full Stack Application.</p>
          <div className="flex items-center gap-6">
            <span>Stripe Ready</span>
            <span>Razorpay Ready</span>
            <span>PayPal Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
