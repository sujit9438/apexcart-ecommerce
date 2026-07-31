import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck, Home, XCircle } from 'lucide-react';
import api from '../services/api';
import { Order, OrderStatus } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';
  const [orderNumber, setOrderNumber] = useState<string>(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchOrder = async (num: string) => {
    if (!num.trim()) return;
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/orders/track/${num.trim()}`);
      setOrder(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order not found. Please verify the order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const steps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'PENDING', label: 'Order Placed', icon: Clock },
    { status: 'PROCESSING', label: 'Processing', icon: Package },
    { status: 'SHIPPED', label: 'Shipped Out', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: Home },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'PROCESSING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  };

  const currentIndex = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-white">Live Order Tracking</h1>
        <p className="text-slate-400 text-sm">Track real-time dispatch progress and delivery updates</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrder(orderNumber);
          }}
          className="flex max-w-md mx-auto gap-2 pt-2"
        >
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter Order Number (e.g. ORD-12345678)"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 uppercase"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Track
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-sm text-center">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl">
          {/* Order Header Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Tracking Number</span>
              <h3 className="text-2xl font-black text-white">{order.orderNumber}</h3>
              <p className="text-xs text-slate-400 mt-1">Carrier Reference: {order.trackingNumber || 'TRK-ASSIGNED'}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                order.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                order.status === 'CANCELLED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              }`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Visual Timeline Bar */}
          {order.status !== 'CANCELLED' ? (
            <div className="py-6">
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-slate-800 w-full z-0" />
                <div
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-indigo-500 z-0 transition-all duration-500"
                  style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentIndex;
                  return (
                    <div key={step.status} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50 scale-110' : 'bg-slate-900 border-2 border-slate-800 text-slate-500'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold mt-2 ${isCompleted ? 'text-white' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-center gap-3 text-rose-300">
              <XCircle className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Order Cancelled</h4>
                <p className="text-xs">This order has been cancelled and refunded.</p>
              </div>
            </div>
          )}

          {/* Ordered Items List */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-slate-300">Package Contents</h4>
            <div className="space-y-3">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm">
                  <div>
                    <h5 className="font-bold text-white">{item.productName}</h5>
                    <p className="text-xs text-slate-400">Qty: {item.quantity} • Unit Price: ${Number(item.price).toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-emerald-400">${Number(item.totalPrice).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
