import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2, Plus, Loader2 } from 'lucide-react';
import api from '../services/api';
import { Address, PaymentMethod } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const couponCode = (location.state as any)?.couponCode || '';

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('STRIPE');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // New address form inline
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [newAddr, setNewAddr] = useState<Address>({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/addresses');
        const list: Address[] = res.data.data || [];
        setAddresses(list);
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.default) || list[0];
          setSelectedAddressId(defaultAddr.id || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/addresses', newAddr);
      const created: Address = res.data.data;
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id || null);
      setShowAddressModal(false);
      showToast('Address saved successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save address', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast('Please select or add a shipping address', 'info');
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.post('/orders', {
        addressId: selectedAddressId,
        paymentMethod,
        couponCode: couponCode || null,
      });

      const order = res.data.data;
      await clearCart();
      showToast(`Order ${order.orderNumber} placed successfully!`, 'success');
      navigate(`/order-tracking?orderNumber=${order.orderNumber}`);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = cart?.totalAmount || 0;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 15.0;
  const total = subtotal + tax + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-black text-white">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Steps */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Select Shipping Address */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-400" /> 1. Shipping Address
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-3 py-1.5 bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-bold hover:bg-indigo-600/30 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Address
              </button>
            </div>

            {loading ? (
              <div className="py-6 text-indigo-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id || null)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-white">{addr.fullName}</span>
                      {selectedAddressId === addr.id && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                    </div>
                    <p className="text-xs">{addr.street}</p>
                    <p className="text-xs">{addr.city}, {addr.state} {addr.zipCode}</p>
                    <p className="text-xs font-semibold text-slate-300 mt-1">{addr.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No saved address found. Click 'Add Address' to create one.</p>
            )}

            {/* Address Modal Inline */}
            {showAddressModal && (
              <form onSubmit={handleAddAddress} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 mt-4">
                <h4 className="text-sm font-bold text-white">Add New Address</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={newAddr.street}
                    onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                    className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={newAddr.zipCode}
                    onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={newAddr.country}
                    onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" /> 2. Payment Gateway
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => setPaymentMethod('STRIPE')}
                className={`p-4 rounded-2xl border cursor-pointer text-center space-y-2 transition-all ${
                  paymentMethod === 'STRIPE'
                    ? 'bg-indigo-600/10 border-indigo-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-indigo-400 font-extrabold text-lg">Stripe</div>
                <p className="text-[11px] text-slate-500">Credit / Debit Cards</p>
              </div>

              <div
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-4 rounded-2xl border cursor-pointer text-center space-y-2 transition-all ${
                  paymentMethod === 'RAZORPAY'
                    ? 'bg-indigo-600/10 border-indigo-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-blue-400 font-extrabold text-lg">Razorpay</div>
                <p className="text-[11px] text-slate-500">UPI / NetBanking</p>
              </div>

              <div
                onClick={() => setPaymentMethod('PAYPAL')}
                className={`p-4 rounded-2xl border cursor-pointer text-center space-y-2 transition-all ${
                  paymentMethod === 'PAYPAL'
                    ? 'bg-indigo-600/10 border-indigo-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-sky-400 font-extrabold text-lg">PayPal</div>
                <p className="text-[11px] text-slate-500">Global Wallet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <h3 className="text-lg font-black text-white pb-4 border-b border-slate-800">Final Summary</h3>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {cart?.cartItems?.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs text-slate-300">
                  <span className="truncate max-w-[180px]">{item.product?.name} x{item.quantity}</span>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm pt-4 border-t border-slate-800">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-white pt-2 border-t border-slate-800">
                <span>Total Due</span>
                <span className="text-emerald-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
