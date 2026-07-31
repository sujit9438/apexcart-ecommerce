import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { Wishlist, Product } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: Wishlist | null;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      setWishlist(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist(null);
    }
  }, [isAuthenticated]);

  const isInWishlist = (productId: number) => {
    return wishlist?.products?.some((p) => p.id === productId) || false;
  };

  const toggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      showToast('Please login to manage wishlist', 'info');
      return;
    }
    const exists = isInWishlist(product.id);
    try {
      if (exists) {
        const res = await api.delete(`/wishlist/${product.id}`);
        setWishlist(res.data.data);
        showToast('Removed from wishlist', 'info');
      } else {
        const res = await api.post(`/wishlist/${product.id}`);
        setWishlist(res.data.data);
        showToast('Added to wishlist', 'success');
      }
    } catch (err: any) {
      showToast('Failed to update wishlist', 'error');
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
