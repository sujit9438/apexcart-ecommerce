import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Package, Heart, MapPin, Download, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import api from '../services/api';
import { Order, Address } from '../types';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'orders';

  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordRes, addrRes] = await Promise.all([
          api.get('/orders/my-orders'),
          api.get('/addresses'),
        ]);
        setOrders(ordRes.data.data || []);
        setAddresses(addrRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownloadInvoice = (order: Order) => {
    const invoiceContent = `
==================================================
                 APEXCART INVOICE
==================================================
Invoice No   : INV-${order.orderNumber}
Date         : ${new Date(order.createdAt).toLocaleDateString()}
Customer     : ${order.user?.fullName}
Email        : ${order.user?.email}

Shipping Address:
${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state}

ITEMS PURCHASED:
${order.orderItems?.map((item) => `- ${item.productName} (x${item.quantity}) : $${item.totalPrice}`).join('\n')}

Subtotal     : $${order.subtotal}
Tax (8%)     : $${order.taxAmount}
Shipping     : $${order.shippingFee}
Discount     : -$${order.discountAmount || 0}
TOTAL PAID   : $${order.totalAmount}
==================================================
Thank you for shopping with ApexCart!
`;
    const element = document.createElement('a');
    const file = new Blob([invoiceContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Invoice_${order.orderNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-black text-2xl flex items-center justify-center">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{user?.fullName}</h1>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Account Verified
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setSearchParams({ tab: 'orders' })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> My Orders
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'wishlist' })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'wishlist' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" /> Wishlist
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'addresses' })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'addresses' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" /> Addresses
          </button>
        </div>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white">Order History ({orders.length})</h3>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-xs text-indigo-400 font-bold uppercase">Order #{order.orderNumber}</span>
                      <p className="text-xs text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300' :
                        order.status === 'CANCELLED' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {order.status}
                      </span>
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        title="Download Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.orderItems?.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs text-slate-300">
                        <span>{item.productName} (x{item.quantity})</span>
                        <span className="font-bold text-emerald-400">${Number(item.totalPrice).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-sm font-bold text-white">
                    <span>Total Amount</span>
                    <span className="text-emerald-400 text-base">${Number(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl text-slate-500">
              No orders placed yet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white">Saved Wishlist ({wishlist?.products?.length || 0})</h3>

          {wishlist?.products && wishlist.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl text-slate-500">
              Your wishlist is currently empty.
            </div>
          )}
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white">Saved Shipping Addresses ({addresses.length})</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-base">{addr.fullName}</h4>
                  {addr.default && <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full font-bold">Default</span>}
                </div>
                <p className="text-xs text-slate-400">{addr.street}</p>
                <p className="text-xs text-slate-400">{addr.city}, {addr.state} {addr.zipCode}</p>
                <p className="text-xs font-bold text-slate-300 pt-2">{addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
