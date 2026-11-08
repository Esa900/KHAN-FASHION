export interface ProductVariantSize {
  size: string;
  stock: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  brand?: string;
  category: string;
  subCategory?: string;
  description: string;
  price: number; // in BDT
  salePrice?: number;
  discountPercent?: number;
  warranty?: string;
  fabric?: string; // used for specifications/material
  careInstructions?: string;
  sizes: ProductVariantSize[];
  colors: ProductColor[];
  images: string[];
  tags: string[];
  featured?: boolean;
  isNew?: boolean;
  isFlashSale?: boolean;
  isOfficialMall?: boolean;
  isFreeDelivery?: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedSize?: string;
  selectedColor?: ProductColor;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | string;

export interface ShippingAddress {
  fullName: string;
  phone: string;
  division: string;
  district: string;
  thana: string;
  streetAddress: string;
  address?: string; // alias for streetAddress
  city?: string; // alias for district/city
  postalCode?: string;
  orderNotes?: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "TNM-2026-8910"
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  totalAmount?: number; // alias for total
  paymentMethod: 'bKash' | 'Nagad' | 'COD' | 'SSLCommerz' | 'Upay';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionId?: string;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | string;
  status?: OrderStatus; // alias for orderStatus
  courierService?: 'Steadfast' | 'Pathao' | 'RedX' | 'Sundarban' | 'eCourier' | string;
  courierTrackingId?: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
  trackingHistory: {
    status: string;
    timestamp: string;
    note: string;
  }[];
}

export interface Voucher {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  usageCount: number;
  usedCount?: number; // alias
  isActive: boolean;
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  productCount?: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  announcementText: string;
  announcementEnabled?: boolean;
  isAnnouncementActive?: boolean;
  metaTitle: string;
  metaDescription: string;
  adminPassword?: string;
  lastCloudSync?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  createdAt: string;
  address?: ShippingAddress;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string | null;
}

export interface AdminStats {
  totalSales: number;
  totalOrders: number;
  activeCustomers: number;
  outOfStockCount: number;
  lowStockCount: number;
  inventoryAlerts: {
    productId: string;
    title: string;
    sku: string;
    size: string;
    stock: number;
  }[];
  categorySales: Record<string, number>;
  monthlyRevenue: {
    month: string;
    revenue: number;
    orders: number;
  }[];
  recentOrders: Order[];
}

export interface FilterState {
  category: string;
  subCategory: string;
  minPrice: number;
  maxPrice: number;
  size: string;
  color: string;
  fabric: string;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest';
}

export const BD_DIVISIONS_DATA: Record<string, { districts: Record<string, string[]> }> = {
  Dhaka: {
    districts: {
      Dhaka: ['Dhanmondi', 'Gulshan-1', 'Gulshan-2', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur', 'Bashundhara R/A', 'Motijheel', 'Old Dhaka'],
      Gazipur: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Sreepur'],
      Narayanganj: ['Narayanganj Sadar', 'Sonargaon', 'Rupganj']
    }
  },
  Chattogram: {
    districts: {
      Chattogram: ['Panchlaish', 'Nasirabad', 'Khulshi', 'Agrabad', 'GEC Circle', 'Kotwali', 'Halishahar'],
      CoxBazar: ['Cox\'s Bazar Sadar', 'Teknaf', 'Ramu'],
      Cumilla: ['Cumilla Adarsha Sadar', 'Laksam']
    }
  },
  Sylhet: {
    districts: {
      Sylhet: ['Zindabazar', 'Amberkhana', 'Upashahar', 'Subidbazar'],
      Moulvibazar: ['Sreemangal', 'Moulvibazar Sadar']
    }
  },
  Rajshahi: {
    districts: {
      Rajshahi: ['Boalia', 'Motihar', 'Rajpara'],
      Bogura: ['Bogura Sadar', 'Sherpur']
    }
  },
  Khulna: {
    districts: {
      Khulna: ['Khulna Sadar', 'Sonadanga', 'Khalishpur'],
      Jashore: ['Jashore Sadar', 'Benapole']
    }
  },
  Barishal: {
    districts: {
      Barishal: ['Kotwali', 'Airport', 'Bakerganj']
    }
  },
  Rangpur: {
    districts: {
      Rangpur: ['Rangpur Sadar', 'Kotwali', 'Badarganj']
    }
  },
  Mymensingh: {
    districts: {
      Mymensingh: ['Kotwali', 'Muktagachha', 'Trishal']
    }
  }
};
