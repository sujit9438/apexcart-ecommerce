import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, Clock, Truck, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = '/orders?size=50';
      if (filterStatus) url += `&status=${filterStatus}`;
      const res = await api.get(url);
      setOrders(res.data.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order status updated to ${newStatus}`, 'success');
      fetchOrders();
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Customer Order Management</h1>
          <p className="text-slate-400 text-sm mt-1">Review pending orders and update fulfillment status</p>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="p-4">Order Number</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-white">{o.orderNumber}</td>
                <td className="p-4 text-slate-300">
                  <div>{o.user?.fullName}</div>
                  <div className="text-xs text-slate-500">{o.user?.email}</div>
                </td>
                <td className="p-4 font-bold text-emerald-400">${Number(o.totalAmount).toFixed(2)}</td>
                <td className="p-4 text-xs font-bold text-slate-300">{o.paymentMethod}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    o.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300' :
                    o.status === 'CANCELLED' ? 'bg-rose-500/20 text-rose-300' :
                    'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select
                    value={o.status}
                    onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
