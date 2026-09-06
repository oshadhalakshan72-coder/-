import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getWhatsAppLink } from '../utils/helpers';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    settings,
    setIsCartOpen,
    openProductModal,
    addToast,
  } = useStore();

  const primaryColor = settings.theme?.primaryColor || '#10b981';

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    if (wishlistedProducts.length === 0) return;
    let addedCount = 0;
    wishlistedProducts.forEach((product) => {
      if (product.inStock && product.stock > 0) {
        addToCart(product, 1, product.colors?.[0], product.sizes?.[0]);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      addToast({
        type: 'success',
        title: 'Moved to Cart',
        description: `Added ${addedCount} wishlist items to your shopping cart.`,
      });
      setIsWishlistOpen(false);
      setIsCartOpen(true);
    } else {
      addToast({
        type: 'warning',
        title: 'Out of Stock',
        description: 'Wishlist items are currently unavailable in stock.',
      });
    }
  };

  const handleShareWishlistWhatsApp = () => {
    if (wishlistedProducts.length === 0) return;
    const itemsText = wishlistedProducts
      .map((p, i) => `${i + 1}. *${p.name}* - ${formatCurrency(p.price, settings.currencySymbol)}`)
      .join('\n');

    const msg = `🌟 *My Wishlist on ${settings.storeName}:*\n\n${itemsText}\n\nCheck them out on ${settings.storeName}!`;
    const url = getWhatsAppLink(settings.ownerWhatsAppNumber, msg);
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <div
        id="wishlist-drawer-backdrop"
        className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end"
        onClick={() => setIsWishlistOpen(false)}
      >
        <motion.div
          id="wishlist-drawer-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl text-slate-100"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Heart className="w-5 h-5 fill-rose-500/20" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  My Wishlist
                  <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                    {wishlistedProducts.length}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">Saved items you love</p>
              </div>
            </div>

            <button
              id="close-wishlist-drawer-btn"
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 mx-auto">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your wishlist is empty</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Explore our catalog and tap the heart icon on any product to save it here for later.
                  </p>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs shadow-lg active:scale-95 transition-transform"
                  style={{ backgroundColor: primaryColor }}
                >
                  Start Exploring Products
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlistedProducts.map((product) => {
                  const isOutOfStock = !product.inStock || product.stock <= 0;
                  return (
                    <div
                      key={product.id}
                      className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-3.5 group"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onClick={() => {
                          setIsWishlistOpen(false);
                          openProductModal(product);
                        }}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {product.category}
                        </span>
                        <h4
                          onClick={() => {
                            setIsWishlistOpen(false);
                            openProductModal(product);
                          }}
                          className="text-xs font-semibold text-white truncate cursor-pointer hover:text-emerald-400 transition-colors"
                        >
                          {product.name}
                        </h4>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold" style={{ color: primaryColor }}>
                            {formatCurrency(product.price, settings.currencySymbol)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-slate-500 line-through">
                              {formatCurrency(product.originalPrice, settings.currencySymbol)}
                            </span>
                          )}
                        </div>

                        {/* Stock Badge */}
                        <div className="mt-1">
                          {isOutOfStock ? (
                            <span className="text-[10px] font-bold text-rose-400">Out of Stock</span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-400">In Stock</span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => {
                            addToCart(product, 1, product.colors?.[0], product.sizes?.[0]);
                            setIsWishlistOpen(false);
                            setIsCartOpen(true);
                          }}
                          className="p-2 rounded-xl text-slate-950 font-bold transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                          style={{ backgroundColor: primaryColor }}
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {wishlistedProducts.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/95 space-y-2.5">
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-slate-950 font-black text-xs sm:text-sm transition-all shadow-xl active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All Items to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleShareWishlistWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Share Wishlist via WhatsApp</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
