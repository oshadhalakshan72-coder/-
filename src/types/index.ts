export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  features?: string[];
  images: string[];
  stock: number;
  inStock: boolean;
  sku: string;
  tags: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isFlashSale?: boolean;
  warranty?: string;
  colors?: string[];
  sizes?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  image: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'whatsapp' | 'cod' | 'card' | 'bank_transfer';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  postalCode?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  trackingNumber?: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  roleTitle: string; // e.g. "Super Admin / Store Owner", "Inventory & Stock Manager", "Orders & Dispatch Lead"
  badgeColor: 'amber' | 'cyan' | 'emerald' | 'purple' | 'rose';
  phone: string;
  passcode: string;
  permissions: ('all' | 'products' | 'orders' | 'settings' | 'team')[];
  lastLogin?: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  adminRoleId?: string;
  roleTitle?: string;
  badgeColor?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  imageUrl: string;
  ctaText: string;
  ctaCategory?: string;
  buttonColor?: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minOrder: number;
  isActive: boolean;
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
  preset: 'emerald' | 'cyan' | 'indigo' | 'amber' | 'rose' | 'purple' | 'teal' | 'orange' | 'custom';
  mode: 'dark' | 'midnight' | 'oled' | 'light';
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  customLogoUrl?: string;
  currency: string;
  currencySymbol: string;
  ownerWhatsAppNumber: string; // e.g. "94771234567" or "+94771234567"
  supportEmail: string;
  adminPasscode?: string;
  adminAccounts?: AdminAccount[];
  freeShippingThreshold: number;
  standardDeliveryFee: number;
  enableWhatsAppAlerts: boolean;
  announcementText: string;
  showAnnouncement: boolean;
  heroSlides: HeroSlide[];
  promoCodes: PromoCode[];
  theme?: ThemeSettings;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export type FilterCategory = 'All' | string;
export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
