import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Layers } from 'lucide-react';
import api from '../../services/api';
import { Category, Brand } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [catName, setCatName] = useState('');
  const [brandName, setBrandName] = useState('');
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [cRes, bRes] = await Promise.all([api.get('/categories'), api.get('/brands')]);
      setCategories(cRes.data.data || []);
      setBrands(bRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      await api.post('/categories', { name: catName });
      showToast('Category created!', 'success');
      setCatName('');
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create category', 'error');
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    try {
      await api.post('/brands', { name: brandName });
      showToast('Brand created!', 'success');
      setBrandName('');
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create brand', 'error');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);
      showToast('Category deleted', 'info');
      fetchData();
    } catch (err) {
      showToast('Failed to delete category', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <h1 className="text-3xl font-black text-white">Categories & Brands Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Box */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" /> Categories ({categories.length})
          </h3>

          <form onSubmit={handleCreateCategory} className="flex gap-2">
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="New Category Name..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              required
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs">
              Add Category
            </button>
          </form>

          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-sm text-white">
                <span>{c.name}</span>
                <button onClick={() => handleDeleteCategory(c.id)} className="text-rose-400 p-1 hover:bg-rose-500/10 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Brands Box */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-400" /> Brands ({brands.length})
          </h3>

          <form onSubmit={handleCreateBrand} className="flex gap-2">
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="New Brand Name..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              required
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs">
              Add Brand
            </button>
          </form>

          <div className="space-y-2">
            {brands.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-sm text-white">
                <span>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
