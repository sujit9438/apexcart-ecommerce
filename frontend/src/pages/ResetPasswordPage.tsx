import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Key, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export const ResetPasswordPage: React.FC = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/auth/reset-password', { token, newPassword });
      showToast('Password reset successfully! Please login with your new password.', 'success');
      navigate('/login');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid or expired token', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">Reset Password</h2>
          <p className="text-xs text-slate-400">Enter your reset token and new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Reset Token</label>
            <div className="relative">
              <Key className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">New Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
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
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Reset Password <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};
