import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { db, auth, googleProvider } from '../lib/firebase';
import {
  Product,
  CartItem,
  Order,
  User,
  StoreSettings,
  AdminAccount,
  Review,
  SortOption,
  OrderStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_REVIEWS,
} from '../data/initialData';
import { generateOrderNumber, calculateCartTotals } from '../utils/helpers';
import { DEFAULT_THEME, applyThemeVariables } from '../utils/theme';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface StoreContextType {
  // State
  products: Product[];
  settings: StoreSettings;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  reviews: Review[];
  currentUser: User | null;
  appliedPromo: { code: string; discountPercent: number } | null;
  isCloudSynced: boolean;
  firebaseStatus: 'connected' | 'connecting' | 'offline' | 'error';
  lastCloudSyncTime: Date | null;
  cloudPingMs: number | null;
  testFirebaseConnection: () => Promise<{ success: boolean; latencyMs: number; error?: string }>;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
  filteredProducts: Product[];
  categories: string[];

  // Cart operations
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  cartTotals: ReturnType<typeof calculateCartTotals>;
  cartItemCount: number;

  // Wishlist
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Promo code
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Orders
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'subtotal' | 'discount' | 'shipping' | 'total'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

  // Product management (Admin)
  addProduct: (newProduct: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  clearAllProducts: () => Promise<void>;
  toggleStockStatus: (productId: string) => Promise<void>;

  // Reviews
  addReview: (productId: string, rating: number, comment: string, userName: string) => Promise<void>;
  getProductReviews: (productId: string) => Review[];

  // Settings management (Admin)
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  updateAdminAccount: (updatedAdmin: AdminAccount) => Promise<void>;
  addAdminAccount: (newAdmin: Omit<AdminAccount, 'id'>) => Promise<void>;
  deleteAdminAccount: (adminId: string) => Promise<void>;

  // Auth operations
  login: (identifier: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  demoLoginAdmin: () => void;
  loginAsAdmin: (adminId?: string) => void;
  demoLoginCustomer: () => void;

  // UI Modal & Navigation state
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isTrackOrderOpen: boolean;
  setIsTrackOrderOpen: (open: boolean) => void;
  trackingQuery: string;
  setTrackingQuery: (query: string) => void;
  activePolicyModal: 'returns' | 'warranty' | 'shipping' | 'faq' | 'privacy' | null;
  setActivePolicyModal: (modal: 'returns' | 'warranty' | 'shipping' | 'faq' | 'privacy' | null) => void;
  recentlyViewedIds: string[];
  addRecentlyViewed: (productId: string) => void;
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  viewMode: 'store' | 'admin';
  setViewMode: (mode: 'store' | 'admin') => void;
  isAdminPasscodeModalOpen: boolean;
  setIsAdminPasscodeModalOpen: (open: boolean) => void;
  adminTab: 'overview' | 'products' | 'orders' | 'settings' | 'team';
  setAdminTab: (tab: 'overview' | 'products' | 'orders' | 'settings' | 'team') => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'azon_products_v3',
  SETTINGS: 'azon_settings_v3',
  CART: 'azon_cart_v3',
  WISHLIST: 'azon_wishlist_v3',
  ORDERS: 'azon_orders_v3',
  REVIEWS: 'azon_reviews_v3',
  USER: 'azon_user_v3',
};

export function normalizeProduct(raw: any, docId?: string): Product {
  const id = raw?.id || docId || `prod-${Date.now()}`;
  const price = typeof raw?.price === 'number' && !isNaN(raw.price) ? raw.price : 0;
  const originalPrice =
    typeof raw?.originalPrice === 'number' && !isNaN(raw.originalPrice)
      ? raw.originalPrice
      : undefined;
  const stock = typeof raw?.stock === 'number' && !isNaN(raw.stock) ? raw.stock : 10;
  const inStock = raw?.inStock !== undefined ? Boolean(raw.inStock) : stock > 0;

  let images: string[] = [];
  if (Array.isArray(raw?.images) && raw.images.length > 0) {
    images = raw.images.filter((img: any) => typeof img === 'string' && img.trim().length > 0);
  }
  if (images.length === 0) {
    images = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    ];
  }

  return {
    id,
    name: String(raw?.name || 'Product Item'),
    category: String(raw?.category || 'General'),
    price,
    originalPrice,
    description: String(raw?.description || ''),
    images,
    rating: typeof raw?.rating === 'number' && !isNaN(raw.rating) ? raw.rating : 5.0,
    reviewCount: typeof raw?.reviewCount === 'number' && !isNaN(raw.reviewCount) ? raw.reviewCount : 1,
    inStock,
    stock,
    isFlashSale: Boolean(raw?.isFlashSale),
    isFeatured: raw?.isFeatured !== undefined ? Boolean(raw.isFeatured) : true,
    isNewArrival: Boolean(raw?.isNewArrival),
    sku: String(raw?.sku || `AZN-${id.slice(-4).toUpperCase()}`),
    tags: Array.isArray(raw?.tags) ? raw.tags.map(String) : [],
    colors: Array.isArray(raw?.colors) ? raw.colors.map(String) : undefined,
    sizes: Array.isArray(raw?.sizes) ? raw.sizes.map(String) : undefined,
    warranty: String(raw?.warranty || '6 Months Official Warranty'),
  };
}

export function normalizeOrder(raw: any, docId?: string): Order {
  const id = raw?.id || docId || `ord-${Date.now()}`;
  return {
    id,
    orderNumber: String(raw?.orderNumber || `AZN-${id.slice(-6).toUpperCase()}`),
    customerName: String(raw?.customerName || 'Customer'),
    customerEmail: raw?.customerEmail ? String(raw.customerEmail) : undefined,
    customerPhone: String(raw?.customerPhone || ''),
    deliveryAddress: String(raw?.deliveryAddress || raw?.shippingAddress || ''),
    city: String(raw?.city || ''),
    postalCode: raw?.postalCode ? String(raw.postalCode) : undefined,
    notes: raw?.notes ? String(raw.notes) : undefined,
    items: Array.isArray(raw?.items) ? raw.items : [],
    subtotal: Number(raw?.subtotal) || 0,
    discount: Number(raw?.discount) || 0,
    shipping: Number(raw?.shipping) || 0,
    total: Number(raw?.total) || 0,
    paymentMethod: raw?.paymentMethod || 'whatsapp',
    status: raw?.status || 'pending',
    trackingNumber: raw?.trackingNumber ? String(raw.trackingNumber) : undefined,
    createdAt: raw?.createdAt || new Date().toISOString(),
  };
}

export function normalizeReview(raw: any, docId?: string): Review {
  const id = raw?.id || docId || `rev-${Date.now()}`;
  return {
    id,
    productId: String(raw?.productId || ''),
    userName: String(raw?.userName || 'Customer'),
    rating: Number(raw?.rating) || 5,
    comment: String(raw?.comment || ''),
    date: String(raw?.date || new Date().toISOString().split('T')[0]),
    verifiedPurchase: raw?.verifiedPurchase !== undefined ? Boolean(raw.verifiedPurchase) : true,
  };
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<'connected' | 'connecting' | 'offline' | 'error'>('connecting');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<Date | null>(null);
  const [cloudPingMs, setCloudPingMs] = useState<number | null>(null);

  const testFirebaseConnection = async (): Promise<{ success: boolean; latencyMs: number; error?: string }> => {
    const startTime = performance.now();
    try {
      // Direct Firestore document read to check live cloud connectivity & latency
      await getDoc(doc(db, 'settings', 'general'));
      const latency = Math.max(1, Math.round(performance.now() - startTime));
      setCloudPingMs(latency);
      setFirebaseStatus('connected');
      setIsCloudSynced(true);
      setLastCloudSyncTime(new Date());
      return { success: true, latencyMs: latency };
    } catch (err: any) {
      console.warn('Firebase ping test error:', err);
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      setFirebaseStatus(isOffline ? 'offline' : 'error');
      return {
        success: false,
        latencyMs: 0,
        error: err?.message || 'Unable to reach Firebase Cloud Firestore',
      };
    }
  };

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => {
      setFirebaseStatus('connected');
      testFirebaseConnection();
    };
    const handleOffline = () => {
      setFirebaseStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial State from Local Storage or Defaults (excluding legacy dummy records)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const dummyIds = new Set(['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8', 'prod-9']);
          const realCustomProds = parsed.filter((p: any) => !dummyIds.has(p?.id));
          if (realCustomProds.length > 0) {
            return realCustomProds.map((p: any) => normalizeProduct(p));
          }
          localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedTheme = parsed.theme ? { ...DEFAULT_THEME, ...parsed.theme } : DEFAULT_THEME;
        const initialDefaults = INITIAL_SETTINGS.adminAccounts || [];
        let adminAccounts =
          parsed.adminAccounts && parsed.adminAccounts.length > 0
            ? parsed.adminAccounts
            : initialDefaults;

        const existingIds = new Set(adminAccounts.map((a: AdminAccount) => a.id));
        const missingDefaults = initialDefaults.filter((d) => !existingIds.has(d.id));
        if (missingDefaults.length > 0) {
          adminAccounts = [...adminAccounts, ...missingDefaults];
        }

        const ownerWhatsAppNumber =
          !parsed.ownerWhatsAppNumber ||
          parsed.ownerWhatsAppNumber === '94771234567' ||
          parsed.ownerWhatsAppNumber === '94770000000'
            ? '94766999016'
            : parsed.ownerWhatsAppNumber;

        return {
          ...parsed,
          storeName: parsed.storeName || 'AZON LANKA',
          storeTagline: parsed.storeTagline || 'Your Online Marketplace',
          ownerWhatsAppNumber,
          adminAccounts,
          theme: mergedTheme,
        };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // UI Modal & Navigation state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [activePolicyModal, setActivePolicyModal] = useState<'returns' | 'warranty' | 'shipping' | 'faq' | 'privacy' | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [isAdminPasscodeModalOpen, setIsAdminPasscodeModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'orders' | 'settings' | 'team'>('overview');

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('azon_recently_viewed_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewedIds((prev) => {
      const updated = [productId, ...prev.filter((id) => id !== productId)].slice(0, 8);
      try {
        localStorage.setItem('azon_recently_viewed_v3', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Toast management
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ----------------------------------------------------
  // FIREBASE REAL-TIME CLOUD DATABASE LISTENERS & SYNC
  // ----------------------------------------------------
  useEffect(() => {
    let unsubProducts = () => {};
    let unsubOrders = () => {};
    let unsubSettings = () => {};
    let unsubReviews = () => {};
    let unsubAuth = () => {};

    try {
      // 1. Real-time Products Sync
      const productsColRef = collection(db, 'products');
      unsubProducts = onSnapshot(
        productsColRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedProducts: Product[] = [];
            const dummyIds = new Set(['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8', 'prod-9']);
            snapshot.forEach((docSnap) => {
              if (dummyIds.has(docSnap.id)) {
                // Remove legacy dummy item from cloud
                deleteDoc(doc(db, 'products', docSnap.id)).catch(() => {});
              } else {
                fetchedProducts.push(normalizeProduct(docSnap.data(), docSnap.id));
              }
            });
            setProducts(fetchedProducts);
            setIsCloudSynced(true);
            setFirebaseStatus('connected');
            setLastCloudSyncTime(new Date());
          } else {
            setProducts([]);
            setIsCloudSynced(true);
            setFirebaseStatus('connected');
            setLastCloudSyncTime(new Date());
          }
        },
        (error) => {
          console.warn('Firestore products listener fallback to local cache:', error.message);
          if (typeof navigator !== 'undefined' && !navigator.onLine) {
            setFirebaseStatus('offline');
          }
        }
      );

      // 2. Real-time Orders Sync
      const ordersColRef = collection(db, 'orders');
      unsubOrders = onSnapshot(
        ordersColRef,
        (snapshot) => {
          setFirebaseStatus('connected');
          setLastCloudSyncTime(new Date());
          const fetchedOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            fetchedOrders.push(normalizeOrder(docSnap.data(), docSnap.id));
          });
          if (fetchedOrders.length > 0) {
            // Sort by createdAt descending
            fetchedOrders.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setOrders(fetchedOrders);
          }
        },
        (error) => {
          console.warn('Firestore orders listener fallback to local cache:', error.message);
        }
      );

      // 3. Real-time Settings Sync
      const settingsDocRef = doc(db, 'settings', 'general');
      unsubSettings = onSnapshot(
        settingsDocRef,
        (snapshot) => {
          setFirebaseStatus('connected');
          setLastCloudSyncTime(new Date());
          if (snapshot.exists()) {
            const cloudSettings = snapshot.data() as StoreSettings;
            setSettings((prev) => ({
              ...prev,
              ...cloudSettings,
              theme: cloudSettings.theme ? { ...DEFAULT_THEME, ...cloudSettings.theme } : prev.theme,
            }));
          } else {
            // Seed settings document
            setDoc(settingsDocRef, INITIAL_SETTINGS).catch((e) =>
              console.error('Error seeding settings to Firestore:', e)
            );
          }
        },
        (error) => {
          console.warn('Firestore settings listener fallback:', error.message);
        }
      );

      // 4. Real-time Reviews Sync
      const reviewsColRef = collection(db, 'reviews');
      unsubReviews = onSnapshot(
        reviewsColRef,
        (snapshot) => {
          setFirebaseStatus('connected');
          setLastCloudSyncTime(new Date());
          if (!snapshot.empty) {
            const fetchedReviews: Review[] = [];
            snapshot.forEach((docSnap) => {
              fetchedReviews.push(normalizeReview(docSnap.data(), docSnap.id));
            });
            setReviews(fetchedReviews);
          } else {
            INITIAL_REVIEWS.forEach((rev) => {
              setDoc(doc(db, 'reviews', rev.id), rev).catch(() => {});
            });
          }
        },
        (error) => {
          console.warn('Firestore reviews listener fallback:', error.message);
        }
      );

      // 5. Firebase Auth State Listener
      unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Check if user has an admin record in Firestore
            const userDocSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
            const adminDocSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
            const userData = userDocSnap.exists() ? userDocSnap.data() : null;
            const adminData = adminDocSnap.exists() ? adminDocSnap.data() : null;

            const isAdminUser =
              userData?.role === 'admin' ||
              userData?.isAdmin === true ||
              adminData?.role === 'admin' ||
              adminData?.isAdmin === true;

            if (isAdminUser) {
              setCurrentUser({
                id: firebaseUser.uid,
                name: firebaseUser.displayName || userData?.name || 'Store Admin',
                email: firebaseUser.email || '',
                phone: firebaseUser.phoneNumber || userData?.phone || '',
                role: 'admin',
                roleTitle: userData?.roleTitle || 'Administrator',
              });
              return;
            }
          } catch (e) {
            console.warn('Error checking admin permissions for Firebase user:', e);
          }

          // Regular customer profile
          setCurrentUser((prev) => {
            if (prev?.role === 'admin') return prev;
            return {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || prev?.phone || '',
              role: 'customer',
            };
          });
        }
      });
    } catch (err) {
      console.error('Firebase initialization error:', err);
    }

    return () => {
      unsubProducts();
      unsubOrders();
      unsubSettings();
      unsubReviews();
      unsubAuth();
    };
  }, []);

  // Sync state to localStorage as fast client-side offline cache
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    if (settings.theme) {
      applyThemeVariables(settings.theme);
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  // Derived categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTag = p.tags?.some((t) => t.toLowerCase().includes(q));
          const matchCategory = p.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchTag && !matchCategory) return false;
        }
        if (p.price < priceRange[0] || p.price > priceRange[1]) {
          return false;
        }
        if (onlyInStock && (!p.inStock || p.stock <= 0)) {
          return false;
        }
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'featured':
          default:
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
      });
  }, [products, selectedCategory, searchQuery, priceRange, onlyInStock, minRating, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceRange([0, 50000]);
    setOnlyInStock(false);
    setMinRating(0);
    setSortBy('featured');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + quantity;
        next[existingIdx] = { ...next[existingIdx], quantity: newQty };
        return next;
      } else {
        return [...prev, { product, quantity, selectedColor, selectedSize }];
      }
    });

    addToast({
      type: 'success',
      title: 'Added to Cart',
      description: `${quantity}x ${product.name}`,
    });
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
    addToast({
      type: 'info',
      title: 'Item Removed',
      description: 'The product was removed from your cart.',
    });
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotals = useMemo(() => {
    const discountPercent = appliedPromo?.discountPercent || 0;
    return calculateCartTotals(cart, settings, discountPercent);
  }, [cart, settings, appliedPromo]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const isSaved = wishlist.includes(productId);
    const prod = products.find((p) => p.id === productId);
    if (isSaved) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      addToast({
        type: 'info',
        title: 'Removed from Wishlist',
        description: prod?.name,
      });
    } else {
      setWishlist((prev) => [...prev, productId]);
      addToast({
        type: 'success',
        title: 'Saved to Wishlist ❤️',
        description: prod?.name,
      });
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Promo code
  const applyPromoCode = (codeToApply: string) => {
    const clean = codeToApply.trim().toUpperCase();
    const found = settings.promoCodes.find(
      (p) => p.code.toUpperCase() === clean && p.isActive
    );

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    if (subtotal < found.minOrder) {
      return {
        success: false,
        message: `Minimum order of ${settings.currencySymbol}${found.minOrder} required for this code.`,
      };
    }

    setAppliedPromo({ code: found.code, discountPercent: found.discountPercent });
    addToast({
      type: 'success',
      title: 'Promo Applied!',
      description: `${found.discountPercent}% discount activated.`,
    });
    return { success: true, message: `Applied ${found.discountPercent}% discount successfully!` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    addToast({
      type: 'info',
      title: 'Coupon Removed',
    });
  };

  // Orders - Real-time Firebase Sync
  const placeOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'subtotal' | 'discount' | 'shipping' | 'total'>
  ): Promise<Order> => {
    const totals = cartTotals;
    const orderId = 'ord-' + Date.now();
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
    };

    // Update local state immediately
    setOrders((prev) => [newOrder, ...prev]);

    // Save to Firebase Firestore Cloud Database
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (err) {
      console.warn('Could not save order to Firestore directly:', err);
    }

    // Update stock levels in Firestore & local
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingItem = orderData.items.find((item) => item.productId === prod.id);
        if (matchingItem) {
          const nextStock = Math.max(0, prod.stock - matchingItem.quantity);
          const updatedProd = {
            ...prod,
            stock: nextStock,
            inStock: nextStock > 0,
          };
          setDoc(doc(db, 'products', prod.id), updatedProd).catch(() => {});
          return updatedProd;
        }
        return prod;
      })
    );

    // Clear cart and promo
    clearCart();
    setAppliedPromo(null);

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
          };
        }
        return o;
      })
    );

    try {
      const updatePayload: Record<string, unknown> = { status };
      if (trackingNumber !== undefined) {
        updatePayload.trackingNumber = trackingNumber;
      }
      await updateDoc(doc(db, 'orders', orderId), updatePayload);
    } catch (err) {
      console.warn('Firestore update order error:', err);
    }

    addToast({
      type: 'success',
      title: 'Order Updated',
      description: `Order status set to "${status.toUpperCase()}".`,
    });
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (err) {
      console.warn('Firestore delete order error:', err);
    }
    addToast({
      type: 'warning',
      title: 'Order Deleted',
      description: 'Order record removed from system.',
    });
  };

  // Product management - Real-time Firebase Sync
  const addProduct = async (newProd: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const id = 'prod-' + Date.now();
    const product: Product = {
      ...newProd,
      id,
      rating: 5.0,
      reviewCount: 1,
    };
    setProducts((prev) => [product, ...prev]);

    try {
      await setDoc(doc(db, 'products', id), product);
    } catch (err) {
      console.warn('Firestore save product error:', err);
    }

    addToast({
      type: 'success',
      title: 'Product Published',
      description: `${product.name} is now live in store and synced to Cloud.`,
    });
  };

  const updateProduct = async (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    try {
      await setDoc(doc(db, 'products', updated.id), updated);
    } catch (err) {
      console.warn('Firestore update product error:', err);
    }
    addToast({
      type: 'success',
      title: 'Product Updated',
      description: updated.name,
    });
  };

  const deleteProduct = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.warn('Firestore delete product error:', err);
    }
    addToast({
      type: 'info',
      title: 'Product Deleted',
      description: target?.name,
    });
  };

  const clearAllProducts = async () => {
    setProducts([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.CART);
      localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    } catch (e) {
      console.error(e);
    }
    setCart([]);
    setWishlist([]);

    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const promises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, 'products', docSnap.id)));
      await Promise.all(promises);
    } catch (err) {
      console.warn('Firestore clear products error:', err);
    }

    addToast({
      type: 'success',
      title: 'Store Refreshed ✨',
      description: 'All dummy products removed. Store is clean and ready for your real inventory.',
    });
  };

  const toggleStockStatus = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;
    const nextStock = !target.inStock;
    const updated = {
      ...target,
      inStock: nextStock,
      stock: nextStock ? (target.stock > 0 ? target.stock : 10) : 0,
    };
    await updateProduct(updated);
  };

  // Reviews
  const addReview = async (productId: string, rating: number, comment: string, userName: string) => {
    const newRev: Review = {
      id: 'rev-' + Date.now(),
      productId,
      userName: userName.trim() || 'Anonymous Customer',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };
    setReviews((prev) => [newRev, ...prev]);

    try {
      await setDoc(doc(db, 'reviews', newRev.id), newRev);
    } catch (err) {
      console.warn('Firestore review error:', err);
    }

    // Recalculate product rating
    const allProdReviews = [...reviews.filter((r) => r.productId === productId), newRev];
    const avg = allProdReviews.reduce((sum, r) => sum + r.rating, 0) / allProdReviews.length;
    const roundedAvg = Math.round(avg * 10) / 10;

    const prodToUpdate = products.find((p) => p.id === productId);
    if (prodToUpdate) {
      const updatedProd = { ...prodToUpdate, rating: roundedAvg, reviewCount: allProdReviews.length };
      await updateProduct(updatedProd);
    }

    addToast({
      type: 'success',
      title: 'Review Posted',
      description: 'Thank you for your rating!',
    });
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  // Settings
  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);

    try {
      await setDoc(doc(db, 'settings', 'general'), merged, { merge: true });
    } catch (err) {
      console.warn('Firestore settings update error:', err);
    }

    addToast({
      type: 'success',
      title: 'Settings Saved',
      description: 'Store parameters and WhatsApp alerts updated in Cloud.',
    });
  };

  const resetSettings = async () => {
    setSettings(INITIAL_SETTINGS);
    try {
      await setDoc(doc(db, 'settings', 'general'), INITIAL_SETTINGS);
    } catch (err) {
      console.warn('Firestore settings reset error:', err);
    }
    addToast({
      type: 'info',
      title: 'Settings Reset',
      description: 'Default parameters restored.',
    });
  };

  const updateAdminAccount = async (updatedAdmin: AdminAccount) => {
    const existing = settings.adminAccounts || INITIAL_SETTINGS.adminAccounts || [];
    const nextAdmins = existing.map((adm) => (adm.id === updatedAdmin.id ? updatedAdmin : adm));
    await updateSettings({ adminAccounts: nextAdmins });

    if (currentUser?.adminRoleId === updatedAdmin.id) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              name: updatedAdmin.name,
              email: updatedAdmin.email,
              phone: updatedAdmin.phone,
              roleTitle: updatedAdmin.roleTitle,
              badgeColor: updatedAdmin.badgeColor,
            }
          : null
      );
    }
    addToast({
      type: 'success',
      title: 'Admin Profile Updated',
      description: `${updatedAdmin.name} (${updatedAdmin.roleTitle}) details saved.`,
    });
  };

  const addAdminAccount = async (newAdmin: Omit<AdminAccount, 'id'>) => {
    const newId = 'admin-' + Date.now();
    const createdAdmin: AdminAccount = {
      ...newAdmin,
      id: newId,
      lastLogin: 'Never',
    };

    const existing = settings.adminAccounts || INITIAL_SETTINGS.adminAccounts || [];
    await updateSettings({ adminAccounts: [...existing, createdAdmin] });

    addToast({
      type: 'success',
      title: 'New Admin Added',
      description: `${createdAdmin.name} (${createdAdmin.roleTitle}) registered successfully.`,
    });
  };

  const deleteAdminAccount = async (adminId: string) => {
    const existing = settings.adminAccounts || INITIAL_SETTINGS.adminAccounts || [];
    const target = existing.find((a) => a.id === adminId);
    if (target?.isDefault) {
      addToast({
        type: 'warning',
        title: 'Cannot Delete Default Admin',
        description: 'Super Admin account is permanently protected.',
      });
      return;
    }

    const admins = settings.adminAccounts || INITIAL_SETTINGS.adminAccounts || [];
    await updateSettings({ adminAccounts: admins.filter((a) => a.id !== adminId) });

    if (currentUser?.adminRoleId === adminId) {
      loginAsAdmin();
    }

    addToast({
      type: 'info',
      title: 'Admin Removed',
      description: `${target?.name || 'Administrator'} account removed.`,
    });
  };

  // Auth Operations
  const loginAsAdmin = (adminId?: string) => {
    const admins = settings.adminAccounts || INITIAL_SETTINGS.adminAccounts || [];
    const targetAdmin = admins.find((a) => a.id === adminId) || admins[0];
    if (!targetAdmin) return;

    const adminUser: User = {
      id: 'usr-admin-' + targetAdmin.id,
      name: targetAdmin.name,
      email: targetAdmin.email,
      phone: targetAdmin.phone,
      role: 'admin',
      adminRoleId: targetAdmin.id,
      roleTitle: targetAdmin.roleTitle,
      badgeColor: targetAdmin.badgeColor,
    };
    setCurrentUser(adminUser);
    setIsAuthOpen(false);
    setViewMode('admin');
    addToast({
      type: 'success',
      title: `Admin Login: ${targetAdmin.name}`,
      description: `Authorized as ${targetAdmin.roleTitle}.`,
    });
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const loggedUser: User = {
        id: user.uid,
        name: user.displayName || 'Google Member',
        email: user.email || '',
        phone: user.phoneNumber || '',
        avatar: user.photoURL || undefined,
        role: 'customer',
      };
      setCurrentUser(loggedUser);
      setIsAuthOpen(false);
      addToast({
        type: 'success',
        title: `Welcome, ${loggedUser.name}!`,
        description: 'Signed in successfully via Google Account.',
      });
      return true;
    } catch (err: any) {
      console.error('Google sign in error:', err);
      const code = err?.code || '';
      let friendlyTitle = 'Google Sign-In Notice';
      let friendlyMsg = 'Google sign-in could not be completed.';

      if (code === 'auth/unauthorized-domain') {
        friendlyTitle = 'Firebase Authorized Domain Required';
        friendlyMsg = `This preview domain (${window.location.hostname}) is not yet added to your Firebase Authorized Domains. In Firebase Console > Authentication > Settings > Authorized domains, add "${window.location.hostname}". In the meantime, you can sign in instantly using Email & Password or Quick Customer Login.`;
      } else if (code === 'auth/configuration-not-found' || code === 'auth/operation-not-allowed') {
        friendlyTitle = 'Google Sign-in Not Enabled Yet';
        friendlyMsg = 'Please enable the "Google" provider in your Firebase Console under Authentication > Sign-in method, or sign in using Email / Quick Customer Login.';
      } else if (code === 'auth/popup-blocked') {
        friendlyTitle = 'Popup Blocked';
        friendlyMsg = 'Browser popup was blocked. Please allow popups for this site or use standard email sign in.';
      } else if (code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user') {
        friendlyTitle = 'Sign-in Cancelled';
        friendlyMsg = 'The Google sign-in window was closed.';
      } else if (err instanceof Error) {
        friendlyMsg = err.message;
      }

      addToast({
        type: 'warning',
        title: friendlyTitle,
        description: friendlyMsg,
      });
      return false;
    }
  };

  const login = async (identifier: string, password?: string): Promise<boolean> => {
    const trimmedId = (identifier || '').trim().toLowerCase();
    const trimmedPass = (password || '').trim();
    const admins = settings.adminAccounts || INITIAL_SETTINGS.adminAccounts || [];
    const masterPasscode = (settings.adminPasscode || '').trim();

    // Check if identifier matches an admin account
    const matchedAdmin = admins.find(
      (a) =>
        a.email.toLowerCase() === trimmedId ||
        a.name.toLowerCase() === trimmedId ||
        trimmedId === 'admin'
    );

    if (matchedAdmin || trimmedId === 'admin') {
      const targetAdmin = matchedAdmin || admins[0];
      const targetPasscode = (targetAdmin?.passcode || '').trim();

      if (
        trimmedPass &&
        ((targetPasscode && trimmedPass === targetPasscode) ||
          (masterPasscode && trimmedPass === masterPasscode))
      ) {
        loginAsAdmin(targetAdmin.id);
        return true;
      } else {
        addToast({
          type: 'error',
          title: 'Sign In Failed',
          description: 'Incorrect email or password. Please try again.',
        });
        return false;
      }
    }

    if (trimmedPass && masterPasscode && trimmedPass === masterPasscode && admins.length > 0) {
      loginAsAdmin(admins[0].id);
      return true;
    }

    // Try Firebase Email Auth if email format
    if (trimmedId.includes('@') && trimmedPass) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, trimmedId, trimmedPass);
        const fbUser = userCred.user;
        const user: User = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
          email: fbUser.email || trimmedId,
          role: 'customer',
        };
        setCurrentUser(user);
        setIsAuthOpen(false);
        addToast({
          type: 'success',
          title: `Welcome back, ${user.name}!`,
          description: 'Logged in to your customer account.',
        });
        return true;
      } catch {
        // Fallback to local customer account
      }
    }

    // Standard customer login
    const user: User = {
      id: 'usr-' + Date.now(),
      name: trimmedId.includes('@') ? trimmedId.split('@')[0] : trimmedId,
      email: trimmedId.includes('@') ? trimmedId : `${trimmedId}@customer.com`,
      role: 'customer',
    };
    setCurrentUser(user);
    setIsAuthOpen(false);
    addToast({
      type: 'success',
      title: `Welcome back, ${user.name}!`,
      description: 'Logged in to your customer account.',
    });
    return true;
  };

  const register = async (name: string, email: string, password?: string, phone?: string): Promise<boolean> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = (password || '').trim();

    if (trimmedEmail && trimmedPass.length >= 6) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
        if (userCred.user) {
          await updateProfile(userCred.user, { displayName: name.trim() });
        }
      } catch (err) {
        console.warn('Firebase Email register notice (proceeding with local account):', err);
      }
    }

    const user: User = {
      id: auth.currentUser?.uid || 'usr-' + Date.now(),
      name: name.trim(),
      email: trimmedEmail,
      phone: phone?.trim(),
      role: 'customer',
    };
    setCurrentUser(user);
    setIsAuthOpen(false);
    addToast({
      type: 'success',
      title: `Welcome to ${settings.storeName}!`,
      description: 'Your account has been created successfully.',
    });
    return true;
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout:', e);
    }
    setCurrentUser(null);
    if (viewMode === 'admin') {
      setViewMode('store');
    }
    addToast({
      type: 'info',
      title: 'Signed Out',
      description: 'You have been logged out of your account.',
    });
  };

  const demoLoginAdmin = () => {
    loginAsAdmin();
  };

  const demoLoginCustomer = () => {
    const customerUser: User = {
      id: 'usr-demo-1',
      name: 'Demo Customer',
      email: 'customer@azonlanka.lk',
      phone: '+94 76 699 9016',
      address: 'No 123, Main Street',
      city: 'Colombo 03',
      role: 'customer',
    };
    setCurrentUser(customerUser);
    setIsAuthOpen(false);
    addToast({
      type: 'success',
      title: 'Logged in as Demo Customer',
    });
  };

  // Product modal
  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    addRecentlyViewed(product.id);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        cart,
        wishlist,
        orders,
        reviews,
        currentUser,
        appliedPromo,
        isCloudSynced,
        firebaseStatus,
        lastCloudSyncTime,
        cloudPingMs,
        testFirebaseConnection,

        searchQuery,
        setSearchQuery,
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
        categories,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotals,
        cartItemCount,

        toggleWishlist,
        isWishlisted,

        applyPromoCode,
        removePromoCode,

        placeOrder,
        updateOrderStatus,
        deleteOrder,

        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        toggleStockStatus,

        addReview,
        getProductReviews,

        updateSettings,
        resetSettings,
        updateAdminAccount,
        addAdminAccount,
        deleteAdminAccount,

        login,
        register,
        loginWithGoogle,
        logout,
        demoLoginAdmin,
        loginAsAdmin,
        demoLoginCustomer,

        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isTrackOrderOpen,
        setIsTrackOrderOpen,
        trackingQuery,
        setTrackingQuery,
        activePolicyModal,
        setActivePolicyModal,
        recentlyViewedIds,
        addRecentlyViewed,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        selectedProduct,
        openProductModal,
        closeProductModal,
        viewMode,
        setViewMode,
        isAdminPasscodeModalOpen,
        setIsAdminPasscodeModalOpen,
        adminTab,
        setAdminTab,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
