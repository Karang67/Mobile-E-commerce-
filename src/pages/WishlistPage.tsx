import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <Link to="/" className="hover:text-[#E30613]">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-bold">My Wishlist ({wishlist.length})</span>
      </div>

      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#E30613] fill-current" />
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            My Wishlist
          </h1>
        </div>
        <span className="text-xs font-bold text-gray-500">
          {wishlist.length} Items Saved
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <Heart className="w-16 h-16 text-gray-200 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900">Your wishlist is currently empty</h2>
          <p className="text-xs text-gray-500 mt-1">
            Tap the heart icon on any smartphone or gadget to save it here for later.
          </p>
          <Link
            to="/shop/smartphones"
            className="mt-6 inline-block bg-[#E30613] hover:bg-[#c40510] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
          >
            Explore Mobiles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
