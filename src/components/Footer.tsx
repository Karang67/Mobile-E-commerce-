import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUp, 
  ShieldCheck, 
  CreditCard, 
  Truck,
  RotateCcw
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';

export const Footer: React.FC = () => {
  const { brandName, storeTagline } = useBrand();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    about: false,
    information: false,
    support: false,
    account: false,
    shipping: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#202D3B] text-gray-300 pt-10 pb-20 lg:pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Centered Brand Logo & Tagline */}
        <div className="flex flex-col items-center justify-center text-center pb-8 border-b border-gray-700/60">
          <Link to="/" className="flex items-center gap-2.5 mb-2">
            <div className="bg-[#E30613] text-white font-black text-2xl px-3 py-1 rounded shadow-sm">
              <span>S</span>
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-wide text-white uppercase block leading-none">
                {brandName}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                Mobiles & Electronics
              </span>
            </div>
          </Link>

          {/* Store Count Badge */}
          <div className="inline-flex items-center gap-2 bg-[#283747] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mt-2 border border-gray-600/50">
            <MapPin className="w-3.5 h-3.5 text-[#E30613]" />
            <span>{storeTagline}</span>
          </div>

          <p className="text-xs text-gray-400 max-w-xl mt-3 leading-relaxed">
            South India’s most trusted multi-brand mobile and smart gadgets retail network with 250+ outlets across Andhra Pradesh, Telangana, and Tamil Nadu.
          </p>


        </div>

        {/* Desktop 5-Column Navigation Grid */}
        <div className="hidden lg:grid grid-cols-5 gap-8 py-10 border-b border-gray-700/60 text-xs">
          {/* Col 1: About */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#E30613] pl-2">
              About {brandName}
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Company Journey</Link></li>
              <li><Link to="/stores" className="hover:text-white transition-colors">Store Network & Locator</Link></li>
              <li><Link to="/offers" className="hover:text-white transition-colors">Mega Deals & Offers</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Corporate Governance</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Careers & Partnerships</Link></li>
            </ul>
          </div>

          {/* Col 2: Information */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#0796D2] pl-2">
              Information
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Store Pickup Policy</Link></li>
              <li><Link to="/payment-methods" className="hover:text-white transition-colors">Payment Methods</Link></li>
              <li><Link to="/stores" className="hover:text-white transition-colors">Visit Our Store</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-yellow-400 pl-2">
              Customer Support
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/contact" className="hover:text-white transition-colors">Help Center & FAQ</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">Track Inquiry</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Returns & Replacement</Link></li>
              <li><Link to="/stores" className="hover:text-white transition-colors">Store Service Desk</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Store Contact</Link></li>
            </ul>
          </div>

          {/* Col 4: My Account */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-400 pl-2">
              My Account
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/account" className="hover:text-white transition-colors">Dashboard Profile</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">My Inquiries</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Device Comparisons</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">View Cart</Link></li>
            </ul>
          </div>

          {/* Col 5: Payment & Store Pickup */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-purple-400 pl-2">
              Payment & Pickup
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/payment-methods" className="hover:text-white transition-colors">Payment Methods</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Store Pickup Guide</Link></li>
              <li><Link to="/stores" className="hover:text-white transition-colors">Adoni Store Location</Link></li>
              <li><Link to="/offers" className="hover:text-white transition-colors">No Cost EMI Options</Link></li>
            </ul>
          </div>
        </div>

        {/* Mobile Accordion Navigation */}
        <div className="lg:hidden divide-y divide-gray-700/60 py-4 text-xs">
          {/* Accordion 1: About */}
          <div className="py-2.5">
            <button
              onClick={() => toggleSection('about')}
              className="w-full flex items-center justify-between font-bold text-sm text-white py-1"
            >
              <span>About {brandName}</span>
              {openSections.about ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.about && (
              <ul className="pt-3 pb-1 space-y-2 text-gray-400 pl-2">
                <li><Link to="/about" className="hover:text-white">Our Company Journey</Link></li>
                <li><Link to="/stores" className="hover:text-white">Store Network & Locator</Link></li>
                <li><Link to="/offers" className="hover:text-white">Mega Deals & Offers</Link></li>
                <li><Link to="/about" className="hover:text-white">Corporate Governance</Link></li>
              </ul>
            )}
          </div>

          {/* Accordion 2: Information */}
          <div className="py-2.5">
            <button
              onClick={() => toggleSection('information')}
              className="w-full flex items-center justify-between font-bold text-sm text-white py-1"
            >
              <span>Information</span>
              {openSections.information ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.information && (
              <ul className="pt-3 pb-1 space-y-2 text-gray-400 pl-2">
                <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/shipping" className="hover:text-white">Store Pickup Policy</Link></li>
                <li><Link to="/payment-methods" className="hover:text-white">Payment Methods</Link></li>
                <li><Link to="/stores" className="hover:text-white">Visit Our Store</Link></li>
              </ul>
            )}
          </div>

          {/* Accordion 3: Support */}
          <div className="py-2.5">
            <button
              onClick={() => toggleSection('support')}
              className="w-full flex items-center justify-between font-bold text-sm text-white py-1"
            >
              <span>Support</span>
              {openSections.support ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.support && (
              <ul className="pt-3 pb-1 space-y-2 text-gray-400 pl-2">
                <li><Link to="/contact" className="hover:text-white">Help Center & FAQ</Link></li>
                <li><Link to="/account" className="hover:text-white">Track Inquiry</Link></li>
                <li><Link to="/contact" className="hover:text-white">Returns & Refunds</Link></li>
                <li><Link to="/stores" className="hover:text-white">Service Centers</Link></li>
              </ul>
            )}
          </div>

          {/* Accordion 4: My Account */}
          <div className="py-2.5">
            <button
              onClick={() => toggleSection('account')}
              className="w-full flex items-center justify-between font-bold text-sm text-white py-1"
            >
              <span>My Account</span>
              {openSections.account ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.account && (
              <ul className="pt-3 pb-1 space-y-2 text-gray-400 pl-2">
                <li><Link to="/account" className="hover:text-white">Dashboard Profile</Link></li>
                <li><Link to="/account" className="hover:text-white">My Inquiries</Link></li>
                <li><Link to="/wishlist" className="hover:text-white">My Wishlist</Link></li>
                <li><Link to="/compare" className="hover:text-white">Device Comparisons</Link></li>
              </ul>
            )}
          </div>

          {/* Accordion 5: Payment & Pickup */}
          <div className="py-2.5">
            <button
              onClick={() => toggleSection('shipping')}
              className="w-full flex items-center justify-between font-bold text-sm text-white py-1"
            >
              <span>Payment & Pickup</span>
              {openSections.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.shipping && (
              <ul className="pt-3 pb-1 space-y-2 text-gray-400 pl-2">
                <li><Link to="/payment-methods" className="hover:text-white">Payment Methods</Link></li>
                <li><Link to="/shipping" className="hover:text-white">Store Pickup Guide</Link></li>
                <li><Link to="/stores" className="hover:text-white">Adoni Store Location</Link></li>
                <li><Link to="/offers" className="hover:text-white">No Cost EMI Options</Link></li>
              </ul>
            )}
          </div>
        </div>

        {/* Contact Strip & Social Links */}
        <div className="flex flex-col md:flex-row items-center justify-between py-6 border-b border-gray-700/60 gap-4 text-xs">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#E30613]" />
              <span>Customer Care: <strong>+91 1800 123 4567</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0796D2]" />
              <span>Support Email: <strong>support@shivangimobile.com</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-700/70 hover:bg-blue-600 flex items-center justify-center text-white transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-700/70 hover:bg-pink-600 flex items-center justify-center text-white transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gray-700/70 hover:bg-red-600 flex items-center justify-center text-white transition-colors" aria-label="YouTube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <button
              onClick={scrollToTop}
              className="ml-2 flex items-center gap-1 bg-[#283747] hover:bg-[#34495e] text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-6 text-center text-xs text-gray-400 space-y-2">
          <p>© 2026 {brandName} Demo Store. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
