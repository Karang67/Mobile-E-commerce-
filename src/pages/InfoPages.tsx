import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Truck,
  HelpCircle,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';

export const AboutPage: React.FC = () => {
  const { brandName, storeTagline } = useBrand();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link to="/" className="hover:text-[#E30613]">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-bold">About Us</span>
      </div>

      <div className="bg-linear-to-r from-[#202D3B] to-[#2B3A4A] text-white p-8 rounded-2xl shadow-lg">
        <span className="text-[#E30613] bg-white px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider">
          Our Heritage
        </span>
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight mt-3">
          About {brandName}
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-2 leading-relaxed">
          {brandName} is a premier electronics retail destination in Sumerpur, Rajasthan, offering genuine smartphones, tablets, smartwatches, certified pre-owned devices, and consumer electronics with 100% genuine brand warranty.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-gray-900 mb-1">{storeTagline}</h3>
          <p className="text-xs text-gray-600">Serving happy mobile customers in Sumerpur with trusted advice and transparent pricing.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0796D2] flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-gray-900 mb-1">Instant Store Pickup</h3>
          <p className="text-xs text-gray-600">Walk into our Sumerpur showroom for instant counter checkout and live demo testing.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-gray-900 mb-1">100% Genuine Warranty</h3>
          <p className="text-xs text-gray-600">All devices come with authorized brand warranty and official invoice.</p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { brandName } = useBrand();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link to="/" className="hover:text-[#E30613]">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-bold">Contact Support</span>
      </div>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
          We’re Here to Help You
        </h1>
        <p className="text-xs text-gray-500">
          Have queries about products, store locations or orders? Connect with our dedicated support team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-2 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-100 text-[#E30613] flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Toll-Free Helpline</h3>
          <p className="text-xs text-gray-600">+91 1800 123 4567</p>
          <p className="text-[11px] text-gray-400">9:00 AM - 9:00 PM (All Days)</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-2 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0796D2] flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Email Support</h3>
          <p className="text-xs text-gray-600">support@shivangimobile.com</p>
          <p className="text-[11px] text-gray-400">Response within 2 hours</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-2 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Corporate Office</h3>
          <p className="text-xs text-gray-600">Road No. 12, Banjara Hills</p>
          <p className="text-[11px] text-gray-400">Hyderabad, Telangana 500034</p>
        </div>
      </div>
    </div>
  );
};

export const ShippingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-xs text-gray-700">
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link to="/" className="hover:text-[#E30613]">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-bold">Store Pickup Policy</span>
      </div>

      <h1 className="text-2xl font-black text-gray-900 uppercase">
        Store Pickup & In-Store Order Policy
      </h1>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4 shadow-xs leading-relaxed">
        <h3 className="font-bold text-sm text-gray-900">1. Instant In-Store Pickup</h3>
        <p>All items listed on Shivangi Mobile are available directly at our retail store in Sumerpur, Rajasthan (Opp. Nagraj Electronic, Main Bazar, Sumerpur, Rajasthan - 306902). You can reserve your phone or accessory online and walk in for instant collection.</p>

        <h3 className="font-bold text-sm text-gray-900">2. Free Order Reservation</h3>
        <p>There are zero charges for reserving orders or picking up items in-store. All store pickups are 100% free.</p>

        <h3 className="font-bold text-sm text-gray-900">3. Live Demo & Testing on Pickup</h3>
        <p>When picking up your product at Shivangi Mobile, our store specialists will unbox, verify seals, help configure your device, transfer your data, and install screen protection on the spot.</p>
      </div>
    </div>
  );
};

export const PaymentMethodsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-xs text-gray-700">
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link to="/" className="hover:text-[#E30613]">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-bold">Payment Methods</span>
      </div>

      <h1 className="text-2xl font-black text-gray-900 uppercase">
        Accepted Payment Methods
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <h3 className="font-bold text-sm text-gray-900 mb-2">UPI (Unified Payments Interface)</h3>
          <p>Instant zero-fee payments via Google Pay, PhonePe, Paytm, and BHIM QR.</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <h3 className="font-bold text-sm text-gray-900 mb-2">Credit & Debit Cards</h3>
          <p>Visa, MasterCard, RuPay, and American Express with 3D Secure OTP verification.</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <h3 className="font-bold text-sm text-gray-900 mb-2">No Cost EMI</h3>
          <p>3, 6, 12 and 24-month plans on leading bank cards with zero down payment.</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <h3 className="font-bold text-sm text-gray-900 mb-2">Cash on Delivery (COD)</h3>
          <p>Pay cash or scan courier UPI QR at your doorstep upon order arrival.</p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-xs text-gray-700">
      <h1 className="text-2xl font-black text-gray-900 uppercase">Terms & Conditions</h1>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3 leading-relaxed">
        <p>Welcome to our online store. By accessing or using this website, you agree to comply with and be bound by the terms described herein.</p>
        <p>All prices are listed in Indian Rupees (INR) and are subject to availability. Products carry authentic manufacturer warranties valid at authorized service centers across India.</p>
        <p>This demo application demonstrates realistic e-commerce capabilities inspired by leading mobile retail chains.</p>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-xs text-gray-700">
      <h1 className="text-2xl font-black text-gray-900 uppercase">Privacy Policy</h1>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3 leading-relaxed">
        <p>We respect your privacy and protect personal data. Cart information and user preferences are maintained in your local browser storage.</p>
        <p>We do not store plain-text payment card data. All transactions adhere to PCI-DSS standards.</p>
      </div>
    </div>
  );
};
