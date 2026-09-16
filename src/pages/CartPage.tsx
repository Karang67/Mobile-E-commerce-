import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Heart, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Tag, 
  Plus, 
  Minus,
  CheckCircle2,
  X,
  Lock,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    discount, 
    deliveryFee, 
    total, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon 
  } = useCart();
  const { toggleWishlist } = useWishlist();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-red-50 text-[#E30613] flex items-center justify-center mx-auto mb-4 border border-red-100">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto mt-2">
          Looks like you haven't added any smartphones, tablets, or smart gadgets to your cart yet.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/shop/smartphones"
            className="bg-[#E30613] hover:bg-[#c40510] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md"
          >
            Explore Smartphones
          </Link>
          <Link
            to="/offers"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all"
          >
            View Festive Deals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <Link to="/" className="hover:text-[#E30613]">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-bold">Shopping Cart ({cart.length} items)</span>
      </div>

      <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* 90-Min delivery banner in cart */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 flex items-center gap-3 text-xs text-emerald-900 font-medium">
            <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              All items in your cart qualify for <strong>90-Minute Express Delivery</strong> in verified store zones!
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
            {cart.map(item => (
              <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Product details */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-contain p-1 border rounded-lg bg-gray-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="block text-sm font-bold text-gray-900 hover:text-[#E30613] transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      {item.selectedRam && <span>RAM: {item.selectedRam}</span>}
                      {item.selectedStorage && <span>• Storage: {item.selectedStorage}</span>}
                      {item.selectedColor && <span>• Color: {item.selectedColor}</span>}
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-base font-black text-[#E30613]">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                      {item.product.originalPrice > item.product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{item.product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-l"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-gray-900 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-r"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Move to Wishlist */}
                  <button
                    onClick={() => {
                      toggleWishlist(item.product);
                      removeFromCart(item.product.id);
                    }}
                    className="p-2 text-gray-400 hover:text-[#E30613] transition-colors"
                    title="Move to Wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop/smartphones"
              className="text-xs font-bold text-[#0796D2] hover:underline flex items-center gap-1"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <h2 className="font-black text-gray-900 uppercase tracking-tight text-base pb-3 border-b border-gray-100">
              Order Summary
            </h2>

            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold">{appliedCoupon.code} applied!</span>
                      <p className="text-[10px] text-emerald-700">You saved ₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-gray-400 hover:text-gray-700 p-1"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700">Have a Promo Code?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Try SHIVANGI500 or FESTIVE10"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                    />
                    <button
                      type="submit"
                      className="bg-gray-900 hover:bg-[#E30613] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Cart Subtotal</span>
                <span className="font-bold text-gray-900 font-mono">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount</span>
                  <span className="font-bold font-mono">- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Fulfillment (Store Pickup)</span>
                <span className="font-bold text-emerald-600">
                  FREE
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline text-sm sm:text-base">
                <span className="font-black text-gray-900 uppercase">Total Amount</span>
                <span className="font-black text-lg text-[#E30613] font-mono">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Warning if unauthenticated */}
            {!isAuthenticated && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900 animate-fade-in">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Account Login Required</span>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    Please login or create an account with Email OTP before placing your order.
                  </p>
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal(
                    'Please login or create an account with Email OTP to proceed with your order, edit your delivery address, and track package live.',
                    () => navigate('/checkout')
                  );
                  return;
                }
                navigate('/checkout');
              }}
              className="w-full bg-[#E30613] hover:bg-[#c40510] text-white py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{isAuthenticated ? 'Proceed to Delivery & Checkout' : 'Login / Register to Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="pt-2 text-[11px] text-gray-500 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Genuine Brand Warranty Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#0796D2]" />
                <span>Instant Store Pickup at Shivangi Mobile, Adoni</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
