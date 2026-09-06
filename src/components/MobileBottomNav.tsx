import React, { useState } from 'react';
import {
  Home,
  Grid,
  Heart,
  ShoppingBag,
  Truck,
  User,
  LogIn,
  Package,
  LayoutDashboard,
  LogOut,
  X,
  Store,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';

export const MobileBottomNav: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    setSelectedCategory,
    setSearchQuery,
    wishlist,
    cartItemCount,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    isTrackOrderOpen,
    setIsTrackOrderOpen,
    currentUser,
    isAuthOpen,
    setIsAuthOpen,
    setAuthMode,
    isAccountModalOpen,
    setIsAccountModalOpen,
    logout,
    settings,
  } = useStore();

  const [isMobileMenuSheetOpen, setIsMobileMenuSheetOpen] = useState(false);

  const primaryColor = settings.theme?.primaryColor || '#10b981';

  // Do not show on admin dashboard
  if (viewMode === 'admin') return null;

  const handleHomeClick = () => {
    setViewMode('store');
    setSelectedCategory('All');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoriesClick = () => {
    setViewMode('store');
    const filterElement =
      document.getElementById('products-showcase-section') ||
      document.getElementById('product-filters-container') ||
      document.getElementById('product-catalog-section');
    if (filterElement) {
      filterElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAccountClick = () => {
    if (currentUser) {
      setIsAccountModalOpen(true);
    } else {
      setAuthMode('login');
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      {/* Mobile Action Sheet for Account / Sign In / Quick Links */}
      <AnimatePresence>
        {isMobileMenuSheetOpen && (
          <div
            id="mobile-account-sheet-backdrop"
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm sm:hidden flex items-end"
            onClick={() => setIsMobileMenuSheetOpen(false)}
          >
            <motion.div
              id="mobile-account-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 pb-8 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">My Account</h3>
                    <p className="text-xs text-slate-400">Sign in to track & manage your orders</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuSheetOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  id="mobile-sheet-signin-btn"
                  onClick={() => {
                    setIsMobileMenuSheetOpen(false);
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                  className="w-full py-3 px-4 rounded-2xl font-bold text-xs text-slate-950 flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>

                <button
                  id="mobile-sheet-signup-btn"
                  onClick={() => {
                    setIsMobileMenuSheetOpen(false);
                    setAuthMode('register');
                    setIsAuthOpen(true);
                  }}
                  className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span>Create Account</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <button
                  onClick={() => {
                    setIsMobileMenuSheetOpen(false);
                    setIsTrackOrderOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left text-xs font-semibold text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Track Order Delivery Live</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">Check courier ID</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuSheetOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-left text-xs font-semibold text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>My Wishlist</span>
                  </div>
                  <span className="text-[10px] text-rose-400 font-bold">{wishlist.length} items</span>
                </button>

                {/* Direct Mobile Admin Portal Button - ONLY if already logged in as Admin */}
                {currentUser?.role === 'admin' && (
                  <button
                    id="mobile-sheet-admin-portal-btn"
                    onClick={() => {
                      setIsMobileMenuSheetOpen(false);
                      setViewMode('admin');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-left text-xs font-semibold text-amber-300 border border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4 text-amber-400" />
                      <span>Admin Dashboard</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">Dashboard</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Bottom Nav */}
      <nav
        id="mobile-bottom-nav"
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 sm:hidden pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center justify-around h-16 px-1">
          {/* Home */}
          <button
            type="button"
            id="mobile-nav-home"
            onClick={handleHomeClick}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-400 hover:text-white transition-colors group relative"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-semibold mt-1 tracking-tight">Home</span>
          </button>

          {/* Categories / Catalog */}
          <button
            type="button"
            id="mobile-nav-categories"
            onClick={handleCategoriesClick}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-400 hover:text-white transition-colors group relative"
          >
            <Grid className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-semibold mt-1 tracking-tight">Catalog</span>
          </button>

          {/* Track Order */}
          <button
            type="button"
            id="mobile-nav-track"
            onClick={() => setIsTrackOrderOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors group relative ${
              isTrackOrderOpen ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <Truck className="w-5 h-5 group-hover:scale-110 transition-transform text-emerald-400" />
            <span className="text-[10px] font-semibold mt-1 tracking-tight text-emerald-400">Track</span>
          </button>

          {/* Cart */}
          <button
            type="button"
            id="mobile-nav-cart"
            onClick={() => setIsCartOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors group relative ${
              isCartOpen ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full font-black text-[9px] flex items-center justify-center text-slate-950 shadow-md animate-bounce"
                  style={{ backgroundColor: primaryColor }}
                >
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold mt-1 tracking-tight">Cart</span>
          </button>

          {/* Account / Sign In */}
          <button
            type="button"
            id="mobile-nav-account"
            onClick={handleAccountClick}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors group relative ${
              isAccountModalOpen || isAuthOpen ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              {currentUser ? (
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
            </div>
            <span className="text-[10px] font-semibold mt-1 tracking-tight">
              {currentUser ? 'Account' : 'Sign In'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
