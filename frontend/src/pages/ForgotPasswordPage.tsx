import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [tokenMsg, setTokenMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      setTokenMsg(res.data.data?.message || 'Password reset token generated! Check email.');
    } catch (err: any) {
      setTokenMsg('Failed to process reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">Forgot Password</h2>
          <p className="text-xs text-slate-400">Enter your account email to receive a password reset token</p>
        </div>

        {tokenMsg ? (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Response Ready
            </div>
            <p className="break-all">{tokenMsg}</p>
            <Link to="/reset-password" className="inline-block mt-2 font-bold text-indigo-400 underline">Proceed to Reset Password</Link>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Request Token <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-400">
          Remember password? <Link to="/login" className="text-indigo-400 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
