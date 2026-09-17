import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Tablet, 
  Laptop, 
  Watch, 
  Headphones, 
  Cable, 
  BatteryCharging, 
  Speaker 
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Headphones,
  Cable,
  BatteryCharging,
  Speaker
};

export const CategoryGrid: React.FC = () => {
  const { categories } = useStoreData();

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-[#E30613] rounded-full" />
          <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">
            Shop by Category
          </h2>
        </div>
        <Link 
          to="/shop" 
          className="text-xs font-bold text-[#0796D2] hover:text-[#067ea8] hover:underline"
        >
          View All Categories →
        </Link>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2.5 md:gap-3">
        {categories.map(cat => {
          const Icon = (cat.icon ? iconMap[cat.icon] : null) || Smartphone;
          return (
            <Link
              key={cat.id}
              to={`/shop/${cat.id}`}
              className="bg-white rounded-xl p-3 md:p-3.5 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-200 border border-gray-200/70 hover:border-red-300 group"
            >
              <div className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-red-50 text-[#E30613] group-hover:bg-[#E30613] group-hover:text-white flex items-center justify-center transition-colors mb-2">
                <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.8} />
              </div>
              <span className="text-[11px] md:text-xs font-bold text-gray-800 group-hover:text-[#E30613] transition-colors leading-tight line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[9px] text-gray-600 mt-0.5 font-medium hidden sm:block">
                {cat.count}+ items
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
