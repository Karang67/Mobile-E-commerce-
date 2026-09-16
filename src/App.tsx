import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { BrandProvider } from './context/BrandContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { StoreDataProvider } from './context/StoreDataContext';
import { AuthProvider } from './context/AuthContext';

import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { StoresPage } from './pages/StoresPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SearchPage } from './pages/SearchPage';
import { WishlistPage } from './pages/WishlistPage';
import { ComparePage } from './pages/ComparePage';
import { OffersPage } from './pages/OffersPage';
import { SecondHandPage } from './pages/SecondHandPage';
import { AccountPage } from './pages/AccountPage';
import { 
  AboutPage, 
  ContactPage, 
  ShippingPage, 
  PaymentMethodsPage, 
  TermsPage, 
  PrivacyPage 
} from './pages/InfoPages';

// Admin imports
import { AdminGuard } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProductList } from './admin/AdminProductList';
import { AdminProductEditor } from './admin/AdminProductEditor';
import { AdminOffers } from './admin/AdminOffers';
import { AdminStore } from './admin/AdminStore';
import { AdminSettings } from './admin/AdminSettings';
import { AdminInquiries } from './admin/AdminInquiries';

// Scroll to top helper on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Admin app — completely separate from storefront (no header/footer/nav)
const AdminApp: React.FC = () => (
  <BrandProvider>
    <AdminGuard>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/inquiries" element={<AdminInquiries />} />
          <Route path="/products" element={<AdminProductList />} />
          <Route path="/products/new" element={<AdminProductEditor />} />
          <Route path="/products/:id/edit" element={<AdminProductEditor />} />
          <Route path="/offers" element={<AdminOffers />} />
          <Route path="/store" element={<AdminStore />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AdminLayout>
    </AdminGuard>
  </BrandProvider>
);
// Storefront wrapper
const StorefrontApp: React.FC = () => (
  <BrandProvider>
    <StoreDataProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <div className="min-h-screen flex flex-col bg-[#F8F8F8] text-[#202020] font-sans antialiased pb-16 lg:pb-0">
                  <ScrollToTop />
                
                {/* Sticky Header (Desktop & Mobile) */}
                <Header />

                {/* Main Route Content */}
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ProductListingPage />} />
                    <Route path="/shop/:category" element={<ProductListingPage />} />
                    <Route path="/brand/:brand" element={<ProductListingPage />} />
                    <Route path="/product/:slug" element={<ProductDetailPage />} />
                    <Route path="/stores" element={<StoresPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/offers" element={<OffersPage />} />
                    <Route path="/second-hand" element={<SecondHandPage />} />
                    <Route path="/pre-owned" element={<Navigate to="/second-hand" replace />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/login" element={<AccountPage />} />
                    <Route path="/register" element={<AccountPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/shipping" element={<ShippingPage />} />
                    <Route path="/payment-methods" element={<PaymentMethodsPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    {/* Fallback to Home */}
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </main>

                {/* Floating WhatsApp Button */}
                <WhatsAppButton />

                {/* Dark Navy Footer */}
                <Footer />

                {/* Fixed Mobile Bottom Navigation (5 tabs) */}
                <MobileBottomNav />

                {/* Supabase Email OTP Auth Modal */}
                <AuthModal />
              </div>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  </StoreDataProvider>
</BrandProvider>
);

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Admin panel — completely isolated from storefront */}
        <Route path="/admin/*" element={<AdminApp />} />
        {/* Main storefront */}
        <Route path="/*" element={<StorefrontApp />} />
      </Routes>
    </Router>
  );
};

export default App;
