import React from 'react';
import { useStore } from '../context/StoreContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textColor?: string;
  className?: string;
  variant?: 'light' | 'dark' | 'navy' | 'auto';
  showDots?: boolean;
  customTagline?: string;
  layout?: 'horizontal' | 'stacked';
  fullLogo?: boolean;
}

/**
 * Authentic AZON LANKA Brand Logo
 * Exactly matching the official brand identity:
 * - Soaring Dove facing right with 3 top wing feathers & 3 tail feathers
 * - Body seamlessly morphing into the lowercase letter 'a'
 * - 8-point compass navigation star in the center of 'a'
 * - AZON LANKA typography in navy blue / dark mode adaptive colors
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  textColor,
  className = '',
  variant = 'auto',
  showDots = true,
  customTagline,
  layout = 'horizontal',
  fullLogo = false,
}) => {
  const { settings } = useStore();

  // Dimensions based on size
  const iconSizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
    '2xl': 'w-24 h-24 sm:w-28 sm:h-28',
  };

  const fullSizes = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
    '2xl': 'h-28 sm:h-32',
  };

  const textSizes = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base md:text-lg',
    lg: 'text-lg sm:text-xl md:text-2xl',
    xl: 'text-2xl sm:text-3xl md:text-4xl',
    '2xl': 'text-3xl sm:text-4xl md:text-5xl',
  };

  const taglineSizes = {
    sm: 'text-[8px] sm:text-[9px]',
    md: 'text-[9px] sm:text-[10px]',
    lg: 'text-[11px] sm:text-xs',
    xl: 'text-xs sm:text-sm',
    '2xl': 'text-sm sm:text-base',
  };

  const isDark = variant === 'dark' || variant === 'auto';
  const defaultTextColor = textColor || (isDark ? 'text-white' : 'text-[#0b3664]');

  // If user uploaded a custom logo image from admin settings, render that
  if (settings?.customLogoUrl) {
    return (
      <div className={`flex items-center gap-2.5 select-none ${layout === 'stacked' ? 'flex-col text-center' : ''} ${className}`}>
        <img
          src={settings.customLogoUrl}
          alt={settings.storeName || 'AZON LANKA'}
          className={`${iconSizes[size]} object-contain rounded-lg`}
          referrerPolicy="no-referrer"
        />
        {showText && (
          <div className={`flex flex-col ${layout === 'stacked' ? 'items-center text-center mt-1' : 'justify-center'}`}>
            <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
              {showDots && (
                <span className="hidden sm:inline text-cyan-400 font-black tracking-widest text-xs select-none opacity-80">
                  . . .
                </span>
              )}
              <span
                className={`font-black uppercase tracking-wider font-sans ${textSizes[size]} ${defaultTextColor}`}
                style={{ letterSpacing: '0.1em' }}
              >
                AZON LANKA
              </span>
              {showDots && (
                <span className="hidden sm:inline text-cyan-400 font-black tracking-widest text-xs select-none opacity-80">
                  . . .
                </span>
              )}
            </div>
            <div className={`items-center gap-1.5 mt-1 leading-none ${layout === 'stacked' ? 'flex' : 'hidden sm:flex'}`}>
              <span className="text-slate-500 font-light text-[10px] select-none">|</span>
              <span
                className={`font-bold tracking-widest uppercase text-cyan-400 font-mono ${taglineSizes[size]}`}
                style={{ letterSpacing: '0.14em' }}
              >
                {customTagline || 'YOUR ONLINE MARKETPLACE'}
              </span>
              <span className="text-slate-500 font-light text-[10px] select-none">|</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If fullLogo requested (emblem + text in single image)
  if (fullLogo) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src="/logo.svg"
          alt="AZON LANKA"
          className={`${fullSizes[size]} w-auto object-contain`}
        />
      </div>
    );
  }

  // Exact reproduction of the official logo emblem
  return (
    <div
      className={`inline-flex items-center select-none ${
        layout === 'stacked'
          ? 'flex-col text-center gap-2 sm:gap-3'
          : 'gap-2 sm:gap-3.5'
      } ${className}`}
    >
      {/* Emblem SVG */}
      <div className={`relative shrink-0 ${iconSizes[size]} flex items-center justify-center`}>
        <img
          src="/logo-emblem.svg"
          alt="AZON LANKA Logo"
          className="w-full h-full object-contain filter drop-shadow-sm"
        />
      </div>

      {/* Brand Typography & Official Tagline */}
      {showText && (
        <div className={`flex flex-col ${layout === 'stacked' ? 'items-center text-center' : 'justify-center'}`}>
          {/* Main Title with decorative dots */}
          <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
            {showDots && (
              <span className="hidden sm:inline text-cyan-400 font-black tracking-widest text-xs sm:text-sm select-none opacity-80">
                . . .
              </span>
            )}
            <span
              className={`font-black uppercase tracking-wider font-sans ${textSizes[size]} ${defaultTextColor}`}
              style={{ letterSpacing: '0.1em' }}
            >
              AZON LANKA
            </span>
            {showDots && (
              <span className="hidden sm:inline text-cyan-400 font-black tracking-widest text-xs sm:text-sm select-none opacity-80">
                . . .
              </span>
            )}
          </div>

          {/* Tagline: | your online marketplace | */}
          <div className={`items-center gap-1.5 mt-0.5 sm:mt-1 leading-none ${layout === 'stacked' ? 'flex' : 'hidden sm:flex'}`}>
            <span className="text-slate-500 font-light text-[10px] select-none">|</span>
            <span
              className={`font-bold tracking-widest uppercase text-cyan-400 font-mono ${taglineSizes[size]}`}
              style={{ letterSpacing: '0.14em' }}
            >
              {customTagline || 'YOUR ONLINE MARKETPLACE'}
            </span>
            <span className="text-slate-500 font-light text-[10px] select-none">|</span>
          </div>
        </div>
      )}
    </div>
  );
};
