import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import api from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, catRes, newRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/categories/featured'),
          api.get('/products/new-arrivals'),
        ]);
        setFeaturedProducts(featRes.data.data || []);
        setCategories(catRes.data.data || []);
        setNewArrivals(newRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950/0 to-slate-950/0 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Next-Gen Enterprise Store
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
                Experience <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Unmatched Luxury
                </span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
                Discover curated high-tech electronics, premium fashion, and home essentials backed by instant global logistics and 24/7 dedicated support.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products?category=1"
                  className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all"
                >
                  Featured Electronics
                </Link>
              </div>

              {/* Stats pill */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80">
                <div>
                  <h4 className="text-2xl font-black text-white">50k+</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Active Shoppers</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-emerald-400">99.8%</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Satisfaction</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-indigo-400">24h</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Dispatch Time</p>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-500/20 bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
                  alt="Hero Product"
                  className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-8">
                  <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">Featured Spotlight</span>
                  <h3 className="text-2xl font-black text-white">Sony WH-1000XM5 Wireless Headphones</h3>
                  <p className="text-slate-300 text-sm mt-1 line-clamp-1">Industry-leading noise canceling audio masterpiece</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-extrabold text-emerald-400">$349.99</span>
                    <Link to="/product/2" className="px-4 py-2 bg-white text-slate-950 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors">
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">Browse Categories</h2>
            <p className="text-slate-400 text-sm mt-1">Explore our wide selection of top tier products</p>
          </div>
          <Link to="/products" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-1">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative h-48 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl"
            >
              <img
                src={category.imageUrl || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600'}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{category.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-400" /> Premium Catalog
            </div>
            <h2 className="text-2xl font-black text-white">Featured Products</h2>
          </div>
          <Link to="/products" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-1">
            Shop All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" /> Fresh Additions
            </div>
            <h2 className="text-2xl font-black text-white">New Arrivals</h2>
          </div>
          <Link to="/products" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-1">
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-slate-950/60 border-y border-slate-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-black text-white">What Our Customers Say</h2>
            <p className="text-slate-400 text-sm mt-1">Verified reviews from authentic buyers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                "The MacBook Pro arrived in perfect condition within 24 hours. The checkout was seamless and tracking was spot on."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  JD
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">John Doe</h4>
                  <p className="text-xs text-slate-500">Verified Buyer</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                "Amazing audio quality on the Sony Headphones! The WELCOME10 coupon worked seamlessly at checkout."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  AS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Alice Smith</h4>
                  <p className="text-xs text-slate-500">Verified Buyer</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                "Top class customer service and super fast refund when I needed to adjust my order details."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                  MR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Michael Reed</h4>
                  <p className="text-xs text-slate-500">Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
