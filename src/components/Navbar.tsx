import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  LayoutDashboard,
  Store,
  X,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Package,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/helpers';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const {
    settings,
    cartItemCount,
    wishlist,
    currentUser,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    products,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    isTrackOrderOpen,
    setIsTrackOrderOpen,
    setIsAuthOpen,
    setAuthMode,
    setIsAccountModalOpen,
    openProductModal,
    viewMode,
    setViewMode,
    logout,
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const primaryColor = settings.theme?.primaryColor || '#10b981';

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick live search suggestions
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 5);
  }, [products, searchQuery]);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-all shadow-md">
      {/* Top Announcement Bar */}
      {settings.showAnnouncement && settings.announcementText && (
        <div
          id="announcement-banner"
          className="px-3 sm:px-4 py-1.5 text-xs font-medium text-white flex items-center justify-between"
          style={{
            background: `linear-gradient(90deg, ${primaryColor}dd 0%, #0d9488 50%, #4f46e5 100%)`,
          }}
        >
          <div className="flex-1 text-center truncate px-2 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber-200" />
            <span className="truncate text-[11px] sm:text-xs">{settings.announcementText}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-normal opacity-90 shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine
            </span>
            <a
              href={`https://wa.me/${settings.ownerWhatsAppNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 text-white font-semibold"
            >
              <PhoneCall className="w-3 h-3" /> WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              id="brand-logo-btn"
              onClick={() => {
                setViewMode('store');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="group flex items-center gap-2 text-left focus:outline-none transition-transform active:scale-95"
            >
              <BrandLogo size="md" />
            </button>
          </div>

          {/* Desktop & Tablet Search Bar */}
          <div
            ref={searchContainerRef}
            className="relative flex-1 max-w-xl mx-auto hidden sm:block"
          >
            <div className="relative">
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search products, categories, brands..."
                className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-900 text-sm text-slate-100 placeholder-slate-400 rounded-full pl-10 pr-9 py-2 border border-slate-700 focus:border-emerald-500 outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-white rounded-full absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div
                id="search-suggestions-dropdown"
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
              >
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-800">
                  Quick Matching Products
                </div>
                <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
                  {searchSuggestions.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => {
                        openProductModal(prod);
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-left flex items-center gap-3 p-2.5 hover:bg-slate-800/80 rounded-xl transition-colors group"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 truncate transition-colors">
                          {prod.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                            {prod.category}
                          </span>
                          <span className="font-semibold" style={{ color: primaryColor }}>
                            {formatCurrency(prod.price, settings.currencySymbol)}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              id="mobile-search-toggle-btn"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="sm:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="Toggle Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Admin Dashboard Button - ONLY shown when currentUser is an authenticated admin */}
            {currentUser?.role === 'admin' && (
              <button
                id="admin-portal-toggle-btn"
                onClick={() => {
                  setViewMode(viewMode === 'admin' ? 'store' : 'admin');
                }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  viewMode === 'admin'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600'
                }`}
                title={viewMode === 'admin' ? 'Back to Storefront' : 'Open Admin Dashboard'}
              >
                {viewMode === 'admin' ? (
                  <>
                    <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden md:inline">Storefront</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                    <span className="hidden md:inline">Admin Dashboard</span>
                  </>
                )}
              </button>
            )}

            {/* Track Order Button (Visible on sm/desktop, mobile has it in bottom nav) */}
            <button
              id="track-order-btn"
              onClick={() => setIsTrackOrderOpen(true)}
              className="hidden sm:flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/60 text-xs font-semibold"
              title="Track Courier Delivery Live"
              aria-label="Track Order Live"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Track Order</span>
            </button>

            {/* Wishlist Button (Visible on sm/desktop, mobile has it in bottom nav/menu) */}
            <button
              id="wishlist-btn"
              onClick={() => setIsWishlistOpen(true)}
              className="hidden sm:flex relative p-2 sm:p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-rose-400 transition-colors border border-slate-700/60"
              aria-label="Wishlist"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span
                  id="wishlist-count-badge"
                  className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900"
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger - Fully visible & responsive on mobile */}
            <button
              id="cart-drawer-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-slate-950 font-bold transition-all shadow-md active:scale-95 shrink-0"
              style={{
                backgroundColor: primaryColor,
              }}
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide">
                Cart
              </span>
              {cartItemCount > 0 && (
                <span
                  id="cart-count-badge"
                  className="bg-slate-950 text-white text-[10px] sm:text-xs font-black px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full border border-white/20"
                >
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Dropdown - Fully visible & responsive on mobile */}
            <div ref={userMenuRef} className="relative shrink-0">
              {currentUser ? (
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-all text-xs font-medium active:scale-95"
                >
                  <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-200 font-semibold max-w-[50px] sm:max-w-[80px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              ) : (
                <button
                  id="login-modal-open-btn"
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold transition-all active:scale-95 shadow-sm"
                >
                  <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: primaryColor }} />
                  <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">Sign In</span>
                </button>
              )}

              {/* User Dropdown menu */}
              {isUserMenuOpen && currentUser && (
                <div
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5"
                >
                  <div className="px-3 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {currentUser.role === 'admin' ? 'Store Administrator' : 'Verified Buyer'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      id="menu-my-orders-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsAccountModalOpen(true);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                    >
                      <Package className="w-4 h-4" style={{ color: primaryColor }} />
                      My Orders
                    </button>
                    <button
                      id="menu-track-orders-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsTrackOrderOpen(true);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                    >
                      <Truck className="w-4 h-4 text-emerald-400" />
                      Track Live Delivery
                    </button>
                    <button
                      id="menu-wishlist-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsWishlistOpen(true);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                    >
                      <Heart className="w-4 h-4 text-rose-400" />
                      Saved Wishlist ({wishlist.length})
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        id="menu-admin-panel-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setViewMode('admin');
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      id="menu-logout-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Expands on click) */}
        {isMobileSearchOpen && (
          <div className="sm:hidden pb-3 pt-1 relative">
            <div className="relative">
              <input
                id="mobile-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                autoFocus
                className="w-full bg-slate-800 text-xs text-slate-100 placeholder-slate-400 rounded-xl pl-9 pr-8 py-2.5 border border-slate-700 focus:border-emerald-500 outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-slate-400 hover:text-white rounded-full absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile search suggestions dropdown */}
            {searchQuery.trim().length > 0 && searchSuggestions.length > 0 && (
              <div
                id="mobile-search-suggestions-dropdown"
                className="mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-2 z-50 space-y-1"
              >
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-800">
                  Matching Products
                </div>
                {searchSuggestions.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      openProductModal(prod);
                      setIsMobileSearchOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2.5 p-2 hover:bg-slate-800/80 rounded-xl transition-colors active:scale-98"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-9 h-9 rounded-lg object-cover bg-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {prod.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                        <span className="bg-slate-800 px-1.5 py-0.2 rounded">
                          {prod.category}
                        </span>
                        <span className="font-bold" style={{ color: primaryColor }}>
                          {formatCurrency(prod.price, settings.currencySymbol)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Categories Bar */}
        {viewMode === 'store' && (
          <div className="py-2 sm:py-2.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 sm:gap-2 border-t border-slate-800/60 text-xs scroll-smooth active:cursor-grabbing">
            <span className="text-slate-500 uppercase text-[9px] sm:text-[10px] font-bold tracking-wider mr-1 hidden sm:inline">
              Categories:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cat-chip-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full font-semibold transition-all whitespace-nowrap text-[11px] sm:text-xs active:scale-95 ${
                    isSelected
                      ? 'text-slate-950 shadow-md font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                  style={{
                    backgroundColor: isSelected ? primaryColor : undefined,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
