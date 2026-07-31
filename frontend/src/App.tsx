import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/order-tracking" element={<OrderTrackingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />

                      {/* Protected Customer Routes */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/dashboard" element={<UserDashboardPage />} />
                      </Route>

                      {/* Protected Admin Routes */}
                      <Route element={<ProtectedRoute adminOnly />}>
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/admin/products" element={<AdminProductsPage />} />
                        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                        <Route path="/admin/orders" element={<AdminOrdersPage />} />
                        <Route path="/admin/coupons" element={<AdminCouponsPage />} />
                      </Route>

                      {/* Fallback 404 */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
