import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Loader2, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { Product, Category, Brand } from '../types';
import { ProductCard } from '../components/ProductCard';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filters state
  const categoryId = searchParams.get('category') || '';
  const brandId = searchParams.get('brand') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortDir = searchParams.get('sortDir') || 'desc';
  const page = parseInt(searchParams.get('page') || '0', 10);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories'),
          api.get('/brands'),
        ]);
        setCategories(catRes.data.data || []);
        setBrands(brandRes.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `/products?page=${page}&size=12&sortBy=${sortBy}&sortDir=${sortDir}`;
        if (categoryId) url += `&categoryId=${categoryId}`;
        if (brandId) url += `&brandId=${brandId}`;
        if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

        const res = await api.get(url);
        const data = res.data.data;
        if (data.content) {
          setProducts(data.content);
          setTotalPages(data.totalPages);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, brandId, searchQuery, sortBy, sortDir, page]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '0');
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-white">Product Catalog</h1>
          <p className="text-slate-400 text-sm mt-1">Discover luxury tech, apparel, and home essentials</p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort By:</label>
          <select
            value={`${sortBy}-${sortDir}`}
            onChange={(e) => {
              const [sb, sd] = e.target.value.split('-');
              updateFilter('sortBy', sb);
              updateFilter('sortDir', sd);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="createdAt-desc">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <SlidersHorizontal className="w-5 h-5 text-indigo-400" /> Filters
              </div>
              <button onClick={resetFilters} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Categories</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    !categoryId ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateFilter('category', c.id.toString())}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      categoryId === c.id.toString()
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Brands</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => updateFilter('brand', '')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    !brandId ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  All Brands
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => updateFilter('brand', b.id.toString())}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      brandId === b.id.toString()
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-indigo-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateFilter('page', i.toString())}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                        page === i
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Filter className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                No matching products found for selected filters. Try clearing some criteria.
              </p>
              <button onClick={resetFilters} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm mt-2">
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
