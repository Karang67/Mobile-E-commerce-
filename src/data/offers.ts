export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgColor: string;
  accentColor: string;
  image: string;
  tag: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    badge: 'SUPERFESTIVAL SPECIAL',
    title: 'Flagship 5G Smartphones',
    subtitle: 'Flat ₹5,000 Instant Bank Discount + Up to ₹10,000 Exchange Bonus',
    ctaText: 'Shop Mobiles',
    ctaLink: '/shop/smartphones',
    secondaryCtaText: 'Explore Deals',
    secondaryCtaLink: '/offers',
    bgColor: 'from-[#C40510] via-[#E30613] to-[#8A000A]',
    accentColor: '#FFD700',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    tag: 'INSTANT STORE PICKUP AVAILABLE'
  },
  {
    id: 'slide-2',
    badge: 'NEW LAUNCH PREVIEW',
    title: 'Redmi Pad 2 & Pro Tablets',
    subtitle: '2.8K 144Hz Eye-Care Display & Snapdragon 7s Gen 2 Performance',
    ctaText: 'View Tablets',
    ctaLink: '/shop/tablets',
    secondaryCtaText: 'View Specs',
    secondaryCtaLink: '/product/redmi-pad-2-8gb-256gb-graphite-grey',
    bgColor: 'from-[#0A4D68] via-[#088395] to-[#05BFDB]',
    accentColor: '#FFFFFF',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    tag: 'NO COST EMI AT ZERO DOWN PAYMENT'
  },
  {
    id: 'slide-3',
    badge: 'PREMIUM LAPTOPS & AUDIO',
    title: 'Apple M3 & OLED Laptops',
    subtitle: 'Up to 24 Months No-Cost EMI on leading HDFC & ICICI Credit Cards',
    ctaText: 'Explore Laptops',
    ctaLink: '/shop/laptops',
    secondaryCtaText: 'Shop Audio',
    secondaryCtaLink: '/shop/earbuds',
    bgColor: 'from-[#1A2634] via-[#243B53] to-[#334E68]',
    accentColor: '#38D9A9',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    tag: '100% GENUINE BRAND WARRANTY'
  }
];

export const coupons = [
  {
    code: 'SHIVANGI500',
    discountAmount: 500,
    minCartValue: 5000,
    description: 'Flat ₹500 OFF on orders above ₹5,000'
  },
  {
    code: 'BIGC1000',
    discountAmount: 1000,
    minCartValue: 15000,
    description: 'Flat ₹1,000 OFF on smartphones & tablets above ₹15,000'
  },
  {
    code: 'FESTIVE10',
    discountAmount: 2000,
    minCartValue: 25000,
    description: 'Festive Mega Discount ₹2,000 OFF on orders above ₹25,000'
  }
];

export const bankOffers = [
  {
    id: 'offer-1',
    bank: 'HDFC Bank',
    badge: 'Instant Bank Discount',
    title: 'Flat ₹3,000 Instant Discount',
    description: 'On HDFC Bank Credit Cards on minimum transaction of ₹20,000',
    code: 'HDFC3000'
  },
  {
    id: 'offer-2',
    bank: 'ICICI Bank',
    badge: 'No Cost EMI',
    title: 'Up to 9 Months No Cost EMI',
    description: 'Zero interest, zero processing fee on select credit & debit cards',
    code: 'ICICINCE'
  },
  {
    id: 'offer-3',
    bank: 'SBI Card',
    badge: 'Card Cashback',
    title: '5% Unlimited Cashback',
    description: 'Get 5% back on all SBI Credit Card purchases',
    code: 'SBICASH'
  },
  {
    id: 'offer-4',
    bank: 'Bajaj Finserv',
    badge: 'Zero Down Payment',
    title: 'Instant In-Store & Online EMI',
    description: 'Approval in 60 seconds with simple OTP verification',
    code: 'BAJAJEMI'
  }
];
