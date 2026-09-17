import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Menu, 
  MapPin, 
  User, 
  Scale, 
  ChevronDown, 
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useBrand } from '../context/BrandContext';
import { useStoreData } from '../context/StoreDataContext';
import { useAuth } from '../context/AuthContext';
import { SidebarDrawer } from './SidebarDrawer';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { compareList } = useCompare();
  const { brandName } = useBrand();
  const { brands } = useStoreData();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileBrandDropdownOpen, setMobileBrandDropdownOpen] = useState(false);

  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const mobileBrandDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target as Node)) {
        setBrandDropdownOpen(false);
      }
      if (mobileBrandDropdownRef.current && !mobileBrandDropdownRef.current.contains(event.target as Node)) {
        setMobileBrandDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setBrandDropdownOpen(false);
        setMobileBrandDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      {/* Main Desktop Header */}
      <header className="hidden lg:block bg-[#E30613] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img 
              src="/images/logo.png" 
              alt="Shivangi Mobile Sumerpur" 
              className="w-12 h-12 object-contain rounded-full bg-white p-0.5 shadow-md border-2 border-white/80 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wide uppercase leading-tight group-hover:text-red-100 transition-colors">
                Shivangi Mobile
              </span>
              <span className="text-[10px] tracking-wider text-red-100 uppercase font-bold flex items-center gap-1">
                <span>SUMERPUR</span>
                <span className="opacity-60">·</span>
                <span className="text-[9px] font-normal tracking-normal text-white/90">सेल्स एण्ड सर्विस</span>
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for smartphones, tablets, laptops, accessories or SKU..."
                className="w-full bg-white text-gray-800 placeholder-gray-400 text-sm rounded-full pl-5 pr-24 py-2.5 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-transparent"
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-[#0796D2] hover:bg-[#067ea8] text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-5 shrink-0">
            {/* Compare */}
            <Link
              to="/compare"
              className="relative flex flex-col items-center text-white/90 hover:text-white transition-colors"
              title="Compare Devices"
            >
              <Scale className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">Compare</span>
              {compareList.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative flex flex-col items-center text-white/90 hover:text-white transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-white text-[#E30613] px-3.5 py-1.5 rounded-full font-bold text-sm shadow hover:bg-red-50 transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-[#E30613]" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E30613] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <Link
                to="/account"
                className="flex items-center gap-1.5 bg-black/25 hover:bg-black/40 text-white px-3 py-1.5 rounded-full transition-colors text-xs font-bold shadow-xs border border-white/20"
                title={`Logged in as ${user?.email}`}
              >
                <div className="w-5 h-5 rounded-full bg-white text-[#E30613] flex items-center justify-center font-black text-[10px] shadow-xs">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[85px] truncate text-[11px] hidden xl:inline">{user?.email?.split('@')[0]}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="flex items-center gap-1.5 bg-white text-[#E30613] hover:bg-red-50 px-3.5 py-1.5 rounded-full transition-all text-xs font-black shadow-sm cursor-pointer"
                title="Sign In / Register with Supabase Email OTP"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </div>

        {/* Secondary Category Navigation Bar (Desktop) */}
        <nav className="bg-[#B8040F] text-white text-xs font-semibold border-t border-red-700/50 shadow-inner relative z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3 py-1.5">
            {/* Shop By Brand Mega Dropdown - Outside overflow-x-auto to prevent vertical clipping! */}
            <div 
              className="relative shrink-0" 
              ref={brandDropdownRef}
            >
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBrandDropdownOpen(prev => !prev);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-extrabold uppercase tracking-wide text-xs transition-all whitespace-nowrap cursor-pointer ${
                  brandDropdownOpen 
                    ? 'bg-black/40 text-yellow-300 ring-2 ring-yellow-400/50 shadow-sm' 
                    : 'bg-black/25 hover:bg-black/35 text-white'
                }`}
                aria-haspopup="true"
                aria-expanded={brandDropdownOpen}
              >
                <Menu className="w-3.5 h-3.5 text-yellow-300" />
                <span>Shop By Brand</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${brandDropdownOpen ? 'rotate-180 text-yellow-300' : 'opacity-80'}`} />
              </button>

              {brandDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1.5 w-72 bg-white text-gray-800 shadow-2xl rounded-2xl border border-gray-100 py-2.5 z-[100] animate-fade-in"
                  style={{ filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.25))' }}
                >
                  <div className="px-4 pb-2 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 border-b flex items-center justify-between">
                    <span>Top Mobile Brands</span>
                    <span className="text-[10px] bg-red-50 text-[#E30613] px-2 py-0.5 rounded-full font-bold">100% Genuine</span>
                  </div>
                  <div className="py-1 max-h-[340px] overflow-y-auto">
                    {brands.map(brand => (
                      <Link
                        key={brand.id}
                        to={`/brand/${brand.id}`}
                        onClick={() => setBrandDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 hover:bg-red-50 text-xs font-bold text-gray-700 hover:text-[#E30613] transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                            style={{ backgroundColor: brand.color || '#E30613' }}
                          />
                          <span>{brand.name}</span>
                        </div>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono group-hover:bg-red-100 group-hover:text-[#E30613]">
                          5G
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t mt-1 pt-2 px-4 flex items-center justify-between bg-gray-50/80 rounded-b-xl">
                    <Link 
                      to="/shop/smartphones" 
                      onClick={() => setBrandDropdownOpen(false)}
                      className="text-xs font-extrabold text-[#0796D2] hover:text-[#067ea8] hover:underline flex items-center gap-1"
                    >
                      <span>View All Brands →</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Main Category Links - Only these scroll horizontally if screen is narrow */}
            <div className="flex items-center space-x-0.5 overflow-x-auto scrollbar-none min-w-0">
              <Link to="/shop/smartphones" className="px-2.5 py-1.5 hover:bg-white/10 rounded-md transition-colors whitespace-nowrap uppercase tracking-wider text-[11px] font-bold shrink-0">
                Smartphones
              </Link>
              <Link to="/shop/tablets" className="px-2.5 py-1.5 hover:bg-white/10 rounded-md transition-colors whitespace-nowrap uppercase tracking-wider text-[11px] font-bold shrink-0">
                Tablets
              </Link>
              <Link to="/shop/laptops" className="px-2.5 py-1.5 hover:bg-white/10 rounded-md transition-colors whitespace-nowrap uppercase tracking-wider text-[11px] font-bold shrink-0">
                Laptops
              </Link>
              <Link to="/shop/smartwatches" className="px-2.5 py-1.5 hover:bg-white/10 rounded-md transition-colors whitespace-nowrap uppercase tracking-wider text-[11px] font-bold shrink-0">
                Smartwatches
              </Link>
              <Link to="/shop/earbuds" className="px-2.5 py-1.5 hover:bg-white/10 rounded-md transition-colors whitespace-nowrap uppercase tracking-wider text-[11px] font-bold shrink-0">
                Earbuds
              </Link>
              <Link to="/shop/accessories" className="px-2.5 py-1.5 hover:bg-white/10 rounded-md transition-colors whitespace-nowrap uppercase tracking-wider text-[11px] font-bold shrink-0">
                Accessories
              </Link>

              {/* Pre-Owned Link with subtle emerald badge */}
              <Link 
                to="/second-hand" 
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-900/60 hover:bg-emerald-900/90 text-emerald-200 border border-emerald-500/50 rounded-full transition-colors whitespace-nowrap uppercase tracking-wider text-[11px] font-black shadow-xs ml-1 shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Pre-Owned</span>
              </Link>
            </div>

            {/* Right Action Links */}
            <div className="flex items-center space-x-2 shrink-0">
              <Link 
                to="/offers" 
                className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-gray-950 font-black text-[11px] uppercase tracking-wider rounded-full transition-all shadow-xs whitespace-nowrap"
              >
                <span>🔥 Festive Deals</span>
              </Link>
              <Link 
                to="/stores" 
                className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 rounded-md text-[11px] uppercase tracking-wider font-bold whitespace-nowrap transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-yellow-300" />
                <span>Our Store</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Sticky Header (Recreates Big C Mobiles Mobile Header) */}
      <header className="lg:hidden bg-[#E30613] text-white sticky top-0 z-40 shadow-md">
        <div className="px-3.5 py-2.5 flex items-center justify-between">
          {/* Hamburger Menu on Left */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 -ml-1 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Centered Brand Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/images/logo.png" 
              alt="Shivangi Mobile" 
              className="w-9 h-9 object-contain rounded-full bg-white p-0.5 shadow-sm border border-white/80"
            />
            <div className="flex flex-col text-left">
              <span className="text-base font-black tracking-wide uppercase leading-none">
                Shivangi Mobile
              </span>
              <span className="text-[9px] font-bold text-red-100 uppercase tracking-wider leading-none mt-0.5">
                Sumerpur · Sales & Service
              </span>
            </div>
          </Link>

          {/* Right Action Icons: Search + Account + Cart with Badge */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle search bar"
            >
              <Search className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <Link
                to="/account"
                className="p-1 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center"
                title={`Account: ${user?.email}`}
              >
                <div className="w-6 h-6 rounded-full bg-white text-[#E30613] flex items-center justify-center font-black text-xs shadow-xs">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-2 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer"
                title="Sign In / Register with Email OTP"
              >
                <User className="w-3.5 h-3.5 text-yellow-300" />
                <span className="text-[10px]">Sign In</span>
              </button>
            )}

            <Link
              to="/cart"
              className="relative p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute 0 right-0 bg-white text-[#E30613] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Collapsible Mobile Search Input */}
        {mobileSearchOpen && (
          <div className="px-3 pb-3 pt-1 animate-fade-in bg-[#C40510]">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search smartphones, tablets, SKU..."
                className="w-full bg-white text-gray-800 placeholder-gray-400 text-xs rounded-full pl-4 pr-20 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-14 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1 bg-[#0796D2] text-white px-3 py-1 rounded-full text-[11px] font-bold"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Secondary Category Navigation Bar */}
        <nav className="bg-[#B8040F] text-white text-xs font-semibold border-t border-red-700/50 shadow-inner relative z-50">
          <div className="px-3 py-1.5 flex items-center justify-between gap-2">
            {/* Shop By Brand Mobile Dropdown */}
            <div className="relative shrink-0" ref={mobileBrandDropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileBrandDropdownOpen(prev => !prev);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-extrabold uppercase tracking-wide text-[11px] transition-all whitespace-nowrap cursor-pointer ${
                  mobileBrandDropdownOpen 
                    ? 'bg-black/40 text-yellow-300 ring-2 ring-yellow-400/50 shadow-sm' 
                    : 'bg-black/25 hover:bg-black/35 text-white'
                }`}
                aria-haspopup="true"
                aria-expanded={mobileBrandDropdownOpen}
              >
                <Menu className="w-3 h-3 text-yellow-300" />
                <span>Shop By Brand</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${mobileBrandDropdownOpen ? 'rotate-180 text-yellow-300' : 'opacity-80'}`} />
              </button>

              {mobileBrandDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1.5 w-64 bg-white text-gray-800 shadow-2xl rounded-2xl border border-gray-100 py-2.5 z-[100] animate-fade-in"
                  style={{ filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.25))' }}
                >
                  <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 border-b flex items-center justify-between">
                    <span>Top Mobile Brands</span>
                    <span className="text-[9px] bg-red-50 text-[#E30613] px-1.5 py-0.5 rounded-full font-bold">100% Genuine</span>
                  </div>
                  <div className="py-1 max-h-[280px] overflow-y-auto">
                    {brands.map(brand => (
                      <Link
                        key={brand.id}
                        to={`/brand/${brand.id}`}
                        onClick={() => setMobileBrandDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 hover:bg-red-50 text-xs font-bold text-gray-700 hover:text-[#E30613] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: brand.color || '#E30613' }}
                          />
                          <span>{brand.name}</span>
                        </div>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                          5G
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t mt-1 pt-2 px-3 flex items-center justify-between bg-gray-50/80 rounded-b-xl">
                    <Link 
                      to="/shop/smartphones" 
                      onClick={() => setMobileBrandDropdownOpen(false)}
                      className="text-[11px] font-extrabold text-[#0796D2] hover:underline"
                    >
                      View All Brands →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Category Horizontal Pills */}
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none min-w-0">
              <Link to="/shop/smartphones" className="px-2 py-1 hover:bg-white/10 rounded text-[11px] uppercase tracking-wider font-bold whitespace-nowrap shrink-0">
                Smartphones
              </Link>
              <Link to="/shop/tablets" className="px-2 py-1 hover:bg-white/10 rounded text-[11px] uppercase tracking-wider font-bold whitespace-nowrap shrink-0">
                Tablets
              </Link>
              <Link to="/second-hand" className="px-2 py-0.5 bg-emerald-900/60 text-emerald-200 border border-emerald-500/50 rounded-full text-[10px] uppercase font-bold whitespace-nowrap shrink-0">
                Pre-Owned
              </Link>
              <Link to="/offers" className="px-2 py-0.5 bg-yellow-400 text-black font-black text-[10px] uppercase tracking-wider rounded-full whitespace-nowrap shrink-0">
                🔥 Deals
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Slideout Navigation Drawer */}
      <SidebarDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};
