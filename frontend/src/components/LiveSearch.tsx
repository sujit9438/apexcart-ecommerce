import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { Product } from '../types';

interface LiveSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveSearch: React.FC<LiveSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-center pt-16 px-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/50">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, categories..."
            className="flex-1 bg-transparent border-none text-white text-base focus:outline-none placeholder:text-slate-500"
          />
          {loading && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {results.length > 0 ? (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  navigate(`/product/${product.id}`);
                  onClose();
                }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors border border-transparent hover:border-slate-700/50 group"
              >
                <img
                  src={product.images?.[0]?.imageUrl || 'https://via.placeholder.com/80'}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-lg bg-slate-950 border border-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{product.category?.name || 'Catalog'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-emerald-400">${product.discountPrice || product.price}</span>
                    {product.discountPrice && (
                      <span className="text-xs text-slate-500 line-through">${product.price}</span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </div>
            ))
          ) : query.trim() ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No matching products found for "{query}"
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              Type to start searching...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
