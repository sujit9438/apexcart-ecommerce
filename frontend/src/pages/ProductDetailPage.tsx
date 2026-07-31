import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, MessageSquare, Send } from 'lucide-react';
import api from '../services/api';
import { Product, Review, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        const p: Product = res.data.data;
        setProduct(p);
        setSelectedImage(p.images?.[0]?.imageUrl || 'https://via.placeholder.com/600');
        if (p.variants && p.variants.length > 0) {
          setSelectedVariant(p.variants[0]);
        }

        // Reviews & Related
        const [revRes, relRes] = await Promise.all([
          api.get(`/reviews/product/${id}`),
          api.get(`/products?categoryId=${p.category?.id || 1}&size=4`),
        ]);
        setReviews(revRes.data.data || []);
        setRelatedProducts((relRes.data.data?.content || []).filter((item: Product) => item.id !== p.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please login to write a review', 'info');
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await api.post('/reviews', {
        productId: Number(id),
        rating: newRating,
        comment: newComment,
      });
      setReviews((prev) => [res.data.data, ...prev]);
      setNewComment('');
      showToast('Review submitted successfully!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-indigo-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const currentPrice = selectedVariant?.price || product.discountPrice || product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Product Detail Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery Column */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-lg'
                  : 'bg-slate-900/70 border border-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnail list */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 bg-slate-950 transition-all ${
                    selectedImage === img.imageUrl ? 'border-indigo-500 shadow-lg' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Meta Column */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">
              <span>{product.brand?.name || 'Enterprise'}</span>
              <span>•</span>
              <span>{product.category?.name}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{product.name}</h1>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating || 4.9}</span>
              </div>
              <span className="text-slate-500 text-sm">({product.reviewCount} Reviews)</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-emerald-400 font-bold">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-3xl font-black text-emerald-400">${Number(currentPrice).toFixed(2)}</span>
            {product.discountPrice && (
              <span className="text-lg text-slate-500 line-through">${Number(product.price).toFixed(2)}</span>
            )}
            {product.discountPrice && (
              <span className="ml-auto bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs px-2.5 py-1 rounded-full">
                Save ${(Number(product.price) - Number(product.discountPrice)).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">{product.description}</p>

          {/* Variants Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Select Option:</label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      selectedVariant?.id === v.id
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center border border-slate-800 rounded-xl bg-slate-900 overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2.5 text-slate-400 hover:text-white font-bold"
              >
                -
              </button>
              <span className="px-4 py-2.5 text-white font-bold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2.5 text-slate-400 hover:text-white font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={() => addToCart(product.id, quantity, selectedVariant?.id)}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              Add To Shopping Cart
            </button>
          </div>

          {/* Trust Guarantee Icons */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/60 text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-400" />
              <span>Fast Express Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authentic Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>30 Days Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Feedback Section */}
      <div className="border-t border-slate-800 pt-12 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-400" /> Customer Reviews ({reviews.length})
          </h3>
        </div>

        {/* Submit Review Box */}
        {isAuthenticated ? (
          <form onSubmit={handleReviewSubmit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white">Write a Verified Review</h4>
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-400 uppercase">Rating:</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'text-amber-400 fill-current' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share details of your experience with this product..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Review
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-sm text-slate-400">
            Please <Link to="/login" className="text-indigo-400 font-bold underline">Login</Link> to post a review.
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {r.user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-bold text-white">{r.user?.fullName || 'Verified Buyer'}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-slate-300 text-sm pl-10">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-800 pt-12 space-y-6">
          <h3 className="text-2xl font-black text-white">You Might Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
