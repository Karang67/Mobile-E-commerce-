import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Phone, 
  Mail, 
  MapPin, 
  Search, 
  CheckCircle2, 
  Clock, 
  MessageCircle,
  Trash2,
  Store,
  Eye,
  X,
  Truck,
  Package,
  Check,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Send
} from 'lucide-react';
import { 
  getAdminNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  clearAdminNotifications,
  updateCustomerOrderStatus,
  getStatusMessage,
  AdminInquiryNotification 
} from '../utils/notificationService';
import { OrderStatus } from '../types';

export const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<AdminInquiryNotification[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiryNotification | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const refreshList = () => {
    setInquiries(getAdminNotifications());
  };

  useEffect(() => {
    refreshList();
    const handleUpdate = () => refreshList();
    window.addEventListener('shivangi_notifications_updated', handleUpdate);
    window.addEventListener('shivangi_orders_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('shivangi_notifications_updated', handleUpdate);
      window.removeEventListener('shivangi_orders_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus, currentPaymentStatus?: 'Pending' | 'Verified' | 'Success' | 'COD') => {
    updateCustomerOrderStatus(orderId, newStatus, currentPaymentStatus);
    refreshList();
    if (selectedInquiry && selectedInquiry.inquiryId === orderId) {
      setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
    }
    setActionSuccessMsg(`Order #${orderId} moved to "${newStatus}". Customer notified!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handlePaymentVerify = (orderId: string, currentStatus: OrderStatus) => {
    updateCustomerOrderStatus(orderId, currentStatus, 'Verified', 'Payment verified successfully by Shivangi Mobile Admin.');
    refreshList();
    if (selectedInquiry && selectedInquiry.inquiryId === orderId) {
      setSelectedInquiry(prev => prev ? { ...prev, paymentStatus: 'Verified' } : null);
    }
    setActionSuccessMsg(`Payment for Order #${orderId} verified successfully!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const filtered = inquiries.filter(inq => {
    const matchesSearch = 
      inq.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inq.customerPhone.includes(search) ||
      inq.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      inq.inquiryId.toLowerCase().includes(search.toLowerCase()) ||
      (inq.streetAddress && inq.streetAddress.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ? true : inq.status === statusFilter;
    const matchesFulfillment = fulfillmentFilter === 'all' ? true : inq.fulfillmentType === fulfillmentFilter;

    return matchesSearch && matchesStatus && matchesFulfillment;
  });

  const unreadCount = inquiries.filter(i => !i.read).length;

  const orderStages: OrderStatus[] = [
    'Order Placed',
    'Preparing',
    'Packed',
    'Out for Delivery',
    'Delivered'
  ];

  const getStageIndex = (status: OrderStatus) => {
    const idx = orderStages.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-white">Orders & Delivery Management</h1>
            {unreadCount > 0 && (
              <span className="bg-[#E30613] text-white text-xs font-black px-2.5 py-0.5 rounded-full animate-pulse">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-0.5">
            Receive customer orders, verify online & COD payments, and update delivery fulfillment stages (Prepare, Pack, Out for Delivery)
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {unreadCount > 0 && (
            <button
              onClick={() => markAllNotificationsAsRead()}
              className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              Mark All Read
            </button>
          )}
          {inquiries.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all orders and inquiry records from the admin list?')) {
                  clearAdminNotifications();
                }
              }}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear List</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Search & Quick Filters */}
      <div className="bg-[#1B2430] p-4 rounded-2xl border border-gray-700/60 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, order ID, address or pincode..."
            className="w-full bg-gray-900/80 border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-gray-400 font-bold text-[11px] mr-1">Status:</span>
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'Order Placed', label: 'Order Placed' },
              { id: 'Preparing', label: 'Preparing' },
              { id: 'Packed', label: 'Packed' },
              { id: 'Out for Delivery', label: 'Out for Delivery' },
              { id: 'Delivered', label: 'Delivered' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-[#E30613] text-white shadow-xs'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Fulfillment Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-bold text-[11px] mr-1">Type:</span>
            <button
              onClick={() => setFulfillmentFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                fulfillmentFilter === 'all' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFulfillmentFilter('delivery')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                fulfillmentFilter === 'delivery' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Truck className="w-3 h-3" />
              <span>Doorstep Delivery</span>
            </button>
            <button
              onClick={() => setFulfillmentFilter('pickup')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                fulfillmentFilter === 'pickup' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Store className="w-3 h-3" />
              <span>Store Pickup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 p-12 text-center space-y-3">
          <ClipboardList className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-sm font-bold text-gray-300">
            {search || statusFilter !== 'all' || fulfillmentFilter !== 'all' 
              ? 'No orders matching current filter criteria' 
              : 'No orders received yet'}
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            When a customer adds products to cart, fills their delivery address, and completes checkout, their order and payment status will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(inq => {
            const isDelivery = inq.fulfillmentType === 'delivery';
            const isPaymentVerified = inq.paymentStatus === 'Verified' || inq.paymentStatus === 'Success';
            const currentStageIdx = getStageIndex(inq.status);

            return (
              <div
                key={inq.id}
                className={`bg-[#1B2430] rounded-2xl border transition-all p-5 space-y-4 shadow-lg ${
                  !inq.read
                    ? 'border-red-500/60 bg-linear-to-r from-[#1B2430] via-red-950/20 to-[#1B2430]'
                    : 'border-gray-700/50'
                }`}
              >
                {/* 1. Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-700/50 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-yellow-400 bg-gray-800 px-3 py-1 rounded-lg border border-gray-700 shadow-xs">
                      #{inq.inquiryId}
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{inq.createdAt}</span>
                    </div>
                    {!inq.read && (
                      <span className="bg-[#E30613] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        New Order
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Fulfillment Badge */}
                    {isDelivery ? (
                      <span className="text-blue-300 font-bold bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-400" />
                        <span>Doorstep Delivery</span>
                      </span>
                    ) : (
                      <span className="text-amber-300 font-bold bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-amber-400" />
                        <span>Store Pickup: Adoni</span>
                      </span>
                    )}

                    {/* Payment Status Badge */}
                    {isPaymentVerified ? (
                      <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-700/60 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Payment Verified ✓</span>
                      </span>
                    ) : inq.paymentStatus === 'COD' ? (
                      <span className="text-amber-400 font-bold bg-amber-950/60 border border-amber-700/60 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                        <span>Cash on Delivery (COD)</span>
                      </span>
                    ) : (
                      <span className="text-yellow-300 font-bold bg-yellow-950/60 border border-yellow-700/60 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Payment Pending Check</span>
                      </span>
                    )}

                    <span className="font-mono font-black text-base text-[#E30613] bg-gray-900 px-3 py-1 rounded-lg border border-gray-800">
                      ₹{inq.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* 2. Customer & Address Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                  {/* Customer Contact */}
                  <div className="bg-gray-800/50 rounded-xl p-3.5 border border-gray-700/40 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      Customer Profile
                    </span>
                    <div className="font-black text-white text-sm">{inq.customerName}</div>
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <a href={`tel:${inq.customerPhone}`} className="hover:text-emerald-400 font-mono font-bold">
                        {inq.customerPhone}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px] truncate">
                      <Mail className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="truncate">{inq.customerEmail}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-700/40 text-[11px] text-gray-400">
                      Method: <strong className="text-gray-200">{inq.paymentMethod}</strong>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-gray-800/50 rounded-xl p-3.5 border border-gray-700/40 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider flex items-center justify-between">
                      <span>Delivery Address</span>
                      {isDelivery ? (
                        <span className="text-blue-400 text-[9px] font-bold uppercase">Doorstep</span>
                      ) : (
                        <span className="text-amber-400 text-[9px] font-bold uppercase">Store Collection</span>
                      )}
                    </span>
                    
                    {isDelivery ? (
                      <div className="space-y-1">
                        <div className="flex items-start gap-1.5 text-gray-200 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#E30613] shrink-0 mt-0.5" />
                          <p className="leading-relaxed">
                            {inq.streetAddress || inq.city}
                          </p>
                        </div>
                        {inq.pincode && (
                          <p className="text-gray-400 text-[11px] pl-5 font-mono">
                            Pincode: <span className="text-white font-bold">{inq.pincode}</span>
                          </p>
                        )}
                        {inq.notes && (
                          <div className="mt-2 bg-amber-950/40 border border-amber-800/40 p-1.5 rounded text-[11px] text-amber-200">
                            <strong>Note:</strong> "{inq.notes}"
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1 text-gray-300">
                        <p className="font-bold text-white">Shivangi Mobile Showroom</p>
                        <p className="text-gray-400 text-[11px]">Municipal Complex, Main Bus Stand Road, Adoni, AP - 518301</p>
                        <p className="text-emerald-400 text-[11px] font-bold">Counter Pickup Counter #1</p>
                      </div>
                    )}
                  </div>

                  {/* Products Reserved & Summary */}
                  <div className="bg-gray-800/50 rounded-xl p-3.5 border border-gray-700/40 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                        Ordered Items ({inq.itemsCount})
                      </span>
                      <p className="text-gray-200 text-xs font-semibold mt-1 leading-relaxed line-clamp-3">
                        {inq.itemsSummary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-700/40 flex items-center justify-between">
                      <span className="text-gray-400 text-[11px]">Current Stage:</span>
                      <span className="bg-red-950/50 text-[#E30613] border border-red-800/50 px-2 py-0.5 rounded font-black text-xs">
                        {inq.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. LIFECYCLE PROGRESS & ADMIN ACTION CONTROLS */}
                <div className="bg-gray-900/90 rounded-xl p-4 border border-gray-700/60 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] uppercase font-black text-gray-300 tracking-wider flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#E30613]" />
                      <span>Order Fulfillment Lifecycle & Customer Updates</span>
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Customer status updates instantly on their tracking screen
                    </span>
                  </div>

                  {/* Visual 5-Stage Step Indicator */}
                  <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                    {orderStages.map((stage, sIdx) => {
                      const isPast = sIdx < currentStageIdx;
                      const isCurrent = sIdx === currentStageIdx;
                      return (
                        <div key={stage} className="flex flex-col items-center">
                          <div
                            className={`w-full py-1.5 px-1 rounded-lg font-bold transition-all truncate flex items-center justify-center gap-1 ${
                              isPast
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                                : isCurrent
                                ? 'bg-[#E30613] text-white font-black shadow-md ring-2 ring-red-500/50'
                                : 'bg-gray-800 text-gray-500 border border-gray-700/40'
                            }`}
                          >
                            {isPast && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                            <span className="truncate">{stage}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-800">
                    {/* Payment Verification Action */}
                    <div className="flex items-center gap-2">
                      {!isPaymentVerified ? (
                        <button
                          onClick={() => handlePaymentVerify(inq.inquiryId, inq.status)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/30"
                          title="Check payment and mark as verified"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verify Payment Success ✓</span>
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Payment Verified</span>
                        </span>
                      )}

                      {/* Dropdown to jump directly to any status */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400 text-[11px] hidden sm:inline">Move to:</span>
                        <select
                          value={inq.status}
                          onChange={e => handleStatusChange(inq.inquiryId, e.target.value as OrderStatus, inq.paymentStatus)}
                          className="bg-gray-800 border border-gray-700 text-white text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                        >
                          <option value="Order Placed">1. Order Placed</option>
                          <option value="Preparing">2. Preparing</option>
                          <option value="Packed">3. Packed</option>
                          <option value="Out for Delivery">4. Out for Delivery</option>
                          <option value="Delivered">5. Delivered</option>
                          <option value="Ready for Pickup">Ready for Store Pickup</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    {/* Next Step Stage Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {inq.status === 'Order Placed' && (
                        <button
                          onClick={() => handleStatusChange(inq.inquiryId, 'Preparing', inq.paymentStatus)}
                          className="bg-yellow-600 hover:bg-yellow-500 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>1. Mark as Preparing →</span>
                        </button>
                      )}

                      {inq.status === 'Preparing' && (
                        <button
                          onClick={() => handleStatusChange(inq.inquiryId, 'Packed', inq.paymentStatus)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>2. Mark as Packed →</span>
                        </button>
                      )}

                      {inq.status === 'Packed' && (
                        <button
                          onClick={() => handleStatusChange(inq.inquiryId, 'Out for Delivery', inq.paymentStatus)}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>3. Mark Out for Delivery →</span>
                        </button>
                      )}

                      {inq.status === 'Out for Delivery' && (
                        <button
                          onClick={() => handleStatusChange(inq.inquiryId, 'Delivered', inq.paymentStatus)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>4. Mark Delivered ✓</span>
                        </button>
                      )}

                      {/* Contact Actions */}
                      <a
                        href={`tel:${inq.customerPhone}`}
                        onClick={() => markNotificationAsRead(inq.id)}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors border border-gray-700"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call</span>
                      </a>

                      <a
                        href={`https://wa.me/91${inq.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hi ${inq.customerName}, this is Shivangi Mobile regarding your order #${inq.inquiryId}. Current status: "${inq.status}". Payment status: "${inq.paymentStatus}". ${getStatusMessage(inq.status)}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => markNotificationAsRead(inq.id)}
                        className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors shadow-xs"
                        title="Send WhatsApp update to customer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Update</span>
                      </a>

                      <button
                        onClick={() => {
                          setSelectedInquiry(inq);
                          markNotificationAsRead(inq.id);
                        }}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-200 p-2 rounded-xl border border-gray-700"
                        title="View Full Order & Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1B2430] rounded-2xl max-w-xl w-full p-6 border border-gray-700/60 shadow-2xl space-y-4 animate-scale-up text-xs text-gray-300 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-700/50">
              <div>
                <span className="text-[10px] text-[#E30613] font-bold uppercase tracking-wider">
                  Order Management Voucher
                </span>
                <h3 className="font-black text-white text-base">Order #{selectedInquiry.inquiryId}</h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Customer Profile */}
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/40 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Customer Profile & Contact</span>
                <p className="text-white font-black text-sm">{selectedInquiry.customerName}</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <a href={`tel:${selectedInquiry.customerPhone}`} className="font-mono text-emerald-400 font-bold hover:underline">
                    {selectedInquiry.customerPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-gray-300">{selectedInquiry.customerEmail}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/40 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {selectedInquiry.fulfillmentType === 'delivery' ? 'Doorstep Delivery Address' : 'Store Pickup Location'}
                </span>
                <p className="text-white font-medium leading-relaxed">
                  {selectedInquiry.streetAddress || selectedInquiry.city || 'Adoni Showroom Counter'}
                </p>
                {selectedInquiry.pincode && (
                  <p className="text-gray-400 font-mono">Pincode: {selectedInquiry.pincode}</p>
                )}
                {selectedInquiry.notes && (
                  <p className="text-amber-300 bg-amber-950/30 p-2 rounded border border-amber-800/40">
                    Instructions: "{selectedInquiry.notes}"
                  </p>
                )}
              </div>

              {/* Products & Price */}
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/40 space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Ordered Items ({selectedInquiry.itemsCount})</span>
                <p className="text-white font-medium">{selectedInquiry.itemsSummary}</p>
                <div className="flex justify-between items-baseline pt-2 border-t border-gray-700/40">
                  <span className="text-gray-400">Total Order Amount:</span>
                  <span className="text-[#E30613] font-black text-lg font-mono">
                    ₹{selectedInquiry.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment & Stage Verification in Modal */}
              <div className="bg-gray-900/90 p-4 rounded-xl border border-gray-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Payment Verification</span>
                    <span className={`font-bold text-xs ${
                      selectedInquiry.paymentStatus === 'Verified' ? 'text-emerald-400' : 'text-yellow-400'
                    }`}>
                      {selectedInquiry.paymentMethod} • Status: {selectedInquiry.paymentStatus}
                    </span>
                  </div>
                  {selectedInquiry.paymentStatus !== 'Verified' && (
                    <button
                      onClick={() => handlePaymentVerify(selectedInquiry.inquiryId, selectedInquiry.status)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify Payment</span>
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Update Fulfillment Status</span>
                    <span className="text-xs font-bold text-white">Current: {selectedInquiry.status}</span>
                  </div>
                  <select
                    value={selectedInquiry.status}
                    onChange={e => handleStatusChange(selectedInquiry.inquiryId, e.target.value as OrderStatus, selectedInquiry.paymentStatus)}
                    className="bg-gray-800 border border-gray-700 text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                  >
                    <option value="Order Placed">1. Order Placed</option>
                    <option value="Preparing">2. Preparing</option>
                    <option value="Packed">3. Packed</option>
                    <option value="Out for Delivery">4. Out for Delivery</option>
                    <option value="Delivered">5. Delivered</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gray-700/50">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-bold"
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
