import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  Zap,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Heart,
  Eye,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/helpers';
import { AnimatedSection } from './AnimatedSection';

export const FlashSaleSection: React.FC = () => {
  const {
    products,
    settings,
    addToCart,
    openProductModal,
    toggleWishlist,
    isWishlisted,
    setIsCartOpen,
  } = useStore();

  const primaryColor = settings.theme?.primaryColor || '#10b981';

  // Flash Sale 24h cycle countdown
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter top discounted products
  const dealProducts = products
    .filter((p) => p.originalPrice && p.originalPrice > p.price && p.inStock)
    .slice(0, 4);

  if (dealProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <AnimatedSection direction="up" delay={0.1}>
        <section
          id="flash-sale-container"
          className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-4 sm:p-7 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Background glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Section Header with Countdown Timer */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-slate-950 shadow-lg shadow-amber-500/20 shrink-0">
                <Flame className="w-5 h-5 fill-current animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Flash Deals & Mega Sale
                  </h2>
                  <span className="bg-rose-500 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                    LIVE NOW
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Exclusive limited-time price drops with islandwide express dispatch
                </p>
              </div>
            </div>

            {/* Countdown Clock Badges */}
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-2xl shadow-inner shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mr-1">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Ends In:</span>
              </div>
              <div className="flex items-center gap-1 text-center font-mono">
                <div className="bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-white font-bold text-xs min-w-[28px]">
                  {String(timeLeft.hours).padStart(2, '0')}
                  <span className="text-[9px] text-slate-400 block -mt-1 font-sans">h</span>
                </div>
                <span className="text-amber-400 font-bold">:</span>
                <div className="bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-white font-bold text-xs min-w-[28px]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                  <span className="text-[9px] text-slate-400 block -mt-1 font-sans">m</span>
                </div>
                <span className="text-amber-400 font-bold">:</span>
                <div className="bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-amber-300 font-bold text-xs min-w-[28px]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                  <span className="text-[9px] text-slate-400 block -mt-1 font-sans">s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flash Deals Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-5 relative z-10">
            {dealProducts.map((product) => {
              const isSaved = isWishlisted(product.id);
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 p-3 sm:p-4 flex flex-col justify-between transition-all group hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 mb-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onClick={() => openProductModal(product)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        referrerPolicy="no-referrer"
                      />

                      {/* Discount Badge */}
                      <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider shadow-md">
                        -{discount}% OFF
                      </span>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-2 right-2 p-2 rounded-xl transition-all ${
                          isSaved
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
                        }`}
                        title="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Category & Title */}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => openProductModal(product)}
                      className="text-xs sm:text-sm font-bold text-white line-clamp-2 cursor-pointer hover:text-emerald-400 transition-colors mt-0.5"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {/* Price Line */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm sm:text-base font-black" style={{ color: primaryColor }}>
                        {formatCurrency(product.price, settings.currencySymbol)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          {formatCurrency(product.originalPrice, settings.currencySymbol)}
                        </span>
                      )}
                    </div>

                    {/* Stock Meter Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 font-semibold text-amber-400">
                          <Zap className="w-3 h-3" /> Claimed: 84%
                        </span>
                        <span className="text-slate-500 font-medium">Only 4 left</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full w-[84%]" />
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product, 1, product.colors?.[0], product.sizes?.[0]);
                        setIsCartOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 hover:brightness-110"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Claim Deal</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};
