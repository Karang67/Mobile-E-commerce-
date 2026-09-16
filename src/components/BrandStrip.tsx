import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../context/StoreDataContext';

export const BrandStrip: React.FC = () => {
  const { brands } = useStoreData();
  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-[#0796D2] rounded-full" />
          <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">
            Shop by Brand
          </h2>
        </div>
        <Link 
          to="/shop/smartphones" 
          className="text-xs font-bold text-[#0796D2] hover:underline"
        >
          All Brands →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 md:gap-2.5">
        {brands.map(brand => (
          <Link
            key={brand.id}
            to={`/brand/${brand.id}`}
            className="bg-white rounded-lg p-2.5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all border border-gray-200/80 hover:border-[#E30613] group"
          >
            <div className="w-full py-2 bg-gray-50 group-hover:bg-red-50 rounded flex items-center justify-center transition-colors">
              <span 
                className="font-black text-xs md:text-sm tracking-wider uppercase"
                style={{ color: brand.color }}
              >
                {brand.logoText}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-gray-700 mt-1.5 group-hover:text-[#E30613] transition-colors">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
