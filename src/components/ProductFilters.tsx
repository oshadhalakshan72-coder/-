import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Star,
  Check,
  TrendingUp,
  Tag,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SortOption } from '../types';
import { formatCurrency } from '../utils/helpers';

export const ProductFilters: React.FC = () => {
  const {
    settings,
    categories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    onlyInStock,
    setOnlyInStock,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    resetFilters,
    filteredProducts,
    products,
  } = useStore();

  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const primaryColor = settings.theme?.primaryColor || '#10b981';

  const isFiltered =
    selectedCategory !== 'All' ||
    priceRange[0] > 0 ||
    priceRange[1] < 50000 ||
    onlyInStock ||
    minRating > 0 ||
    sortBy !== 'featured';

  return (
    <div
      id="product-filters-container"
      className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 mb-4 sm:mb-8 text-slate-100 shadow-xl backdrop-blur-md"
    >
      {/* Top Header & Mobile Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-5 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div
              className="p-2 border rounded-xl shrink-0"
              style={{
                backgroundColor: `${primaryColor}18`,
                borderColor: `${primaryColor}40`,
                color: primaryColor,
              }}
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Filter & Sort
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {filteredProducts.length} of {products.length}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Refine by category, price, and customer ratings
              </p>
            </div>
          </div>

          {/* Mobile Accordion Toggle */}
          <button
            id="mobile-filters-toggle-btn"
            type="button"
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 active:scale-95 transition-all"
          >
            <span>{isMobileExpanded ? 'Hide' : 'Filters'}</span>
            {isMobileExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>

        {/* Sort Dropdown & Reset */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex-1 sm:flex-initial flex items-center gap-1.5 sm:gap-2 bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
            <span className="text-slate-400 font-medium text-[11px] sm:text-xs shrink-0">Sort:</span>
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-1 text-xs w-full sm:w-auto"
            >
              <option value="featured" className="bg-slate-900 text-slate-200">
                Featured & Popular
              </option>
              <option value="newest" className="bg-slate-900 text-slate-200">
                New Arrivals
              </option>
              <option value="price-asc" className="bg-slate-900 text-slate-200">
                Price: Low to High
              </option>
              <option value="price-desc" className="bg-slate-900 text-slate-200">
                Price: High to Low
              </option>
              <option value="rating" className="bg-slate-900 text-slate-200">
                Highest Rating
              </option>
            </select>
          </div>

          {isFiltered && (
            <button
              id="reset-filters-btn"
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors active:scale-95"
            >
              <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Row Controls (Visible on desktop, collapsible on mobile) */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 pt-3 sm:pt-5 ${isMobileExpanded ? 'block' : 'hidden sm:grid'}`}>
        {/* Category Pills */}
        <div>
          <label className="text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" style={{ color: primaryColor }} /> Category
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-36 sm:max-h-none overflow-y-auto no-scrollbar">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`filter-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all active:scale-95 ${
                    active
                      ? 'text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
                  }`}
                  style={{
                    backgroundColor: active ? primaryColor : undefined,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <label className="text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: primaryColor }} /> Max Price:{' '}
              <span className="font-extrabold" style={{ color: primaryColor }}>
                {formatCurrency(priceRange[1], settings.currencySymbol)}
              </span>
            </label>
            <span className="text-[10px] sm:text-[11px] text-slate-400">
              Up to {formatCurrency(50000, settings.currencySymbol)}
            </span>
          </div>
          <input
            id="price-range-slider"
            type="range"
            min={1000}
            max={50000}
            step={1000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: primaryColor }}
          />
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 mt-1">
            <span>{formatCurrency(1000, settings.currencySymbol)}</span>
            <span>{formatCurrency(25000, settings.currencySymbol)}</span>
            <span>{formatCurrency(50000, settings.currencySymbol)}</span>
          </div>
        </div>

        {/* Toggles: In Stock & Ratings */}
        <div className="flex flex-col justify-between gap-2 sm:gap-3">
          <label className="text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Quick Filters
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {/* In-Stock Toggle */}
            <button
              id="toggle-in-stock-filter"
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all active:scale-95 ${
                onlyInStock
                  ? 'border-emerald-500/50 shadow-sm'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              style={{
                backgroundColor: onlyInStock ? `${primaryColor}22` : undefined,
                color: onlyInStock ? primaryColor : undefined,
              }}
            >
              <div
                className="w-4 h-4 rounded flex items-center justify-center border"
                style={{
                  backgroundColor: onlyInStock ? primaryColor : 'rgb(15 23 42)',
                  borderColor: onlyInStock ? primaryColor : 'rgb(71 85 105)',
                  color: onlyInStock ? '#020617' : undefined,
                }}
              >
                {onlyInStock && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              In Stock Only
            </button>

            {/* Min 4 Stars Toggle */}
            <button
              id="toggle-rating-filter"
              onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all active:scale-95 ${
                minRating === 4
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  minRating === 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-500'
                }`}
              />
              4.0★ & Above
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

