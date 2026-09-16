import React, { useState } from 'react';
import { Tag, CreditCard, ShieldCheck, X, Check, HelpCircle, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface OffersEmiSectionProps {
  product: Product;
}

export const OffersEmiSection: React.FC<OffersEmiSectionProps> = ({ product }) => {
  const [emiModalOpen, setEmiModalOpen] = useState(false);
  const [tcModalOpen, setTcModalOpen] = useState(false);
  const [payLaterModalOpen, setPayLaterModalOpen] = useState(false);

  // Approximate monthly EMI calculation for 24 months
  const monthlyEmi24 = Math.round(product.price / 24);
  const monthlyEmi12 = Math.round(product.price / 12);
  const monthlyEmi6 = Math.round(product.price / 6);
  const monthlyEmi3 = Math.round(product.price / 3);

  return (
    <div className="space-y-3.5 my-4">
      {/* 1. Brand Offer Card */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                Brand Offer
              </span>
              <span className="text-xs font-bold text-gray-900">
                Special Manufacturer Discount
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1 leading-normal">
              Flat ₹{Math.min(2000, Math.round(product.price * 0.08)).toLocaleString('en-IN')} Instant Discount on select Credit Cards + 1 Year Extended Warranty
            </p>
          </div>
        </div>

        <button
          onClick={() => setTcModalOpen(true)}
          className="text-[11px] font-bold text-[#0796D2] hover:text-[#067ea8] hover:underline shrink-0"
        >
          T&C
        </button>
      </div>

      {/* 2. No-Cost EMI Card (Recreating the screenshot) */}
      <div className="bg-blue-50/50 border border-blue-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0796D2] flex items-center justify-center shrink-0 mt-0.5">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 bg-blue-200/60 px-2 py-0.5 rounded">
                No-Cost EMI
              </span>
              <span className="text-xs font-bold text-gray-900">
                EMI from <strong className="text-[#E30613]">₹{monthlyEmi24.toLocaleString('en-IN')}/month</strong>
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Zero down payment & zero processing fees across 12+ leading partner banks
            </p>
          </div>
        </div>

        <button
          onClick={() => setEmiModalOpen(true)}
          className="bg-white border border-[#0796D2] text-[#0796D2] hover:bg-[#0796D2] hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 shadow-xs"
        >
          View Plans
        </button>
      </div>

      {/* 3. Pay Later Option */}
      <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                Pay Later Available
              </span>
              <span className="text-xs font-bold text-gray-900">
                Buy Now, Pay Next Month
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Get up to ₹60,000 instant credit line with Simpl, LazyPay & ICICI PayLater
            </p>
          </div>
        </div>

        <button
          onClick={() => setPayLaterModalOpen(true)}
          className="bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 shadow-xs"
        >
          View Options
        </button>
      </div>

      {/* Secure Payment Providers Strip */}
      <div className="flex items-center justify-between px-2 py-1 text-[11px] text-gray-600">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Safe & Secure Payment Gateway</span>
        </div>
        <div className="flex items-center gap-2 font-mono font-bold text-gray-600">
          <span>UPI</span>
          <span>•</span>
          <span>VISA</span>
          <span>•</span>
          <span>MasterCard</span>
          <span>•</span>
          <span>RuPay</span>
        </div>
      </div>

      {/* MODAL 1: EMI Plans Modal */}
      {emiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
                  No Cost EMI & Standard Plans
                </h3>
                <p className="text-xs text-gray-500">For {product.name}</p>
              </div>
              <button
                onClick={() => setEmiModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-xs text-gray-800">
                <span className="font-bold text-[#E30613]">Product Total: ₹{product.price.toLocaleString('en-IN')}</span>
                <p className="text-[11px] text-gray-600 mt-0.5">Bank interest for No Cost EMI is provided as an upfront instant discount at checkout.</p>
              </div>

              {/* Plans Table */}
              <div className="border rounded-xl overflow-hidden divide-y text-xs">
                <div className="grid grid-cols-4 bg-gray-100 font-bold p-2.5 text-gray-700">
                  <span>Tenure</span>
                  <span>Monthly EMI</span>
                  <span>Overall Cost</span>
                  <span className="text-right">Plan Type</span>
                </div>

                <div className="grid grid-cols-4 p-3 items-center hover:bg-gray-50">
                  <span className="font-bold">3 Months</span>
                  <span className="font-bold text-[#E30613]">₹{monthlyEmi3.toLocaleString('en-IN')}</span>
                  <span>₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="text-right text-emerald-700 font-bold">No Cost EMI</span>
                </div>

                <div className="grid grid-cols-4 p-3 items-center hover:bg-gray-50">
                  <span className="font-bold">6 Months</span>
                  <span className="font-bold text-[#E30613]">₹{monthlyEmi6.toLocaleString('en-IN')}</span>
                  <span>₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="text-right text-emerald-700 font-bold">No Cost EMI</span>
                </div>

                <div className="grid grid-cols-4 p-3 items-center hover:bg-gray-50">
                  <span className="font-bold">12 Months</span>
                  <span className="font-bold text-[#E30613]">₹{monthlyEmi12.toLocaleString('en-IN')}</span>
                  <span>₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="text-right text-emerald-700 font-bold">No Cost EMI</span>
                </div>

                <div className="grid grid-cols-4 p-3 items-center hover:bg-gray-50">
                  <span className="font-bold">24 Months</span>
                  <span className="font-bold text-[#E30613]">₹{monthlyEmi24.toLocaleString('en-IN')}</span>
                  <span>₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="text-right text-emerald-700 font-bold">No Cost EMI</span>
                </div>
              </div>

              {/* Supported Banks */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Supported Banks:</h4>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {['HDFC Bank', 'ICICI Bank', 'SBI Card', 'Axis Bank', 'Kotak Mahindra', 'OneCard', 'Bajaj Finserv'].map(b => (
                    <span key={b} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setEmiModalOpen(false)}
                className="w-full bg-[#E30613] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#c40510] transition-colors"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: T&C Modal */}
      {tcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-black text-gray-900 uppercase">Offer Terms & Conditions</h3>
              <button
                onClick={() => setTcModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ul className="space-y-2.5 text-xs text-gray-600 list-disc pl-4 leading-relaxed">
              <li>Offer valid on all authorized Credit Cards with minimum cart purchase of ₹10,000.</li>
              <li>Instant discount is auto-applied on the checkout payment step upon card verification.</li>
              <li>Valid once per user account per calendar month.</li>
              <li>Cannot be combined with select clearance sale vouchers or coupon codes.</li>
              <li>Offer valid across both online purchases and offline outlets across AP, TS and TN.</li>
            </ul>

            <button
              onClick={() => setTcModalOpen(false)}
              className="mt-6 w-full bg-gray-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Pay Later Options Modal */}
      {payLaterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-black text-gray-900 uppercase">Pay Later Partners</h3>
              <button
                onClick={() => setPayLaterModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="border p-3 rounded-xl flex items-center justify-between hover:border-emerald-500 transition-colors">
                <div>
                  <h4 className="font-bold text-gray-900">Simpl 1-Click PayLater</h4>
                  <p className="text-[11px] text-gray-500">Pay bill every 15 days. Zero interest.</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Active</span>
              </div>

              <div className="border p-3 rounded-xl flex items-center justify-between hover:border-emerald-500 transition-colors">
                <div>
                  <h4 className="font-bold text-gray-900">LazyPay by PayU</h4>
                  <p className="text-[11px] text-gray-500">Instant credit line up to ₹50,000.</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Active</span>
              </div>

              <div className="border p-3 rounded-xl flex items-center justify-between hover:border-emerald-500 transition-colors">
                <div>
                  <h4 className="font-bold text-gray-900">ICICI / HDFC PayLater</h4>
                  <p className="text-[11px] text-gray-500">Direct netbanking debit with 45-day cycle.</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Active</span>
              </div>
            </div>

            <button
              onClick={() => setPayLaterModalOpen(false)}
              className="mt-6 w-full bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
