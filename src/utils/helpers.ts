import { Order, CartItem, Product, StoreSettings } from '../types';

export function formatCurrency(amount: number | null | undefined, symbol: string = 'Rs. '): string {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return `${symbol}${num.toLocaleString('en-US')}`;
}

export function generateOrderNumber(): string {
  const prefix = 'AZN';
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${timestamp}${random}`;
}

export function createWhatsAppOrderMessage(
  order: Order,
  settings: StoreSettings
): string {
  const itemsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}* x ${item.quantity}${
          item.selectedColor ? ` (${item.selectedColor})` : ''
        }${item.selectedSize ? ` [${item.selectedSize}]` : ''} - ${formatCurrency(
          item.price * item.quantity,
          settings.currencySymbol
        )}`
    )
    .join('\n');

  const paymentLabels: Record<string, string> = {
    whatsapp: '💬 Direct WhatsApp Order',
    cod: '💵 Cash on Delivery (COD)',
    card: '💳 Credit / Debit Card',
    bank_transfer: '🏦 Direct Bank Transfer',
  };

  const message = `🛍️ *NEW ORDER NOTIFICATION - ${settings.storeName}*
----------------------------------------
📋 *Order ID:* \`${order.orderNumber}\`
📅 *Date:* ${new Date(order.createdAt).toLocaleDateString()} ${new Date(order.createdAt).toLocaleTimeString()}

👤 *Customer Details:*
• *Name:* ${order.customerName}
• *Phone:* ${order.customerPhone}
• *Email:* ${order.customerEmail || 'N/A'}
• *Delivery Address:* ${order.deliveryAddress}, ${order.city} ${order.postalCode ? `(${order.postalCode})` : ''}
${order.notes ? `• *Special Notes:* ${order.notes}\n` : ''}
📦 *Ordered Items:*
${itemsList}

----------------------------------------
💰 *Subtotal:* ${formatCurrency(order.subtotal, settings.currencySymbol)}
🏷️ *Discount:* -${formatCurrency(order.discount, settings.currencySymbol)}
🚚 *Delivery:* ${
    order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping, settings.currencySymbol)
  }
🌟 *GRAND TOTAL:* *${formatCurrency(order.total, settings.currencySymbol)}*
💳 *Payment Method:* ${paymentLabels[order.paymentMethod] || order.paymentMethod}
----------------------------------------
Please confirm this order and provide dispatch details. Thank you!`;

  return message;
}

export function createWhatsAppProductInquiry(product: Product, settings: StoreSettings): string {
  const cleanPhone = settings.ownerWhatsAppNumber.replace(/\D/g, '');
  const text = `Hello *${settings.storeName}*, I'm interested in buying:
🛍️ *${product.name}*
💵 Price: ${formatCurrency(product.price, settings.currencySymbol)} (SKU: ${product.sku})
Is this item currently available in stock for immediate delivery?`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function calculateCartTotals(
  items: CartItem[],
  settings: StoreSettings,
  discountPercent: number = 0
) {
  const subtotal = items.reduce(
    (acc, item) => acc + (Number(item?.product?.price) || 0) * (Number(item?.quantity) || 1),
    0
  );
  const discount = Math.round((subtotal * discountPercent) / 100);
  const eligibleSubtotal = Math.max(0, subtotal - discount);
  const shipping =
    subtotal === 0 || eligibleSubtotal >= (Number(settings?.freeShippingThreshold) || 5000)
      ? 0
      : (Number(settings?.standardDeliveryFee) || 350);
  const total = eligibleSubtotal + shipping;

  const freeShippingRemaining = Math.max(
    0,
    (Number(settings?.freeShippingThreshold) || 5000) - eligibleSubtotal
  );

  return {
    subtotal,
    discount,
    shipping,
    total,
    freeShippingRemaining,
    isFreeShipping: eligibleSubtotal >= (Number(settings?.freeShippingThreshold) || 5000) && subtotal > 0,
  };
}

/**
 * Compresses and resizes an image file selected from the device to a compact Base64 Data URL.
 * Downscales huge phone camera photos (e.g. 12MP-48MP) to max 1200px and JPEG quality 0.82.
 * Typically outputs ~80-160KB data URL string, keeping it crisp and safe for Firestore / LocalStorage quotas.
 */
export async function processDeviceImage(
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG or GIF, read as dataURL directly to preserve animation/vectors
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale while preserving aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        // Fallback to raw data url if canvas rendering encounters issue
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
