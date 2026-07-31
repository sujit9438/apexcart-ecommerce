import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-white">404 - Page Not Found</h1>
      <p className="text-slate-400 text-sm max-w-md">
        The requested page does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Homepage
      </Link>
    </div>
  );
};
