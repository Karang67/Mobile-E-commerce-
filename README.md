# Shivangi Mobile / MobileHub E-Commerce Store
### Inspired by the Big C Mobiles Mobile-First Retail Experience

A complete, production-quality, responsive e-commerce web application inspired by South India's premier mobile retail chain Big C Mobiles. Built with React 19, Vite, TypeScript, Tailwind CSS v4, React Router, and Lucide icons.

---

## 🌟 Visual Accuracy & Recreated Features

### 1. Brand Design System
- **Primary Red**: `#E30613` (Signature Big C vibrant red header, badges, price typography, and CTAs)
- **Primary Blue**: `#0796D2` (Promotional benefits strip, brand badges, and links)
- **Dark Footer**: `#202D3B` / `#283747` (Multi-column desktop and accordion mobile footer)
- **Light Background**: `#F8F8F8` with clean white product cards (`#FFFFFF`) and subtle borders (`#E5E5E5`)
- **Typography**: Google Fonts Inter with clean sans-serif hierarchy
- **Configurable Branding**: Easily switch between **Shivangi Mobile**, **MobileHub**, or **Big C Demo Store** directly from the footer or account settings

### 2. Global Navigation & Mobile Header
- **Desktop Header**:
  - Top utility bar with 90-min express delivery reminder, toll-free helpline (+91 1800 123 4567), store locator, and festive offers link
  - Main header with logo, live auto-suggest search bar, pincode indicator, compare badge, wishlist badge, cart count badge, and account link
  - Secondary navigation bar with **Shop By Brand** dropdown and category links (Smartphones, Tablets, Laptops, Smartwatches, Earbuds, Accessories, Offers, Stores)
- **Mobile Sticky Header**:
  - Vibrant `#E30613` red header with hamburger drawer button, centered brand logo, search toggle, and cart badge
  - Slide-out mobile drawer menu containing full category hierarchy, brand list, store links, and support information

### 3. Fixed Mobile Bottom Navigation (5-Tab Bar)
Recreated directly from the mobile app screenshots:
1. **Home**: Direct link with red active state
2. **Search**: Search experience with recent search history
3. **Cart**: Shopping bag icon with live item count badge
4. **Account**: User profile and past orders
5. **More**: Opens interactive bottom sheet with quick shortcuts to Stores, Festive Deals, Wishlist, Compare, and Support

### 4. Recreated Product Details Page
Faithfully recreates the layout and design seen in the reference screenshots:
- **Featured Demo Product**: `Redmi Pad 2 (8GB/256GB | Graphite Grey)`
  - **SKU**: `10004773`
  - **Price Typography**: Prominent red `₹21,999`, strikethrough original `₹26,999`, `19% OFF` badge
  - **Stock Status**: Red `OUT OF STOCK` badge
  - **Stock Actions**: Interactive `Notify me when this product is in stock` modal and `Notify me when price drops` alert
- **Product Gallery**: Touch-friendly swipe slider with pagination dots on mobile, hover-zoom and thumbnail selector on desktop
- **Offers & EMI Plans Cards**:
  - **Brand Offer** card with discount summary and interactive T&C modal
  - **No-Cost EMI** card showing `EMI from ₹773/month` with interactive **View Plans** bank breakdown modal (3, 6, 12, 24 months)
  - **Pay Later Available** card with interactive **View Options** modal (Simpl, LazyPay, ICICI)
  - Secured payment gateway trust strip (UPI, VISA, MasterCard, RuPay)
- **Pincode Checker**: Validates 6-digit Indian pincodes (e.g. `500001`, `520010`, `530002`) with live 90-minute delivery estimation
- **Red Free Shipping Banner**: `FREE SHIPPING AT YOUR DOORSTEP` with white truck icon and 4 guarantees (90 Min Delivery, Online Payments, COD, No Cost EMI)
- **Quick Overview & Technical Specifications**: Bordered rows matching the reference (Item Weight, Dimensions, SIM, Display Size, Display Resolution, Processor, RAM, Storage, Battery, OS, Camera, Connectivity)
- **Related Products Grid**: 2-column mobile layout and responsive desktop grid (Vivo T4X 5G, Oppo A5 Pro 5G, etc.)

