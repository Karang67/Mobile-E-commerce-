import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const [imgError, setImgError] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  // Fallback SVG data url if Unsplash fails
  const fallbackImg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="%23f3f4f6" width="400" height="400"/><text fill="%239ca3af" font-family="sans-serif" font-size="20" font-weight="bold" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle">${encodeURIComponent(product.brand)}</text></svg>`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between p-3.5 relative group">
      {/* Top badges & action buttons */}
      <div className="flex items-start justify-between z-10">
        <div className="flex flex-col gap-1">
          {product.isSecondHand ? (
            <div className="flex flex-col gap-0.5">
              <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs flex items-center gap-1">
                <span>♻ PRE-OWNED</span>
              </span>
              <span className="bg-gray-900/90 text-emerald-300 text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                {product.condition || 'Like New'} {product.batteryHealth ? `• 🔋${product.batteryHealth}` : ''}
              </span>
            </div>
          ) : (
            <>
              {product.discount > 0 && (
                <span className="bg-[#E30613] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
                  {product.discount}% OFF
                </span>
              )}
              {product.badge && (
                <span className="bg-[#0796D2] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
            </>
          )}
        </div>

        {/* Circular Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Compare Button */}
          <button
            onClick={() => addToCompare(product)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-xs ${
              isCompared
                ? 'bg-[#0796D2] text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
            }`}
            title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
            aria-label="Compare"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-xs ${
              isWishlisted
                ? 'bg-[#E30613] text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#E30613]'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Centered Product Image */}
      <Link
        to={`/product/${product.slug}`}
        className="my-3 flex items-center justify-center h-44 overflow-hidden relative"
      >
        <img
          src={imgError ? fallbackImg : product.images[0]}
          alt={product.name}
          onError={() => setImgError(true)}
          className="max-h-40 max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Out of stock overlay badge if out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-[#E30613] text-white text-[11px] font-black px-2.5 py-1 rounded tracking-wider uppercase shadow">
              OUT OF STOCK
            </span>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="pt-2 border-t border-gray-100 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
              {product.brand}
            </span>
            {/* Rating */}
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-current text-emerald-600" />
              <span className="text-gray-600 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block mt-1 text-xs md:text-sm font-bold text-gray-900 hover:text-[#E30613] transition-colors line-clamp-2 leading-snug min-h-[2.4rem]"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Variant spec tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px] text-gray-600">
            {product.ram && (
              <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                {product.ram}
              </span>
            )}
            {product.storage && (
              <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                {product.storage}
              </span>
            )}
            {product.color && (
              <span className="bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                {product.color}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            {/* Red Price Typography */}
            <span className="text-base md:text-lg font-black text-[#E30613] tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-600 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {product.isSecondHand && (
            <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded w-fit">
              <span>🛡 {product.warrantyPeriod || '6 Months Warranty'}</span>
            </div>
          )}

          {/* Bottom Action Button */}
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <Link
              to={`/product/${product.slug}`}
              className="py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold rounded text-center transition-colors flex items-center justify-center gap-1"
            >
              <Eye className="w-3 h-3 text-gray-500" />
              <span>Details</span>
            </Link>

            {product.inStock ? (
              <button
                onClick={() => addToCart(product, 1)}
                className="py-1.5 px-2 bg-[#E30613] hover:bg-[#c40510] text-white text-[11px] font-bold rounded text-center transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <ShoppingCart className="w-3 h-3" />
                <span>Add</span>
              </button>
            ) : (
              <Link
                to={`/product/${product.slug}`}
                className="py-1.5 px-1 bg-red-100 text-[#E30613] text-[10px] font-black rounded text-center transition-colors flex items-center justify-center"
              >
                Notify Me
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
