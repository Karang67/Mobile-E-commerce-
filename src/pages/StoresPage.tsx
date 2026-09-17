import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles } from 'lucide-react';
import { StoreLocator } from '../components/StoreLocator';
import { useStoreData } from '../context/StoreDataContext';
import { useBrand } from '../context/BrandContext';

export const StoresPage: React.FC = () => {
  const { brandName, storeTagline } = useBrand();
  const { brands } = useStoreData();

  return (
    <div className="space-y-6">
      {/* Secondary Red "Shop by Brand" Sub-bar (matching store locator screenshot) */}
      <div className="bg-[#E30613] text-white py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-4 text-xs font-bold uppercase tracking-wider">
          <span className="text-yellow-300 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Authorized Brands:</span>
          </span>
          <div className="flex items-center space-x-4 shrink-0">
            {brands.map(b => (
              <Link
                key={b.id}
                to={`/brand/${b.id}`}
                className="hover:text-yellow-200 transition-colors"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2">
        {/* Breadcrumb matching screenshot: Home > Store locations */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#E30613]">Home</Link>
          <span>/</span>
          <span className="text-gray-800 font-bold">Store locations</span>
        </div>

        {/* Page Title & Network Tagline */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 bg-red-100 text-[#E30613] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{storeTagline}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
            Shivangi Mobile Showroom in Sumerpur
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Visit our authorized multi-brand showroom Opp. Nagraj Electronic, Main Bazar, Sumerpur (Rajasthan) - 306902. Wholesaler Dealer in all type mobiles & accessories, sales & service.
          </p>
        </div>

        {/* Interactive Store Locator Component */}
        <StoreLocator />
      </div>
    </div>
  );
};
