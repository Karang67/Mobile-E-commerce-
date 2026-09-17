export type ProductCategory = 
  | 'smartphones' 
  | 'tablets' 
  | 'laptops' 
  | 'smartwatches' 
  | 'earbuds' 
  | 'accessories' 
  | 'powerbanks' 
  | 'speakers'
  | (string & {});

export interface CategoryItem {
  id: string;
  name: string;
  count?: number;
  itemCount?: number;
  icon?: string;
  desc?: string;
  isCustom?: boolean;
}

export interface ProductVariant {
  name: string;
  hex?: string;
  slug?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  ram?: string;
  storage?: string;
  color?: string;
  colorVariants?: ProductVariant[];
  storageVariants?: string[];
  images: string[];
  description: string;
  highlights: string[];
  specifications: Record<string, string>;
  isFeatured?: boolean;
  isBestDeal?: boolean;
  isPopular?: boolean;
  badge?: string;
  // Second-Hand / Pre-Owned Specifics
  isSecondHand?: boolean;
  condition?: 'Like New' | 'Superb' | 'Good' | 'Fair';
  batteryHealth?: string; // e.g. "92%" or "88%"
  warrantyPeriod?: string; // e.g. "6 Months Store Warranty"
  includedAccessories?: string[]; // e.g. ["Original Box", "Adapter", "Charging Cable"]
  qcScore?: string; // e.g. "32-Point Quality Inspected"
  deviceNotes?: string; // e.g. "Scratch-free screen, minor pocket wear on edge"
  relatedProductIds?: string[]; // IDs of products to show in Related Products section
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedRam?: string;
  selectedStorage?: string;
  selectedColor?: string;
}

export interface Store {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  lat: number;
  lng: number;
}

export interface Address {
  fullName: string;
  phone: string;
  pincode: string;
  state: string;
  city: string;
  street: string;
  landmark?: string;
  addressType: 'Home' | 'Work';
}

export type OrderStatus = 
  | 'Order Placed' 
  | 'Preparing' 
  | 'Packed' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Ready for Pickup' 
  | 'Completed' 
  | 'Processing';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus?: 'Pending' | 'Verified' | 'Success' | 'COD';
  paymentScreenshot?: string;
  transactionId?: string;
  address: Address;
  paymentMethod: string;
  fulfillmentType?: 'delivery' | 'pickup';
  deliveryMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  statusMessage?: string;
}

export interface PaymentSettings {
  enableQrScanner: boolean;
  enableCod: boolean;
  upiId: string;
  payeeName: string;
  qrCodeImage: string;
  instructions: string;
}

export interface EmiPlan {
  bank: string;
  tenureMonths: number;
  interestRate: number;
  monthlyEmi: number;
  totalCost: number;
  isNoCost: boolean;
}
