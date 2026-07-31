import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import { Product, Category, Brand } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    categoryId: '',
    brandId: '',
    imageUrls: [''],
    featured: false,
    active: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, brandRes] = await Promise.all([
        api.get('/products?size=50'),
        api.get('/categories'),
        api.get('/brands'),
      ]);
      setProducts(prodRes.data.data?.content || []);
      setCategories(catRes.data.data || []);
      setBrands(brandRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      description: '',
      price: '',
      discountPrice: '',
      stockQuantity: '',
      categoryId: categories[0]?.id?.toString() || '',
      brandId: brands[0]?.id?.toString() || '',
      imageUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
      featured: false,
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku || '',
      description: p.description || '',
      price: p.price.toString(),
      discountPrice: p.discountPrice ? p.discountPrice.toString() : '',
      stockQuantity: p.stockQuantity.toString(),
      categoryId: p.category?.id?.toString() || '',
      brandId: p.brand?.id?.toString() || '',
      imageUrls: p.images?.map((i) => i.imageUrl) || [''],
      featured: p.featured,
      active: p.active,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append('file', file);
      const res = await api.post('/files/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data.data.url;
      setFormData((prev) => ({ ...prev, imageUrls: [url, ...prev.imageUrls] }));
      showToast('Image uploaded successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity, 10),
        categoryId: parseInt(formData.categoryId, 10),
        brandId: formData.brandId ? parseInt(formData.brandId, 10) : null,
        imageUrls: formData.imageUrls.filter((u) => u.trim() !== ''),
        featured: formData.featured,
        active: formData.active,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        showToast('Product updated successfully!', 'success');
      } else {
        await api.post('/products', payload);
        showToast('Product created successfully!', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      showToast('Product deleted', 'info');
      fetchData();
    } catch (err: any) {
      showToast('Failed to delete product', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Product Inventory Management</h1>
          <p className="text-slate-400 text-sm mt-1">Create, edit, upload images, and control catalog pricing</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={p.images?.[0]?.imageUrl || 'https://via.placeholder.com/50'}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-white line-clamp-1">{p.name}</h4>
                    <p className="text-xs text-slate-500">SKU: {p.sku}</p>
                  </div>
                </td>
                <td className="p-4 text-slate-300">{p.category?.name || 'N/A'}</td>
                <td className="p-4 font-bold text-emerald-400">${p.discountPrice || p.price}</td>
                <td className="p-4 font-bold text-slate-200">{p.stockQuantity}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {p.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEditModal(p)} className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-xl">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">{editingProduct ? 'Edit Product' : 'Create Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Image Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase flex items-center justify-between">
                  <span>Product Image URL</span>
                  <label className="text-indigo-400 hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </label>
                <input
                  type="text"
                  value={formData.imageUrls[0] || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrls: [e.target.value] })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600"
                  />
                  Featured Product
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600"
                  />
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
