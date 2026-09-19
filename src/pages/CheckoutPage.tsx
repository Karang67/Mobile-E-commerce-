import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  MapPin,
  CreditCard,
  Clock,
  ChevronRight,
  ArrowLeft,
  QrCode,
  Banknote,
  Percent,
  Printer,
  ShoppingBag,
  Store,
  Truck,
  Package,
  ShieldCheck,
  Building,
  Home,
  Check,
  AlertCircle,
  Upload,
  Copy,
  MessageCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useBrand } from '../context/BrandContext';
import { Address, Order } from '../types';
import { addAdminNotification } from '../utils/notificationService';
import { useAuth } from '../context/AuthContext';
import { syncOrderToMongo } from '../utils/apiService';
import { loadPaymentSettings } from '../data/adminData';
import { compressImageFile } from '../utils/imageCompressor';
import { uploadToCloudinary } from '../utils/cloudinaryService';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, discount, total, clearCart } = useCart();
  const { brandName } = useBrand();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // 3 Steps: 1: Delivery Address & Details, 2: Payment, 3: Confirmation & Tracking
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Fulfillment Type: Delivery vs Store Pickup
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');

  // Step 1: Customer & Delivery Address Form (Fully Editable)
  const [customer, setCustomer] = useState(() => {
    try {
      const savedProfile = localStorage.getItem('shivangi_user_profile');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        if (p.fullName && p.fullName !== 'Customer') {
          return {
            fullName: p.fullName,
            phone: p.phone ? p.phone.replace(/\D/g, '') : '',
            email: p.email || '',
            pincode: '518301',
            city: p.city || 'Sumerpur',
            state: 'Rajasthan',
            street: p.address || '',
            landmark: '',
            addressType: 'Home' as 'Home' | 'Work',
            deliveryInstructions: '',
          };
        }
      }
      const savedAddrs = localStorage.getItem('shivangi_saved_addresses');
      if (savedAddrs) {
        const addrs = JSON.parse(savedAddrs);
        if (addrs.length > 0) {
          const a = addrs[0];
          return {
            fullName: a.fullName || '',
            phone: a.phone ? a.phone.replace(/\D/g, '') : '',
            email: '',
            pincode: a.pincode || '518301',
            city: a.city || 'Sumerpur',
            state: a.state || 'Rajasthan',
            street: a.street || '',
            landmark: a.landmark || '',
            addressType: a.addressType || 'Home',
            deliveryInstructions: '',
          };
        }
      }
    } catch {
      // ignore
    }
    return {
      fullName: '',
      phone: '',
      email: '',
      pincode: '306902',
      city: 'Sumerpur',
      state: 'Rajasthan',
      street: '',
      landmark: '',
      addressType: 'Home' as 'Home' | 'Work',
      deliveryInstructions: '',
    };
  });

  // Sync authenticated user's email into customer email
  useEffect(() => {
    if (user?.email && !customer.email) {
      setCustomer(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  // Step 2: Payment Method (Only QR Scanner & Cash on Delivery)
  const paymentSettings = loadPaymentSettings();
  const [paymentMethod, setPaymentMethod] = useState<'scanner' | 'cod'>(() =>
    paymentSettings.enableQrScanner ? 'scanner' : 'cod'
  );
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [screenshotError, setScreenshotError] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // Step 3: Confirmed Order details
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handleScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingScreenshot(true);
    setScreenshotError('');

    try {
      const result = await uploadToCloudinary(file);
      if (result?.url) {
        setPaymentScreenshot(result.url);
      } else {
        const compressed = await compressImageFile(file, { maxDimension: 1200, quality: 0.85 });
        setPaymentScreenshot(compressed);
      }
    } catch (err: any) {
      console.error('Failed to upload screenshot', err);
      setScreenshotError(err.message || 'Failed to upload screenshot. Please try again.');
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const copyUpiId = () => {
    if (!paymentSettings.upiId) return;
    navigator.clipboard.writeText(paymentSettings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.street.trim()) {
      return;
    }
    setCurrentStep(2);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'scanner' && !paymentScreenshot && !transactionId.trim()) {
      setScreenshotError('Please upload your payment screenshot or enter your Transaction ID / UTR so the shop owner can verify your payment.');
      return;
    }

    const randomSuffix = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID().slice(0, 6).toUpperCase() 
      : Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `SHIV-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;

    const addressObj: Address = {
      fullName: customer.fullName,
      phone: customer.phone,
      pincode: customer.pincode || '518301',
      state: customer.state || 'Rajasthan',
      city: customer.city || 'Sumerpur',
      street: customer.street,
      landmark: customer.landmark,
      addressType: customer.addressType,
    };

    const paymentMethodLabel = paymentMethod === 'scanner' ? 'UPI QR Scanner' : 'Cash on Delivery (COD)';
    const paymentStatusVal = paymentMethod === 'scanner' ? 'Pending' : 'COD';

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      items: [...cart],
      subtotal,
      discount,
      deliveryFee: 0,
      total,
      status: 'Order Placed',
      paymentStatus: paymentStatusVal,
      paymentScreenshot: paymentMethod === 'scanner' ? paymentScreenshot : undefined,
      transactionId: paymentMethod === 'scanner' ? transactionId.trim() : undefined,
      address: addressObj,
      paymentMethod: paymentMethodLabel,
      fulfillmentType,
      deliveryMethod: fulfillmentType === 'delivery' ? 'Doorstep Delivery' : 'In-Store Pickup (Sumerpur Store)',
      estimatedDelivery: fulfillmentType === 'delivery' ? 'Estimated: Tomorrow, by 6:00 PM' : 'Ready Today at Sumerpur Store (Main Bazar)',
      statusMessage: paymentMethod === 'scanner'
        ? 'Payment screenshot submitted. Shop owner will verify and begin packing.'
        : 'Cash on Delivery order placed. We are preparing your order.',
    };

    // Save order into customer orders in localStorage
    try {
      const existing = localStorage.getItem('shivangi_customer_orders');
      const ordersList: Order[] = existing ? JSON.parse(existing) : [];
      ordersList.unshift(newOrder);
      localStorage.setItem('shivangi_customer_orders', JSON.stringify(ordersList));
      window.dispatchEvent(new Event('shivangi_orders_updated'));
    } catch (err) {
      console.error('Failed to save order to localStorage', err);
    }

    // Sync order to MongoDB database if API backend is active
    syncOrderToMongo(newOrder).catch(() => { });

    // Trigger Admin Notification with payment proof
    try {
      addAdminNotification({
        inquiryId: orderId,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        city: `${customer.city}, ${customer.state}`,
        streetAddress: `${customer.street}, ${customer.landmark ? 'Landmark: ' + customer.landmark + ', ' : ''}${customer.city} - ${customer.pincode}`,
        pincode: customer.pincode,
        fulfillmentType,
        notes: customer.deliveryInstructions || undefined,
        itemsSummary: cart.map(i => `${i.product.name} (x${i.quantity})`).join(', '),
        itemsCount: cart.reduce((sum, i) => sum + i.quantity, 0),
        total,
        paymentMethod: paymentMethodLabel,
        paymentStatus: paymentStatusVal,
        paymentScreenshot: paymentMethod === 'scanner' ? paymentScreenshot : undefined,
        transactionId: paymentMethod === 'scanner' ? transactionId.trim() : undefined,
        status: 'Order Placed',
      });
    } catch (err) {
      console.error('Failed to send admin notification', err);
    }

    setConfirmedOrder(newOrder);
    setCurrentStep(3);
    clearCart();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }
  };

  if (cart.length === 0 && currentStep !== 3) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-50 text-[#E30613] rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-xs text-gray-500 mt-2">Add items to your cart before proceeding to checkout.</p>
        <Link
          to="/"
          className="mt-5 inline-block bg-[#E30613] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#c40510] transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Checkout Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-xl mx-auto relative">
          {/* Connector Line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-10" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#E30613] -z-10 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />

          {/* Steps */}
          {[
            { num: 1, label: 'Delivery Address' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Order Confirmed' },
          ].map(s => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center bg-[#F8F8F8] px-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                      ? 'bg-[#E30613] text-white ring-4 ring-red-100'
                      : 'bg-white text-gray-400 border border-gray-300'
                    }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-bold mt-1.5 uppercase tracking-wider ${isCurrent ? 'text-[#E30613]' : 'text-gray-500'
                    }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-8">
          {/* STEP 1: DELIVERY OPTION & EDITABLE ADDRESS */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs animate-fade-in space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-[#E30613]" />
                  <h2 className="font-black text-gray-900 uppercase text-base">
                    Step 1: Choose Delivery & Edit Address
                  </h2>
                </div>
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full">
                  Free Shipping Guaranteed
                </span>
              </div>

              {/* Auth Warning Gate */}
              {!isAuthenticated && (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-sm animate-fade-in">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-sm block">⚠️ Account Login Required to Order</span>
                      <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                        Please verify your email via Clerk Email OTP to proceed with checkout and live package tracking.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('Please login or create an account with Email OTP to proceed with your order.')}
                    className="bg-[#E30613] hover:bg-[#c40510] text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shrink-0 transition-colors shadow-xs"
                  >
                    Sign In with OTP
                  </button>
                </div>
              )}

              {/* Delivery vs Store Pickup Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 ${fulfillmentType === 'delivery'
                    ? 'border-[#E30613] bg-red-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${fulfillmentType === 'delivery' ? 'bg-[#E30613] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm text-gray-900">Doorstep Delivery</span>
                      <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">FREE</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Direct delivery to your home or office address. Real-time updates as your order is prepared, packed, and dispatched.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 ${fulfillmentType === 'pickup'
                    ? 'border-[#E30613] bg-red-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${fulfillmentType === 'pickup' ? 'bg-[#E30613] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm text-gray-900">In-Store Pickup</span>
                      <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">Instant</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Shivangi Mobile, Opp. Nagraj Electronic, Main Bazar, Sumerpur. Inspect in person and unbox right away.
                    </p>
                  </div>
                </button>
              </div>

              {/* Editable Address Form */}
              <form onSubmit={handleAddressSubmit} className="space-y-4 text-xs">
                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                    {fulfillmentType === 'delivery' ? 'Enter Delivery Address Details' : 'Customer Contact Details'}
                  </span>
                  <span className="text-[11px] text-gray-500">* Required fields</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={customer.fullName}
                      onChange={e => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="e.g. Shivangi Sharma"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Mobile Number (For Delivery Tracking & OTP) *</label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Pincode *</label>
                    <input
                      type="text"
                      value={customer.pincode}
                      onChange={e => setCustomer({ ...customer, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      placeholder="e.g. 518301"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">City / Town *</label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={e => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="e.g. Sumerpur"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">State *</label>
                    <input
                      type="text"
                      value={customer.state}
                      onChange={e => setCustomer({ ...customer, state: e.target.value })}
                      placeholder="e.g. Rajasthan"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    {fulfillmentType === 'delivery' ? 'House No., Building, Street Address *' : 'Address / Area *'}
                  </label>
                  <textarea
                    rows={2}
                    value={customer.street}
                    onChange={e => setCustomer({ ...customer, street: e.target.value })}
                    placeholder="Enter complete street address for accurate delivery"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={customer.landmark}
                      onChange={e => setCustomer({ ...customer, landmark: e.target.value })}
                      placeholder="e.g. Opposite State Bank, Near Clock Tower"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={e => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="For order receipts & dispatch tracking"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                      required
                    />
                  </div>
                </div>

                {/* Address Type & Delivery Instructions */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <span className="font-bold text-gray-700">Address Type:</span>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      checked={customer.addressType === 'Home'}
                      onChange={() => setCustomer({ ...customer, addressType: 'Home' })}
                      className="text-[#E30613] focus:ring-[#E30613]"
                    />
                    <Home className="w-3.5 h-3.5 text-gray-500" />
                    <span>Home (All day delivery)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      checked={customer.addressType === 'Work'}
                      onChange={() => setCustomer({ ...customer, addressType: 'Work' })}
                      className="text-[#E30613] focus:ring-[#E30613]"
                    />
                    <Building className="w-3.5 h-3.5 text-gray-500" />
                    <span>Work (10 AM - 6 PM delivery)</span>
                  </label>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#E30613] hover:bg-[#c40510] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs animate-fade-in space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-[#E30613]" />
                  <h2 className="font-black text-gray-900 uppercase text-base">
                    Step 2: Select Payment Method
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-gray-500 hover:text-[#E30613] flex items-center gap-1 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Edit Address
                </button>
              </div>

              {/* Delivery Address Summary */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin className="w-4 h-4 text-[#E30613] shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-gray-900">
                      Delivering to {customer.fullName} ({customer.phone})
                    </span>
                    <p className="text-gray-500 text-[11px] truncate">
                      {customer.street}, {customer.city} - {customer.pincode}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase bg-red-100 text-[#E30613] px-2 py-0.5 rounded shrink-0">
                  {fulfillmentType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
                </span>
              </div>

              {/* Payment Method Selection Options */}
              <div className="space-y-3">
                {/* Option 1: QR Scanner (UPI) */}
                {paymentSettings.enableQrScanner && (
                  <label
                    className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'scanner'
                      ? 'border-[#E30613] bg-red-50/30 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'scanner'}
                        onChange={() => { setPaymentMethod('scanner'); setScreenshotError(''); }}
                        className="mt-1 text-[#E30613] focus:ring-[#E30613]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <QrCode className="w-5 h-5 text-[#E30613]" />
                          <span className="font-black text-gray-900 text-sm">
                            UPI QR Scanner (Scan & Pay)
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Scan the shop QR code using Google Pay, PhonePe, Paytm, or BHIM. Pay the exact amount and upload your payment screenshot.
                        </p>
                      </div>
                    </div>
                  </label>
                )}

                {/* Option 2: Cash on Delivery (COD) */}
                {paymentSettings.enableCod && (
                  <label
                    className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentMethod === 'cod'
                      ? 'border-[#E30613] bg-red-50/30 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => { setPaymentMethod('cod'); setScreenshotError(''); }}
                        className="mt-1 text-[#E30613] focus:ring-[#E30613]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-5 h-5 text-emerald-600" />
                          <span className="font-black text-gray-900 text-sm">
                            Cash on Delivery (COD)
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                            Pay on Delivery
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Pay directly with cash or UPI QR to the delivery personnel upon delivery of your package.
                        </p>
                      </div>
                    </div>
                  </label>
                )}
              </div>

              {/* Dynamic QR Scanner Details & Screenshot Upload */}
              {paymentMethod === 'scanner' && (
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-xs space-y-5 animate-fade-in">
                  <div className="text-center space-y-3">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Scan To Pay Exact Amount
                    </span>

                    <div className="text-2xl font-black text-[#E30613] font-mono">
                      ₹{total.toLocaleString('en-IN')}
                    </div>

                    {/* QR Code Container */}
                    <div className="w-52 h-52 mx-auto bg-white p-2.5 rounded-2xl shadow-lg border-2 border-gray-200 flex items-center justify-center relative group">
                      {paymentSettings.qrCodeImage ? (
                        <img
                          src={paymentSettings.qrCodeImage}
                          alt="Shivangi Mobile UPI Scanner"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <QrCode className="w-12 h-12 text-gray-300" />
                          <span className="text-xs">QR Scanner Image</span>
                        </div>
                      )}
                    </div>

                    {/* Store UPI Info */}
                    <div className="space-y-1 pt-1">
                      <div className="inline-flex items-center gap-2 bg-white border border-gray-300 py-1.5 px-3 rounded-xl font-mono text-xs font-bold text-gray-800 shadow-xs">
                        <span>{paymentSettings.upiId || 'shivangimobile@upi'}</span>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="text-gray-500 hover:text-gray-800 transition-colors"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="text-[11px] text-gray-600 font-medium">
                        Payee: <strong className="text-gray-900">{paymentSettings.payeeName}</strong>
                      </div>
                    </div>

                    {/* Instructions Banner */}
                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-left text-[11px] text-amber-900 leading-relaxed max-w-md mx-auto">
                      💡 <strong>Instructions:</strong> {paymentSettings.instructions}
                    </div>
                  </div>

                  {/* Screenshot Upload Section */}
                  <div className="border-t border-gray-200 pt-4 space-y-3 max-w-md mx-auto">
                    <div>
                      <label className="block text-xs font-black text-gray-800 uppercase tracking-wide mb-1">
                        1. Upload Payment Screenshot *
                      </label>
                      <p className="text-[11px] text-gray-500 mb-2">
                        Upload the confirmation screen showing transaction status and amount.
                      </p>

                      <div
                        onClick={() => screenshotInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${paymentScreenshot
                          ? 'border-emerald-500 bg-emerald-50/30'
                          : 'border-gray-300 hover:border-[#E30613] bg-white'
                          }`}
                      >
                        {paymentScreenshot ? (
                          <div className="space-y-2">
                            <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border border-emerald-300 shadow-sm">
                              <img
                                src={paymentScreenshot}
                                alt="Payment Proof"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-bold text-xs">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Screenshot Attached!</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                screenshotInputRef.current?.click();
                              }}
                              className="text-[10px] text-gray-500 hover:text-gray-800 underline block mx-auto"
                            >
                              Change Screenshot
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1.5 py-2">
                            <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                            <div className="font-bold text-xs text-gray-800">
                              {uploadingScreenshot ? 'Uploading Screenshot...' : 'Click to Upload Screenshot'}
                            </div>
                            <div className="text-[10px] text-gray-400">PNG, JPG, JPEG (Max 10MB)</div>
                          </div>
                        )}
                        <input
                          ref={screenshotInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* UTR / Transaction ID */}
                    <div>
                      <label className="block text-xs font-black text-gray-800 uppercase tracking-wide mb-1">
                        2. UPI Transaction ID / UTR (Recommended)
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={e => setTransactionId(e.target.value)}
                        placeholder="e.g. 408123456789 (12-digit UTR)"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">Found in your Google Pay, PhonePe, or Paytm receipt.</p>
                    </div>

                    {screenshotError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{screenshotError}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* COD Description Box */}
              {paymentMethod === 'cod' && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cash on Delivery Selected</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Our delivery agent will deliver your sealed box to your address. You can inspect the seal and pay <strong>₹{total.toLocaleString('en-IN')}</strong> in cash or via UPI QR scanner upon delivery.
                  </p>
                </div>
              )}

              {/* Submit Order CTA */}
              <div className="pt-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  ← Back to Address
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={uploadingScreenshot}
                  className="bg-[#E30613] hover:bg-[#c40510] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <span>{paymentMethod === 'scanner' ? 'Submit Payment & Place Order' : 'Place Cash on Delivery Order'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMED & LIVE TRACKING PROGRESS */}
          {currentStep === 3 && confirmedOrder && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-md animate-fade-in text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                  Order Successfully Placed!
                </span>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mt-2">
                  Thank You for Your Order with {brandName}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Order ID: <strong className="font-mono text-gray-900 text-sm bg-gray-100 px-2 py-0.5 rounded">{confirmedOrder.id}</strong> • Date: {confirmedOrder.date}
                </p>
              </div>

              {/* Visual Order Lifecycle Stepper (The exact requested flow) */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-gray-900 tracking-wider">
                    Order Delivery Status
                  </span>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    Stage 1: Order Placed
                  </span>
                </div>

                {/* 4-Stage Stepper */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center">
                  {[
                    { stage: 'Order Placed', desc: 'Received & Logged', active: true, done: true },
                    { stage: 'Preparing', desc: 'Item allocated in store', active: false, done: false },
                    { stage: 'Packed', desc: 'Packaged & Sealed', active: false, done: false },
                    { stage: 'Out for Delivery', desc: 'Dispatched to address', active: false, done: false },
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className={`h-2 rounded-full ${s.done ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      <p className={`text-[11px] font-black ${s.done ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {s.stage}
                      </p>
                      <p className="text-[9px] text-gray-400 hidden sm:block">{s.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-600 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#E30613] shrink-0" />
                  <span>
                    <strong>Next Step:</strong> Shop owner will verify your payment screenshot in the admin dashboard, then advance your order to <strong>Preparing</strong>, <strong>Packed</strong>, and <strong>Out for Delivery</strong>.
                  </span>
                </div>
              </div>

              {/* Payment Verification Banner & WhatsApp Action for Scanner Orders */}
              {confirmedOrder.paymentMethod === 'UPI QR Scanner' && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Payment Verification Pending</span>
                    </span>
                    <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Awaiting Verification
                    </span>
                  </div>

                  <p className="text-xs text-amber-800 leading-relaxed">
                    Thank you! Your payment screenshot has been received. The shop owner is reviewing your transaction and will immediately advance your order to <strong>Preparing & Packed</strong>.
                  </p>

                  {confirmedOrder.transactionId && (
                    <div className="text-xs text-gray-700 bg-white border border-amber-200 p-2 rounded-lg font-mono">
                      Transaction UTR: <strong>{confirmedOrder.transactionId}</strong>
                    </div>
                  )}

                  {confirmedOrder.paymentScreenshot && (
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-amber-200">
                      <img
                        src={confirmedOrder.paymentScreenshot}
                        alt="Payment Proof"
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                      <div className="text-xs text-gray-600">
                        <span className="font-bold text-gray-900 block">Proof Uploaded Successfully</span>
                        <span className="text-[11px] text-gray-500">Stored safely for store verification.</span>
                      </div>
                    </div>
                  )}

                  {/* Direct WhatsApp Confirmation Button */}
                  <a
                    href={`https://wa.me/917841976969?text=${encodeURIComponent(
                      `Hello Shivangi Mobile (Sumerpur), I have placed Order #${confirmedOrder.id} for ₹${confirmedOrder.total.toLocaleString('en-IN')} via UPI Scanner.\nCustomer: ${confirmedOrder.address.fullName} (${confirmedOrder.address.phone})\n${confirmedOrder.transactionId ? 'UTR: ' + confirmedOrder.transactionId + '\n' : ''}Please verify my payment screenshot and start packing!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Payment Proof to Shop Owner on WhatsApp</span>
                  </a>
                </div>
              )}

              {/* Shipping Details Box */}
              <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 text-xs text-left max-w-md mx-auto space-y-1.5">
                <div className="flex items-center gap-2 text-[#E30613] font-black uppercase tracking-wide">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery Address</span>
                </div>
                <p className="font-bold text-gray-900">{confirmedOrder.address.fullName} ({confirmedOrder.address.phone})</p>
                <p className="text-gray-600 leading-relaxed">
                  {confirmedOrder.address.street}, {confirmedOrder.address.landmark ? 'Near ' + confirmedOrder.address.landmark + ', ' : ''}{confirmedOrder.address.city}, {confirmedOrder.address.state} - {confirmedOrder.address.pincode}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-emerald-800 border-t border-red-100 font-medium">
                  <span>Payment: <strong>{confirmedOrder.paymentMethod}</strong></span>
                  <span className="bg-emerald-100 px-2 py-0.5 rounded font-bold">{confirmedOrder.paymentStatus}</span>
                </div>
              </div>

              {/* Items Purchased List */}
              <div className="text-left border rounded-xl overflow-hidden divide-y text-xs max-w-lg mx-auto">
                <div className="bg-gray-100 p-2.5 font-bold text-gray-700 flex justify-between">
                  <span>Ordered Items ({confirmedOrder.items.length})</span>
                  <span className="text-emerald-700 font-bold">Fulfillment: {confirmedOrder.fulfillmentType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}</span>
                </div>
                {confirmedOrder.items.map(it => (
                  <div key={it.product.id} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block">{it.product.name}</span>
                      <span className="text-[11px] text-gray-500">Qty: {it.quantity} • {it.selectedRam || it.product.ram}</span>
                    </div>
                    <span className="font-bold text-gray-900 font-mono">
                      ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                <div className="p-3 bg-gray-50 flex items-center justify-between font-black text-sm">
                  <span>Grand Total Paid:</span>
                  <span className="text-[#E30613] font-mono">₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/account"
                  className="bg-[#E30613] hover:bg-[#c40510] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
                >
                  <span>Track in My Account</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <Link
                  to="/"
                  className="text-xs font-bold text-gray-600 hover:text-gray-900 px-4 py-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Mini Cart Summary */}
        {currentStep !== 3 && (
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm pb-3 border-b border-gray-100">
              Order Summary ({cart.length} items)
            </h3>

            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1 text-xs">
              {cart.map(item => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-10 object-contain p-1 border rounded bg-gray-50 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-mono font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping & Delivery</span>
                <span className="font-mono font-bold text-emerald-600">
                  FREE
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t font-black text-base text-gray-900">
                <span>Total Amount</span>
                <span className="font-mono text-[#E30613]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Delivery Assurance */}
            <div className="p-3 bg-red-50/40 rounded-xl border border-red-100 text-[11px] text-gray-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#E30613]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Secure Checkout</span>
              </div>
              <p className="text-[10px] text-gray-500">
                Free shipping with seal-verified packaging and live SMS updates.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
