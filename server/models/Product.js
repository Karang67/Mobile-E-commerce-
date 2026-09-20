import mongoose from 'mongoose';

const ProductVariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String },
  slug: { type: String },
}, { _id: false });

const EmiPlanSchema = new mongoose.Schema({
  bank: { type: String, required: true },
  tenureMonths: { type: Number, required: true },
  interestRate: { type: Number, default: 0 },
  monthlyEmi: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  isNoCost: { type: Boolean, default: false },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 10 },
  sku: { type: String, default: '' },
  ram: { type: String },
  storage: { type: String },
  color: { type: String },
  colorVariants: [ProductVariantSchema],
  storageVariants: [{ type: String }],
  images: [{ type: String }],
  description: { type: String, default: '' },
  highlights: [{ type: String }],
  specifications: { type: Map, of: String },
  isFeatured: { type: Boolean, default: false },
  isBestDeal: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  badge: { type: String },
  // Second-Hand specifics
  isSecondHand: { type: Boolean, default: false },
  condition: { 
    type: String, 
    enum: ['Like New', 'Superb', 'Good', 'Fair', ''] 
  },
  batteryHealth: { type: String },
  warrantyPeriod: { type: String },
  includedAccessories: [{ type: String }],
  qcScore: { type: String },
  deviceNotes: { type: String },
  relatedProductIds: [{ type: String }],
  emiPlans: [EmiPlanSchema],
}, {
  timestamps: true,
});

export const Product = mongoose.model('Product', ProductSchema);
