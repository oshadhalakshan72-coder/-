import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from '../BrandLogo';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Tag,
  Sparkles,
  RefreshCw,
  Phone,
  Eye,
  EyeOff,
  Sliders,
  Image as ImageIcon,
  Palette,
  Upload,
  UploadCloud,
  Camera,
  Star,
  Loader2,
  Lock,
  ShieldCheck,
  ArrowLeft,
  Key,
  ShieldAlert,
  Users,
  User,
  UserCheck,
  UserPlus,
  Shield,
  Briefcase,
  Mail,
  KeyRound,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  Product,
  Order,
  OrderStatus,
  StoreSettings,
  PromoCode,
  HeroSlide,
  ThemeSettings,
  AdminAccount,
} from '../../types';
import { formatCurrency, getWhatsAppLink, processDeviceImage } from '../../utils/helpers';
import { THEME_PRESETS, DEFAULT_THEME, applyThemeVariables } from '../../utils/theme';
import { FirebaseLiveBadge, FirebaseOverviewCard } from './FirebaseStatusIndicator';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    settings,
    updateSettings,
    resetSettings,
    updateAdminAccount,
    addAdminAccount,
    deleteAdminAccount,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    toggleStockStatus,
    updateOrderStatus,
    deleteOrder,
    adminTab,
    setAdminTab,
    setViewMode,
    currentUser,
    demoLoginAdmin,
    loginAsAdmin,
    isCloudSynced,
  } = useStore();

  // Admin Profile Edit & Add Modal State
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
  const [editAdminForm, setEditAdminForm] = useState<AdminAccount | null>(null);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState<{
    name: string;
    email: string;
    roleTitle: string;
    badgeColor: 'amber' | 'cyan' | 'emerald' | 'purple' | 'rose';
    phone: string;
    passcode: string;
    permissions: ('all' | 'products' | 'orders' | 'settings' | 'team')[];
  }>({
    name: '',
    email: '',
    roleTitle: '',
    badgeColor: 'purple',
    phone: '',
    passcode: '',
    permissions: ['orders', 'products'],
  });
  const [showNewAdminPasscode, setShowNewAdminPasscode] = useState(false);
  const [showAdminSwitchDropdown, setShowAdminSwitchDropdown] = useState(false);
  const [showAdminPasscodeInEdit, setShowAdminPasscodeInEdit] = useState(false);

  // Search & Filter within Admin
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isClearProductsModalOpen, setIsClearProductsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [orderTrackingInput, setOrderTrackingInput] = useState('');

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Electronics');
  const [newProdPrice, setNewProdPrice] = useState<number>(10000);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number>(12500);
  const [newProdStock, setNewProdStock] = useState<number>(20);
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdFeatures, setNewProdFeatures] = useState('');
  const [newProdImages, setNewProdImages] = useState<string[]>([]);
  const [newProdUrlInput, setNewProdUrlInput] = useState<string>('');
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false);
  const [imageUploadError, setImageUploadError] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [newProdColors, setNewProdColors] = useState('');
  const [newProdSizes, setNewProdSizes] = useState('');
  const [newProdIsFeatured, setNewProdIsFeatured] = useState(true);
  const [newProdIsNewArrival, setNewProdIsNewArrival] = useState(true);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(10);
  const [newPromoMinOrder, setNewPromoMinOrder] = useState(2000);

  // Maximum images allowed per product
  const MAX_PRODUCT_IMAGES = 5;

  // Device image upload and optimization handlers
  const handleDeviceImageFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    
    // Check if limit is already reached
    if (newProdImages.length >= MAX_PRODUCT_IMAGES) {
      setImageUploadError(`Maximum limit of ${MAX_PRODUCT_IMAGES} images already reached. Delete an existing image to upload new ones.`);
      return;
    }

    const availableSlots = MAX_PRODUCT_IMAGES - newProdImages.length;
    setIsUploadingImages(true);
    setImageUploadError('');

    try {
      const processedList: string[] = [];
      const filesToProcess = Array.from(files).slice(0, availableSlots);

      if (files.length > availableSlots) {
        setImageUploadError(`Only ${availableSlots} more image(s) can be added (Maximum ${MAX_PRODUCT_IMAGES} images allowed).`);
      }

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        if (!file.type.startsWith('image/')) {
          continue;
        }
        const dataUrl = await processDeviceImage(file, 1200, 0.82);
        processedList.push(dataUrl);
      }

      if (processedList.length > 0) {
        setNewProdImages((prev) => [...prev, ...processedList].slice(0, MAX_PRODUCT_IMAGES));
      } else if (!imageUploadError) {
        setImageUploadError('Please select valid image files (JPG, PNG, WebP).');
      }
    } catch (err) {
      console.error('Error processing device images:', err);
      setImageUploadError('Failed to process image from device. Please try another file.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleAddUrlImage = () => {
    if (!newProdUrlInput.trim()) return;
    if (newProdImages.length >= MAX_PRODUCT_IMAGES) {
      setImageUploadError(`Maximum limit of ${MAX_PRODUCT_IMAGES} images reached. Delete an existing image first.`);
      return;
    }

    const url = newProdUrlInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image/')) {
      setImageUploadError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    setNewProdImages((prev) => [...prev, url].slice(0, MAX_PRODUCT_IMAGES));
    setNewProdUrlInput('');
    setImageUploadError('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setNewProdImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImageUploadError('');
  };

  const handleMoveImage = (currentIndex: number, targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= newProdImages.length) return;
    setNewProdImages((prev) => {
      const copy = [...prev];
      const item = copy.splice(currentIndex, 1)[0];
      copy.splice(targetIndex, 0, item);
      return copy;
    });
  };

  const handleSetPrimaryCover = (index: number) => {
    if (index === 0) return;
    setNewProdImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleDeviceImageFiles(e.dataTransfer.files);
    }
  };

  // Sync settings form when settings change
  React.useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Analytics Metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, o) => acc + o.total, 0);

    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const processingOrders = orders.filter((o) => o.status === 'processing').length;
    const lowStockCount = products.filter((p) => p.inStock && p.stock <= 5).length;
    const outOfStockCount = products.filter((p) => !p.inStock || p.stock <= 0).length;
    const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      processingOrders,
      lowStockCount,
      outOfStockCount,
      avgOrderValue,
    };
  }, [orders, products]);

  // Handle open edit product
  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setNewProdName(prod.name);
    setNewProdCategory(prod.category);
    setNewProdPrice(prod.price);
    setNewProdOriginalPrice(prod.originalPrice || 0);
    setNewProdStock(prod.stock);
    setNewProdDescription(prod.description);
    setNewProdFeatures(prod.features?.join('\n') || '');
    setNewProdImages(prod.images && Array.isArray(prod.images) ? [...prod.images] : []);
    setNewProdUrlInput('');
    setImageUploadError('');
    setNewProdColors(prod.colors?.join(', ') || '');
    setNewProdSizes(prod.sizes?.join(', ') || '');
    setNewProdIsFeatured(!!prod.isFeatured);
    setNewProdIsNewArrival(!!prod.isNewArrival);
    setIsAddProductModalOpen(true);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setNewProdName('');
    setNewProdCategory('Electronics');
    setNewProdPrice(12000);
    setNewProdOriginalPrice(15000);
    setNewProdStock(25);
    setNewProdDescription('');
    setNewProdFeatures('Premium build quality\n1-Year official warranty\nFast shipping');
    setNewProdImages([
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ]);
    setNewProdUrlInput('');
    setImageUploadError('');
    setNewProdColors('Black, Silver');
    setNewProdSizes('');
    setNewProdIsFeatured(true);
    setNewProdIsNewArrival(true);
    setIsAddProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    const imgArray = newProdImages
      .map((s) => (typeof s === 'string' ? s.trim() : ''))
      .filter((s) => s.length > 0);

    const featArray = newProdFeatures
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const colorArray = newProdColors
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const sizeArray = newProdSizes
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const sku =
      editingProduct?.sku ||
      `${newProdCategory.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: newProdName.trim(),
        category: newProdCategory,
        price: Number(newProdPrice),
        originalPrice: Number(newProdOriginalPrice) || undefined,
        stock: Number(newProdStock),
        inStock: Number(newProdStock) > 0,
        description: newProdDescription.trim(),
        features: featArray,
        images: imgArray.length > 0 ? imgArray : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
        colors: colorArray.length > 0 ? colorArray : undefined,
        sizes: sizeArray.length > 0 ? sizeArray : undefined,
        isFeatured: newProdIsFeatured,
        isNewArrival: newProdIsNewArrival,
      });
    } else {
      addProduct({
        name: newProdName.trim(),
        category: newProdCategory,
        price: Number(newProdPrice),
        originalPrice: Number(newProdOriginalPrice) || undefined,
        stock: Number(newProdStock),
        inStock: Number(newProdStock) > 0,
        description: newProdDescription.trim(),
        features: featArray,
        images: imgArray.length > 0 ? imgArray : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
        sku,
        tags: [newProdCategory.toLowerCase(), 'new', 'trending'],
        colors: colorArray.length > 0 ? colorArray : undefined,
        sizes: sizeArray.length > 0 ? sizeArray : undefined,
        isFeatured: newProdIsFeatured,
        isNewArrival: newProdIsNewArrival,
      });
    }

    setIsAddProductModalOpen(false);
  };

  // Add Promo Code in Settings
  const handleAddPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const newPromo: PromoCode = {
      code: newPromoCode.trim().toUpperCase(),
      discountPercent: Number(newPromoDiscount),
      minOrder: Number(newPromoMinOrder),
      isActive: true,
    };
    updateSettings({
      promoCodes: [...settings.promoCodes, newPromo],
    });
    setNewPromoCode('');
  };

  const handleTogglePromoCode = (code: string) => {
    const next = settings.promoCodes.map((p) =>
      p.code === code ? { ...p, isActive: !p.isActive } : p
    );
    updateSettings({ promoCodes: next });
  };

  const handleDeletePromoCode = (code: string) => {
    const next = settings.promoCodes.filter((p) => p.code !== code);
    updateSettings({ promoCodes: next });
  };

  // Generate Customer WhatsApp Dispatch Notification from Admin
  const getCustomerWhatsAppStatusUpdateUrl = (order: Order, status: OrderStatus) => {
    const cleanPhone = order.customerPhone.replace(/\D/g, '');
    let msg = `Hello *${order.customerName}*! 👋\nThis is an official update regarding your *${settings.storeName}* order *#${order.orderNumber}*:\n\n`;

    if (status === 'shipped') {
      msg += `🚚 *Your order has been DISPATCHED!*
Your package is on its way to ${order.deliveryAddress}, ${order.city}.
${order.trackingNumber ? `📦 *Courier Tracking Number:* \`${order.trackingNumber}\`\n` : ''}
Expected delivery within 24-48 hours. Please keep payment of *${formatCurrency(
        order.total,
        settings.currencySymbol
      )}* ready if Cash on Delivery.`;
    } else if (status === 'delivered') {
      msg += `🎉 *Your order has been marked as DELIVERED!*
