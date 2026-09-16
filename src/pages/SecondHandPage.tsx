import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  BatteryCharging,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  Smartphone
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

export const SecondHandPage: React.FC = () => {
  const { products } = useStoreData();
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Filter only second-hand products
  const secondHandProducts = useMemo(() => {
    return products.filter(p => p.isSecondHand);
  }, [products]);

  // Extract available brands in second-hand catalog
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    secondHandProducts.forEach(p => set.add(p.brand));
    return Array.from(set);
  }, [secondHandProducts]);

  // Filter and sort
  const filteredProducts = useMemo(() => {
    let list = [...secondHandProducts];

    if (selectedBrand !== 'all') {
      list = list.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (selectedCondition !== 'all') {
      list = list.filter(p => p.condition?.toLowerCase() === selectedCondition.toLowerCase());
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [secondHandProducts, selectedBrand, selectedCondition, sortBy]);

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-16">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-[#E30613] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Certified Pre-Owned & 2nd Hand Mobiles</span>
        </div>
      </div>

      {/* Hero Banner with Trust Markers */}
      <section className="bg-gradient-to-r from-[#1A2634] via-[#202D3B] to-[#121922] text-white py-8 sm:py-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Inspected & Quality Verified</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                Certified <span className="text-[#E30613]">Pre-Owned</span> & Second Hand Mobiles
              </h1>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Get flagship Apple, Samsung & OnePlus smartphones at up to 60% OFF retail price. Every device passes our rigorous 32-point technical diagnostic inspection and comes backed with store warranty.
              </p>
            </div>

            {/* 4 Trust Feature Cards */}
            <div className="grid grid-cols-2 gap-3 w-full lg:max-w-md">
              <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3.5 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-white">6 Months Warranty</div>
                  <p className="text-[10px] text-gray-300 mt-0.5">Repair & replacement protection</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3.5 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#0796D2] shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-white">32-Point Quality Check</div>
                  <p className="text-[10px] text-gray-300 mt-0.5">Camera, touch, mic & battery</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3.5 rounded-xl flex items-start gap-3">
                <BatteryCharging className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-white">85%+ Battery Health</div>
                  <p className="text-[10px] text-gray-300 mt-0.5">Original OEM tested capacity</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3.5 rounded-xl flex items-start gap-3">
                <RotateCcw className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-white">7 Days Replacement</div>
                  <p className="text-[10px] text-gray-300 mt-0.5">Hassle-free walk-in support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Condition Filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Condition:
              </span>
              {[
                { id: 'all', label: 'All Conditions' },
                { id: 'like new', label: 'Like New (10/10)' },
                { id: 'superb', label: 'Superb (9/10)' },
                { id: 'good', label: 'Good (8/10)' },
                { id: 'fair', label: 'Fair (7/10)' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCondition(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCondition === c.id
                      ? 'bg-[#E30613] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Sort & Brand Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {availableBrands.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 font-semibold">Brand:</span>
                  <select
                    value={selectedBrand}
                    onChange={e => setSelectedBrand(e.target.value)}
                    className="bg-gray-100 text-gray-800 text-xs font-bold rounded-xl px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                  >
                    <option value="all">All Brands</option>
                    {availableBrands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-gray-100 text-gray-800 text-xs font-bold rounded-xl px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            Showing <strong className="text-gray-900">{filteredProducts.length}</strong> certified pre-owned devices
          </div>
          {(selectedBrand !== 'all' || selectedCondition !== 'all') && (
            <button
              onClick={() => { setSelectedBrand('all'); setSelectedCondition('all'); }}
              className="text-[#E30613] hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#E30613] flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">No Pre-Owned Mobiles Match These Filters</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Try selecting a different condition grade or brand. More certified second-hand devices are inspected and added daily!
            </p>
            <button
              onClick={() => { setSelectedBrand('all'); setSelectedCondition('all'); }}
              className="mt-2 bg-[#E30613] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#c40510] transition-colors"
            >
              Show All Pre-Owned Mobiles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Condition Guide Educational Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 flex items-center gap-2">
            <span className="w-2 h-5 bg-[#E30613] rounded-full" />
            <span>Shivangi Certified Condition Grading Guide</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="inline-block bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded mb-2">
                Grade A+ • Like New
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Flawless aesthetic condition with zero visible scratches. Screen, body, and back glass look brand new out of the box.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
              <div className="inline-block bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded mb-2">
                Grade A • Superb
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Pristine screen with no scratches. Body may have 1 or 2 faint micro-marks from normal careful handling.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-yellow-200 bg-yellow-50/50">
              <div className="inline-block bg-yellow-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded mb-2">
                Grade B • Good
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Light cosmetic scratches on frame or back panel. 100% fully tested with zero impact on camera or performance.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/50">
              <div className="inline-block bg-orange-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded mb-2">
                Grade C • Fair
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Visible signs of usage on body or bezels. Deeply discounted for maximum savings while remaining 100% technically certified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