### 5. Why Shop With Us (The Blue Benefits Strip)
Recreated directly from the reference screenshots using 4 white rounded cards with vibrant red icon graphics on a `#0796D2` blue background:
- **BEST DEALS** — *On All Products*
- **90 MIN DELIVERY** — *On Smart Mobiles*
- **NO COST EMI** — *At Zero Down Payment*
- **100% SECURED PAYMENT** — *We value your security*

### 6. Interactive Store Locator Page (`/stores`)
Recreates the store locator screenshots:
- Red secondary **Shop by Brand** bar
- Breadcrumb: `Home > Store locations`
- Interactive **Leaflet OpenStreetMap** with custom red map markers
- Search input: *"Search for Outlets here.."* by city, area, or name
- State filter pills (Andhra Pradesh, Telangana, Tamil Nadu)
- Store listing cards for Adoni, Amalapuram, Anakapalli, Vijayawada, Visakhapatnam, Hyderabad, Rajahmundry, Guntur, Tirupati, and Chennai with direct Google Maps **Get Directions** links, phone, email, and store timings

### 7. Cart & Multi-Step Checkout Flow
- **Cart (`/cart`)**: Real-time quantity stepper, item removal, move to wishlist, subtotal calculations, and working coupon codes:
  - `SHIVANGI500` (Flat ₹500 OFF)
  - `BIGC1000` (Flat ₹1,000 OFF)
  - `FESTIVE10` (Flat ₹2,000 OFF)
- **Checkout (`/checkout`)**:
  - **Step 1 (Address)**: Full Name, Mobile, Pincode, City, State, Street, Landmark
  - **Step 2 (Delivery)**: 90-Minute Superfast Express vs. Standard Free Delivery
  - **Step 3 (Payment)**: UPI QR / ID, Credit/Debit Card, Net Banking, No-Cost EMI, Cash on Delivery
  - **Step 4 (Order Confirmation)**: Celebratory confetti animation, order ID, delivery estimate, item breakdown, and print receipt action

### 8. Dark Navy Footer & Floating WhatsApp Button
- **Footer (`#202D3B`)**: Centered brand logo, `250+ STORES | AP | TS | TN` network badge, mobile collapsible accordions (About, Information, Support, My Account, Payment & Shipping), copyright, and brand switcher
- **Floating WhatsApp Button**: Positioned fixed on the bottom-left (`left-4 bottom-20 lg:bottom-6`), safely offset so it never covers the mobile bottom navigation bar or checkout actions

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Modern component-based UI |
| **Vite 8** | Lightning-fast build tool and dev server |
| **TypeScript** | Type-safe models, props, and states |
| **Tailwind CSS v4** | Modern CSS utility design tokens |
| **React Router v7** | Client-side routing with deep link support |
| **Lucide React** | Clean, modern SVG icon set |
| **Leaflet & OpenStreetMap** | Responsive interactive store map |
| **Canvas Confetti** | Smooth celebratory checkout animations |
| **localStorage** | Persistent cart, wishlist, compare, and preferences |

---

## 📁 Project Structure