Thank you for shopping with ${settings.storeName}. We hope you love your products!`;
    } else if (status === 'processing') {
      msg += `⚙️ *Your order is now being processed and packed* by our fulfillment team. We will notify you once dispatched.`;
    } else {
      msg += `Your order status has been updated to: *${status.toUpperCase()}*.`;
    }

    msg += `\n\nNeed assistance? Reply directly to this WhatsApp message. Have a wonderful day!`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      setViewMode('store');
    }
  }, [currentUser?.role, setViewMode]);

  // If user is not an administrator, do not display any admin screen or details
  if (currentUser?.role !== 'admin') {
    return null;
  }

  const currentAdminAccount = (settings.adminAccounts || []).find(
    (a) => a.id === currentUser?.adminRoleId || a.email === currentUser?.email
  ) || (settings.adminAccounts && settings.adminAccounts[0]);

  // Check if current logged-in user is Super Admin
  const isSuperAdmin = Boolean(
    currentAdminAccount?.id === 'admin-1' ||
    currentAdminAccount?.isDefault ||
    currentAdminAccount?.permissions?.includes('all') ||
    currentAdminAccount?.permissions?.includes('team') ||
    currentAdminAccount?.roleTitle?.toLowerCase().includes('owner') ||
    currentAdminAccount?.roleTitle?.toLowerCase().includes('super') ||
    currentAdminAccount?.name?.toLowerCase().includes('super')
  );

  // If not super admin and trying to view restricted tabs, automatically route to overview
  React.useEffect(() => {
    if (!isSuperAdmin && (adminTab === 'team' || adminTab === 'settings')) {
      setAdminTab('overview');
    }
  }, [isSuperAdmin, adminTab, setAdminTab]);

  return (
    <div id="admin-dashboard-root" className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Admin Navigation Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-14 sm:top-16 z-30 px-3 sm:px-8 py-3 sm:py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-lg font-black text-white truncate">Store Control Center</h1>
                <span className="text-[9px] sm:text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full uppercase border border-amber-500/30 truncate">
                  {currentAdminAccount?.roleTitle || 'Store Admin'}
                </span>
                <FirebaseLiveBadge />
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Logged in as <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.email})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full md:w-auto">
            {/* Quick Switch Admin Dropdown */}
            <div className="relative col-span-2 sm:col-span-1">
              <button
                type="button"
                id="admin-switch-persona-btn"
                onClick={() => setShowAdminSwitchDropdown(!showAdminSwitchDropdown)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center justify-between sm:justify-center gap-2 shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Switch Admin ({(settings.adminAccounts || []).length} Staff)</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {showAdminSwitchDropdown && (
                <div className="absolute left-0 sm:left-auto right-0 mt-2 w-full sm:w-72 max-w-[calc(100vw-1.5rem)] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Authorized Staff Roles
                  </div>
                  {(settings.adminAccounts || []).map((adm) => {
                    const isSelected = adm.id === currentAdminAccount?.id;
                    return (
                      <button
                        key={adm.id}
                        type="button"
                        onClick={() => {
                          loginAsAdmin(adm.id);
                          setShowAdminSwitchDropdown(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                            adm.badgeColor === 'amber'
                              ? 'bg-amber-400'
                              : adm.badgeColor === 'cyan'
                              ? 'bg-cyan-400'
                              : adm.badgeColor === 'purple'
                              ? 'bg-purple-400'
                              : adm.badgeColor === 'rose'
                              ? 'bg-rose-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white truncate">{adm.name}</span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{adm.roleTitle}</p>
                        </div>
                      </button>
                    );
                  })}
                  {isSuperAdmin && (
                    <div className="pt-1 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setAdminTab('team');
                          setShowAdminSwitchDropdown(false);
                        }}
                        className="w-full text-center py-1.5 text-[11px] text-emerald-400 hover:underline font-bold"
                      >
                        Manage {(settings.adminAccounts || []).length} Admins & Passcodes →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              id="admin-switch-storefront-btn"
              onClick={() => setViewMode('store')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Storefront</span>
            </button>

            <button
              id="admin-add-product-quick-btn"
              onClick={handleOpenAddProduct}
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3] shrink-0" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5 sm:space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Gross Sales</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white">
              {formatCurrency(metrics.totalRevenue, settings.currencySymbol)}
            </p>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live revenue count
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white">{metrics.totalOrders}</p>
            <span className="text-[11px] text-cyan-400 font-semibold">
              {metrics.pendingOrders} Pending confirmation
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Products</span>
              <Package className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white">{products.length}</p>
            <span className="text-[11px] text-slate-400 font-semibold">
              {products.filter((p) => p.inStock).length} in stock
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Stock Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-400">
              {metrics.lowStockCount + metrics.outOfStockCount} Items
            </p>
            <span className="text-[11px] text-amber-300 font-semibold">
              {metrics.lowStockCount} Low stock • {metrics.outOfStockCount} Out of stock
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-bold overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap -mx-1 px-1 sm:mx-0 sm:px-1.5">
          <button
            id="admin-tab-overview"
            onClick={() => setAdminTab('overview')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shrink-0 ${
              adminTab === 'overview'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Overview</span>
          </button>

          <button
            id="admin-tab-products"
            onClick={() => setAdminTab('products')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shrink-0 ${
              adminTab === 'products'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            id="admin-tab-orders"
            onClick={() => setAdminTab('orders')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shrink-0 ${
              adminTab === 'orders'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Orders ({orders.length})</span>
            {metrics.pendingOrders > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {metrics.pendingOrders}
              </span>
            )}
          </button>

          {isSuperAdmin && (
            <button
              id="admin-tab-team"
              onClick={() => setAdminTab('team')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shrink-0 ${
                adminTab === 'team'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Admin Team</span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-500/30">
                {(settings.adminAccounts || []).length} Admins
              </span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              id="admin-tab-settings"
              onClick={() => setAdminTab('settings')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shrink-0 ${
                adminTab === 'settings'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Settings</span>
            </button>
          )}
        </div>

        {/* TAB 1: OVERVIEW */}
        {adminTab === 'overview' && (
          <div className="space-y-6">
            <FirebaseOverviewCard />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders Live Stream */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Recent Customer Orders</span>
                </h3>
                <button
                  onClick={() => setAdminTab('orders')}
                  className="text-xs text-emerald-400 hover:underline font-semibold"
                >
                  View all ({orders.length}) →
                </button>
              </div>

              <div className="space-y-3 divide-y divide-slate-800/60">
                {orders.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No orders recorded yet.</p>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">{order.orderNumber}</span>
                          <span className="text-slate-400 font-semibold">• {order.customerName}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {order.items.length} item(s) • {order.city} • {order.paymentMethod.toUpperCase()}
                        </p>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <span className="font-bold text-emerald-400">
                          {formatCurrency(order.total, settings.currencySymbol)}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedOrderDetails(order);
                            setOrderTrackingInput(order.trackingNumber || '');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions & Low Stock Alerts */}
            <div className="space-y-6">
              {/* WhatsApp Quick Link Info */}
              <div className="p-5 rounded-3xl bg-emerald-950/40 border border-emerald-500/30 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Notifications Active</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Store alerts are connected to: <b>+{settings.ownerWhatsAppNumber}</b>.
                  Orders placed by customers generate direct WhatsApp message links for instant notification.
                </p>
                {isSuperAdmin && (
                  <button
                    onClick={() => setAdminTab('settings')}
                    className="w-full py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black hover:bg-emerald-400 transition-colors"
                  >
                    Configure WhatsApp Number
                  </button>
                )}
              </div>

              {/* Low Stock Alerts */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Inventory Health</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {products
                    .filter((p) => p.stock <= 5)
                    .slice(0, 4)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800"
                      >
                        <span className="truncate max-w-[170px] text-slate-200">{p.name}</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            p.stock <= 0
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {p.stock <= 0 ? 'Out of stock' : `${p.stock} left`}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {adminTab === 'products' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search product inventory..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none w-64"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {products.length > 0 && (
                  <button
                    id="admin-clear-all-prod-btn"
                    onClick={() => setIsClearProductsModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Products</span>
                  </button>
                )}

                <button
                  id="admin-add-prod-btn-tab"
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 w-fit shadow-lg active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Empty Products State */}
            {products.length === 0 ? (
              <div className="p-8 sm:p-12 text-center bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <Package className="w-7 h-7 stroke-[1.75]" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-white">No Products in Store</h4>
                  <p className="text-xs text-slate-400">
                    Dummy products have been cleared. Ready to add your first real product with prices, images, and variants.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Create Your First Product</span>
                </button>
              </div>
            ) : (
              <>
                {/* Products Table (Desktop) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Product</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Price</th>
                        <th className="p-3.5">Stock</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {products
                        .filter((p) => {
                          if (!productSearch.trim()) return true;
                          return (
                            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                            p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
                            p.sku.toLowerCase().includes(productSearch.toLowerCase())
                          );
                        })
                        .map((prod) => (
                          <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-3.5 flex items-center gap-3">
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-white truncate max-w-xs">{prod.name}</p>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  SKU: {prod.sku}
                                </span>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className="bg-slate-800 px-2 py-1 rounded-lg text-slate-300">
                                {prod.category}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-emerald-400">
                              {formatCurrency(prod.price, settings.currencySymbol)}
                            </td>
                            <td className="p-3.5 font-semibold text-slate-200">
                              {prod.stock} units
                            </td>
                            <td className="p-3.5">
                              <button
                                onClick={() => toggleStockStatus(prod.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                                  prod.inStock && prod.stock > 0
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                }`}
                              >
                                {prod.inStock && prod.stock > 0 ? 'In Stock' : 'Out of Stock'}
                              </button>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => handleEditProduct(prod)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(prod.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Product Cards (sm:hidden) */}
                <div className="block sm:hidden space-y-3">
                  {products
                    .filter((p) => {
                      if (!productSearch.trim()) return true;
                      return (
                        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.sku.toLowerCase().includes(productSearch.toLowerCase())
                      );
                    })
                    .map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-semibold mb-1 inline-block">
                              {prod.category}
                            </span>
                            <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-black text-emerald-400">
                                {formatCurrency(prod.price, settings.currencySymbol)}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Stock: {prod.stock}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                          <button
                            onClick={() => toggleStockStatus(prod.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                              prod.inStock && prod.stock > 0
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            {prod.inStock && prod.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditProduct(prod)}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-[11px] font-bold flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => deleteProduct(prod.id)}
                              className="p-1.5 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-800/40"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {adminTab === 'orders' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
                {['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl capitalize transition-all whitespace-nowrap ${
                        orderStatusFilter === st
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customer, phone, ID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none w-64"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Orders Table (Desktop) & Cards (Mobile) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">Customer & Phone</th>
                    <th className="p-3.5">Items</th>
                    <th className="p-3.5">Total & Payment</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions & WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {orders
                    .filter((o) => {
                      if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
                      if (!orderSearch.trim()) return true;
                      const q = orderSearch.toLowerCase();
                      return (
                        o.orderNumber.toLowerCase().includes(q) ||
                        o.customerName.toLowerCase().includes(q) ||
                        o.customerPhone.toLowerCase().includes(q) ||
                        o.city.toLowerCase().includes(q)
                      );
                    })
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-white block">
                            {order.orderNumber}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-white block">
                            {order.customerName}
                          </span>
                          <span className="text-slate-400 text-[11px]">{order.customerPhone}</span>
                          <span className="text-slate-500 text-[10px] block">{order.city}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-200">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                          </span>
                          <span className="text-slate-400 text-[10px] block truncate max-w-[180px]">
                            {order.items.map((i) => i.productName).join(', ')}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-black text-emerald-400 block">
                            {formatCurrency(order.total, settings.currencySymbol)}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-slate-950 border border-slate-700 text-white text-[11px] font-bold rounded-xl px-2.5 py-1.5 focus:border-emerald-500 outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          {/* Send WhatsApp Status Message to Customer */}
                          <a
                            href={getCustomerWhatsAppStatusUpdateUrl(order, order.status)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-colors"
                            title="Send dispatch WhatsApp message to customer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Notify Customer</span>
                          </a>

                          <button
                            onClick={() => {
                              setSelectedOrderDetails(order);
                              setOrderTrackingInput(order.trackingNumber || '');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View Full Order Info"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Order Cards (sm:hidden) */}
            <div className="block sm:hidden space-y-3">
              {orders
                .filter((o) => {
                  if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
                  if (!orderSearch.trim()) return true;
                  const q = orderSearch.toLowerCase();
                  return (
                    o.orderNumber.toLowerCase().includes(q) ||
                    o.customerName.toLowerCase().includes(q) ||
                    o.customerPhone.toLowerCase().includes(q) ||
                    o.city.toLowerCase().includes(q)
                  );
                })
                .map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white text-xs">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{order.customerName}</span>
                        <span className="text-[11px] text-slate-400">{order.customerPhone}</span>
                        <span className="text-[10px] text-slate-500">{order.city}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-400 block">
                          {formatCurrency(order.total, settings.currencySymbol)}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="font-semibold text-slate-400 block mb-0.5">
                        Items ({order.items.reduce((s, i) => s + i.quantity, 0)}):
                      </span>
                      <span className="truncate block">
                        {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="flex-1 bg-slate-900 border border-slate-700 text-white text-[11px] font-bold rounded-xl px-2.5 py-2 focus:border-emerald-500 outline-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <a
                        href={getCustomerWhatsAppStatusUpdateUrl(order, order.status)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                        title="Notify Customer via WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => {
                          setSelectedOrderDetails(order);
                          setOrderTrackingInput(order.trackingNumber || '');
                        }}
                        className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: STORE & WHATSAPP SETTINGS (Super Admin Only) */}
        {adminTab === 'settings' && isSuperAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General & WhatsApp Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>Storefront & WhatsApp Parameters</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Tagline / Subheader
                  </label>
                  <input
                    type="text"
                    value={settingsForm.storeTagline}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, storeTagline: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Brand Logo Display & Custom Upload */}
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Official Brand Logo & Artwork</span>
                    </span>
                    {settingsForm.customLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, customLogoUrl: '' })}
                        className="text-[10px] text-rose-400 hover:text-rose-300 font-bold underline"
                      >
                        Reset to Official Vector Logo
                      </button>
                    )}
                  </div>

                  {/* Logo Live Preview */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <BrandLogo size="lg" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-400 font-bold block">✓ Active on Navbar, Footer & Invoices</span>
                      <span className="text-[9px] text-slate-400">Dove + 'a' + 8-Point Compass Star</span>
                    </div>
                  </div>

                  {/* Optional Custom Logo Upload / URL */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase block">
                      Custom Logo Image Upload / URL (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://... or upload image below"
                        value={settingsForm.customLogoUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, customLogoUrl: e.target.value })}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                      />
                      <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer border border-slate-700 flex items-center gap-1 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const dataUrl = await processDeviceImage(file, 600, 0.85);
                                setSettingsForm({ ...settingsForm, customLogoUrl: dataUrl });
                              } catch (err) {
                                console.error('Logo upload error:', err);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Notification Number */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" /> Owner WhatsApp Alert Number (With Country Code)
                  </label>
                  <input
                    type="text"
                    placeholder="94766999016"
                    value={settingsForm.ownerWhatsAppNumber}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, ownerWhatsAppNumber: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl p-3 text-white font-mono focus:border-emerald-400 outline-none"
                  />
                  <p className="text-[11px] text-slate-400">
                    Format without plus sign or dashes, e.g. <b>94766999016</b> for Sri Lanka.
                  </p>
                </div>

                {/* Admin Access Passcode */}
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> Administrator Panel Passcode / Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new administrator password / passcode"
                    value={settingsForm.adminPasscode || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, adminPasscode: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-xl p-3 text-white font-mono focus:border-amber-400 outline-none"
                  />
                  <p className="text-[11px] text-slate-400">
                    Use this passcode to unlock the Admin Portal safely from any device.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={settingsForm.currencySymbol}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                      Delivery Fee ({settingsForm.currencySymbol})
                    </label>
                    <input
                      type="number"
                      value={settingsForm.standardDeliveryFee}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          standardDeliveryFee: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Free Delivery Threshold ({settingsForm.currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        freeShippingThreshold: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Top Announcement Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    onClick={() => updateSettings(settingsForm)}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    Save Store Settings
                  </button>
                  <button
                    onClick={resetSettings}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs transition-colors border border-slate-700"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE THEME COLOR CUSTOMIZER */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <span>Store Theme & Color Palette</span>
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  Live Customizer
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Preset Palettes */}
                <div>
                  <label className="font-bold text-slate-300 uppercase tracking-wider block mb-2">
                    Select Ready Theme Palette
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {THEME_PRESETS.map((preset) => {
                      const isSelected = settingsForm.theme?.preset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            const newTheme: ThemeSettings = {
                              primaryColor: preset.primary,
                              accentColor: preset.accent,
                              secondaryColor: preset.secondary,
                              preset: preset.id,
                              mode: settingsForm.theme?.mode || 'dark',
                            };
                            setSettingsForm({ ...settingsForm, theme: newTheme });
                            applyThemeVariables(newTheme);
                          }}
                          className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                            isSelected
                              ? 'bg-slate-800/90 border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-4 h-4 rounded-full shadow-sm shrink-0"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <span
                              className="w-4 h-4 rounded-full shadow-sm shrink-0"
                              style={{ backgroundColor: preset.accent }}
                            />
                          </div>
                          <div>
                            <span className="font-bold text-[11px] text-white block truncate">
                              {preset.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Pickers */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="font-bold text-slate-200 block">Custom Hex Color Controls</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Primary Theme Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settingsForm.theme?.primaryColor || '#10b981'}
                          onChange={(e) => {
                            const newTheme: ThemeSettings = {
                              ...(settingsForm.theme || DEFAULT_THEME),
                              primaryColor: e.target.value,
                              preset: 'custom',
                            };
                            setSettingsForm({ ...settingsForm, theme: newTheme });
                            applyThemeVariables(newTheme);
                          }}
                          className="w-9 h-9 rounded-xl border border-slate-700 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settingsForm.theme?.primaryColor || '#10b981'}
                          onChange={(e) => {
                            const newTheme: ThemeSettings = {
                              ...(settingsForm.theme || DEFAULT_THEME),
                              primaryColor: e.target.value,
                              preset: 'custom',
                            };
                            setSettingsForm({ ...settingsForm, theme: newTheme });
                            applyThemeVariables(newTheme);
                          }}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 font-mono text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Accent Theme Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settingsForm.theme?.accentColor || '#06b6d4'}
                          onChange={(e) => {
                            const newTheme: ThemeSettings = {
                              ...(settingsForm.theme || DEFAULT_THEME),
                              accentColor: e.target.value,
                              preset: 'custom',
                            };
                            setSettingsForm({ ...settingsForm, theme: newTheme });
                            applyThemeVariables(newTheme);
                          }}
                          className="w-9 h-9 rounded-xl border border-slate-700 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settingsForm.theme?.accentColor || '#06b6d4'}
                          onChange={(e) => {
                            const newTheme: ThemeSettings = {
                              ...(settingsForm.theme || DEFAULT_THEME),
                              accentColor: e.target.value,
                              preset: 'custom',
                            };
                            setSettingsForm({ ...settingsForm, theme: newTheme });
                            applyThemeVariables(newTheme);
                          }}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 font-mono text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display Theme Mode */}
                <div>
                  <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Background Atmosphere
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'dark', label: 'Dark Slate (Default)' },
                      { id: 'oled', label: 'Deep OLED Black' },
                      { id: 'midnight', label: 'Midnight Navy' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          const newTheme: ThemeSettings = {
                            ...(settingsForm.theme || DEFAULT_THEME),
                            mode: m.id as any,
                          };
                          setSettingsForm({ ...settingsForm, theme: newTheme });
                          applyThemeVariables(newTheme);
                        }}
                        className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-colors ${
                          settingsForm.theme?.mode === m.id
                            ? 'bg-slate-800 text-white border-emerald-400'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Mockup Preview Box */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Live UI Preview
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-950 font-bold"
                        style={{ backgroundColor: settingsForm.theme?.primaryColor || '#10b981' }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">
                          Theme Button & Accent
                        </span>
                        <span
                          className="text-[10px] font-semibold"
                          style={{ color: settingsForm.theme?.accentColor || '#06b6d4' }}
                        >
                          Rs. 24,500 (Free Islandwide Delivery)
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl text-slate-950 text-[11px] font-black shadow-md"
                      style={{ backgroundColor: settingsForm.theme?.primaryColor || '#10b981' }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                {/* Save Theme Button */}
                <button
                  type="button"
                  onClick={() => updateSettings(settingsForm)}
                  className="w-full py-3 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg active:scale-95"
                  style={{
                    backgroundColor: settingsForm.theme?.primaryColor || '#10b981',
                  }}
                >
                  Save & Apply Store Theme
                </button>
              </div>
            </div>

            {/* Coupons & Promo Codes Manager */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                <span>Promo Discount Coupons</span>
              </h3>

              {/* Add coupon form */}
              <form
                onSubmit={handleAddPromoCode}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs"
              >
                <span className="font-bold text-slate-300 block">Create New Discount Coupon</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="CODE (e.g. SAVE15)"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono uppercase focus:border-emerald-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Discount %"
                    value={newPromoDiscount}
                    onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-white focus:border-emerald-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Min Order"
                    value={newPromoMinOrder}
                    onChange={(e) => setNewPromoMinOrder(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newPromoCode.trim()}
                  className="w-full py-2 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold rounded-xl text-xs transition-colors border border-slate-700"
                >
                  Add Coupon Code
                </button>
              </form>

              {/* Active Coupons List */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-400 uppercase text-[11px] tracking-wider block">
                  Active Coupons
                </span>
                {settings.promoCodes.map((p) => (
                  <div
                    key={p.code}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
                  >
                    <div>
                      <span className="font-mono font-bold text-emerald-400">{p.code}</span>
                      <span className="text-slate-400 ml-2">
                        {p.discountPercent}% OFF (Min {formatCurrency(p.minOrder, settings.currencySymbol)})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePromoCode(p.code)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.isActive
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => handleDeletePromoCode(p.code)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN TEAM & STAFF ROLES (Super Admin Only) */}
        {adminTab === 'team' && isSuperAdmin && (
          <div className="space-y-6">
            {/* Header / Intro Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Multi-Admin Role-Based Security ({(settings.adminAccounts || []).length} Admins)</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Store Staff & {(settings.adminAccounts || []).length} Administrator Roles
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                    Your store comes with dedicated staff profiles for operational management: Store Owner / Super Admin, Inventory & Stock Management, Orders & WhatsApp Dispatch, and Customer Support & Accounts. You can also add custom admin staff roles anytime.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    id="add-new-admin-btn"
                    onClick={() => {
                      setNewAdminForm({
                        name: '',
                        email: '',
                        roleTitle: '',
                        badgeColor: 'purple',
                        phone: '+94 7',
                        passcode: '',
                        permissions: ['orders', 'products'],
                      });
                      setShowNewAdminPasscode(false);
                      setIsAddAdminModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Add New Admin</span>
                  </button>

                  <span className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                    Active: <span className="text-amber-400">{currentUser?.name}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Accounts Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {(settings.adminAccounts || []).map((admin, idx) => {
                const isActiveUser =
                  currentUser?.adminRoleId === admin.id ||
                  currentUser?.email.toLowerCase() === admin.email.toLowerCase();

                const badgeColorClass =
                  admin.badgeColor === 'amber'
                    ? 'from-amber-500/20 to-amber-950/30 border-amber-500/40 text-amber-300'
                    : admin.badgeColor === 'cyan'
                    ? 'from-cyan-500/20 to-cyan-950/30 border-cyan-500/40 text-cyan-300'
                    : admin.badgeColor === 'purple'
                    ? 'from-purple-500/20 to-purple-950/30 border-purple-500/40 text-purple-300'
                    : admin.badgeColor === 'rose'
                    ? 'from-rose-500/20 to-rose-950/30 border-rose-500/40 text-rose-300'
                    : 'from-emerald-500/20 to-emerald-950/30 border-emerald-500/40 text-emerald-300';

                const iconBg =
                  admin.badgeColor === 'amber'
                    ? 'bg-amber-500 text-slate-950'
                    : admin.badgeColor === 'cyan'
                    ? 'bg-cyan-500 text-slate-950'
                    : admin.badgeColor === 'purple'
                    ? 'bg-purple-500 text-slate-950'
                    : admin.badgeColor === 'rose'
                    ? 'bg-rose-500 text-slate-950'
                    : 'bg-emerald-500 text-slate-950';

                const iconEmoji =
                  admin.badgeColor === 'amber'
                    ? '👑'
                    : admin.badgeColor === 'cyan'
                    ? '📦'
                    : admin.badgeColor === 'purple'
                    ? '💜'
                    : admin.badgeColor === 'rose'
                    ? '💎'
                    : '🚚';

                return (
                  <div
                    key={admin.id}
                    className={`rounded-3xl bg-gradient-to-b ${badgeColorClass} border p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden`}
                  >
                    {isActiveUser && (
                      <div className="absolute top-3.5 right-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black tracking-wide shadow-md">
                          <CheckCircle2 className="w-3 h-3" /> ACTIVE
                        </span>
                      </div>
                    )}

                    <div className="space-y-3.5">
                      {/* Avatar & Title */}
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base shadow-lg shrink-0 ${iconBg}`}>
                          {iconEmoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <span>Admin #{idx + 1}</span>
                            {admin.isDefault && (
                              <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-black border border-amber-500/30">
                                OWNER
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base font-black text-white truncate">{admin.name}</h3>
                          <p className="text-[11px] font-semibold text-slate-300 truncate">{admin.roleTitle}</p>
                        </div>
                      </div>

                      {/* Credentials Box */}
                      <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <Mail className="w-3 h-3 text-slate-500 shrink-0" /> Login:
                          </span>
                          <span className="font-mono text-white font-semibold text-[10px] truncate max-w-[130px]">
                            {admin.email}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <Phone className="w-3 h-3 text-slate-500 shrink-0" /> Phone:
                          </span>
                          <span className="font-mono text-slate-200 text-[10px] truncate max-w-[120px]">
                            {admin.phone || 'Not set'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-900">
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <Key className="w-3 h-3 text-amber-400 shrink-0" /> Passcode:
                          </span>
                          <span className="font-mono font-bold text-amber-300 tracking-wider bg-amber-500/10 px-1.5 py-0.5 rounded-lg border border-amber-500/20 text-[11px]">
                            ••••••••
                          </span>
                        </div>
                      </div>

                      {/* Permissions */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block">
                          Permissions:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {admin.permissions.map((perm, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[9px] font-semibold text-slate-300 flex items-center gap-1"
                            >
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                              <span>{perm}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2.5 border-t border-slate-800/80 space-y-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAdmin(admin);
                            setEditAdminForm({ ...admin });
                            setShowAdminPasscodeInEdit(false);
                          }}
                          className="py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                        >
                          <Edit2 className="w-3 h-3 text-amber-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => loginAsAdmin(admin.id)}
                          disabled={isActiveUser}
                          className={`py-2 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-colors ${
                            isActiveUser
                              ? 'bg-slate-800 text-slate-500 cursor-default'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                          }`}
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>{isActiveUser ? 'Active' : 'Sign In'}</span>
                        </button>
                      </div>

                      {!admin.isDefault && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${admin.name} (${admin.roleTitle}) from Admin Staff?`)) {
                              deleteAdminAccount(admin.id);
                            }
                          }}
                          className="w-full py-1 text-center text-[10px] text-rose-400/80 hover:text-rose-300 font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove Admin
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Admin Team Information Note */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 flex-shrink-0 mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    How Store Staff Accounts Work
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Each admin can use their dedicated email or unique passcode to unlock the Control Panel. You can add new admins, edit names, update contact numbers, or change passcodes anytime.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminTab('overview')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs whitespace-nowrap transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD NEW ADMIN ACCOUNT MODAL */}
      {isAddAdminModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl p-4 sm:p-6 space-y-4 text-slate-100 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add New Administrator</h3>
                  <p className="text-[11px] text-slate-400">Create a new staff role with unique passcode & permissions</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddAdminModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAdminForm.name.trim() || !newAdminForm.email.trim() || !newAdminForm.passcode.trim()) {
                  return;
                }
                addAdminAccount(newAdminForm);
                setIsAddAdminModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">
                  Full Name / Admin Staff Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  placeholder="e.g. Ruwan Silva"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminForm.roleTitle}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, roleTitle: e.target.value })}
                    placeholder="e.g. Marketing & Promo Lead"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Theme Badge Color
                  </label>
                  <select
                    value={newAdminForm.badgeColor}
                    onChange={(e) =>
                      setNewAdminForm({
                        ...newAdminForm,
                        badgeColor: e.target.value as 'amber' | 'cyan' | 'emerald' | 'purple' | 'rose',
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="purple">💜 Purple (Support & Finance)</option>
                    <option value="rose">💎 Rose (Marketing & Promos)</option>
                    <option value="amber">👑 Amber / Gold (Super Admin)</option>
                    <option value="cyan">📦 Cyan / Blue (Inventory)</option>
                    <option value="emerald">🚚 Emerald / Green (Orders & Dispatch)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Official Login Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    placeholder="ruwan@azonlanka.lk"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={newAdminForm.phone}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                    placeholder="+94 77 987 6543"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">
                  Admin Passcode / Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewAdminPasscode ? 'text' : 'password'}
                    required
                    value={newAdminForm.passcode}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, passcode: e.target.value })}
                    placeholder="Enter security password / passcode"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-10 py-3 text-white font-mono focus:border-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewAdminPasscode(!showNewAdminPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    {showNewAdminPasscode ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddAdminModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
                >
                  + Create Administrator
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* EDIT ADMIN ACCOUNT MODAL */}
      {editingAdmin && editAdminForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 text-slate-100 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Admin Account</h3>
                  <p className="text-[11px] text-slate-400">Update credentials & profile information</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingAdmin(null);
                  setEditAdminForm(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editAdminForm.name.trim() || !editAdminForm.email.trim() || !editAdminForm.passcode.trim()) {
                  return;
                }
                updateAdminAccount(editAdminForm);
                setEditingAdmin(null);
                setEditAdminForm(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">
                  Full Name / Admin Name *
                </label>
                <input
                  type="text"
                  required
                  value={editAdminForm.name}
                  onChange={(e) => setEditAdminForm({ ...editAdminForm, name: e.target.value })}
                  placeholder="e.g. Kasun Perera"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editAdminForm.roleTitle}
                    onChange={(e) => setEditAdminForm({ ...editAdminForm, roleTitle: e.target.value })}
                    placeholder="e.g. Inventory Manager"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Theme Badge Color
                  </label>
                  <select
                    value={editAdminForm.badgeColor}
                    onChange={(e) =>
                      setEditAdminForm({
                        ...editAdminForm,
                        badgeColor: e.target.value as 'amber' | 'cyan' | 'emerald' | 'purple' | 'rose',
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="amber">👑 Amber / Gold (Owner / Super Admin)</option>
                    <option value="cyan">📦 Cyan / Blue (Inventory)</option>
                    <option value="emerald">🚚 Emerald / Green (Orders)</option>
                    <option value="purple">💜 Purple (Support & Finance)</option>
                    <option value="rose">💎 Rose (Marketing & Promos)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={editAdminForm.email}
                    onChange={(e) => setEditAdminForm({ ...editAdminForm, email: e.target.value })}
                    placeholder="admin@azonlanka.lk"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editAdminForm.phone}
                    onChange={(e) => setEditAdminForm({ ...editAdminForm, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">
                  Admin Passcode / Password *
                </label>
                <div className="relative">
                  <input
                    type={showAdminPasscodeInEdit ? 'text' : 'password'}
                    required
                    value={editAdminForm.passcode}
                    onChange={(e) => setEditAdminForm({ ...editAdminForm, passcode: e.target.value })}
                    placeholder="Set passcode for this admin"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-10 py-3 text-white font-mono focus:border-amber-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPasscodeInEdit(!showAdminPasscodeInEdit)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    {showAdminPasscodeInEdit ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Used by this staff member to unlock the admin control panel.
                </span>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingAdmin(null);
                    setEditAdminForm(null);
                  }}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
                >
                  Save Admin Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>{editingProduct ? 'Edit Product' : 'Add New Product to Store'}</span>
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Gaming Mouse"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Electronics / Fashion / Home"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Selling Price ({settings.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Original Strike-through Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 uppercase block mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed attractive product description..."
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none resize-none"
                />
              </div>

              {/* PRODUCT IMAGES (DEVICE UPLOAD & GALLERY MANAGER) */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Product Images</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      newProdImages.length >= MAX_PRODUCT_IMAGES
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {newProdImages.length} / {MAX_PRODUCT_IMAGES} images max
                    </span>
                  </label>
                  {newProdImages.length > 0 && (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-emerald-400" />
                      <span>1st photo is store cover</span>
                    </span>
                  )}
                </div>

                {/* Device Upload Drag & Drop Area */}
                {newProdImages.length >= MAX_PRODUCT_IMAGES ? (
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-amber-300 text-xs text-left">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <p className="font-bold">Maximum limit reached (5 of 5 photos)</p>
                        <p className="text-[11px] text-amber-400/80">To add different photos, delete an existing image below first.</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-[10px] font-bold tracking-wide border border-amber-500/20 shrink-0">
                      5 / 5 SLOTS FULL
                    </span>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('device-product-image-file-input')?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                      isDraggingOver
                        ? 'border-emerald-400 bg-emerald-950/20'
                        : 'border-slate-700/80 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-900/70'
                    }`}
                  >
                    <input
                      id="device-product-image-file-input"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleDeviceImageFiles(e.target.files);
                          e.target.value = '';
                        }
                      }}
                    />

                    {isUploadingImages ? (
                      <div className="py-2 flex flex-col items-center gap-2 text-emerald-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs font-semibold">
                          Optimizing & loading photos from your device...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-200">
                            <span className="text-emerald-400 underline decoration-emerald-500/50 underline-offset-2">
                              Click to upload from Device
                            </span>{' '}
                            or drag & drop images
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Upload up to 5 photos (Phone Gallery, Camera, or PC files)
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-medium border border-slate-700/80">
                            <Camera className="w-3 h-3 text-emerald-400" /> Up to 5 Images
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-medium border border-slate-700/80">
                            ⚡ Auto-compressed
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-medium border border-slate-700/80">
                            ✓ {MAX_PRODUCT_IMAGES - newProdImages.length} slots left
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {imageUploadError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1.5 bg-rose-950/30 p-2.5 rounded-xl border border-rose-800/40">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{imageUploadError}</span>
                  </p>
                )}

                {/* Optional Web Image URL Input */}
                {newProdImages.length < MAX_PRODUCT_IMAGES && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="url"
                      placeholder="Or paste web image URL (https://...)"
                      value={newProdUrlInput}
                      onChange={(e) => setNewProdUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddUrlImage();
                        }
                      }}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1 border border-slate-700 shrink-0 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Add URL</span>
                    </button>
                  </div>
                )}

                {/* Thumbnails Gallery with Cover Badge, Reorder, and Delete */}
                {newProdImages.length > 0 ? (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Added Photos ({newProdImages.length} of {MAX_PRODUCT_IMAGES})</span>
                      <span className="text-[9px] text-slate-500 font-normal">
                        Click 'Set Cover' to make it the primary store photo
                      </span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {newProdImages.map((imgUrl, idx) => (
                        <div
                          key={`${idx}-${imgUrl.slice(0, 32)}`}
                          className={`relative group rounded-xl overflow-hidden border bg-slate-950 flex flex-col transition-all ${
                            idx === 0
                              ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                              : 'border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          <div className="relative aspect-square w-full bg-slate-900 overflow-hidden">
                            <img
                              src={imgUrl}
                              alt={`Product image ${idx + 1}`}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />

                            {/* Main Cover Badge */}
                            {idx === 0 ? (
                              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-black tracking-wide shadow-md flex items-center gap-1">
                                <Star className="w-3 h-3 fill-slate-950" />
                                <span>MAIN COVER</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetPrimaryCover(idx);
                                }}
                                title="Make this the main display cover"
                                className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-900/90 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[9px] font-bold border border-slate-700 shadow transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                              >
                                Set Cover
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                              }}
                              title="Delete Photo"
                              className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600/90 hover:bg-rose-500 text-white shadow transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="p-1.5 bg-slate-900/90 text-[10px] text-slate-300 text-center font-medium truncate flex items-center justify-center gap-1">
                            <span>{idx === 0 ? '★ Primary Cover' : `Photo ${idx + 1}`}</span>
                          </div>
                        </div>
                      ))}

                      {/* Empty slots placeholders if less than MAX_PRODUCT_IMAGES */}
                      {Array.from({ length: MAX_PRODUCT_IMAGES - newProdImages.length }).map((_, slotIdx) => (
                        <button
                          key={`empty-slot-${slotIdx}`}
                          type="button"
                          onClick={() => document.getElementById('device-product-image-file-input')?.click()}
                          className="aspect-square rounded-xl border border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-900/20 hover:bg-emerald-950/10 flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-emerald-400 transition-colors p-2 text-center"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-[9px] font-semibold uppercase tracking-wider">Slot {newProdImages.length + slotIdx + 1}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-300/90 text-[11px] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>No photos added yet. You can upload up to 5 photos from your phone/PC above or paste image URLs.</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Colors (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Black, Silver, Blue"
                    value={newProdColors}
                    onChange={(e) => setNewProdColors(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 uppercase block mb-1">
                    Sizes (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="S, M, L, XL or 42mm, 46mm"
                    value={newProdSizes}
                    onChange={(e) => setNewProdSizes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdIsFeatured}
                    onChange={(e) => setNewProdIsFeatured(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Mark as Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdIsNewArrival}
                    onChange={(e) => setNewProdIsNewArrival(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Mark as New Arrival</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER INSPECTION MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Order {selectedOrderDetails.orderNumber}</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                Customer Contact & Shipping Address
              </span>
              <p className="text-white font-semibold">{selectedOrderDetails.customerName}</p>
              <p className="text-slate-300">📞 {selectedOrderDetails.customerPhone}</p>
              {selectedOrderDetails.customerEmail && (
                <p className="text-slate-400">✉️ {selectedOrderDetails.customerEmail}</p>
              )}
              <p className="text-slate-300">
                📍 {selectedOrderDetails.deliveryAddress}, {selectedOrderDetails.city}
              </p>
              {selectedOrderDetails.notes && (
                <p className="text-amber-300/90 pt-1 border-t border-slate-800">
                  📝 Notes: {selectedOrderDetails.notes}
                </p>
              )}
            </div>

            {/* Ordered Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-300 block">Ordered Items</span>
              {selectedOrderDetails.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-900"
                    />
                    <div>
                      <p className="font-semibold text-white">{item.productName}</p>
                      <span className="text-[11px] text-slate-400">
                        Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(item.price * item.quantity, settings.currencySymbol)}
                  </span>
                </div>
              ))}
            </div>

            {/* Tracking Code Updater */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <label className="font-bold text-slate-300 uppercase block">
                Courier Tracking Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. PRT-9988123"
                  value={orderTrackingInput}
                  onChange={(e) => setOrderTrackingInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 outline-none"
                />
                <button
                  onClick={() => {
                    updateOrderStatus(
                      selectedOrderDetails.id,
                      selectedOrderDetails.status,
                      orderTrackingInput.trim()
                    );
                    setSelectedOrderDetails({
                      ...selectedOrderDetails,
                      trackingNumber: orderTrackingInput.trim(),
                    });
                  }}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl"
                >
                  Save Code
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={getCustomerWhatsAppStatusUpdateUrl(
                  selectedOrderDetails,
                  selectedOrderDetails.status
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Dispatch Update to Customer</span>
              </a>

              <button
                onClick={() => {
                  deleteOrder(selectedOrderDetails.id);
                  setSelectedOrderDetails(null);
                }}
                className="px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM CLEAR ALL PRODUCTS MODAL */}
      {isClearProductsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-white">Clear All Products?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will remove all current products from your store database and local cache so you can start fresh with your real catalog. This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsClearProductsModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await clearAllProducts();
                  setIsClearProductsModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg active:scale-95"
              >
                Yes, Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
