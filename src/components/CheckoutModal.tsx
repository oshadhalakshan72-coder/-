import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CreditCard,
  Banknote,
  Building,
  MessageCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  Copy,
  Check,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, PaymentMethod } from '../types';
import { BrandLogo } from './BrandLogo';
import {
  formatCurrency,
  createWhatsAppOrderMessage,
  getWhatsAppLink,
} from '../utils/helpers';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotals,
    settings,
    currentUser,
    placeOrder,
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Form State
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+94 77 ');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('whatsapp');

  // Simulated Card Info
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !city) return;
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        image: item.product.images[0],
      }));

      const newOrder = placeOrder({
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        deliveryAddress: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        notes: notes.trim(),
        items: orderItems,
        paymentMethod,
        status: 'pending',
      });

      setCompletedOrder(newOrder);
      setIsProcessing(false);
      setStep('confirmation');

      // Auto-open real WhatsApp with the full order message
      try {
        const whatsappMsg = createWhatsAppOrderMessage(newOrder, settings);
        const whatsappUrl = getWhatsAppLink(settings.ownerWhatsAppNumber, whatsappMsg);
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.error('WhatsApp redirect error:', err);
      }

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b'],
        });
      } catch (err) {
        console.error('Confetti error:', err);
      }
    }, 600);
  };

  const handleCopyOrderId = () => {
    if (!completedOrder) return;
    navigator.clipboard.writeText(completedOrder.orderNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('details');
    setCompletedOrder(null);
  };

  return (
    <AnimatePresence>
      <div
        id="checkout-modal-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      >
        <motion.div
          id="checkout-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col my-auto"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  {step === 'confirmation' ? 'Order Placed Successfully!' : 'Fast & Secure Checkout'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {step === 'details' && 'Step 1 of 2: Shipping & Delivery Contact'}
                  {step === 'payment' && 'Step 2 of 2: Select Payment Method & Confirm'}
                  {step === 'confirmation' && 'Your order is recorded and ready for dispatch'}
                </p>
              </div>
            </div>

            <button
              id="close-checkout-btn"
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
            {/* STEP 1: Shipping Details Form */}
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      Full Name *
                    </label>
                    <input
                      id="checkout-name-input"
                      type="text"
                      required
                      placeholder="e.g. Kasun Weerasinghe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      Phone / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <input
                        id="checkout-phone-input"
                        type="tel"
                        required
                        placeholder="+94 77 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                      />
                      <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Email Address (For Confirmation & Tracking)
                  </label>
                  <div className="relative">
                    <input
                      id="checkout-email-input"
                      type="email"
                      placeholder="youremail@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                      Delivery Street Address *
                    </label>
                    <div className="relative">
                      <input
                        id="checkout-address-input"
                        type="text"
                        required
                        placeholder="House / Apartment Number, Street Name"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                      />
                      <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                        City / Town *
                      </label>
                      <input
                        id="checkout-city-input"
                        type="text"
                        required
                        placeholder="Colombo / Kandy / Galle"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                        Postal Code
                      </label>
                      <input
                        id="checkout-postal-input"
                        type="text"
                        placeholder="e.g. 00300"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Order Notes / Delivery Instructions (Optional)
                  </label>
                  <textarea
                    id="checkout-notes-input"
                    rows={2}
                    placeholder="e.g. Please leave package at the gate or call 10 mins before arrival"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none resize-none"
                  />
                </div>

                {/* Items preview */}
                <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-200 mb-2">
                    <span>Order Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                    <span className="text-emerald-400 font-extrabold">
                      Total: {formatCurrency(cartTotals.total, settings.currencySymbol)}
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-400 max-h-24 overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="truncate max-w-[280px]">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span>{formatCurrency(item.product.price * item.quantity, settings.currencySymbol)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  id="checkout-to-payment-btn"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-xl shadow-emerald-500/25 active:scale-95 mt-4"
                >
                  <span>Continue to Payment & Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Payment Method & Placement */}
            {step === 'payment' && (
              <div className="space-y-6">
                {/* Payment Selection Options */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Choose Payment Method
                  </label>

                  {/* Option 1: WhatsApp Direct Order */}
                  <label
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'whatsapp'
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'whatsapp'}
                      onChange={() => setPaymentMethod('whatsapp')}
                      className="mt-1 accent-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-white">
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>Instant WhatsApp Order (Fastest)</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Instantly sends complete order details to {settings.storeName}'s official WhatsApp for rapid confirmation and dispatch.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-white">
                        <Banknote className="w-4 h-4 text-emerald-400" />
                        <span>Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Pay cash directly to the courier agent when your package is delivered safely to your doorstep.
                      </p>
                    </div>
                  </label>

                  {/* Option 3: Direct Bank Deposit */}
                  <label
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 accent-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-white">
                        <Building className="w-4 h-4 text-cyan-400" />
                        <span>Direct Bank Transfer</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Transfer to our Commercial Bank / HNB account and share the deposit slip via WhatsApp.
                      </p>
                    </div>
                  </label>

                  {/* Option 4: Card Payment */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 accent-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-white">
                        <CreditCard className="w-4 h-4 text-indigo-400" />
                        <span>Credit / Debit Card (Visa, MasterCard)</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Simulated secure 256-bit encrypted checkout gateway.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Conditional Card inputs */}
                {paymentMethod === 'card' && (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Card Details
                    </span>
                    <div>
                      <input
                        type="text"
                        placeholder="Card Number (4000 1234 5678 9010)"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                      />
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="CVC / CVV"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Final Order Review Breakdown */}
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Delivering to:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                      {name} ({city})
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(cartTotals.subtotal, settings.currencySymbol)}</span>
                  </div>
                  {cartTotals.discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Promo Discount:</span>
                      <span>-{formatCurrency(cartTotals.discount, settings.currencySymbol)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Islandwide Shipping:</span>
                    <span>
                      {cartTotals.shipping === 0 ? (
                        <strong className="text-emerald-400 uppercase">FREE</strong>
                      ) : (
                        formatCurrency(cartTotals.shipping, settings.currencySymbol)
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-black text-white">
                    <span>Grand Total:</span>
                    <span className="text-emerald-400">
                      {formatCurrency(cartTotals.total, settings.currencySymbol)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-colors border border-slate-700 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    type="button"
                    id="place-order-confirm-btn"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-sm transition-all shadow-xl shadow-emerald-500/25 active:scale-95"
                  >
                    {isProcessing ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          Confirm & Place Order ({formatCurrency(cartTotals.total, settings.currencySymbol)})
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Confirmation & WhatsApp Direct Notification */}
            {step === 'confirmation' && completedOrder && (
              <div className="text-center space-y-6 py-2">
                <div className="flex justify-center">
                  <BrandLogo size="md" />
                </div>

                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-in zoom-in">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Thank You for Your Order!
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    We have successfully received your order. An instant confirmation receipt has been generated.
                  </p>
                </div>

                {/* Order ID Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400">Order ID:</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {completedOrder.orderNumber}
                  </span>
                  <button
                    onClick={handleCopyOrderId}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Copy Order ID"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* WHATSAPP ACTION CARD */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 text-left space-y-3 shadow-xl">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <MessageCircle className="w-5 h-5" />
                    <span>Send Instant WhatsApp Order Alert</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Click the button below to send your itemized order receipt directly to <b>{settings.storeName}</b>'s WhatsApp (+{settings.ownerWhatsAppNumber}) for immediate dispatch tracking!
                  </p>

                  <a
                    id="send-whatsapp-order-btn"
                    href={getWhatsAppLink(
                      settings.ownerWhatsAppNumber,
                      createWhatsAppOrderMessage(completedOrder, settings)
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950" />
                    <span>Send Order to WhatsApp (+{settings.ownerWhatsAppNumber})</span>
                  </a>
                </div>

                {/* Itemized Receipt breakdown */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
                  <span className="font-bold text-slate-200 block mb-2">Order Summary</span>
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-400">
                      <span>
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-semibold text-slate-200">
                        {formatCurrency(item.price * item.quantity, settings.currencySymbol)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                    <span>Total Paid / Due:</span>
                    <span className="text-emerald-400">
                      {formatCurrency(completedOrder.total, settings.currencySymbol)}
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  id="order-success-finish-btn"
                  onClick={handleClose}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors border border-slate-700"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
