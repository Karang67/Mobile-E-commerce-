import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, History, TrendingUp, Sparkles } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { ProductCard } from '../components/ProductCard';

const RECENT_SEARCHES_KEY = 'shivangi_recent_searches';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { products } = useStoreData();

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ['Redmi Pad 2', 'Vivo 5G', 'iPhone 16', 'OnePlus 12R'];
    } catch {
      return ['Redmi Pad 2', 'Vivo 5G', 'iPhone 16', 'OnePlus 12R'];
    }
  });

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      saveRecentSearch(query.trim());
    }
  };

  const handleTagClick = (term: string) => {
    setQuery(term);
    setSearchParams({ q: term });
    saveRecentSearch(term);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Search Results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(p => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.ram && p.ram.toLowerCase().includes(q)) ||
        (p.storage && p.storage.toLowerCase().includes(q))
      );
    });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Search Bar Input */}
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by product name, brand, category, or SKU (e.g., Redmi Pad 2, 10004773)..."
            className="w-full bg-white border-2 border-gray-300 rounded-full pl-12 pr-28 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:border-transparent shadow-sm"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSearchParams({});
              }}
              className="absolute right-24 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#E30613] hover:bg-[#c40510] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Suggestions & Recent Searches tags */}
        <div className="mt-4 space-y-2">
          {recentSearches.length > 0 && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5 font-bold text-gray-700">
                <History className="w-3.5 h-3.5" />
                <span>Recent Searches:</span>
              </div>
              <button
                onClick={clearRecentSearches}
                className="text-[11px] text-gray-400 hover:text-[#E30613]"
              >
                Clear
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {recentSearches.map(term => (
              <button
                key={term}
                onClick={() => handleTagClick(term)}
                className="bg-white border border-gray-200 text-gray-700 hover:border-[#E30613] hover:text-[#E30613] px-3 py-1 rounded-full text-xs font-medium transition-colors shadow-2xs"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results or Empty State */}
      <div className="pt-4">
        {query.trim() === '' ? (
          /* Initial Suggested Products */
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <h2 className="text-base font-bold text-gray-900 uppercase">Popular Searches Right Now</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {products.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          /* No Results State */
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No results found for "{query}"</h3>
            <p className="text-xs text-gray-500 mt-1">
              Check for spelling errors or search using generic terms like "Tablet", "Samsung", or "Earbuds".
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => handleTagClick('Smartphones')}
                className="bg-red-50 text-[#E30613] font-bold px-3 py-1.5 rounded-lg text-xs"
              >
                Browse Smartphones
              </button>
              <button
                onClick={() => handleTagClick('Tablets')}
                className="bg-blue-50 text-[#0796D2] font-bold px-3 py-1.5 rounded-lg text-xs"
              >
                Browse Tablets
              </button>
            </div>
          </div>
        ) : (
          /* Results Grid */
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
              <h2 className="text-base font-black text-gray-900 uppercase">
                Search Results for "{query}"
              </h2>
              <span className="text-xs text-gray-500 font-bold">
                Found {results.length} items
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
