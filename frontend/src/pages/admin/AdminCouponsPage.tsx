import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { Coupon } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const { showToast } = useToast();

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const discountValue = parseFloat(discountPercentage);
      if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
        showToast('Please enter a valid discount percentage (1-100)', 'error');
        return;
      }
      await api.post('/coupons', {
        code: code.trim().toUpperCase(),
        discountPercentage: discountValue,
        minSpend: 50,
        usageLimit: 500,
        active: true,
        validFrom: new Date().toISOString(),
      });
      showToast('Coupon code created!', 'success');
      setCode('');
      setDiscountPercentage('');
      fetchCoupons();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create coupon', 'error');
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    try {
      await api.delete(`/coupons/${id}`);
      showToast('Coupon deleted', 'info');
      fetchCoupons();
    } catch (err) {
      showToast('Failed to delete coupon', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-black text-white">Coupon & Promo Code Management</h1>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Tag className="w-5 h-5 text-indigo-400" /> Create Promo Coupon
        </h3>

        <form onSubmit={handleCreateCoupon} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="COUPON CODE (e.g. VIP25)"
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white uppercase"
            required
          />
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            placeholder="Discount % (e.g. 25)"
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
            required
          />
          <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs">
            Create Coupon
          </button>
        </form>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Times Used</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-extrabold text-indigo-400">{c.code}</td>
                <td className="p-4 font-bold text-emerald-400">
                  {c.discountPercentage ? `${c.discountPercentage}% OFF` : `$${c.discountAmount} OFF`}
                </td>
                <td className="p-4 text-slate-300">{c.timesUsed || 0}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {c.active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDeleteCoupon(c.id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
