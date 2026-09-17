import { Product } from '../types';

export const seedProducts: Product[] = [
  {
    id: 'prod-s24-ultra',
    slug: 'samsung-galaxy-s24-ultra-5g',
    name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB Storage | Titanium Gray)',
    brand: 'Samsung',
    category: 'smartphones',
    price: 129999,
    originalPrice: 134999,
    discount: 4,
    rating: 4.8,
    reviewCount: 342,
    inStock: true,
    stockQuantity: 15,
    sku: 'SAM-S24U-256',
    ram: '12GB',
    storage: '256GB',
    color: 'Titanium Gray',
    colorVariants: [
      { name: 'Titanium Gray', hex: '#68676C', slug: 'titanium-gray' },
      { name: 'Titanium Black', hex: '#2B2B2C', slug: 'titanium-black' },
      { name: 'Titanium Violet', hex: '#584C69', slug: 'titanium-violet' }
    ],
    storageVariants: ['256GB', '512GB', '1TB'],
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility — starting with the most important device in your life. Your phone.',
    highlights: [
      '200MP Quad Telephoto Camera with AI Zoom',
      'Snapdragon 8 Gen 3 for Galaxy Processor',
      'Built-in S Pen & Circle to Search with Google',
      'Titanium Shield Frame & Corning Gorilla Armor Glass',
      '5000mAh Battery with 45W Super Fast Charging'
    ],
    specifications: {
      'Display': '6.8" Quad HD+ Dynamic AMOLED 2X (120Hz)',
      'Processor': 'Snapdragon 8 Gen 3 Mobile Platform for Galaxy',
      'Rear Camera': '200MP (Main) + 50MP (5x Telephoto) + 12MP (Ultra-wide) + 10MP (3x Telephoto)',
      'Front Camera': '12MP Dual Pixel AF',
      'Battery': '5000 mAh (45W Wired, Fast Wireless 2.0)',
      'OS': 'One UI 6.1 based on Android 14'
    },
    isFeatured: true,
    isBestDeal: true,
    isPopular: true,
    badge: 'Flagship AI Phone',
    isSecondHand: false,
  },
  {
    id: 'prod-iphone-15-pro-max',
    slug: 'apple-iphone-15-pro-max',
    name: 'Apple iPhone 15 Pro Max (256GB | Natural Titanium)',
    brand: 'Apple',
    category: 'smartphones',
    price: 149900,
    originalPrice: 159900,
    discount: 6,
    rating: 4.9,
    reviewCount: 512,
    inStock: true,
    stockQuantity: 12,
    sku: 'APL-IP15PM-256',
    ram: '8GB',
    storage: '256GB',
    color: 'Natural Titanium',
    colorVariants: [
      { name: 'Natural Titanium', hex: '#9E9A93', slug: 'natural-titanium' },
      { name: 'Blue Titanium', hex: '#2F3847', slug: 'blue-titanium' },
      { name: 'Black Titanium', hex: '#3C3B3D', slug: 'black-titanium' }
    ],
    storageVariants: ['256GB', '512GB', '1TB'],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'iPhone 15 Pro Max forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    highlights: [
      'Aerospace-Grade Titanium Design with Textured Matte Glass Back',
      'A17 Pro Chip with 6-Core GPU',
      '48MP Main Camera with 5x Optical Zoom Telephoto Lens',
      'Customizable Action Button for Fast Shortcuts',
      'USB-C Connector with USB 3 Speeds'
    ],
    specifications: {
      'Display': '6.7" Super Retina XDR ProMotion (120Hz Always-On)',
      'Processor': 'A17 Pro Bionic Chip',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto',
      'Front Camera': '12MP TrueDepth Camera',
      'Battery': 'Up to 29 hours video playback',
      'OS': 'iOS 17'
    },
    isFeatured: true,
    isBestDeal: true,
    isPopular: true,
    badge: 'Best Seller',
    isSecondHand: false,
  },
  {
    id: 'prod-oneplus-12',
    slug: 'oneplus-12-5g',
    name: 'OnePlus 12 5G (16GB RAM, 512GB Storage | Flowy Emerald)',
    brand: 'OnePlus',
    category: 'smartphones',
    price: 69999,
    originalPrice: 74999,
    discount: 7,
    rating: 4.7,
    reviewCount: 198,
    inStock: true,
    stockQuantity: 20,
    sku: 'OP-12-512',
    ram: '16GB',
    storage: '512GB',
    color: 'Flowy Emerald',
    colorVariants: [
      { name: 'Flowy Emerald', hex: '#2A5C54', slug: 'flowy-emerald' },
      { name: 'Silky Black', hex: '#222222', slug: 'silky-black' }
    ],
    storageVariants: ['256GB', '512GB'],
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Smooth Beyond Belief. The OnePlus 12 combines flagship hardware with software optimizations for an unparalleled user experience.',
    highlights: [
      'Snapdragon 8 Gen 3 with Trinity Engine',
      '4th Gen Hasselblad Camera System for Mobile',
      '2K 120Hz ProXDR Display with 4500 nits Peak Brightness',
      '5400 mAh Battery + 100W SUPERVOOC Fast Charging'
    ],
    specifications: {
      'Display': '6.82" 2K 120Hz ProXDR AMOLED',
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '50MP Main + 64MP Periscope + 48MP Ultra-Wide',
      'Battery': '5400 mAh (100W Wired, 50W AIRVOOC)'
    },
    isFeatured: true,
    isBestDeal: false,
    isPopular: true,
    badge: 'Super Value',
    isSecondHand: false,
  },
  {
    id: 'prod-macbook-air-m3',
    slug: 'apple-macbook-air-m3',
    name: 'Apple MacBook Air 13-inch M3 Chip (8GB Unified Memory, 256GB SSD | Midnight)',
    brand: 'Apple',
    category: 'laptops',
    price: 114900,
    originalPrice: 119900,
    discount: 4,
    rating: 4.9,
    reviewCount: 124,
    inStock: true,
    stockQuantity: 8,
    sku: 'APL-MBA-M3-256',
    ram: '8GB',
    storage: '256GB SSD',
    color: 'Midnight',
    colorVariants: [
      { name: 'Midnight', hex: '#1C242B', slug: 'midnight' },
      { name: 'Starlight', hex: '#E3DBCD', slug: 'starlight' },
      { name: 'Space Gray', hex: '#53565A', slug: 'space-gray' }
    ],
    storageVariants: ['256GB SSD', '512GB SSD'],
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Supercharged by M3. Lean. Mean. M3 machine. MacBook Air sails through work and play — and the M3 chip brings even greater capabilities to the world’s most popular laptop.',
    highlights: [
      'Apple M3 chip with 8-core CPU and 8-core GPU',
      'Up to 18 hours battery life',
      '13.6-inch Liquid Retina display with 500 nits brightness',
      '1080p FaceTime HD camera & 4-speaker sound system'
    ],
    specifications: {
      'Display': '13.6" Liquid Retina Display',
      'Chip': 'Apple M3 Chip',
      'Memory': '8GB Unified Memory',
      'Storage': '256GB SSD',
      'Weight': '1.24 kg'
    },
    isFeatured: true,
    isBestDeal: false,
    isPopular: true,
    badge: 'Apple Silicon',
    isSecondHand: false,
  },
  {
    id: 'prod-ipad-air-m2',
    slug: 'apple-ipad-air-m2-11',
    name: 'Apple iPad Air 11-inch M2 Chip (Wi-Fi, 128GB | Space Gray)',
    brand: 'Apple',
    category: 'tablets',
    price: 59900,
    originalPrice: 62900,
    discount: 5,
    rating: 4.8,
    reviewCount: 88,
    inStock: true,
    stockQuantity: 10,
    sku: 'APL-IPAD-AIR-M2',
    ram: '8GB',
    storage: '128GB',
    color: 'Space Gray',
    colorVariants: [
      { name: 'Space Gray', hex: '#53565A', slug: 'space-gray' },
      { name: 'Starlight', hex: '#E3DBCD', slug: 'starlight' },
      { name: 'Purple', hex: '#B8B3D3', slug: 'purple' }
    ],
    storageVariants: ['128GB', '256GB', '512GB'],
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'iPad Air is supercharged by the incredibly fast Apple M2 chip. It features a stunning Liquid Retina display, landscape front camera, and fast Wi-Fi 6E.',
    highlights: [
      'Liquid Retina Display with True Tone & P3 Wide Color',
      'Apple M2 Chip with Neural Engine',
      '12MP Landscape Ultra Wide Front Camera with Center Stage',
      'Supports Apple Pencil Pro and Magic Keyboard'
    ],
    specifications: {
      'Display': '11" Liquid Retina Display',
      'Processor': 'Apple M2 Chip',
      'Front Camera': '12MP Landscape Ultra Wide',
      'Rear Camera': '12MP Wide'
    },
    isFeatured: false,
    isBestDeal: true,
    isPopular: true,
    badge: 'M2 Powered',
    isSecondHand: false,
  }
];
