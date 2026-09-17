import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  Scale,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Bell,
  Clock,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Share2,
  BatteryCharging,
  Sparkles,
  Camera,
  Check,
  MapPin
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { ProductGallery } from '../components/ProductGallery';
import { OffersEmiSection } from '../components/OffersEmiSection';
import { ProductSpecifications } from '../components/ProductSpecifications';
import { RelatedProducts } from '../components/RelatedProducts';
import { StockNotifyModal } from '../components/StockNotifyModal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useToast } from '../context/ToastContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { showToast } = useToast();
  const { products } = useStoreData();

  // Find product by slug or default to first
  const product = products.find(p => p.slug === slug) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colorVariants?.[0]?.name || product.color || '');
  const [selectedStorage, setSelectedStorage] = useState(product.storageVariants?.[0] || product.storage || '');

  // Modals for out-of-stock actions
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyMode, setNotifyMode] = useState<'stock' | 'price'>('stock');

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Shivangi Mobile!`,
        url: window.location.href,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const handleBuyNow = () => {
    if (addToCart(product, quantity, product.ram, selectedStorage, selectedColor)) {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#E30613]">Home</Link>
        <span>/</span>
        {product.isSecondHand ? (
          <>
            <Link to="/second-hand" className="hover:text-emerald-700 font-bold text-emerald-600">
              Certified Pre-Owned
            </Link>
            <span>/</span>
          </>
        ) : (
          <>
            <Link to={`/shop/${product.category}`} className="hover:text-[#E30613] capitalize">
              {product.category}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-800 font-bold truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Two-Column Section: Gallery & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} productName={product.name} />

          {/* If Second Hand, show verified unit badge under image */}
          {product.isSecondHand && (
            <div className="mt-3 flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-bold shadow-2xs">
              <Camera className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Unit: Displaying actual photos of this pre-owned phone</span>
            </div>
          )}

          {/* Quick Assurance Badges under image on desktop */}
          <div className="hidden sm:grid grid-cols-3 gap-3 mt-4 text-center text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-200">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-gray-800">
                {product.isSecondHand ? (product.warrantyPeriod || 'Store Warranty') : '100% Genuine'}
              </span>
              <span className="text-[10px] text-gray-400">
                {product.isSecondHand ? 'Repair & Replace' : 'Brand Direct Warranty'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-5 h-5 text-[#0796D2]" />
              <span className="font-semibold text-gray-800">Store Pickup</span>
              <span className="text-[10px] text-gray-400">Shivangi Mobile, Sumerpur</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-800">7 Days Return</span>
              <span className="text-[10px] text-gray-400">
                {product.isSecondHand ? 'Testing Guarantee' : 'Replacement Guarantee'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Actions (Recreating Screenshot Layout) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Brand & SKU info */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-[#0796D2] bg-blue-50 px-2.5 py-1 rounded-md">
              {product.brand}
            </span>
            <span className="text-xs font-mono text-gray-500 font-medium">
              SKU: <strong className="text-gray-800">{product.sku}</strong>
            </span>
          </div>

          {/* Product Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Rating & Review Counter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded text-xs font-bold shadow-xs">
              <span>{product.rating}</span>
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {product.reviewCount} Ratings & Reviews
            </span>
            <span className="text-gray-300">•</span>
            <button
              onClick={handleShare}
              className="text-xs text-gray-600 hover:text-[#E30613] font-semibold flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Certified Pre-Owned Guarantee Box (if second hand) */}
          {product.isSecondHand && (
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/30 rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Certified Pre-Owned</span>
                </div>
                <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md">
                  Condition: {product.condition || 'Like New'}
                </span>
              </div>

              {/* Key Second-Hand Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" /> Battery Health
                  </div>
                  <div className="text-sm font-black text-gray-900 mt-0.5 font-mono">{product.batteryHealth || '92%'}</div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0796D2]" /> Warranty
                  </div>
                  <div className="text-xs font-black text-gray-900 mt-0.5 truncate">{product.warrantyPeriod || '6 Months Store'}</div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Diagnostics
                  </div>
                  <div className="text-xs font-black text-gray-900 mt-0.5 truncate">{product.qcScore || '32-Pt Passed'}</div>
                </div>
              </div>

              {/* Included Accessories in Box */}
              {product.includedAccessories && product.includedAccessories.length > 0 && (
                <div className="pt-2 border-t border-emerald-200/60">
                  <span className="text-[11px] font-black uppercase text-gray-700 tracking-wider block mb-1.5">
                    What's In The Box:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.includedAccessories.map((acc, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-white border border-emerald-200 text-gray-800 text-[11px] font-semibold px-2 py-0.5 rounded-lg shadow-2xs">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{acc}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Physical Inspection Notes */}
              {product.deviceNotes && (
                <div className="text-xs text-gray-700 bg-white/90 p-2.5 rounded-xl border border-emerald-200/70">
                  <strong className="text-gray-900">Physical Inspection Note: </strong>
                  <span>{product.deviceNotes}</span>
                </div>
              )}
            </div>
          )}

          {/* Price Section matching Big C Screenshots */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80">
            <div className="flex items-baseline gap-3 flex-wrap">
              {/* Red Price Typography */}
              <span className="text-2xl sm:text-3xl font-black text-[#E30613] tracking-tight font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-gray-500 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-[#E30613] text-white text-xs font-black px-2 py-0.5 rounded uppercase shadow-xs">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Inclusive of all taxes. Free instant store pickup at Sumerpur.
            </p>

            {/* Stock status indicator */}
            <div className="mt-2.5 pt-2.5 border-t border-gray-200/60">
              {product.inStock ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>IN STOCK • Ready for Instant In-Store Pickup at Sumerpur Store</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="bg-[#E30613] text-white text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider shadow-xs">
                    OUT OF STOCK
                  </span>
                  <span className="text-xs text-gray-500">
                    Currently unavailable for online order
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Color Variants Selection */}
          {product.colorVariants && product.colorVariants.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                Color: <span className="text-gray-900">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2">
                {product.colorVariants.map(v => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedColor(v.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${selectedColor === v.name
                        ? 'border-[#E30613] bg-red-50 text-[#E30613] ring-1 ring-[#E30613]'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    {v.hex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                        style={{ backgroundColor: v.hex }}
                      />
                    )}
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage Variants Selection */}
          {product.storageVariants && product.storageVariants.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                Storage Variant: <span className="text-gray-900">{selectedStorage}</span>
              </label>
              <div className="flex items-center gap-2">
                {product.storageVariants.map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedStorage(st)}
                    className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold uppercase transition-all ${selectedStorage === st
                        ? 'border-[#E30613] bg-[#E30613] text-white shadow-xs'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons Section */}
          <div className="pt-2">
            {!product.inStock ? (
              /* OUT OF STOCK ACTIONS (Specified in Requirement 7) */
              <div className="space-y-3">
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#E30613]" />
                    <span>This item is temporarily out of stock.</span>
                  </p>
                  <p className="text-gray-600 mt-1">
                    Sign up below to receive immediate notification via SMS or Email as soon as fresh units arrive at our stores.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      setNotifyMode('stock');
                      setNotifyModalOpen(true);
                    }}
                    className="w-full bg-[#E30613] hover:bg-[#c40510] text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notify When In Stock</span>
                  </button>

                  <button
                    onClick={() => {
                      setNotifyMode('price');
                      setNotifyModalOpen(true);
                    }}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>Price Drop Alert</span>
                  </button>
                </div>

                {/* Secondary actions */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${isWishlisted
                        ? 'bg-red-50 border-[#E30613] text-[#E30613]'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-[#E30613]' : ''}`} />
                    <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  <button
                    onClick={() => addToCompare(product)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${isCompared
                        ? 'bg-blue-50 border-[#0796D2] text-[#0796D2]'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>{isCompared ? 'In Compare' : 'Add to Compare'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* IN STOCK ACTIONS */
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-gray-600 hover:text-black font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-bold font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-gray-600 hover:text-black font-bold text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => addToCart(product, quantity, product.ram, selectedStorage, selectedColor)}
                    className="flex-1 bg-[#E30613] hover:bg-[#c40510] text-white py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Buy Now</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${isWishlisted
                        ? 'bg-red-50 border-[#E30613] text-[#E30613]'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-[#E30613]' : ''}`} />
                    <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  <button
                    onClick={() => addToCompare(product)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${isCompared
                        ? 'bg-blue-50 border-[#0796D2] text-[#0796D2]'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>{isCompared ? 'In Compare' : 'Add to Compare'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Store Pickup Availability Card */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50/40 border border-red-100 rounded-xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E30613] text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">
                Available at Shivangi Mobile, Sumerpur
              </h4>
              <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                Opp. Nagraj Electronic, Main Bazar, Sumerpur, Rajasthan - 306902. Walk in today for live demos, instant hands-on testing, and zero-waiting counter pickup.
              </p>
              <div className="mt-2 flex items-center gap-3 text-[11px] font-bold text-[#E30613]">
                <span>✓ Pay at Store Accepted</span>
                <span>✓ Instant Unboxing & Setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Information & Technical Specifications */}
      <ProductSpecifications
        specifications={product.specifications}
        highlights={product.highlights}
      />

      {/* Related Products Section (Vivo T4X, Oppo A5 Pro, etc.) */}
      <RelatedProducts products={products} currentProductId={product.id} />

      {/* Notification Modal for Out of stock / Price alert */}
      <StockNotifyModal
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        productName={product.name}
        mode={notifyMode}
      />
    </div>
  );
};
