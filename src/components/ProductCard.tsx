import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  ShoppingBag,
  Star,
  Eye,
  MessageCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatCurrency, createWhatsAppProductInquiry } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const {
    settings,
    addToCart,
    toggleWishlist,
    isWishlisted,
    openProductModal,
  } = useStore();

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const isSaved = isWishlisted(product.id);
  const isOutOfStock = !product.inStock || product.stock <= 0;
  const isLowStock = product.inStock && product.stock > 0 && product.stock <= 5;

  const whatsappInquiryUrl = createWhatsAppProductInquiry(product, settings);
  const primaryColor = settings.theme?.primaryColor || '#10b981';

  const defaultImg = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
  const displayImg =
    (product.images && product.images[currentImgIndex]) ||
    (product.images && product.images[0]) ||
    defaultImg;

  return (
    <motion.div
      id={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.45,
        delay: Math.min((index % 6) * 0.08, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (product.images && product.images.length > 1) setCurrentImgIndex(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImgIndex(0);
      }}
      className="group relative flex flex-col bg-slate-900 border border-slate-800 rounded-xl xs:rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-slate-700/80 transition-all duration-300 transform-gpu hover:-translate-y-1"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-square w-full bg-slate-950 overflow-hidden cursor-pointer">
        <img
          src={displayImg}
          alt={product.name || 'Product'}
          onClick={() => openProductModal(product)}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = defaultImg;
          }}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="bg-rose-500 text-white text-[9px] xs:text-[10px] sm:text-[11px] font-black px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shadow-md uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-indigo-600 text-white text-[8px] xs:text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md shadow-md uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" /> New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
            isSaved
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-900 backdrop-blur-md border border-white/10'
          }`}
          aria-label={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay Button (Desktop) */}
        <div
          className={`hidden sm:block absolute inset-x-0 bottom-3 px-3 z-10 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={() => openProductModal(product)}
            className="w-full py-2 bg-slate-950/85 hover:bg-slate-900 text-slate-200 hover:text-white backdrop-blur-md rounded-xl text-xs font-bold border border-slate-700/60 flex items-center justify-center gap-1.5 shadow-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Quick Preview
          </button>
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-slate-900 border border-rose-500/40 text-rose-400 font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-xs uppercase tracking-wider shadow-xl">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-2.5 xs:p-3.5 sm:p-5 flex-1 flex flex-col justify-between gap-2 sm:gap-3 text-slate-100">
        <div>
          {/* Category & Stock pill */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
            <span className="text-slate-400 font-medium uppercase tracking-wider truncate max-w-[85px] xs:max-w-[100px]">
              {product.category}
            </span>
            {isLowStock && (
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/20">
                {product.stock} left
              </span>
            )}
            {!isLowStock && !isOutOfStock && (
              <span
                className="text-[9px] sm:text-[10px] font-semibold flex items-center gap-1"
                style={{ color: primaryColor }}
              >
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> In Stock
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3
            id={`product-title-${product.id}`}
            onClick={() => openProductModal(product)}
            className="font-bold text-xs sm:text-base text-slate-100 transition-colors line-clamp-2 cursor-pointer leading-snug hover:underline"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
              <span className="text-[11px] sm:text-xs font-extrabold ml-1 text-slate-200">
                {(Number(product.rating) || 5.0).toFixed(1)}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500">
              ({Number(product.reviewCount) || 0})
            </span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-sm sm:text-lg font-black text-white">
              {formatCurrency(product.price, settings.currencySymbol)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-500 line-through">
                {formatCurrency(product.originalPrice, settings.currencySymbol)}
              </span>
            )}
          </div>

          {/* Action Buttons Grid - stacks on <380px, side-by-side on >=380px and desktop */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2">
            {/* Add to Cart */}
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-black transition-all shadow-md ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'text-slate-950 shadow-md active:scale-95'
              }`}
              style={{
                backgroundColor: isOutOfStock ? undefined : primaryColor,
              }}
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">Add Cart</span>
            </button>

            {/* Instant WhatsApp Order Button */}
            <a
              id={`whatsapp-order-btn-${product.id}`}
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500/50 text-[11px] sm:text-xs font-bold transition-all active:scale-95 shadow-sm"
              title="Order directly on WhatsApp"
            >
              <MessageCircle
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0"
                style={{ color: primaryColor }}
              />
              <span className="truncate">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
