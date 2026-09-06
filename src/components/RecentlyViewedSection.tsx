import React from 'react';
import { History, Trash2, ShoppingBag, Heart, Star, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/helpers';
import { AnimatedSection } from './AnimatedSection';

export const RecentlyViewedSection: React.FC = () => {
  const {
    recentlyViewedIds,
    products,
    settings,
    openProductModal,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setIsCartOpen,
  } = useStore();

  const primaryColor = settings.theme?.primaryColor || '#10b981';

  // Get products matching recently viewed IDs in order
  const recentProducts = recentlyViewedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is typeof products[0] => Boolean(p));

  if (recentProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <AnimatedSection direction="up" delay={0.1}>
        <section
          id="recently-viewed-shelf"
          className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-4 sm:p-6 backdrop-blur-md shadow-xl space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="p-2 rounded-xl border"
                style={{
                  backgroundColor: `${primaryColor}18`,
                  borderColor: `${primaryColor}40`,
                  color: primaryColor,
                }}
              >
                <History className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Recently Viewed Products
                </h3>
                <p className="text-[11px] text-slate-400">
                  Pick up where you left off
                </p>
              </div>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              {recentProducts.length} {recentProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Horizontal scrollable cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {recentProducts.slice(0, 4).map((product) => {
              const isSaved = isWishlisted(product.id);
              return (
                <div
                  key={product.id}
                  className="rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 p-3 flex flex-col justify-between transition-all group"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800 mb-2">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onClick={() => openProductModal(product)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all ${
                          isSaved
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
                        }`}
                        title="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      {product.category}
                    </span>
                    <h4
                      onClick={() => openProductModal(product)}
                      className="text-xs font-semibold text-white truncate cursor-pointer hover:text-emerald-400 transition-colors mt-0.5"
                    >
                      {product.name}
                    </h4>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold block" style={{ color: primaryColor }}>
                        {formatCurrency(product.price, settings.currencySymbol)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product, 1, product.colors?.[0], product.sizes?.[0]);
                        setIsCartOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-950 font-bold transition-all active:scale-95 shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
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
