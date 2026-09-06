import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Truck,
  CheckCircle2,
  Tag,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getWhatsAppLink } from '../utils/helpers';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotals,
    settings,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const primaryColor = settings.theme?.primaryColor || '#10b981';

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyPromoCode(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Quick WhatsApp cart inquiry
  const handleWhatsAppCartInquiry = () => {
    if (cart.length === 0) return;
    const itemsList = cart
      .map(
        (item, i) =>
          `${i + 1}. *${item.product.name}* x${item.quantity}${
            item.selectedColor ? ` (${item.selectedColor})` : ''
          } - ${formatCurrency(item.product.price * item.quantity, settings.currencySymbol)}`
      )
      .join('\n');

    const msg = `Hello *${settings.storeName}*, I'd like to place an order for these cart items:
${itemsList}

💰 *Estimated Total:* ${formatCurrency(cartTotals.total, settings.currencySymbol)}
Please assist me with the checkout.`;

    const url = getWhatsAppLink(settings.ownerWhatsAppNumber, msg);
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      <div
        id="cart-drawer-backdrop"
        className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end"
        onClick={() => setIsCartOpen(false)}
      >
        <motion.div
          id="cart-drawer-panel"
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
              <div
                className="p-2 rounded-xl border"
                style={{
                  backgroundColor: `${primaryColor}18`,
                  borderColor: `${primaryColor}40`,
                  color: primaryColor,
                }}
              >
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  Shopping Cart
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{
                      backgroundColor: `${primaryColor}22`,
                      color: primaryColor,
                    }}
                  >
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">Review items before fast checkout</p>
              </div>
            </div>

            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-4 sm:px-5 py-3 bg-slate-950/60 border-b border-slate-800/80">
            {cartTotals.isFreeShipping ? (
              <div
                className="flex items-center gap-2 text-xs font-semibold"
                style={{ color: primaryColor }}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                <span>You unlocked <b>FREE Islandwide Delivery</b>! 🎉</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" style={{ color: primaryColor }} /> Add{' '}
                    <strong style={{ color: primaryColor }}>
                      {formatCurrency(cartTotals.freeShippingRemaining, settings.currencySymbol)}
                    </strong>{' '}
                    more for FREE delivery
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: primaryColor,
                      width: `${Math.min(
                        100,
                        Math.round(
                          ((settings.freeShippingThreshold - cartTotals.freeShippingRemaining) /
                            settings.freeShippingThreshold) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-800/60">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Explore our featured products and discover tech, home essentials, and lifestyle accessories.
                  </p>
                </div>
                <button
                  id="empty-cart-explore-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-950 font-bold text-xs transition-colors shadow-lg active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`}
                  className="pt-3 first:pt-0 flex gap-3.5 group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                          {item.product.name}
                        </h4>
                        <button
                          id={`remove-cart-item-${item.product.id}`}
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                          }
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant tags */}
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
                        {item.selectedColor && (
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300">
                            {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300">
                            {item.selectedSize}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and Quantity Stepper */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-black" style={{ color: primaryColor }}>
                        {formatCurrency(item.product.price * item.quantity, settings.currencySymbol)}
                      </span>

                      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700/80 rounded-lg p-0.5">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 space-y-3 sm:space-y-4">
              {/* Coupon Code Input */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{appliedPromo.code} ({appliedPromo.discountPercent}% OFF)</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-rose-400 hover:underline text-[11px] font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Promo Code (e.g. WELCOME10)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white uppercase placeholder:normal-case placeholder-slate-500 outline-none"
                        />
                        <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                      <button
                        type="submit"
                        disabled={!couponInput.trim()}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-400 px-1">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-200 font-semibold">
                    {formatCurrency(cartTotals.subtotal, settings.currencySymbol)}
                  </span>
                </div>
                {cartTotals.discount > 0 && (
                  <div className="flex justify-between font-semibold" style={{ color: primaryColor }}>
                    <span>Discount</span>
                    <span>-{formatCurrency(cartTotals.discount, settings.currencySymbol)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span>
                    {cartTotals.shipping === 0 ? (
                      <strong className="uppercase" style={{ color: primaryColor }}>FREE</strong>
                    ) : (
                      formatCurrency(cartTotals.shipping, settings.currencySymbol)
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm sm:text-base font-black text-white">
                  <span>Grand Total</span>
                  <span className="font-black" style={{ color: primaryColor }}>
                    {formatCurrency(cartTotals.total, settings.currencySymbol)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  id="checkout-flow-start-btn"
                  onClick={handleCheckoutClick}
                  className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl text-slate-950 font-black text-xs sm:text-sm transition-all shadow-xl active:scale-95"
                  style={{
                    backgroundColor: primaryColor,
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="cart-whatsapp-order-btn"
                  onClick={handleWhatsAppCartInquiry}
                  className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold transition-all"
                  style={{ color: primaryColor }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp directly</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] sm:text-[11px] text-slate-500">
                <button
                  onClick={clearCart}
                  className="hover:text-rose-400 transition-colors"
                >
                  Clear entire cart
                </button>
                <span>Encrypted 256-Bit Checkout</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
