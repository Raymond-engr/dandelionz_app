import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: string | number | undefined): string {
  if (amount === undefined || amount === null) return "0.00";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0.00";
  return num.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function resolveNotificationUrl(url: string | null | undefined, role: string): string {
  if (!url) return '#';

  // Strip domain if present (e.g. https://api.dandelionz.com.ng/...)
  let path = url;
  try {
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      path = urlObj.pathname + urlObj.search;
    }
  } catch (e) {
    // If invalid URL, keep original string
    console.warn('Invalid URL in resolveNotificationUrl', e);
  }

  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  // Logic for Vendor
  if (role === 'vendor') {
    // Check if it's an order detail path (from backend /transactions/orders/UUID/ or frontend /orders/UUID)
    // We want to map it to /vendor/orders/UUID
    const orderMatch = path.match(/\/(?:transactions\/orders|orders)\/([a-zA-Z0-9-]+)/);
    if (orderMatch) {
      return `/vendor/orders/${orderMatch[1]}`;
    }

    // Vendor Products: Detail page might not exist (only edit), redirect to list for safety
    if (path.includes('/product/') || path === '/product') {
      return '/vendor/product';
    }
    
    // Ensure vendor prefix if missing for other known vendor routes
    if (!path.startsWith('/vendor') && !path.startsWith('/account')) {
       // Check if it's a route that has a vendor equivalent
       const vendorRoutes = ['dashboard', 'wallet', 'settings'];
       const cleanPath = path.replace(/^\//, '');
       const firstSegment = cleanPath.split('/')[0];
       
       if (vendorRoutes.includes(firstSegment)) {
         return `/vendor/${cleanPath}`;
       }
    }
  }

  // Logic for Customer
  if (role === 'customer') {
    // Orders: /orders/123 is valid
    // Receipt: /receipt?id=123 is valid
    if (path.includes('/receipt')) {
        return path;
    }

    // If backend sends payment or transaction links (other than receipt), redirect to orders list
    if (path.includes('/transactions/') || path.includes('/payment/')) {
        return '/orders';
    }

    // Orders: /orders/123 is valid
    // Products: /product/slug is valid
    // If backend sends /admin/... or /vendor/... to a customer, redirect to home or safe page
    if (path.startsWith('/admin') || path.startsWith('/vendor')) {
      return '/';
    }
  }

  return path;
}

const prettify = (f: string) =>
  f.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/**
 * Turn an RTK Query error into a message safe to render.
 *
 * Mirrors the mobile app's `apiError` so both platforms surface the same text.
 * Two things callers reliably get wrong on their own:
 *
 * - The API is inconsistent about which key carries the message. Validation
 *   errors arrive under `error` (see BaseAPIView.handle_exception), while most
 *   other endpoints use `message`.
 * - `error` is not always a string. For serializer errors the backend keeps the
 *   structured payload ({name: ["already exists"]}), so reading it straight into
 *   render state throws "Objects are not valid as a React child". This flattens
 *   it to "Name: already exists".
 *
 * Always returns a string.
 */
export function apiError(err: any, fallback = "Something went wrong"): string {
  // Transport failures carry no server message — RTK Query puts a raw JS error
  // string on `err.error` ("TypeError: Failed to fetch"), which must not reach
  // the user. Handle these before reading the body.
  if (err?.status === "FETCH_ERROR")
    return "Network error. Check your connection and try again.";
  if (err?.status === "TIMEOUT_ERROR")
    return "The request timed out. Please try again.";
  if (err?.status === "PARSING_ERROR") return fallback;

  const e = err?.data?.error ?? err?.data?.message ?? err?.error;
  if (typeof e === "string") return e;
  if (Array.isArray(e)) return e.join("\n");
  if (e && typeof e === "object") {
    return Object.entries(e)
      .map(([field, msgs]) => {
        const text = Array.isArray(msgs) ? msgs.join(" ") : String(msgs);
        return field === "non_field_errors" ? text : `${prettify(field)}: ${text}`;
      })
      .join("\n");
  }
  if (err?.status === 413) return "Your images are too large. Try fewer or smaller photos.";
  return fallback;
}

export const SYSTEM_NOTIFICATION_CATEGORIES = [
  'order', 'product', 'payment', 'delivery', 'general', 'withdrawal', 'system',
];

export function isSystemNotification(notification: { category?: string }): boolean {
  return SYSTEM_NOTIFICATION_CATEGORIES.includes(notification?.category || '');
}