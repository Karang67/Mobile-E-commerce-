import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Search, 
  ShoppingCart, 
  User, 
  MoreHorizontal, 
  MapPin, 
  Tag, 
  Scale, 
  Heart, 
  Phone, 
  X, 
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const { totalItems } = useCart();
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);

  return (
    <>
      {/* Fixed Bottom Navigation Bar - Mobile Only */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-[0_-3px_10px_rgba(0,0,0,0.08)] safe-area-pb"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 h-16 items-center">
          {/* 1. Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center h-full transition-colors ${
                isActive ? 'text-[#E30613]' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-1">Home</span>
          </NavLink>

          {/* 2. Search */}
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center h-full transition-colors ${
                isActive ? 'text-[#E30613]' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <Search className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-1">Search</span>
          </NavLink>

          {/* 3. Cart with Badge */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center h-full transition-colors ${
                isActive ? 'text-[#E30613]' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-[#E30613] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold mt-1">Cart</span>
          </NavLink>

          {/* 4. Account */}
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center h-full transition-colors ${
                isActive ? 'text-[#E30613]' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <User className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-1">Account</span>
          </NavLink>

          {/* 5. More (Three Dots) */}
          <button
            onClick={() => setMoreSheetOpen(true)}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              moreSheetOpen ? 'text-[#E30613]' : 'text-gray-500 hover:text-gray-900'
            }`}
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[11px] font-semibold mt-1">More</span>
          </button>
        </div>
      </nav>

      {/* More Options Bottom Sheet */}
      {moreSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMoreSheetOpen(false)}
          />

          {/* Bottom Sheet Drawer */}
          <div className="relative bg-white rounded-t-2xl shadow-2xl p-5 z-10 animate-fade-in border-t border-gray-100 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-5 bg-[#E30613] rounded-full" />
                <h3 className="font-bold text-gray-900 text-base">Quick Shortcuts & Help</h3>
              </div>
              <button
                onClick={() => setMoreSheetOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Close shortcuts sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <NavLink
                to="/stores"
                onClick={() => setMoreSheetOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 hover:text-[#E30613] transition-colors border border-gray-200/60"
              >
                <div className="w-9 h-9 rounded-lg bg-red-100 text-[#E30613] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">Find Stores</h4>
                  <p className="text-[10px] text-gray-500">Adoni Outlet</p>
                </div>
              </NavLink>

              <NavLink
                to="/offers"
                onClick={() => setMoreSheetOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 hover:text-[#E30613] transition-colors border border-gray-200/60"
              >
                <div className="w-9 h-9 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">Festive Deals</h4>
                  <p className="text-[10px] text-gray-500">EMI & Discounts</p>
                </div>
              </NavLink>

              <NavLink
                to="/wishlist"
                onClick={() => setMoreSheetOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 hover:text-[#E30613] transition-colors border border-gray-200/60"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">Wishlist</h4>
                  <p className="text-[10px] text-gray-500">Saved items</p>
                </div>
              </NavLink>

              <NavLink
                to="/compare"
                onClick={() => setMoreSheetOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 hover:text-[#E30613] transition-colors border border-gray-200/60"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#0796D2] flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">Compare</h4>
                  <p className="text-[10px] text-gray-500">Up to 4 devices</p>
                </div>
              </NavLink>
            </div>

            {/* Quick Benefits Strip within sheet */}
            <div className="bg-blue-50 border border-blue-200/60 rounded-xl p-3 flex items-center justify-between text-[11px] text-blue-900 font-semibold mb-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0796D2]" />
                <span>Store Pickup</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Genuine</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span>0% Down EMI</span>
              </div>
            </div>

            <NavLink
              to="/contact"
              onClick={() => setMoreSheetOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Helpline & Support</span>
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
};
