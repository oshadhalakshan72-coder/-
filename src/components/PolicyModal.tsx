import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RotateCcw,
  ShieldCheck,
  Truck,
  HelpCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/helpers';

export const PolicyModal: React.FC = () => {
  const { activePolicyModal, setActivePolicyModal, settings } = useStore();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const primaryColor = settings.theme?.primaryColor || '#10b981';

  if (!activePolicyModal) return null;

  const faqs = [
    {
      q: 'How do I place an order on AZON LANKA?',
      a: 'You can add items to your cart and checkout directly on the website with Cash on Delivery (COD), Card, or Bank Transfer, or click the "WhatsApp Order" button on any product to order instantly with a support representative.',
    },
    {
      q: 'What are the delivery rates and timeframes in Sri Lanka?',
      a: `We offer fast islandwide delivery via Domex, Koombiyo Express, and Pronto. Orders within Colombo & Western Province arrive in 24-48 hours. Outstation areas arrive in 2-4 business days. Standard delivery is ${formatCurrency(settings.standardDeliveryFee, settings.currencySymbol)} and FREE for orders over ${formatCurrency(settings.freeShippingThreshold, settings.currencySymbol)}!`,
    },
    {
      q: 'Can I check the package before paying Cash on Delivery?',
      a: 'Yes, all our deliveries are shipped with verified courier partners. You can verify the sealed package and item details upon arrival.',
    },
    {
      q: 'What is your 7-Day Return & Replacement Policy?',
      a: 'If you receive a defective, damaged, or incorrect item, contact our WhatsApp hotline within 7 days of delivery. We will arrange a free exchange or full refund.',
    },
    {
      q: 'Are your tech & electronic items covered by warranty?',
      a: 'Yes, all our electronics, audio gear, and wearables come with official hardware warranties as specified on the product page.',
    },
  ];

  return (
    <AnimatePresence>
      <div
        id="policy-modal-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        onClick={() => setActivePolicyModal(null)}
      >
        <motion.div
          id="policy-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col my-auto"
        >
          {/* Header */}
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
                {activePolicyModal === 'returns' && <RotateCcw className="w-5 h-5" />}
                {activePolicyModal === 'warranty' && <ShieldCheck className="w-5 h-5" />}
                {activePolicyModal === 'shipping' && <Truck className="w-5 h-5" />}
                {activePolicyModal === 'faq' && <HelpCircle className="w-5 h-5" />}
                {activePolicyModal === 'privacy' && <FileText className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {activePolicyModal === 'returns' && '7-Day Return & Replacement Policy'}
                  {activePolicyModal === 'warranty' && 'Official Warranty & Authenticity Guarantee'}
                  {activePolicyModal === 'shipping' && 'Islandwide Delivery & Shipping Policy'}
                  {activePolicyModal === 'faq' && 'Frequently Asked Questions (FAQ)'}
                  {activePolicyModal === 'privacy' && 'Privacy Policy & Terms of Service'}
                </h2>
                <p className="text-[11px] text-slate-400">{settings.storeName} Customer Assurance</p>
              </div>
            </div>

            <button
              onClick={() => setActivePolicyModal(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {/* 1. RETURNS POLICY */}
            {activePolicyModal === 'returns' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-slate-200 space-y-1">
                  <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Hassle-Free 7-Day Replacement Guarantee
                  </h4>
                  <p className="text-xs text-slate-300">
                    We want you to be 100% satisfied with every purchase at {settings.storeName}.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Eligible Conditions for Return / Exchange:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300 text-xs">
                    <li>Product received in physically damaged or non-functional condition.</li>
                    <li>Incorrect product, model, size, or color dispatched by mistake.</li>
                    <li>Missing accessories, parts, or manuals listed in the original box.</li>
                    <li>Items must be in original packaging with intact security seals.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    How to initiate a return:
                  </h4>
                  <p className="text-xs">
                    Simply take a clear photo or short video of the package and item, then message our WhatsApp hotline at <b>+{settings.ownerWhatsAppNumber}</b> with your Order ID. Our dispatch team will arrange a free exchange courier within 48 hours.
                  </p>
                </div>
              </div>
            )}

            {/* 2. WARRANTY POLICY */}
            {activePolicyModal === 'warranty' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-slate-200 space-y-1">
                  <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    100% Genuine Products with Official Warranty
                  </h4>
                  <p className="text-xs text-slate-300">
                    All tech gear and electronics are directly sourced from authorized distributors.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Warranty Coverage:
                  </h4>
                  <p className="text-xs text-slate-300">
                    • <b>6 to 12 Months Hardware Warranty</b> on headphones, smartwatches, speakers, and chargers against manufacturing defects.
                    <br />
                    • Free diagnosis and replacement for internal component defects during the active warranty period.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                  <b>Note:</b> Physical damage, water damage (unless IP-certified), or unauthorized tampering is not covered under manufacturer warranty.
                </div>
              </div>
            )}

            {/* 3. SHIPPING & DELIVERY */}
            {activePolicyModal === 'shipping' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <h5 className="font-bold text-white text-xs uppercase text-emerald-400">
                      Western Province (Colombo/Gampaha/Kalutara)
                    </h5>
                    <p className="text-xs text-slate-300">
                      • <b>24 to 48 Hours</b> Express Delivery
                      <br />• Delivery Fee: Rs. 350 - 450
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <h5 className="font-bold text-white text-xs uppercase text-cyan-400">
                      Islandwide Outstation
                    </h5>
                    <p className="text-xs text-slate-300">
                      • <b>2 to 4 Business Days</b>
                      <br />• Delivery Fee: Rs. 450 - 550
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-200">
                  <h4 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                    🎉 Free Delivery Benefit:
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    All orders exceeding <b>{formatCurrency(settings.freeShippingThreshold, settings.currencySymbol)}</b> automatically qualify for <b>100% Free Islandwide Express Shipping</b>!
                  </p>
                </div>

                <p className="text-xs text-slate-400">
                  We partner with top Sri Lankan logistics providers: <b>Domex</b>, <b>Koombiyo Express</b>, and <b>Pronto</b>. Live tracking links are provided immediately upon dispatch.
                </p>
              </div>
            )}

            {/* 4. FAQ */}
            {activePolicyModal === 'faq' && (
              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-slate-800/80 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 5. PRIVACY & TERMS */}
            {activePolicyModal === 'privacy' && (
              <div className="space-y-3 text-xs">
                <p>
                  At <b>{settings.storeName}</b>, we respect your personal privacy. Customer phone numbers, delivery addresses, and order details are strictly protected and used exclusively to process and fulfill your purchases.
                </p>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">
                  Payment Security:
                </h4>
                <p>
                  Online card payments and direct bank transactions are protected with industry-standard 256-bit encryption. We never store credit/debit card numbers on our servers.
                </p>
              </div>
            )}
          </div>

          {/* Footer Contact CTA */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Need further assistance? We are online 24/7.</span>
            </div>
            <a
              href={`https://wa.me/${settings.ownerWhatsAppNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                `Hello ${settings.storeName}, I have a question regarding store policies.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
