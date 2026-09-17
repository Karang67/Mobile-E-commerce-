import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    brand: { type: String },
    category: { type: String },
  },
  quantity: { type: Number, required: true, default: 1 },
  selectedRam: { type: String },
  selectedStorage: { type: String },
  selectedColor: { type: String },
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  landmark: { type: String },
  addressType: { type: String, enum: ['Home', 'Work'], default: 'Home' },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: [
      'Order Placed', 
      'Preparing', 
      'Packed', 
      'Out for Delivery', 
      'Delivered', 
      'Ready for Pickup', 
      'Completed', 
      'Processing'
    ],
    default: 'Order Placed' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Success', 'COD'],
    default: 'Pending'
  },
  paymentScreenshot: { type: String },
  transactionId: { type: String },
  address: { type: AddressSchema, required: true },
  paymentMethod: { type: String, required: true },
  fulfillmentType: { type: String, enum: ['delivery', 'pickup'], default: 'delivery' },
  deliveryMethod: { type: String },
  statusMessage: { type: String },
}, {
  timestamps: true,
});

export const Order = mongoose.model('Order', OrderSchema);
