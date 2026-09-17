import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ChevronRight,
  Store,
  Printer,
  X,
  Edit3,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  MessageCircle,
  Truck,
  AlertCircle,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Order, Address, OrderStatus } from '../types';
import { getStatusMessage } from '../utils/notificationService';

const PROFILE_STORAGE_KEY = 'shivangi_user_profile';
const ORDERS_STORAGE_KEY = 'shivangi_customer_orders';
const ADDRESSES_STORAGE_KEY = 'shivangi_saved_addresses';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  memberSince: string;
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Customer',
  email: '',
  phone: '',
  city: 'Sumerpur',
  address: '',
  memberSince: '2025',
};

const DEFAULT_ORDERS: Order[] = [];

const DEFAULT_ADDRESSES: Address[] = [];

export const AccountPage: React.FC = () => {
  const { brandName } = useBrand();
  const { wishlist } = useWishlist();
  const { showToast } = useToast();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'store'>('orders');

  // Profile state backed by localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Orders state backed by localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  // Saved addresses state backed by localStorage
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const saved = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
    }
  });

  // Modal for Viewing Order Details / Store Token
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Profile Edit form state
  const [editProfile, setEditProfile] = useState<UserProfile>(profile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // New Address form modal
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: profile.fullName,
    phone: profile.phone,
    pincode: '518301',
    state: 'Rajasthan',
    city: 'Sumerpur',
    street: '',
    landmark: '',
    addressType: 'Home'
  });

  // Keep editProfile synced when profile changes
  useEffect(() => {
    setEditProfile(profile);
  }, [profile]);

  // Listen to live order updates from Admin or Checkout
  useEffect(() => {
    const handleOrdersUpdate = () => {
      try {
        const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setOrders(parsed);
          setSelectedOrder(prev => {
            if (!prev) return null;
            const found = parsed.find((o: Order) => o.id === prev.id);
            return found || prev;
          });
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('shivangi_orders_updated', handleOrdersUpdate);
    window.addEventListener('storage', handleOrdersUpdate);
    return () => {
      window.removeEventListener('shivangi_orders_updated', handleOrdersUpdate);
      window.removeEventListener('storage', handleOrdersUpdate);
    };
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editProfile);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(editProfile));
      showToast('Profile details updated successfully!', 'success');
    } catch {
      showToast('Failed to save profile changes.', 'error');
    }
    setIsEditingProfile(false);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street.trim()) {
      showToast('Please enter street / location address.', 'error');
      return;
    }
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    try {
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
      showToast('New address added successfully!', 'success');
    } catch {
      showToast('Failed to save address.', 'error');
    }
    setShowAddAddressModal(false);
    setNewAddress({
      fullName: profile.fullName,
      phone: profile.phone,
      pincode: '518301',
      state: 'Rajasthan',
      city: 'Sumerpur',
      street: '',
      landmark: '',
      addressType: 'Home'
    });
  };

  const handleDeleteAddress = (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    try {
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
      showToast('Address deleted.', 'info');
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
        <Link to="/" className="hover:text-[#E30613]">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-bold">My Account</span>
      </div>

      {/* Top Banner: Sign Up / Login with Email OTP (if unauthenticated) or Profile Card (if authenticated) */}
      {!isAuthenticated ? (
        <div className="bg-gradient-to-r from-[#18222F] via-[#202D3B] to-[#111827] rounded-3xl p-6 sm:p-8 mb-8 text-white shadow-xl border border-red-900/30 relative overflow-hidden animate-fade-in">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-300 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Supabase Email OTP Authentication</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Sign In or Create Your Account
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Sign up with your email to receive a secure 6-digit verification OTP code. Access your order history, live package tracking, saved delivery addresses, and exclusive offers.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="w-full md:w-auto px-6 py-3.5 bg-[#E30613] hover:bg-[#C40510] text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer ring-2 ring-white/20"
              >
                <Mail className="w-4 h-4 text-yellow-300" />
                <span>Sign Up / Login with Email OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Top Profile Banner Card (Logged In) */
        <div className="bg-gradient-to-r from-[#202D3B] to-[#2B3A4A] rounded-2xl p-6 mb-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#E30613] text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white/20">
              {(profile.fullName || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black">{profile.fullName || user?.email?.split('@')[0]}</h1>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>OTP Verified</span>
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 flex items-center gap-3 flex-wrap">
                {profile.phone && <span>{profile.phone}</span>}
                {profile.phone && <span>•</span>}
                <span>{user?.email || profile.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Quick Account Metrics */}
            <div className="flex items-center gap-4 sm:gap-6 bg-black/25 px-5 py-3 rounded-xl border border-white/10 shrink-0">
              <div className="text-center">
                <span className="block text-lg font-black text-white font-mono">{orders.length}</span>
                <span className="text-[10px] text-gray-300 uppercase tracking-wide">Orders</span>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div className="text-center">
                <span className="block text-lg font-black text-yellow-400 font-mono">{wishlist.length}</span>
                <span className="text-[10px] text-gray-300 uppercase tracking-wide">Wishlist</span>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div className="text-center">
                <span className="block text-lg font-black text-white font-mono">{addresses.length}</span>
                <span className="text-[10px] text-gray-300 uppercase tracking-wide">Addresses</span>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/15"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Menu */}
        <aside className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <nav className="space-y-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${activeTab === 'orders'
                ? 'bg-red-50 text-[#E30613] shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4" />
                <span>My Orders & Live Tracking</span>
              </div>
              <span className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded-full font-mono">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${activeTab === 'profile'
                ? 'bg-red-50 text-[#E30613] shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Personal Profile</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${activeTab === 'addresses'
                ? 'bg-red-50 text-[#E30613] shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </div>
              <span className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded-full font-mono">
                {addresses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('store')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${activeTab === 'store'
                ? 'bg-red-50 text-[#E30613] shadow-xs'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4" />
                <span>Store Info & Support</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </nav>

          {/* Quick Sumerpur Store Pickup Card */}
          <div className="pt-3 border-t border-gray-100">
            <div className="bg-red-50/60 rounded-xl p-3.5 border border-red-100 text-xs">
              <div className="flex items-center gap-2 text-[#E30613] font-black uppercase text-[11px]">
                <Store className="w-4 h-4" />
                <span>Shivangi Mobile Sumerpur</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                Opp. Nagraj Electronic, Main Bazar, Sumerpur, Rajasthan - 306902. Open daily 10 AM – 9:30 PM.
              </p>
              <a
                href="tel:9876543210"
                className="mt-2 text-[11px] font-bold text-[#E30613] hover:underline flex items-center gap-1"
              >
                <Phone className="w-3 h-3" /> Call: +91 98765 43210
              </a>
            </div>
          </div>
        </aside>

        {/* Right Content Panel */}
        <main className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          {/* 1. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="font-black text-gray-900 uppercase text-base flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#E30613]" />
                    <span>My Orders & Live Delivery Tracking</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Track real-time order preparation, packing, and doorstep delivery updates from our store team.
                  </p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 font-bold px-2.5 py-1 rounded-full">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-gray-500 space-y-3">
                  <Package className="w-12 h-12 mx-auto text-gray-300" />
                  <h3 className="font-bold text-gray-700 text-sm">No orders yet</h3>
                  <p className="text-xs">Browse smartphones and electronics to place your first doorstep delivery order.</p>
                  <Link
                    to="/shop/smartphones"
                    className="inline-block bg-[#E30613] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#c40510]"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {orders.map(order => {
                    const isDelivery = order.fulfillmentType === 'delivery' || order.deliveryMethod?.toLowerCase().includes('delivery');
                    const isPaymentVerified = order.paymentStatus === 'Verified' || order.paymentStatus === 'Success';

                    const stages: OrderStatus[] = [
                      'Order Placed',
                      'Preparing',
                      'Packed',
                      'Out for Delivery',
                      'Delivered'
                    ];

                    const getStageIndex = (s: OrderStatus) => {
                      const idx = stages.indexOf(s);
                      if (idx !== -1) return idx;
                      if (s === 'Ready for Pickup') return 2;
                      if (s === 'Completed') return 4;
                      return 0;
                    };

                    const currentStageIdx = getStageIndex(order.status);
                    const statusText = order.statusMessage || getStatusMessage(order.status);

                    return (
                      <div
                        key={order.id}
                        className="border border-gray-200 hover:border-gray-300 rounded-2xl p-5 transition-all space-y-4 bg-white shadow-xs"
                      >
                        {/* 1. Header: ID, Date, Fulfillment Badge, Payment Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-black text-sm text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                              #{order.id}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 font-medium">{order.date}</span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Fulfillment Badge */}
                            {isDelivery ? (
                              <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-blue-600" />
                                <span>Doorstep Delivery</span>
                              </span>
                            ) : (
                              <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
                                <Store className="w-3.5 h-3.5 text-amber-600" />
                                <span>Store Pickup (Sumerpur)</span>
                              </span>
                            )}

                            {/* Payment Badge */}
                            {isPaymentVerified ? (
                              <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Payment Verified ✓</span>
                              </span>
                            ) : order.paymentStatus === 'COD' ? (
                              <span className="text-[11px] bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                                Cash on Delivery (COD)
                              </span>
                            ) : (
                              <span className="text-[11px] bg-yellow-50 text-yellow-800 font-bold px-2.5 py-1 rounded-lg border border-yellow-200 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-yellow-600" />
                                <span>Payment Pending Check</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 2. Real-Time Status Confirmation Banner */}
                        <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${order.status === 'Delivered' || order.status === 'Completed'
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                          : order.status === 'Out for Delivery'
                            ? 'bg-purple-50/80 border-purple-200 text-purple-900'
                            : order.status === 'Packed'
                              ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
                              : order.status === 'Preparing'
                                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                                : 'bg-red-50/70 border-red-200 text-red-900'
                          }`}>
                          <div className="shrink-0 mt-0.5">
                            {order.status === 'Delivered' || order.status === 'Completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : order.status === 'Out for Delivery' ? (
                              <Truck className="w-4 h-4 text-purple-600 animate-bounce" />
                            ) : order.status === 'Packed' ? (
                              <Package className="w-4 h-4 text-indigo-600" />
                            ) : order.status === 'Preparing' ? (
                              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-[#E30613]" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-xs">
                              Live Status: <span className="uppercase font-black">{order.status}</span>
                            </div>
                            <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                              {statusText}
                            </p>
                          </div>
                        </div>

                        {/* 3. 5-Stage Visual Delivery Progress Tracker Stepper */}
                        <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/80">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-2">
                            <span>Fulfillment Tracking</span>
                            <span className="text-[#E30613]">
                              Stage {currentStageIdx + 1} of {stages.length}
                            </span>
                          </div>

                          <div className="grid grid-cols-5 gap-1 text-center">
                            {stages.map((stg, idx) => {
                              const isCompleted = idx < currentStageIdx;
                              const isCurrent = idx === currentStageIdx;

                              return (
                                <div key={stg} className="flex flex-col items-center">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold mb-1.5 transition-all shadow-xs ${isCompleted
                                      ? 'bg-emerald-600 text-white'
                                      : isCurrent
                                        ? 'bg-[#E30613] text-white ring-4 ring-red-100 animate-pulse'
                                        : 'bg-white text-gray-400 border border-gray-300'
                                      }`}
                                  >
                                    {isCompleted ? (
                                      <Check className="w-3.5 h-3.5 text-white" />
                                    ) : (
                                      idx + 1
                                    )}
                                  </div>
                                  <span
                                    className={`text-[10px] font-bold tracking-tight line-clamp-1 ${isCurrent
                                      ? 'text-[#E30613]'
                                      : isCompleted
                                        ? 'text-emerald-700'
                                        : 'text-gray-400'
                                      }`}
                                  >
                                    {stg}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 4. Delivery Address Preview (If Doorstep Delivery) */}
                        {order.address && (
                          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 flex items-start gap-2.5 text-xs text-gray-600">
                            <MapPin className="w-4 h-4 text-[#E30613] shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                                {isDelivery ? 'Delivery Destination' : 'Store Pickup Location'}
                              </span>
                              <p className="font-semibold text-gray-900 mt-0.5">
                                {order.address.fullName} ({order.address.phone})
                              </p>
                              <p className="text-[11px] text-gray-600">
                                {order.address.street}{order.address.landmark ? `, Landmark: ${order.address.landmark}` : ''}, {order.address.city}, {order.address.state} - {order.address.pincode}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* 5. Items List */}
                        <div className="divide-y divide-gray-100">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={it.product.images[0]}
                                  alt={it.product.name}
                                  className="w-12 h-12 object-contain p-1 border rounded-lg bg-gray-50 shrink-0"
                                />
                                <div className="truncate">
                                  <h4 className="font-bold text-gray-900 truncate">{it.product.name}</h4>
                                  <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                                    <span>Qty: <strong>{it.quantity}</strong></span>
                                    {it.selectedRam && <span>• {it.selectedRam}</span>}
                                    {it.selectedStorage && <span>• {it.selectedStorage}</span>}
                                    {it.selectedColor && <span>• {it.selectedColor}</span>}
                                  </div>
                                </div>
                              </div>
                              <span className="font-mono font-bold text-gray-900 shrink-0">
                                ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* 6. Footer & Actions */}
                        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-gray-500 text-[11px]">Payment: </span>
                            <span className="font-semibold text-gray-800">{order.paymentMethod}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-[11px] text-gray-500 mr-2">Total Amount:</span>
                              <span className="font-mono font-black text-base text-[#E30613]">
                                ₹{order.total.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="bg-gray-900 hover:bg-[#E30613] text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <span>Track & View Receipt</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="font-black text-gray-900 uppercase text-base">
                    Personal Profile
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Update your contact details for store pickup orders and SMS receipts.
                  </p>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="bg-[#E30613] hover:bg-[#c40510] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={editProfile.fullName}
                        onChange={e => setEditProfile({ ...editProfile, fullName: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        value={editProfile.phone}
                        onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-medium font-mono focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={editProfile.email}
                        onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">City / Town</label>
                      <input
                        type="text"
                        value={editProfile.city}
                        onChange={e => setEditProfile({ ...editProfile, city: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={editProfile.address}
                        onChange={e => setEditProfile({ ...editProfile, address: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 border rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#E30613] hover:bg-[#c40510] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[11px] text-gray-400 font-bold uppercase">Full Name</span>
                    <p className="text-sm font-bold text-gray-900 mt-1">{profile.fullName}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[11px] text-gray-400 font-bold uppercase">Mobile Number</span>
                    <p className="text-sm font-bold text-gray-900 font-mono mt-1">{profile.phone}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[11px] text-gray-400 font-bold uppercase">Email Address</span>
                    <p className="text-sm font-bold text-gray-900 mt-1">{profile.email}</p>
                  </div>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[11px] text-gray-400 font-bold uppercase">City / Location</span>
                    <p className="text-sm font-bold text-gray-900 mt-1">{profile.city || 'Sumerpur, AP'}</p>
                  </div>
                  <div className="sm:col-span-2 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[11px] text-gray-400 font-bold uppercase">Primary Address</span>
                    <p className="text-sm font-medium text-gray-800 mt-1">{profile.address}</p>
                  </div>
                  <div className="sm:col-span-2 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Account Member Status: Active Verified Shopper</span>
                    </div>
                    <span className="text-[11px] text-emerald-700">Since {profile.memberSince}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-5 animate-fade-in text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="font-black text-gray-900 uppercase text-base">
                    Saved Contact Addresses
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Saved addresses for order reservation and billing invoices.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="bg-[#E30613] hover:bg-[#c40510] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200 text-gray-500 space-y-2.5">
                  <MapPin className="w-10 h-10 text-gray-300 mx-auto" />
                  <h3 className="font-bold text-gray-700 text-sm">No saved addresses yet</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Save your home or office address for fast, 1-click doorstep delivery checkout.
                  </p>
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="inline-block bg-[#E30613] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#c40510] shadow-xs transition-colors"
                  >
                    + Add New Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 hover:border-red-200 rounded-xl p-4.5 space-y-2 relative bg-white transition-all shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">{addr.fullName}</span>
                        <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {addr.addressType}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{addr.street}</p>
                      {addr.landmark && (
                        <p className="text-gray-500 text-[11px]">Landmark: {addr.landmark}</p>
                      )}
                      <p className="text-gray-700 font-semibold">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-gray-500 font-mono text-[11px]">Phone: {addr.phone}</p>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        {idx === 0 ? (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            Default Address
                          </span>
                        ) : <span />}
                        {addresses.length > 1 && (
                          <button
                            onClick={() => handleDeleteAddress(idx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                            title="Delete address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Address Modal */}
              {showAddAddressModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <h3 className="font-black text-gray-900 text-sm uppercase">Add New Contact Address</h3>
                      <button
                        onClick={() => setShowAddAddressModal(false)}
                        className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddAddress} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                          <input
                            type="text"
                            value={newAddress.fullName}
                            onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                            className="w-full bg-gray-50 border rounded-lg p-2 text-xs focus:ring-2 focus:ring-[#E30613]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            value={newAddress.phone}
                            onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                            className="w-full bg-gray-50 border rounded-lg p-2 text-xs font-mono focus:ring-2 focus:ring-[#E30613]"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Street Address *</label>
                        <input
                          type="text"
                          value={newAddress.street}
                          onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                          placeholder="House / Shop / Street"
                          className="w-full bg-gray-50 border rounded-lg p-2 text-xs focus:ring-2 focus:ring-[#E30613]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">City *</label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full bg-gray-50 border rounded-lg p-2 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">State *</label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                            className="w-full bg-gray-50 border rounded-lg p-2 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Pincode *</label>
                          <input
                            type="text"
                            value={newAddress.pincode}
                            onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })}
                            className="w-full bg-gray-50 border rounded-lg p-2 text-xs font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-3 flex justify-end gap-2 border-t">
                        <button
                          type="button"
                          onClick={() => setShowAddAddressModal(false)}
                          className="px-4 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#E30613] hover:bg-[#c40510] text-white px-5 py-2 rounded-lg font-bold"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. STORE INFO & SUPPORT TAB */}
          {activeTab === 'store' && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div className="pb-3 border-b border-gray-100">
                <h2 className="font-black text-gray-900 uppercase text-base">
                  Shivangi Mobile Sumerpur Showroom
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Visit our flagship store for instant device collection, exchanges, and warranty support.
                </p>
              </div>

              {/* Showroom Details Card */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50/50 rounded-2xl p-5 border border-red-200/80 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#E30613] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-sm uppercase">Shivangi Mobile</h3>
                      <p className="text-gray-600 mt-1 leading-relaxed">
                        Opp. Nagraj Electronic, Main Bazar, Sumerpur, Rajasthan - 306902
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-emerald-700 font-bold text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>OPEN TODAY • 10:00 AM – 9:30 PM</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/stores"
                    className="bg-white hover:bg-gray-50 text-[#E30613] border border-red-200 px-3.5 py-1.5 rounded-lg font-bold text-[11px] shrink-0 transition-colors shadow-xs flex items-center gap-1"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href="tel:9876543210"
                    className="bg-white p-3 rounded-xl border border-gray-200 hover:border-[#E30613] transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Customer Hotline</span>
                      <span className="font-bold text-gray-900 font-mono">+91 98765 43210</span>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/919876543210?text=Hi%20Shivangi%20Mobile,%20I%20need%20assistance"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white p-3 rounded-xl border border-gray-200 hover:border-emerald-500 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">WhatsApp Chat</span>
                      <span className="font-bold text-emerald-700">Chat with Store Executive</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* In-Store Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-1">Free Data Transfer</span>
                  <p className="text-[11px] text-gray-500">
                    Our technical staff will transfer all your contacts, photos, and apps to your new device.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-1">Old Phone Exchange</span>
                  <p className="text-[11px] text-gray-500">
                    Get best exchange value for your old smartphone with on-the-spot evaluation.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-1">0% Down EMI</span>
                  <p className="text-[11px] text-gray-500">
                    Bajaj Finserv, HDB, and IDFC First Bank finance with zero down payment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ORDER DETAILS & STORE PICKUP TOKEN MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[92vh] overflow-y-auto text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#E30613] bg-red-50 px-2 py-0.5 rounded">
                  {selectedOrder.fulfillmentType === 'delivery' || selectedOrder.deliveryMethod?.toLowerCase().includes('delivery') ? 'Doorstep Delivery Order' : 'Store Pickup Order'}
                </span>
                <h3 className="font-black text-gray-900 text-base uppercase mt-1">
                  Order #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Status Banner in Modal */}
            <div className="p-3.5 rounded-xl border bg-gray-50 flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#E30613] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block">
                  Status: <span className="text-[#E30613] uppercase font-black">{selectedOrder.status}</span>
                </span>
                <p className="text-gray-600 text-[11px] mt-0.5">
                  {selectedOrder.statusMessage || getStatusMessage(selectedOrder.status)}
                </p>
              </div>
            </div>

            {/* Visual Tracking Stepper */}
            <div className="bg-gray-50/80 rounded-xl p-3.5 border border-gray-200/80">
              <div className="grid grid-cols-5 gap-1 text-center">
                {['Order Placed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'].map((stg, idx) => {
                  const stageOrder = ['Order Placed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'];
                  const curIdx = stageOrder.indexOf(selectedOrder.status);
                  const isDone = curIdx >= idx;
                  const isCurrent = curIdx === idx;

                  return (
                    <div key={stg} className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 shadow-xs ${isDone
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                            ? 'bg-[#E30613] text-white ring-2 ring-red-200'
                            : 'bg-white text-gray-400 border'
                          }`}
                      >
                        {isDone && !isCurrent ? <Check className="w-3 h-3 text-white" /> : idx + 1}
                      </div>
                      <span className={`text-[9px] font-bold leading-tight ${isCurrent ? 'text-[#E30613]' : isDone ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {stg}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Destination Notice */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#E30613] font-black uppercase text-[11px]">
                  {selectedOrder.fulfillmentType === 'delivery' || selectedOrder.deliveryMethod?.toLowerCase().includes('delivery') ? (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>Delivery Address</span>
                    </>
                  ) : (
                    <>
                      <Store className="w-4 h-4" />
                      <span>Pickup Showroom</span>
                    </>
                  )}
                </div>
                <span className="font-mono font-bold text-gray-700">{selectedOrder.date}</span>
              </div>
              <p className="font-bold text-gray-900">
                {selectedOrder.address ? selectedOrder.address.fullName : 'Customer'}
              </p>
              <p className="text-gray-700">
                {selectedOrder.address ? `${selectedOrder.address.street}${selectedOrder.address.landmark ? ', Landmark: ' + selectedOrder.address.landmark : ''}, ${selectedOrder.address.city}, ${selectedOrder.address.state} - ${selectedOrder.address.pincode}` : 'Sumerpur Showroom Counter'}
              </p>
              <p className="text-[11px] text-gray-500">
                Phone: <strong className="text-gray-800">{selectedOrder.address?.phone}</strong>
              </p>
              <div className="pt-1 border-t border-red-200/60 flex items-center justify-between text-[11px]">
                <span className="text-gray-600">Payment: <strong>{selectedOrder.paymentMethod}</strong></span>
                <span className="text-emerald-700 font-bold">{selectedOrder.paymentStatus ? `Status: ${selectedOrder.paymentStatus}` : 'Prepaid'}</span>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="border rounded-xl overflow-hidden divide-y text-xs">
              <div className="bg-gray-50 p-2.5 font-bold text-gray-700 flex justify-between">
                <span>Items ({selectedOrder.items.length})</span>
                <span>Price</span>
              </div>
              {selectedOrder.items.map((it, i) => (
                <div key={i} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={it.product.images[0]}
                      alt={it.product.name}
                      className="w-10 h-10 object-contain p-1 border rounded bg-gray-50 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-gray-900 truncate">{it.product.name}</p>
                      <p className="text-[10px] text-gray-500">Qty: {it.quantity} • {it.selectedRam || it.product.ram}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-gray-900 shrink-0">
                    ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              <div className="p-3 bg-gray-50 flex items-center justify-between font-black text-sm">
                <span>Total Amount:</span>
                <span className="text-[#E30613] font-mono">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <button
                onClick={() => window.print()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-[#E30613] hover:bg-[#c40510] text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
