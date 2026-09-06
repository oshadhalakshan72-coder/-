import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Package,
  Heart,
  User as UserIcon,
  LogOut,
  ExternalLink,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  Trash2,
  ShoppingBag,
  LayoutDashboard,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getWhatsAppLink } from '../utils/helpers';

export const UserAccountModal: React.FC = () => {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    currentUser,
    logout,
    orders,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    settings,
    setViewMode,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  if (!isAccountModalOpen || !currentUser) return null;

  // Filter user's orders (or match by email/phone or show all recent for demo)
  const userOrders = orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      o.customerName.toLowerCase() === currentUser.name.toLowerCase() ||
      orders.length <= 4 // show store recent if customer created one
  );

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
            <Truck className="w-3 h-3" /> Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
            Pending Confirmation
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      <div
        id="account-modal-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        onClick={() => setIsAccountModalOpen(false)}
      >
        <motion.div
          id="account-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col my-auto"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-500/20">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-tight">
                  {currentUser.name}
                </h2>
                <p className="text-xs text-slate-400">{currentUser.email}</p>
              </div>
            </div>

            <button
              id="close-account-modal-btn"
              onClick={() => setIsAccountModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-2 border-b border-slate-800/80 bg-slate-950/40 text-xs font-bold overflow-x-auto no-scrollbar whitespace-nowrap">
            <button
              id="account-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 sm:gap-2 py-3 px-2.5 sm:px-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-emerald-400 text-emerald-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>My Orders ({userOrders.length})</span>
            </button>

            <button
              id="account-tab-wishlist"
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-1.5 sm:gap-2 py-3 px-2.5 sm:px-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'wishlist'
                  ? 'border-emerald-400 text-emerald-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="w-4 h-4 shrink-0" />
              <span>Wishlist ({wishlistedProducts.length})</span>
            </button>

            <button
              id="account-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 sm:gap-2 py-3 px-2.5 sm:px-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-emerald-400 text-emerald-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserIcon className="w-4 h-4 shrink-0" />
              <span>Profile & Address</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Package className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-slate-300">No orders placed yet</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Your completed purchases and dispatch tracking will show up right here.
                    </p>
                  </div>
                ) : (
                  userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-sm"
                    >
                      {/* Order Top Line */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white">
                              {order.orderNumber}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Total Amount</span>
                          <span className="text-sm sm:text-base font-black text-emerald-400">
                            {formatCurrency(order.total, settings.currencySymbol)}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-200 truncate">
                                {item.productName}
                              </p>
                              <span className="text-[11px] text-slate-400">
                                Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                              </span>
                            </div>
                            <span className="font-bold text-slate-200">
                              {formatCurrency(item.price * item.quantity, settings.currencySymbol)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery & WhatsApp Inquire */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="text-slate-400">
                          <span>Address: </span>
                          <span className="text-slate-200">{order.deliveryAddress}, {order.city}</span>
                          {order.trackingNumber && (
                            <span className="block text-emerald-400 font-mono mt-0.5">
                              Tracking Code: {order.trackingNumber}
                            </span>
                          )}
                        </div>

                        <a
                          href={getWhatsAppLink(
                            settings.ownerWhatsAppNumber,
                            `Hello *${settings.storeName}*, I'm inquiring about my order *${order.orderNumber}*. Could you please update me on the delivery status?`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Status Support</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-3">
                {wishlistedProducts.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Heart className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-slate-300">Your wishlist is empty</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Tap the heart icon on any product to save items for future purchases.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wishlistedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex gap-3 items-center group"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                            {prod.name}
                          </h4>
                          <span className="text-xs font-black text-emerald-400 block mt-0.5">
                            {formatCurrency(prod.price, settings.currencySymbol)}
                          </span>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => addToCart(prod, 1)}
                              className="px-2.5 py-1 bg-emerald-500 text-slate-950 rounded-lg text-[11px] font-bold hover:bg-emerald-400 transition-colors"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => toggleWishlist(prod.id)}
                              className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-1">Name</span>
                    <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-1">Email</span>
                    <p className="text-sm font-semibold text-white">{currentUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-1">
                      Phone Number
                    </span>
                    <p className="text-sm font-semibold text-white">
                      {currentUser.phone || '+94 77 123 4567'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase block mb-1">
                      Default City
                    </span>
                    <p className="text-sm font-semibold text-white">
                      {currentUser.city || 'Colombo'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center gap-2">
                  <button
                    onClick={() => {
                      logout();
                      setIsAccountModalOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      id="account-modal-open-admin-btn"
                      onClick={() => {
                        setIsAccountModalOpen(false);
                        setViewMode('admin');
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
