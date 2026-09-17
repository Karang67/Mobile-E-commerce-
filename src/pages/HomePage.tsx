import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Sparkles,
  Clock,
  MapPin,
  ChevronRight,
  Percent,
  TrendingUp,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { HeroCarousel } from '../components/HeroCarousel';
import { CategoryGrid } from '../components/CategoryGrid';
import { BrandStrip } from '../components/BrandStrip';
import { BenefitsStrip } from '../components/BenefitsStrip';
import { ProductCard } from '../components/ProductCard';
import { useStoreData } from '../context/StoreDataContext';
import { useBrand } from '../context/BrandContext';

export const HomePage: React.FC = () => {
  const { brandName, storeTagline } = useBrand();
  const { products, store } = useStoreData();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const bestDeals = products.filter(p => p.isBestDeal).slice(0, 6);
  const secondHandProducts = products.filter(p => p.isSecondHand).slice(0, 4);
  const popularProducts = products.filter(p => p.isPopular || p.rating >= 4.7).slice(0, 8);

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Large Hero Promotional Carousel */}
      <HeroCarousel />

      {/* 2. Shop by Category */}
      <CategoryGrid />

      {/* 3. Shop by Brand */}
      <BrandStrip />

      {/* 4. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-[#E30613] rounded-full" />
            <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-1.5">
              <span>Featured Products</span>
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </h2>
          </div>
          <Link
            to="/shop/smartphones"
            className="text-xs font-bold text-[#0796D2] hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Best Deals Section (Red/Blue Prominent Promotional Strip) */}
      <section className="bg-linear-to-r from-red-50 via-white to-blue-50 py-8 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E30613] text-white flex items-center justify-center shadow-xs">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">
                  Mega Festive Deals
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Up to 30% discount on top rated flagship mobiles and accessories
                </p>
              </div>
            </div>
            <Link
              to="/offers"
              className="inline-flex items-center gap-1 bg-[#E30613] hover:bg-[#c40510] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
            >
              <span>Explore All Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {bestDeals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Certified Pre-Owned & 2nd Hand Mobiles Showcase */}
      {secondHandProducts.length > 0 && (
        <section className="bg-gradient-to-r from-emerald-900/10 via-teal-900/5 to-emerald-900/10 py-8 border-y border-emerald-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">
                      Certified Pre-Owned Mobiles
                    </h2>
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs">
                      SAVE UP TO 60%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    100% Tested · 32-Point Quality Diagnostic Check · 6 Months Store Warranty
                  </p>
                </div>
              </div>
              <Link
                to="/second-hand"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider transition-colors shadow-xs self-start sm:self-auto"
              >
                <span>View All Pre-Owned</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {secondHandProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Why Shop With Us: The Signature Blue Benefits Strip (Recreating screenshot) */}
      <BenefitsStrip />

      {/* 7. Popular Products (Horizontally scrollable on mobile, grid on desktop) */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-[#0796D2] rounded-full" />
            <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-1.5">
              <span>Popular & Trending</span>
              <TrendingUp className="w-4 h-4 text-[#0796D2]" />
            </h2>
          </div>
          <Link
            to="/shop/tablets"
            className="text-xs font-bold text-[#0796D2] hover:underline"
          >
            View More →
          </Link>
        </div>

        {/* Responsive layout: scrollable horizontally on mobile, 4-col grid on desktop */}
        <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x">
          {popularProducts.map(product => (
            <div key={product.id} className="min-w-[240px] sm:min-w-[260px] md:min-w-0 snap-start shrink-0 md:shrink">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>


      {/* 9. Store Locator Preview Section */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#E30613] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Sumerpur Flagship Store</span>
              </div>
              <h2 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                Visit Shivangi Mobile Showroom in Sumerpur
              </h2>
              <p className="text-xs md:text-sm text-gray-600 max-w-xl">
                Experience live product demos, get instant trade-in valuations, and collect online reserved orders in person at our Sumerpur store counter.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="bg-red-50 text-[#E30613] text-[11px] font-bold px-3 py-1 rounded-md border border-red-100">
                  📍 Opp. Nagraj Electronic, Main Bazar, Sumerpur - 306902
                </span>
                <span className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  Open 10 AM – 9:30 PM
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                to="/stores"
                className="bg-[#0796D2] hover:bg-[#067ea8] text-white px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Find a Store Near You</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