```
shivangi-mobile/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Desktop & Mobile Header
│   │   ├── MobileBottomNav.tsx     # 5-Tab Fixed Mobile Bottom Navigation
│   │   ├── SidebarDrawer.tsx       # Mobile Slideout Navigation Drawer
│   │   ├── WhatsAppButton.tsx      # Floating Bottom-Left WhatsApp Action
│   │   ├── Footer.tsx              # Dark Navy Footer with Mobile Accordions
│   │   ├── HeroCarousel.tsx        # Auto-sliding Hero Promotional Banners
│   │   ├── CategoryGrid.tsx        # 8 Category Cards with Icons
│   │   ├── BrandStrip.tsx          # 10 Mobile Brands Filter Strip
│   │   ├── BenefitsStrip.tsx       # Blue Benefits Strip (4 cards, red icons)
│   │   ├── DeliveryBanner.tsx      # Red Free Shipping 90-min Delivery Banner
│   │   ├── ProductCard.tsx         # Reusable White Product Card
│   │   ├── ProductGallery.tsx      # Multi-image Gallery with Zoom & Dots
│   │   ├── OffersEmiSection.tsx    # EMI & Brand Offer Cards with Modals
│   │   ├── PincodeChecker.tsx      # Delivery Availability & 90-min Checker
│   │   ├── StockNotifyModal.tsx    # Out-of-Stock and Price Drop Alert Modal
│   │   ├── ProductSpecifications.tsx # Bordered Specs Accordion Table
│   │   ├── RelatedProducts.tsx     # 2-col Mobile & 4-col Desktop Grid
│   │   └── StoreLocator.tsx        # Leaflet Map & Outlets Search
│   ├── context/
│   │   ├── CartContext.tsx         # Cart State & Coupon Code Logic
│   │   ├── WishlistContext.tsx     # Wishlist Persistence
│   │   ├── CompareContext.tsx      # Up to 4 Device Comparison
│   │   ├── ToastContext.tsx        # Toast Notifications
│   │   └── BrandContext.tsx        # Configurable Brand Label & Pincode
│   ├── data/
│   │   ├── products.ts             # 20+ Detailed Electronics Products
│   │   ├── stores.ts               # 11+ Store Outlets across AP, TS, TN
│   │   └── offers.ts               # Banners, Coupons, Bank EMI Schemes
│   ├── pages/
│   │   ├── HomePage.tsx            # Main Landing Page
│   │   ├── ProductListingPage.tsx  # Multi-faceted Filter & Sort Grid
│   │   ├── ProductDetailPage.tsx   # Redmi Pad 2 Experience Page
│   │   ├── StoresPage.tsx          # Store Locator Page
│   │   ├── CartPage.tsx            # Shopping Cart Page
│   │   ├── CheckoutPage.tsx        # 4-Step Checkout Flow
│   │   ├── SearchPage.tsx          # Search with History & Suggestions
│   │   ├── WishlistPage.tsx        # Saved Items
│   │   ├── ComparePage.tsx         # Side-by-side Specs Comparison
│   │   ├── OffersPage.tsx          # Bank Deals & Coupons
│   │   ├── AccountPage.tsx         # Profile, Orders & Settings
│   │   └── InfoPages.tsx           # About, Contact, Shipping, Privacy, Terms
│   ├── types/
│   │   └── index.ts                # TypeScript Interfaces
│   ├── App.tsx                     # Main Router & Layout Assembly
│   ├── index.css                   # Tailwind v4 & Design Tokens
│   └── main.tsx                    # React Root Bootstrap
├── index.html                      # HTML5 Template with SEO Meta
├── package.json
└── vite.config.ts                  # Vite + Tailwind Plugin Config
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher (tested on Node v24)
- **npm**: v9 or higher

### Installation & Local Run
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```
Open your browser at `http://localhost:5173/` (or `http://localhost:5174/` if 5173 is in use).

### Production Build
```bash
# Build production bundle with TypeScript check
npm run build

# Preview production build locally
npm run preview
```

---

## 📱 Responsive Testing Viewports

The design is optimized and verified across:
- **320px – 390px**: iPhone SE, iPhone 12/13/14/15/16, Samsung Galaxy S
- **390px – 430px**: iPhone Pro Max, Google Pixel
- **768px – 1024px**: iPad, iPad Pro, Android Tablets
- **1280px – 1440px+**: Desktop monitors & Laptops

---

## ⚖️ Disclaimer
*This website is a production-quality demonstration application inspired by modern mobile retail shopping platforms. All brand trademarks, logos, and product model references (Xiaomi, Apple, Samsung, OnePlus, Vivo, Oppo, Realme, Motorola, Nothing, JBL, Anker, ASUS) belong to their respective corporate owners.*
