import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  Heart,
  MessageCircle,
  Plus,
  Minus,
  Sparkles,
  UserCheck,
  Send,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, createWhatsAppProductInquiry } from '../utils/helpers';

export const ProductDetailsModal: React.FC = () => {
  const {
    selectedProduct,
    closeProductModal,
    openProductModal,
    products: allProducts,
    settings,
    addToCart,
    toggleWishlist,
    isWishlisted,
    getProductReviews,
    addReview,
    currentUser,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    selectedProduct?.colors?.[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    selectedProduct?.sizes?.[0]
  );
  const [quantity, setQuantity] = useState(1);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Reset variant selections when selectedProduct changes
  React.useEffect(() => {
    if (selectedProduct) {
      setActiveImageIndex(0);
      setSelectedColor(selectedProduct.colors?.[0]);
      setSelectedSize(selectedProduct.sizes?.[0]);
      setQuantity(1);
      setReviewRating(5);
      setReviewComment('');
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const isSaved = isWishlisted(product.id);
  const isOutOfStock = !product.inStock || product.stock <= 0;
  const reviews = getProductReviews(product.id);
  const whatsappUrl = createWhatsAppProductInquiry(product, settings);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    addReview(
      product.id,
      reviewRating,
      reviewComment.trim(),
      reviewerName.trim() || currentUser?.name || 'Customer'
    );
    setReviewComment('');
    setIsSubmittingReview(false);
  };

  return (
    <AnimatePresence>
      <div
        id="product-details-modal-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        onClick={closeProductModal}
      >
        <motion.div
          id="product-details-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col my-auto"
        >
          {/* Close Button */}
          <button
            id="close-product-modal-btn"
            onClick={closeProductModal}
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-4 xs:p-5 sm:p-8 space-y-6 sm:space-y-8">
            {/* Top Grid: Gallery & Purchase Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column: Image Gallery */}
              <div className="space-y-4">
                {/* Main Large Image */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={
                      (product.images && product.images[activeImageIndex]) ||
                      (product.images && product.images[0]) ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={product.name || 'Product'}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  {discountPercent && (
                    <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                      -{discountPercent}% OFF
                    </span>
                  )}
                  <button
                    id="modal-wishlist-toggle"
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 p-2.5 rounded-full border transition-all ${
                      isSaved
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-700 backdrop-blur-md'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        id={`thumbnail-btn-${idx}`}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all active:scale-95 ${
                          idx === activeImageIndex
                            ? 'border-emerald-500 shadow-md shadow-emerald-500/20 scale-105'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`View ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-slate-400">
                  <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Fast Islandwide</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Verified Quality</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex flex-col items-center gap-1">
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Specs & Purchasing */}
              <div className="flex flex-col justify-between space-y-6">
                <div>
                  {/* Category & SKU */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="uppercase font-semibold tracking-wider text-emerald-400">
                      {product.category}
                    </span>
                    <span>SKU: {product.sku}</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                    {product.name}
                  </h1>

                  {/* Rating & Reviews summary */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(Number(product.rating) || 5)
                              ? 'fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-200">
                      {(Number(product.rating) || 5.0).toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({reviews.length} customer reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-5">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                      {formatCurrency(product.price, settings.currencySymbol)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-slate-500 line-through">
                        {formatCurrency(product.originalPrice, settings.currencySymbol)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-5">
                    {product.description}
                  </p>

                  {/* Color Options if applicable */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-4">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                        Select Color: <span className="text-emerald-400 font-semibold">{selectedColor}</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            id={`color-choice-${color.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              selectedColor === color
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Options if applicable */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-4">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                        Select Size: <span className="text-emerald-400 font-semibold">{selectedSize}</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            id={`size-choice-${size.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => setSelectedSize(size)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              selectedSize === size
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Features Checklist */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-5">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                        Key Highlights
                      </label>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {product.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Quantity & CTA Buttons */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase">Quantity</span>
                    <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl p-1">
                      <button
                        id="qty-decrement-btn"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                      <button
                        id="qty-increment-btn"
                        onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                        disabled={quantity >= product.stock}
                        className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Buttons Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      id="modal-add-cart-btn"
                      onClick={() => {
                        addToCart(product, quantity, selectedColor, selectedSize);
                        closeProductModal();
                      }}
                      disabled={isOutOfStock}
                      className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-extrabold shadow-lg transition-all ${
                        isOutOfStock
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 active:scale-95'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart • {formatCurrency(product.price * quantity, settings.currencySymbol)}</span>
                    </button>

                    <a
                      id="modal-whatsapp-btn"
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 text-sm font-bold transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Customer Reviews & Ratings */}
            <div className="pt-8 border-t border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Customer Reviews
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {reviews.length}
                  </span>
                </h3>
              </div>

              {/* Review Write Form */}
              <form
                onSubmit={handleReviewSubmit}
                className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-4"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Write a Product Review
                </h4>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400 mr-2">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        id={`star-select-${star}`}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder="What did you like about this product? How was the build quality and delivery?"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 outline-none resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReview || !reviewComment.trim()}
                    className="absolute right-3 bottom-3.5 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 rounded-lg text-xs font-bold transition-all"
                  >
                    <Send className="w-3 h-3" /> Post Review
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No reviews yet. Be the first to share your feedback!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-xs">
                            {rev.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                <UserCheck className="w-3 h-3" /> Verified Customer
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? 'fill-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed pl-9">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Related Products / You May Also Like */}
            {(() => {
              const relatedProds = allProducts
                .filter((p) => p.category === product.category && p.id !== product.id)
                .slice(0, 3);

              if (relatedProds.length === 0) return null;

              return (
                <div className="pt-8 border-t border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      You May Also Like
                    </h3>
                    <span className="text-xs text-slate-400">Similar in {product.category}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {relatedProds.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => openProductModal(rel)}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group flex items-center sm:flex-col sm:items-start gap-3"
                      >
                        <img
                          src={rel.images[0]}
                          alt={rel.name}
                          className="w-14 h-14 sm:w-full sm:aspect-square rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                            {rel.name}
                          </h4>
                          <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                            {formatCurrency(rel.price, settings.currencySymbol)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
