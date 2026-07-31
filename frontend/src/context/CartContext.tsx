import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { Cart } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  fetchCart: () => void;
  addToCart: (productId: number, quantity?: number, variantId?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const addToCart = async (productId: number, quantity: number = 1, variantId?: number) => {
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'info');
      return;
    }
    try {
      const res = await api.post('/cart/items', { productId, quantity, variantId });
      setCart(res.data.data);
      showToast('Added to shopping cart', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to add item', 'error');
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      const res = await api.put(`/cart/items/${cartItemId}?quantity=${quantity}`);
      setCart(res.data.data);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update quantity', 'error');
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      const res = await api.delete(`/cart/items/${cartItemId}`);
      setCart(res.data.data);
      showToast('Item removed from cart', 'info');
    } catch (err: any) {
      showToast('Failed to remove item', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart(null);
    } catch (err) {
      console.error(err);
    }
  };

  const itemCount = cart?.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
