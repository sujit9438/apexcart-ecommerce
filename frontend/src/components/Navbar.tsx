import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Sun,
  Moon,
  ShieldCheck,
  LogOut,
  Package,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { LiveSearch } from './LiveSearch';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const wishlistCount = wishlist?.products?.length || 0;

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  ApexCart
                </span>
                <span className="text-[10px] tracking-widest text-indigo-400 font-semibold uppercase -mt-1">
                  Enterprise
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <Link to="/" className="hover:text-indigo-400 transition-colors">
                Home
              </Link>
              <Link to="/products" className="hover:text-indigo-400 transition-colors">
                Shop Catalog
              </Link>
              <Link to="/products?category=1" className="hover:text-indigo-400 transition-colors">
                Electronics
              </Link>
              <Link to="/order-tracking" className="hover:text-indigo-400 transition-colors">
                Track Order
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold hover:bg-indigo-500/20 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-4">
              {/* Search Trigger Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
              </button>

              {/* Wishlist Button */}
              <Link
                to="/dashboard?tab=wishlist"
                className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800 transition-all relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 text-rose-400" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-slate-900">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Button */}
              <Link
                to="/cart"
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 relative"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-semibold">Cart</span>
                {itemCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Account Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 hover:bg-slate-800 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center text-sm">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                      <div className="px-3 py-2 border-b border-slate-800">
                        <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-indigo-400" />
                        My Profile & Orders
                      </Link>

                      <Link
                        to="/order-tracking"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <Package className="w-4 h-4 text-emerald-400" />
                        Track Orders
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Console
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-sm font-semibold text-white transition-all"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Shop Catalog
            </Link>
            <Link
              to="/order-tracking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              Order Tracking
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-400 hover:bg-indigo-500/10"
              >
                Admin Console
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Live Search Modal */}
      <LiveSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
