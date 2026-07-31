import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      const data = res.data.data;
      login(data.token, data.refreshToken, {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        roles: data.roles.map((r: string) => ({ id: 0, name: r })),
        enabled: true,
        emailVerified: true,
      });
      showToast(`Welcome back, ${data.fullName}!`, 'success');
      navigate('/');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Sign In to ApexCart</h2>
          <p className="text-xs text-slate-400">Access your orders, wishlist, and recommendations</p>
        </div>

        {/* Quick Demo Credentials Box */}
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs space-y-2 text-indigo-300">
          <p className="font-bold uppercase tracking-wider text-[10px]">Quick Demo Credentials:</p>
          <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <span>Admin: <strong className="text-white">admin@ecommerce.com</strong></span>
            <button
              type="button"
              onClick={() => { setEmail('admin@ecommerce.com'); setPassword('Admin@123'); }}
              className="text-[10px] font-bold underline text-emerald-400"
            >
              Autofill
            </button>
          </div>
          <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <span>Customer: <strong className="text-white">user@ecommerce.com</strong></span>
            <button
              type="button"
              onClick={() => { setEmail('user@ecommerce.com'); setPassword('User@123'); }}
              className="text-[10px] font-bold underline text-emerald-400"
            >
              Autofill
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-extrabold text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
};
