import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tag,
  Store,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Bell,
  ExternalLink,
  ClipboardList,
  Phone,
  Clock,
  CheckCircle2,
  Trash2,
  Truck,
  QrCode
} from 'lucide-react';
import { adminLogout } from '../data/adminData';
import { 
  getAdminNotifications, 
  markAllNotificationsAsRead, 
  clearAdminNotifications,
  markNotificationAsRead,
  AdminInquiryNotification 
} from '../utils/notificationService';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/inquiries', icon: Truck, label: 'Orders & Deliveries' },
  { to: '/admin/payment', icon: QrCode, label: 'QR Scanner & Payment' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/offers', icon: Tag, label: 'Offers & Banners' },
  { to: '/admin/store', icon: Store, label: 'Store Info' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminInquiryNotification[]>(() => getAdminNotifications());

  const refreshNotifications = () => {
    setNotifications(getAdminNotifications());
  };

  useEffect(() => {
    refreshNotifications();
    const handleUpdate = () => refreshNotifications();
    window.addEventListener('shivangi_notifications_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('shivangi_notifications_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin');
    window.location.reload();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-700/60">
        <div className="flex items-center gap-3">
          <img 
            src="/images/logo.png" 
            alt="Shivangi Mobile Sumerpur" 
            className="w-10 h-10 object-contain rounded-full bg-white p-0.5 shadow-md border border-white/80 shrink-0"
          />
          <div>
            <div className="text-white font-black text-sm leading-tight">Shivangi Mobile</div>
            <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Sumerpur · Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname.startsWith(to);
          const isOrders = to === '/admin/inquiries';
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group relative ${
                active
                  ? 'bg-[#E30613] text-white shadow-md shadow-red-900/30'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span className="flex-1">{label}</span>
              {isOrders && unreadCount > 0 && (
                <span className="bg-[#E30613] text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-gray-900">
                  {unreadCount}
                </span>
              )}
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-700/60 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-700/50 hover:text-white transition-all"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          View Storefront
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0F1923] font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#1B2430] flex-col shrink-0 border-r border-gray-700/40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-[#1B2430] flex flex-col border-r border-gray-700/40 z-10 animate-slide-in-left">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-[#1B2430] border-b border-gray-700/40 px-5 py-3.5 flex items-center justify-between shrink-0 relative z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-white font-bold text-sm">
              {navItems.find(n => location.pathname.startsWith(n.to))?.label ?? 'Admin'}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell Button & Popover */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="text-gray-400 hover:text-white relative p-1.5 rounded-lg hover:bg-gray-700/40 transition-colors"
                title="Customer Inquiry Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E30613] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1B2430] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50 text-xs animate-fade-in">
                  <div className="p-3.5 border-b border-gray-700/60 flex items-center justify-between bg-gray-800/40">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Customer Inquiries</span>
                      {unreadCount > 0 && (
                        <span className="bg-[#E30613] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllNotificationsAsRead()}
                          className="text-[11px] text-gray-400 hover:text-white"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-700/40">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 space-y-1.5">
                        <Bell className="w-8 h-8 mx-auto text-gray-600" />
                        <p className="font-semibold text-gray-300">No inquiry notifications</p>
                        <p className="text-[11px] text-gray-500">
                          When a customer places a store inquiry, notification with customer info will appear here.
                        </p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(notif => (
                        <div
                          key={notif.id}
                          className={`p-3.5 transition-colors ${
                            !notif.read ? 'bg-red-950/20' : 'hover:bg-gray-800/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{notif.customerName}</span>
                              <span className="font-mono text-[10px] text-yellow-400 bg-gray-800 px-1.5 py-0.5 rounded">
                                {notif.inquiryId}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500">{notif.createdAt}</span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-gray-300 mb-1">
                            <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                            <a href={`tel:${notif.customerPhone}`} className="hover:text-emerald-400 font-mono">
                              {notif.customerPhone}
                            </a>
                            <span>•</span>
                            <span className="text-[#E30613] font-bold font-mono">
                              ₹{notif.total.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-400 line-clamp-1">
                            {notif.itemsSummary}
                          </p>

                          <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-gray-700/30 text-[10px]">
                            <span className="text-gray-500">{notif.paymentMethod}</span>
                            <Link
                              to="/admin/inquiries"
                              onClick={() => {
                                markNotificationAsRead(notif.id);
                                setNotifDropdownOpen(false);
                              }}
                              className="text-[#0796D2] hover:underline font-bold"
                            >
                              View Inquiry →
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-2.5 border-t border-gray-700/60 text-center bg-gray-800/40">
                      <Link
                        to="/admin/inquiries"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-xs font-bold text-[#E30613] hover:underline block"
                      >
                        View All Inquiries ({notifications.length})
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#E30613] flex items-center justify-center text-white font-black text-sm shadow-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-left { animation: slideInLeft 0.22s ease; }
      `}</style>
    </div>
  );
};
