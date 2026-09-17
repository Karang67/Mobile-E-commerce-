import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Filter, 
  ChevronDown, 
  X, 
  RotateCcw, 
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

export const ProductListingPage: React.FC = () => {
  const { category: urlCategory, brand: urlBrand } = useParams<{ category?: string; brand?: string }>();
  const { products, categories, brands } = useStoreData();

  // Dynamic price bounds
  const maxPossiblePrice = useMemo(() => {
    if (!products.length) return 200000;
    const highest = Math.max(...products.map(p => p.price || 0));
    return Math.max(highest, 150000);
  }, [products]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(urlBrand || 'all');
  const [userMaxPrice, setUserMaxPrice] = useState<number | null>(null);
  const [selectedRam, setSelectedRam] = useState<string>('all');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const effectiveMaxPrice = userMaxPrice !== null ? userMaxPrice : maxPossiblePrice;

  // Sync with URL params if changed
  React.useEffect(() => {
    setSelectedCategory(urlCategory || 'all');
    setSelectedBrand(urlBrand || 'all');
  }, [urlCategory, urlBrand]);

  // Unique RAM & Storage options
  const ramOptions = ['all', '4 GB', '6 GB', '8 GB', '12 GB', '16 GB'];
  const storageOptions = ['all', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB'];

  const normalizeSpec = (val?: string) => (val ? val.toLowerCase().replace(/[^a-z0-9]/g, '') : '');

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category filter (case-insensitive & slug aware)
        if (selectedCategory !== 'all') {
          const sel = selectedCategory.toLowerCase().trim();
          const pCat = (p.category || '').toLowerCase().trim();
          const pSlug = pCat.replace(/[^a-z0-9]+/g, '-');
          const matched = categories.find(c => c.id.toLowerCase() === sel || c.name.toLowerCase() === sel);
          const cId = matched ? matched.id.toLowerCase() : sel;
          const cName = matched ? matched.name.toLowerCase() : sel;
          if (pCat !== cId && pCat !== cName && pSlug !== cId) return false;
        }
        // Brand filter
        if (selectedBrand !== 'all' && p.brand?.trim().toLowerCase() !== selectedBrand.trim().toLowerCase()) return false;
        // Price filter (only filter if user dragged the slider)
        if (userMaxPrice !== null && p.price > userMaxPrice) return false;
        // RAM filter
        if (selectedRam !== 'all') {
          if (!p.ram) return false;
          if (!normalizeSpec(p.ram).includes(normalizeSpec(selectedRam))) return false;
        }
        // Storage filter
        if (selectedStorage !== 'all') {
          if (!p.storage) return false;
          if (!normalizeSpec(p.storage).includes(normalizeSpec(selectedStorage))) return false;
        }
        // In stock
        if (onlyInStock && !p.inStock) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return b.discount - a.discount;
        return 0; // relevance
      });
  }, [products, selectedCategory, selectedBrand, userMaxPrice, selectedRam, selectedStorage, onlyInStock, sortBy, categories]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setUserMaxPrice(null);
    setSelectedRam('all');
    setSelectedStorage('all');
    setOnlyInStock(false);
    setSortBy('relevance');
  };

  const getHeading = () => {
    if (selectedBrand !== 'all') {
      const b = brands.find(x => x.id === selectedBrand.toLowerCase());
      return b ? `${b.name} Mobiles & Gadgets` : `${selectedBrand} Store`;
    }
    if (selectedCategory !== 'all') {
      const c = categories.find(x => x.id.toLowerCase() === selectedCategory.toLowerCase() || x.name.toLowerCase() === selectedCategory.toLowerCase());
      return c ? c.name : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
    }
    return 'All Mobiles & Electronics';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-[#E30613]">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#E30613]">Shop</Link>
        {selectedCategory !== 'all' && (
          <>
            <span>/</span>
            <span className="text-gray-800 font-bold capitalize">{selectedCategory}</span>
          </>
        )}
        {selectedBrand !== 'all' && (
          <>
            <span>/</span>
            <span className="text-gray-800 font-bold uppercase">{selectedBrand}</span>
          </>
        )}
      </div>

      {/* Header bar with title, count, and sort dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
            {getHeading()}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing <strong className="text-gray-800">{filteredProducts.length}</strong> items matching your preferences
          </p>
        </div>

        {/* Mobile Filter Button & Desktop Sort */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter trigger */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-xl text-xs font-bold text-gray-800 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#E30613]" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Sidebar Filters (Sticky & Fixed in Position on Scroll) */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 scrollbar-thin">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#E30613]" />
              <span>Filters</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] font-bold text-gray-400 hover:text-[#E30613] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Filter: Category */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-gray-800 uppercase">Category</h4>
              <span className="text-[10px] text-gray-400 font-medium">{categories.length} total</span>
            </div>
            <div className="space-y-1 text-xs max-h-60 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-red-50 text-[#E30613] font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[11px] opacity-75 font-mono">({products.length})</span>
              </button>
              {categories.map(c => {
                const isActive = selectedCategory.toLowerCase() === c.id.toLowerCase() || selectedCategory.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-red-50 text-[#E30613] font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="text-[11px] opacity-75 font-mono shrink-0 ml-1.5">
                      ({c.itemCount ?? 0})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter: Brand */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-gray-800 uppercase">Brand</h4>
              <span className="text-[10px] text-gray-400 font-medium">{brands.length} brands</span>
            </div>
            <div className="space-y-1 text-xs max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedBrand === 'all'
                    ? 'bg-red-50 text-[#E30613] font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>All Brands</span>
                <span className="text-[11px] opacity-75 font-mono">({products.length})</span>
              </button>
              {brands.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBrand(b.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedBrand.toLowerCase() === b.id.toLowerCase()
                      ? 'bg-red-50 text-[#E30613] font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  <span className="text-[11px] opacity-75 font-mono shrink-0 ml-1.5">
                    ({(b as any).count ?? 0})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Max Price Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-gray-800 uppercase mb-2">
              <span>Max Price</span>
              <span className="font-mono text-[#E30613]">₹{effectiveMaxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={2000}
              max={maxPossiblePrice}
              step={1000}
              value={effectiveMaxPrice}
              onChange={e => setUserMaxPrice(Number(e.target.value))}
              className="w-full accent-[#E30613]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
              <span>₹2,000</span>
              <span>₹{maxPossiblePrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Filter: RAM */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase mb-2">RAM</h4>
            <div className="flex flex-wrap gap-1.5">
              {ramOptions.map(ram => (
                <button
                  key={ram}
                  onClick={() => setSelectedRam(ram)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold uppercase transition-colors ${
                    selectedRam === ram
                      ? 'bg-[#E30613] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ram}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Storage */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase mb-2">Storage</h4>
            <div className="flex flex-wrap gap-1.5">
              {storageOptions.map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStorage(st)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold uppercase transition-colors ${
                    selectedStorage === st
                      ? 'bg-[#E30613] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: In Stock Only */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={e => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 text-[#E30613] rounded focus:ring-[#E30613]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
              <p className="text-base font-bold text-gray-800">No products match your filters</p>
              <p className="text-xs text-gray-500 mt-1">Try relaxing some of the brand or price filters above.</p>
              <button
                onClick={resetFilters}
                className="mt-4 bg-[#E30613] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer / Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                <h3 className="font-black text-gray-900 uppercase text-sm">Filter Products</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Elements */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-gray-800 mb-1.5 uppercase">Category</h4>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-1.5 uppercase">Brand</h4>
                  <select
                    value={selectedBrand}
                    onChange={e => setSelectedBrand(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs"
                  >
                    <option value="all">All Brands</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Max Price</span>
                    <span className="text-[#E30613]">₹{effectiveMaxPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={maxPossiblePrice}
                    step={2000}
                    value={effectiveMaxPrice}
                    onChange={e => setUserMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#E30613]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={e => setOnlyInStock(e.target.checked)}
                      className="w-4 h-4 text-[#E30613]"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold text-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 bg-[#E30613] text-white py-2.5 rounded-xl font-bold text-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
