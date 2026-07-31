import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700/80 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Tag */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
            {discountPercent}% OFF
          </span>
        )}

        {/* Stock Alert */}
        {product.stockQuantity < 5 && product.stockQuantity > 0 && (
          <span className="absolute top-3 right-12 bg-amber-500/90 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            Only {product.stockQuantity} left
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{product.category?.name || 'Catalog'}</span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating || 4.8}</span>
              <span className="text-slate-500">({product.reviewCount || 12})</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-emerald-400">
                ${product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ${product.price}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product.id, 1)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
