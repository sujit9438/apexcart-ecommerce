export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  roles: { id: number; name: string }[];
  enabled: boolean;
  emailVerified: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  featured: boolean;
}

export interface Brand {
  id: number;
  name: string;
  logoUrl?: string;
  description?: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  primaryImage: boolean;
}

export interface ProductVariant {
  id: number;
  name: string;
  sku?: string;
  price?: number;
  stockQuantity: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  category?: Category;
  brand?: Brand;
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  active: boolean;
}

export interface CartItem {
  id: number;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface Cart {
  id: number;
  cartItems: CartItem[];
  totalAmount: number;
}

export interface Wishlist {
  id: number;
  products: Product[];
}

export interface Address {
  id?: number;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  default?: boolean;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'STRIPE' | 'RAZORPAY' | 'PAYPAL' | 'CASH_ON_DELIVERY';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: number;
  product?: Product;
  productName: string;
  variantName?: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  user: User;
  orderItems: OrderItem[];
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface Coupon {
  id: number;
  code: string;
  discountPercentage?: number;
  discountAmount?: number;
  minSpend?: number;
  maxDiscount?: number;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  timesUsed?: number;
  active: boolean;
}

export interface Review {
  id: number;
  product: Product;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  lowStockCount: number;
  pendingOrdersCount: number;
}

export interface SalesReport {
  period: string;
  revenue: number;
  orderCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
