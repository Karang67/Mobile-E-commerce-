import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Percent, CreditCard, ShieldCheck, Copy, CheckCircle2 } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { useToast } from '../context/ToastContext';

export const OffersPage: React.FC = () => {
  const { showToast } = useToast();
  const { bankOffers, coupons } = useStoreData();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Copied "${code}" to clipboard!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link to="/" className="hover:text-[#E30613]">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-bold">Festive Bank Offers & Deals</span>
      </div>

      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#C40510] via-[#E30613] to-[#8A000A] text-white p-6 sm:p-10 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-yellow-400 text-gray-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Limited Period Offers
          </span>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
            Festive Mobile Mega Deals & EMI Offers
          </h1>
          <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
            Avail flat instant bank discounts, 0% interest EMI up to 24 months, and exclusive online coupons on top 5G smartphones, tablets, and laptops.
          </p>
        </div>
      </div>

      {/* 1. Bank Offers Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-[#0796D2]" />
          <h2 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight">
            Partner Bank Discounts & Cashbacks
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bankOffers.map(offer => (
            <div
              key={offer.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-gray-500">{offer.bank}</span>
                  <span className="text-[10px] font-bold bg-blue-50 text-[#0796D2] px-2 py-0.5 rounded">
                    {offer.badge}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{offer.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{offer.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-gray-400 font-semibold">{offer.code}</span>
                <span className="text-[11px] text-emerald-600 font-bold">Auto-applied at Checkout</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Promo Coupons Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-[#E30613]" />
          <h2 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight">
            Discount Coupon Vouchers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {coupons.map(cp => (
            <div
              key={cp.code}
              className="bg-white rounded-xl border-2 border-dashed border-red-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-sm text-[#E30613] bg-red-50 px-2.5 py-1 rounded">
                    {cp.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(cp.code)}
                    className="text-xs text-gray-500 hover:text-[#E30613] flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-xs font-bold text-gray-800 mt-2">{cp.description}</p>
                <p className="text-[11px] text-gray-500 mt-1">Min cart value: ₹{cp.minCartValue.toLocaleString('en-IN')}</p>
              </div>

              <div className="mt-4">
                <Link
                  to="/shop/smartphones"
                  className="block text-center bg-gray-900 hover:bg-[#E30613] text-white py-2 rounded-lg text-xs font-bold transition-colors"
                >
                  Shop with this Coupon
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
