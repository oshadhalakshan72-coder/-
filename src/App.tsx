import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { FlashSaleSection } from './components/FlashSaleSection';
import { ProductFilters } from './components/ProductFilters';
import { ProductCard } from './components/ProductCard';
import { RecentlyViewedSection } from './components/RecentlyViewedSection';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { TrackOrderModal } from './components/TrackOrderModal';
import { PolicyModal } from './components/PolicyModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { UserAccountModal } from './components/UserAccountModal';
import { AdminPasscodeModal } from './components/AdminPasscodeModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AnimatedSection } from './components/AnimatedSection';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  RotateCcw,
  Zap,
  ShieldCheck,
  Truck,
  MessageCircle,
  Search,
  Sparkles,
  Headphones,
  CreditCard,
  Plus,
} from 'lucide-react';

const StorefrontContent: React.FC = () => {
  const { filteredProducts, resetFilters, settings, products, setViewMode, setAdminTab } = useStore();
  const primaryColor = settings.theme?.primaryColor || '#10b981';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Image Slider */}
      <HeroSlider />

      {/* Flash Sale / Mega Deals Countdown Bar */}
      <FlashSaleSection />

      {/* Trust & Guarantee Perks Bar */}
      <div className="max-w-7xl mx-auto px-2.5 xs:px-3 sm:px-6 lg:px-8">
        <AnimatedSection direction="up" delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl min-w-0">
              <div
                className="p-1.5 sm:p-2 rounded-xl shrink-0"
                style={{
                  backgroundColor: `${primaryColor}18`,
                  color: primaryColor,
                }}
              >
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-bold text-white truncate">Islandwide Express</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">24-48h Delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl min-w-0">
              <div
                className="p-1.5 sm:p-2 rounded-xl shrink-0"
                style={{
                  backgroundColor: `${primaryColor}18`,
                  color: primaryColor,
                }}
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-bold text-white truncate">WhatsApp Orders</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Instant Confirmation</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl min-w-0">
              <div
                className="p-1.5 sm:p-2 rounded-xl shrink-0"
                style={{
                  backgroundColor: `${primaryColor}18`,
                  color: primaryColor,
                }}
              >
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-bold text-white truncate">100% Genuine</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Official Warranty</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl min-w-0">
              <div
                className="p-1.5 sm:p-2 rounded-xl shrink-0"
                style={{
                  backgroundColor: `${primaryColor}18`,
                  color: primaryColor,
                }}
              >
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-bold text-white truncate">Cash On Delivery</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Pay Upon Receiving</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Main Catalog & Filter Section */}
      <main
        id="products-showcase-section"
        className="max-w-7xl mx-auto px-2.5 xs:px-3 sm:px-6 lg:px-8 py-2 sm:py-4"
      >
        {/* Filter Controls with Scroll Animation */}
        <AnimatedSection direction="up" delay={0.15}>
          <ProductFilters />
        </AnimatedSection>

        {/* Products Grid or Empty State */}
        {products.length === 0 ? (
          <AnimatedSection direction="none" delay={0.1}>
            <div
              id="empty-store-state"
              className="p-8 sm:p-14 text-center bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl my-6 relative overflow-hidden"
            >
              <div
                className="w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto shadow-lg"
                style={{
                  backgroundColor: `${primaryColor}18`,
                  borderColor: `${primaryColor}40`,
                  color: primaryColor,
                }}
              >
                <Sparkles className="w-8 h-8 stroke-[1.75]" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Store Catalog is Refreshed & Ready
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Dummy products have been removed. Open the Admin Dashboard to add your real products, set prices, and upload images.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  id="empty-store-add-btn"
                  onClick={() => {
                    setViewMode('admin');
                    setAdminTab('products');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-slate-950 font-black text-xs transition-all shadow-lg active:scale-95 hover:brightness-110"
                  style={{
                    backgroundColor: primaryColor,
                  }}
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Open Admin Panel & Add Products</span>
                </button>
              </div>
            </div>
          </AnimatedSection>
        ) : filteredProducts.length === 0 ? (
          <AnimatedSection direction="none" delay={0.1}>
            <div
              id="empty-filter-state"
              className="p-8 sm:p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl my-6"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 mx-auto">
                <Search className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">No matching products found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  We couldn't find any products matching your current search or filter combination.
                </p>
              </div>
              <button
                id="empty-state-reset-btn"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-950 font-bold text-xs transition-colors shadow-lg active:scale-95"
                style={{
                  backgroundColor: primaryColor,
                }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear All Filters</span>
              </button>
            </div>
          </AnimatedSection>
        ) : (
          <div
            id="products-grid-list"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 xs:gap-3.5 sm:gap-5"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Recently Viewed Products Shelf */}
        <RecentlyViewedSection />

        {/* Fast Order WhatsApp Banner with Scroll Animation */}
        <AnimatedSection direction="up" delay={0.2}>
          <section
            id="whatsapp-promo-banner"
            className="mt-10 sm:mt-14 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 relative overflow-hidden"
          >
            {/* Ambient background glow */}
            <div
              className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{ backgroundColor: primaryColor }}
            />

            <div className="space-y-2 text-center md:text-left relative z-10">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: `${primaryColor}18`,
                  borderColor: `${primaryColor}40`,
                  color: primaryColor,
                }}
              >
                <Zap className="w-3.5 h-3.5" /> Instant Delivery Support
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white">
                Prefer Ordering via WhatsApp?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Send your preferred product photo or name to our hotline <b>+{settings.ownerWhatsAppNumber}</b>. Our customer representative will confirm stock, arrange cash on delivery, and dispatch your package immediately!
              </p>
            </div>

            <a
              id="banner-whatsapp-cta"
              href={`https://wa.me/${settings.ownerWhatsAppNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                `Hello ${settings.storeName}! I would like to place an order directly on WhatsApp.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3.5 rounded-2xl text-slate-950 font-black text-xs sm:text-sm transition-all shadow-xl hover:scale-105 active:scale-95 relative z-10"
              style={{
                backgroundColor: primaryColor,
              }}
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Chat on WhatsApp (+{settings.ownerWhatsAppNumber})</span>
            </a>
          </section>
        </AnimatedSection>
      </main>

      {/* Footer with Scroll Reveal */}
      <AnimatedSection direction="up" delay={0.1}>
        <Footer />
      </AnimatedSection>
    </div>
  );
};

const MainAppContainer: React.FC = () => {
  const {
    viewMode,
    settings,
    currentUser,
    isAdminPasscodeModalOpen,
    setIsAdminPasscodeModalOpen,
  } = useStore();
  const primaryColor = settings.theme?.primaryColor || '#10b981';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar />

      {/* Conditional View: Storefront vs Admin Dashboard */}
      <div className="flex-1 pb-24 sm:pb-0 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]">
        {viewMode === 'admin' && currentUser?.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <StorefrontContent />
        )}
      </div>

      {/* Mobile App Bottom Bar (Fixed for Smartphones) */}
      <MobileBottomNav />

      {/* Global Interactive Modals & Drawers */}
      <ProductDetailsModal />
      <CartDrawer />
      <WishlistDrawer />
      <TrackOrderModal />
      <PolicyModal />
      <CheckoutModal />
      <AuthModal />
      <UserAccountModal />
      <AdminPasscodeModal
        isOpen={isAdminPasscodeModalOpen}
        onClose={() => setIsAdminPasscodeModalOpen(false)}
      />
      <WhatsAppWidget />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContainer />
    </StoreProvider>
  );
}
