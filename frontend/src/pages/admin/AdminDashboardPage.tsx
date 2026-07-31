import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, Clock, ArrowUpRight, TrendingUp, ShieldCheck, Tag } from 'lucide-react';
import api from '../../services/api';
import { DashboardStats, SalesReport } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [statRes, repRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/reports/sales'),
        ]);
        setStats(statRes.data.data);
        setReports(repRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Admin Command Center
          </div>
          <h1 className="text-3xl font-black text-white">Enterprise Analytics & Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-all">
            Manage Catalog
          </Link>
          <Link to="/admin/orders" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-all">
            Review Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-emerald-400">${stats?.totalRevenue || '0.00'}</h3>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> +18.4% from last month
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.totalOrders || 0}</h3>
          <p className="text-xs text-slate-500">Live order transactions</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.totalUsers || 0}</h3>
          <p className="text-xs text-slate-500">Active customer accounts</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog Products</span>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white">{stats?.totalProducts || 0}</h3>
          <p className="text-xs text-slate-500">Active SKUs</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Warning</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-amber-400">{stats?.lowStockCount || 0}</h3>
          <p className="text-xs text-slate-500">Items below threshold (10 units)</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Orders</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-rose-400">{stats?.pendingOrdersCount || 0}</h3>
          <p className="text-xs text-slate-500">Requires fulfillment</p>
        </div>
      </div>

      {/* Interactive Sales Chart Visualization */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white">Monthly Sales Growth Report</h3>
            <p className="text-xs text-slate-400 mt-0.5">Revenue trend breakdown across the fiscal year</p>
          </div>
        </div>

        {/* SVG Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-2 pt-8 px-4 border-b border-slate-800">
          {reports.map((r, i) => {
            const maxRev = 20000;
            const heightPct = Math.min(100, Math.max(15, (r.revenue / maxRev) * 100));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="opacity-0 group-hover:opacity-100 text-[10px] text-emerald-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 transition-opacity">
                  ${r.revenue}
                </div>
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full bg-gradient-to-t from-indigo-600 to-emerald-400 rounded-t-lg group-hover:brightness-125 transition-all"
                />
                <span className="text-[11px] font-bold text-slate-400">{r.period}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Link to="/admin/products" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between text-white font-bold text-sm group">
          <span>Products Management</span>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        </Link>
        <Link to="/admin/categories" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between text-white font-bold text-sm group">
          <span>Categories & Brands</span>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        </Link>
        <Link to="/admin/orders" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between text-white font-bold text-sm group">
          <span>Orders Management</span>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        </Link>
        <Link to="/admin/coupons" className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between text-white font-bold text-sm group">
          <span>Coupons & Discounts</span>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        </Link>
      </div>
    </div>
  );
};
