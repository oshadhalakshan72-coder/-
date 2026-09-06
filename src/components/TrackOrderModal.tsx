import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getWhatsAppLink } from '../utils/helpers';
import { Order, OrderStatus } from '../types';

export const TrackOrderModal: React.FC = () => {
  const {
    isTrackOrderOpen,
    setIsTrackOrderOpen,
    trackingQuery,
    setTrackingQuery,
    orders,
    settings,
  } = useStore();

  const [inputQuery, setInputQuery] = useState(trackingQuery);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const primaryColor = settings.theme?.primaryColor || '#10b981';

  // Sync initial query if opened with one
  React.useEffect(() => {
    if (trackingQuery.trim()) {
      setInputQuery(trackingQuery);
      performSearch(trackingQuery);
    }
  }, [trackingQuery]);

  if (!isTrackOrderOpen) return null;

  const performSearch = (queryStr: string) => {
    const q = queryStr.trim().toLowerCase();
    if (!q) {
      setSearchedOrder(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    const found = orders.find((o) => {
      const orderNumMatch = o.orderNumber.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
      const phoneMatch = o.customerPhone.replace(/\D/g, '').includes(q.replace(/\D/g, '')) && q.replace(/\D/g, '').length >= 7;
      const trackingMatch = o.trackingNumber?.toLowerCase().includes(q);
      return orderNumMatch || phoneMatch || trackingMatch;
    });

    setSearchedOrder(found || null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(inputQuery);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Status timeline steps
  const steps: { key: OrderStatus; label: string; description: string }[] = [
    {
      key: 'pending',
      label: 'Order Placed',
      description: 'Order registered in our system.',
    },
    {
      key: 'processing',
      label: 'Processing & Packed',
      description: 'Verified, item boxed with tamper-proof seal.',
    },
    {
      key: 'shipped',
      label: 'Dispatched with Courier',
      description: 'Handed over to courier express partner.',
    },
    {
      key: 'delivered',
      label: 'Delivered',
      description: 'Successfully received and confirmed.',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const activeStepIdx = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  return (
    <AnimatePresence>
      <div
        id="track-order-modal-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        onClick={() => setIsTrackOrderOpen(false)}
      >
        <motion.div
          id="track-order-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col my-auto"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl border"
                style={{
                  backgroundColor: `${primaryColor}18`,
                  borderColor: `${primaryColor}40`,
                  color: primaryColor,
                }}
              >
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  Track Your Order Live
                </h2>
                <p className="text-[11px] text-slate-400">
                  Islandwide Courier Delivery Tracking (Domex / Koombiyo / Pronto)
                </p>
              </div>
            </div>

            <button
              id="close-track-order-btn"
              onClick={() => setIsTrackOrderOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="track-order-input"
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. AZN-84920) or Phone Number..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-11 pr-28 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 outline-none transition-all shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                id="track-search-btn"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                Track Now
              </button>
            </form>

            {/* Quick Demo Orders Pill List if no query searched */}
            {!hasSearched && orders.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <p className="text-xs font-semibold text-slate-400">Quick Track Recent Orders:</p>
                <div className="flex flex-wrap gap-2">
                  {orders.slice(0, 3).map((ord) => (
                    <button
                      key={ord.id}
                      type="button"
                      onClick={() => {
                        setInputQuery(ord.orderNumber);
                        performSearch(ord.orderNumber);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Package className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{ord.orderNumber}</span>
                      <span className="text-[10px] text-slate-400">({ord.customerName})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Result - Not Found */}
            {hasSearched && !searchedOrder && (
              <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-3xl space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                  <AlertCircle className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-white">No Order Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  We couldn't locate an order matching "<b>{inputQuery}</b>". Please double-check your Order Number or WhatsApp hotline for assistance.
                </p>
                <a
                  href={`https://wa.me/${settings.ownerWhatsAppNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${settings.storeName}, I need help checking the status of my order.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask Support on WhatsApp</span>
                </a>
              </div>
            )}

            {/* Search Result - Order Found */}
            {searchedOrder && (
              <div className="space-y-6">
                {/* Order Meta Header Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Order Number:</span>
                      <span className="font-mono font-bold text-white text-sm">
                        {searchedOrder.orderNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(searchedOrder.orderNumber)}
                        className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                        title="Copy Order ID"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">
                      Placed on {new Date(searchedOrder.createdAt).toLocaleDateString()} at{' '}
                      {new Date(searchedOrder.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col sm:items-end gap-1">
                    <span
                      className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border ${
                        searchedOrder.status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : searchedOrder.status === 'shipped'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : searchedOrder.status === 'processing'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          : searchedOrder.status === 'cancelled'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {searchedOrder.status}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Estimated Delivery: 24 - 48 Hours
                    </span>
                  </div>
                </div>

                {/* Tracking & Courier Partner Info Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Courier Partner
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-200">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      <span>Domex / Koombiyo Express</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Waybill / Tracking No.
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {searchedOrder.trackingNumber || 'TRK-' + searchedOrder.orderNumber.replace(/\D/g, '')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Delivery Destination
                    </span>
                    <span className="font-semibold text-slate-200 truncate block">
                      {searchedOrder.city}, Sri Lanka
                    </span>
                  </div>
                </div>

                {/* Visual Step Progress Tracker */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Shipment Journey
                  </h4>

                  {searchedOrder.status === 'cancelled' ? (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
                      This order was cancelled. Please contact customer support if you need assistance.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {steps.map((step, idx) => {
                        const isDone = idx <= activeStepIdx;
                        const isCurrent = idx === activeStepIdx;
                        return (
                          <div key={step.key} className="flex items-start gap-3 relative">
                            {/* Connector line */}
                            {idx < steps.length - 1 && (
                              <div
                                className={`absolute left-3.5 top-7 bottom-0 w-0.5 -mb-4 ${
                                  idx < activeStepIdx ? 'bg-emerald-500' : 'bg-slate-800'
                                }`}
                              />
                            )}

                            {/* Step icon dot */}
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                isDone
                                  ? 'bg-emerald-500 text-slate-950 font-bold'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Clock className="w-3.5 h-3.5" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-bold ${
                                    isCurrent
                                      ? 'text-emerald-400 font-extrabold'
                                      : isDone
                                      ? 'text-white'
                                      : 'text-slate-500'
                                  }`}
                                >
                                  {step.label}
                                </span>
                                {isCurrent && (
                                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30 font-bold uppercase animate-pulse">
                                    Current Status
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Ordered Items Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-3">
                  <div className="flex items-center justify-between font-bold text-slate-300 border-b border-slate-800/80 pb-2">
                    <span>Ordered Package Items ({searchedOrder.items.length})</span>
                    <span className="text-emerald-400 font-bold">
                      Total: {formatCurrency(searchedOrder.total, settings.currencySymbol)}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {searchedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-300 text-[11px]">
                        <span className="truncate max-w-[260px]">
                          {item.quantity}x {item.productName}
                          {item.selectedColor && ` (${item.selectedColor})`}
                          {item.selectedSize && ` [${item.selectedSize}]`}
                        </span>
                        <span className="font-semibold text-slate-200">
                          {formatCurrency(item.price * item.quantity, settings.currencySymbol)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address & Contact */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Recipient Address
                  </span>
                  <p className="text-slate-200 font-medium flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {searchedOrder.customerName}, {searchedOrder.deliveryAddress}, {searchedOrder.city}{' '}
                      {searchedOrder.postalCode}
                    </span>
                  </p>
                  <p className="text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Contact: {searchedOrder.customerPhone}</span>
                  </p>
                </div>

                {/* Live Support Link */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <a
                    href={`https://wa.me/${settings.ownerWhatsAppNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${settings.storeName}, I am inquiring about my order ${searchedOrder.orderNumber}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Dispatch on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setInputQuery('');
                      setSearchedOrder(null);
                      setHasSearched(false);
                    }}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Track another package
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
