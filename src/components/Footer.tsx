import React from 'react';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  PhoneCall,
  MessageCircle,
  Mail,
  Heart,
  Sparkles,
  CreditCard,
  Building,
  Banknote,
  Lock,
  HelpCircle,
  FileText,
  ShieldCheck as ShieldIcon,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const {
    settings,
    categories,
    setSelectedCategory,
    viewMode,
    setViewMode,
    setActivePolicyModal,
    setIsTrackOrderOpen,
    currentUser,
  } = useStore();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            type="button"
            onClick={() => setActivePolicyModal('shipping')}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all text-left group"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                Islandwide Express
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Fast 24-48h courier dispatch</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsTrackOrderOpen(true)}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all text-left group"
          >
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                Track Live Order
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time parcel status</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActivePolicyModal('warranty')}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all text-left group"
          >
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                100% Genuine
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Verified products with warranty</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActivePolicyModal('returns')}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all text-left group"
          >
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                Easy Returns
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">7-day replacement guarantee</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand info */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="md" />
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.storeTagline}. Experience effortless shopping with instant WhatsApp order confirmations and prompt doorstep deliveries across Sri Lanka.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={`https://wa.me/${settings.ownerWhatsAppNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-bold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: +{settings.ownerWhatsAppNumber}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Top Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Popular Collections
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(1, 6).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Customer Support & Help
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setIsTrackOrderOpen(true)}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Track Courier Delivery</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('returns')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>7-Day Return & Replacement</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('warranty')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Warranty & Authenticity</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('shipping')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Shipping & Delivery Rates</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('faq')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Frequently Asked Questions (FAQ)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Payment & Security Guarantee */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Payment Methods
            </h4>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
                  <Banknote className="w-3 h-3 text-emerald-400" /> Cash on Delivery
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-emerald-400" /> WhatsApp Direct
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
                  <Building className="w-3 h-3 text-cyan-400" /> Bank Transfer
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-indigo-400" /> Visa / MasterCard
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                All customer transactions and addresses are strictly protected with 256-bit SSL encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Admin Portal Access */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setActivePolicyModal('privacy')}
              className="hover:text-slate-400 transition-colors"
            >
              Privacy Policy & Terms
            </button>
            <span>•</span>
            {/* Admin Dashboard Button - ONLY shown if logged in as Admin */}
            {currentUser?.role === 'admin' && (
              <>
                <span>•</span>
                <button
                  id="footer-admin-portal-btn"
                  onClick={() => {
                    setViewMode(viewMode === 'admin' ? 'store' : 'admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all font-semibold"
                  title="Admin Dashboard"
                >
                  <ShieldIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Dashboard</span>
                </button>
              </>
            )}
            <span className="hidden sm:inline">•</span>
            <p className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by <span className="font-semibold text-slate-300">Digicore Solution</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

