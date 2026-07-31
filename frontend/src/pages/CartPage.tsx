import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const subtotal = cart?.totalAmount || 0;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15.0;
  const total = Math.max(0, subtotal - appliedDiscount + tax + shipping);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      setCouponError('');
      const res = await api.get(`/coupons/code/${couponCode.trim().toUpperCase()}`);
      const coupon = res.data.data;
      if (coupon && coupon.active) {
        let disc = 0;
        if (coupon.discountPercentage) {
          disc = (subtotal * coupon.discountPercentage) / 100;
          if (coupon.maxDiscount && disc > coupon.maxDiscount) disc = coupon.maxDiscount;
        } else if (coupon.discountAmount) {
          disc = coupon.discountAmount;
        }
        setAppliedDiscount(disc);
        showToast(`Coupon ${coupon.code} applied successfully!`, 'success');
      }
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Invalid or expired coupon code');
      setAppliedDiscount(0);
    }
  };

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-indigo-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-white">Your Shopping Cart is Empty</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Explore our products catalog and discover high-performance tech, apparel, and gadgets.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl transition-all shadow-xl shadow-indigo-600/30"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-black text-white flex items-center gap-3">
        Shopping Cart <span className="text-indigo-400 text-base font-semibold">({itemCount} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all"
            >
              <img
                src={item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/100'}
                alt={item.product?.name}
                className="w-20 h-20 object-cover rounded-xl bg-slate-950 border border-slate-800 shrink-0"
              />

              <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                <Link to={`/product/${item.product?.id}`} className="text-base font-bold text-white hover:text-indigo-400 transition-colors line-clamp-1">
                  {item.product?.name}
                </Link>
                {item.variant && <p className="text-xs text-indigo-400 font-semibold">{item.variant.name}</p>}
                <p className="text-xs text-slate-400">Unit Price: ${item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-slate-800 rounded-xl bg-slate-950 overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-white font-bold text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white font-bold"
                >
                  +
                </button>
              </div>

              <div className="text-right font-extrabold text-emerald-400 text-lg sm:w-24">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <h3 className="text-lg font-black text-white pb-4 border-b border-slate-800">Order Summary</h3>

            {/* Coupon Application */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-indigo-400" /> Apply Coupon
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. WELCOME10"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 uppercase"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-xs text-rose-400">{couponError}</p>}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-3 text-sm pt-4 border-t border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Discount</span>
                  <span>-${appliedDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span>Est. Tax (8%)</span>
                <span className="font-bold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Shipping Fee</span>
                <span className="font-bold">{shipping === 0 ? <span className="text-emerald-400">FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-white pt-3 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-emerald-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { couponCode: appliedDiscount > 0 ? couponCode : null } })}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Proceed To Checkout <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
