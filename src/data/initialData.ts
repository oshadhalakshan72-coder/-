import { Product, StoreSettings, Review } from '../types';
import { DEFAULT_THEME } from '../utils/theme';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'AZON LANKA',
  storeTagline: 'Your Online Marketplace',
  currency: 'LKR',
  currencySymbol: 'Rs. ',
  ownerWhatsAppNumber: '94766999016',
  supportEmail: 'contact@azonlanka.lk',
  adminPasscode: 'admin123',
  adminAccounts: [
    {
      id: 'admin-1',
      name: 'Store Administrator',
      email: 'admin@azonlanka.lk',
      roleTitle: 'Store Owner & Manager',
      badgeColor: 'amber',
      phone: '+94 76 699 9016',
      passcode: 'admin123',
      permissions: ['all', 'products', 'orders', 'settings', 'team'],
      isDefault: true,
      lastLogin: 'Active',
    },
  ],
  freeShippingThreshold: 15000,
  standardDeliveryFee: 450,
  enableWhatsAppAlerts: true,
  announcementText: '⚡ AZON LANKA • Islandwide Express Delivery | Order via WhatsApp or Website with Instant Confirmation!',
  showAnnouncement: true,
  theme: DEFAULT_THEME,
  promoCodes: [
    { code: 'AZON10', discountPercent: 10, minOrder: 3000, isActive: true },
    { code: 'WELCOME10', discountPercent: 10, minOrder: 3000, isActive: true },
    { code: 'MEGA20', discountPercent: 20, minOrder: 10000, maxDiscount: 4000, isActive: true },
    { code: 'AZON5', discountPercent: 5, minOrder: 1500, isActive: true },
  ],
  heroSlides: [
    {
      id: 'slide-1',
      title: 'Next-Gen Wireless ANC Headphones',
      subtitle: 'Pure Audio Fidelity',
      description: 'Experience studio-grade sound with ultra-low latency, 40h playtime, and adaptive noise cancellation.',
      badge: 'NEW ARRIVAL • 25% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Shop Tech & Audio',
      ctaCategory: 'Electronics',
    },
    {
      id: 'slide-2',
      title: 'Minimalist Titanium Smartwatch Series 7',
      subtitle: 'Elegance Meets Intelligence',
      description: 'Sapphire crystal display, 14-day battery life, all-day biometric health tracking and fast charging.',
      badge: 'TRENDING IN 2025',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Explore Wearables',
      ctaCategory: 'Wearables',
    },
    {
      id: 'slide-3',
      title: 'Nordic Ceramic Coffee Pour-Over Set',
      subtitle: 'Artisan Kitchen & Living',
      description: 'Handcrafted matte finish stoneware designed for slow morning rituals and exquisite extraction.',
      badge: 'EDITOR’S CHOICE',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Discover Home & Living',
      ctaCategory: 'Home & Living',
    },
  ],
};

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_REVIEWS: Review[] = [];

