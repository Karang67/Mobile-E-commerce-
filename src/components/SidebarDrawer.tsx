import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Home, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Headphones, 
  Watch, 
  Tag, 
  MapPin, 
  Info, 
  Phone, 
  Heart, 
  Scale, 
  User, 
  ChevronRight, 
  ChevronDown, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useStoreData } from '../context/StoreDataContext';
import { useAuth } from '../context/AuthContext';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ isOpen, onClose }) => {
  const { brandName } = useBrand();
  const { brands } = useStoreData();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [brandsExpanded, setBrandsExpanded] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-4/5 max-w-xs bg-white text-gray-800 h-full shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="bg-[#E30613] text-white p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-white text-[#E30613] font-black text-xl px-2 py-0.5 rounded shadow">
              <span>S</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-wide leading-tight">
                {brandName}
              </h2>
              <p className="text-[10px] text-red-100 font-medium tracking-wider">
                Mobiles & Electronics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick User Banner */}
        <div className="bg-red-50 p-3.5 border-b border-red-100 text-xs">
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#E30613] text-white flex items-center justify-center font-black text-xs shadow-xs">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="max-w-[130px] truncate">
                  <span className="font-bold text-gray-800 block leading-tight">{user?.email?.split('@')[0]}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Verified</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/account"
                  onClick={onClose}
                  className="text-xs font-bold text-[#E30613] hover:underline"
                >
                  Account
                </Link>
                <button
                  onClick={() => { logout(); onClose(); }}
                  className="text-[11px] text-gray-500 hover:text-red-600 cursor-pointer"
                >
                  Exit
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-gray-600 font-medium">
                <span>Account Access</span>
                <span className="text-[10px] bg-red-100 text-[#E30613] px-1.5 py-0.5 rounded font-bold">Email OTP</span>
              </div>
              <button
                type="button"
                onClick={() => { onClose(); openAuthModal(); }}
                className="w-full py-2 px-3 bg-[#E30613] hover:bg-red-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-yellow-300" />
                <span>Sign In / Sign Up with OTP</span>
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Links list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 py-1">
          {/* Main Navigation */}
          <div className="py-2">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
            >
              <Home className="w-4 h-4 text-[#E30613]" />
              <span>Home</span>
            </Link>

            {/* Shop By Brand Collapsible */}
            <div>
              <button
                onClick={() => setBrandsExpanded(!brandsExpanded)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#0796D2]" />
                  <span>Shop by Brand</span>
                </div>
                {brandsExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {brandsExpanded && (
                <div className="bg-gray-50 py-1 pl-10 pr-4 space-y-1">
                  {brands.map(brand => (
                    <Link
                      key={brand.id}
                      to={`/brand/${brand.id}`}
                      onClick={onClose}
                      className="block py-1.5 text-xs font-medium text-gray-600 hover:text-[#E30613]"
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/shop/smartphones"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
            >
              <Smartphone className="w-4 h-4 text-gray-500" />
              <span>Smartphones</span>
            </Link>

            <Link
              to="/second-hand"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Pre-Owned Mobiles</span>
              </div>
              <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                SAVE BIG
              </span>
            </Link>

            <Link
              to="/shop/tablets"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
            >
              <Tablet className="w-4 h-4 text-gray-500" />
              <span>Tablets</span>
            </Link>

            <Link
              to="/shop/laptops"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
            >
              <Laptop className="w-4 h-4 text-gray-500" />
              <span>Laptops</span>
            </Link>

            <Link
              to="/shop/smartwatches"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
            >
              <Watch className="w-4 h-4 text-gray-500" />
              <span>Smartwatches</span>
            </Link>

            <Link
              to="/shop/earbuds"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
            >
              <Headphones className="w-4 h-4 text-gray-500" />
              <span>Earbuds & Audio</span>
            </Link>

            <Link
              to="/shop/accessories"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
            >
              <Tag className="w-4 h-4 text-gray-500" />
              <span>Accessories</span>
            </Link>
          </div>

          {/* Offers & Stores */}
          <div className="py-2">
            <Link
              to="/offers"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-[#E30613] hover:bg-red-50"
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-[#E30613]" />
                <span>Special Offers & EMI</span>
              </div>
              <span className="bg-[#E30613] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                HOT
              </span>
            </Link>

            <Link
              to="/stores"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
            >
              <MapPin className="w-4 h-4 text-[#0796D2]" />
              <span>Our Store</span>
            </Link>

            <Link
              to="/compare"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
            >
              <Scale className="w-4 h-4 text-gray-500" />
              <span>Compare Devices</span>
            </Link>

            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
            >
              <Heart className="w-4 h-4 text-gray-500" />
              <span>My Wishlist</span>
            </Link>
          </div>

          {/* Support & Company */}
          <div className="py-2">
            <Link
              to="/about"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
            >
              <Info className="w-4 h-4 text-gray-400" />
              <span>About Us</span>
            </Link>

            <Link
              to="/contact"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E30613]"
            >
              <Phone className="w-4 h-4 text-gray-400" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <PhoneCall className="w-3.5 h-3.5 text-[#E30613]" />
            <span>Toll-Free Support:</span>
          </div>
          <p className="font-bold text-sm text-gray-900">+91 1800 123 4567</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Mon - Sun: 9:00 AM - 9:00 PM</p>
        </div>
      </div>
    </div>
  );
};
