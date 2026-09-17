import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save, ArrowLeft, Plus, Trash2,
  AlertCircle, CheckCircle2, Upload,
  Image as ImageIcon, Sparkles, ShieldCheck,
  BatteryCharging, Check, Star, RefreshCw
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { Product, ProductCategory } from '../types';
import { compressImageFile } from '../utils/imageCompressor';
import { uploadToCloudinary } from '../utils/cloudinaryService';
import { syncProductToMongo } from '../utils/apiService';

const CATEGORIES: ProductCategory[] = [
  'smartphones', 'tablets', 'laptops', 'smartwatches',
  'earbuds', 'accessories', 'powerbanks', 'speakers'
];

const TABS = ['Basic', 'Pricing', 'Stock', '2nd Hand', 'Images', 'Variants', 'Flags', 'EMI', 'Specs', 'Highlights', 'Related'] as const;
type Tab = typeof TABS[number];

interface EmiPlanForm {
  bank: string;
  tenureMonths: number;
  interestRate: number;
  monthlyEmi: number;
  totalCost: number;
  isNoCost: boolean;
}

interface ProductWithEmi extends Product {
  emiPlans?: EmiPlanForm[];
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function calcDiscount(price: number, original: number): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

const inp = "w-full bg-gray-800 text-gray-200 text-sm rounded-xl px-3.5 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E30613] placeholder-gray-500";
const lbl = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={value}
    onClick={() => onChange(!value)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
      value ? 'bg-emerald-500' : 'bg-gray-600'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
        value ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const SmallToggle: React.FC<{ value: boolean; onChange: (v: boolean) => void; color?: string }> = ({ value, onChange, color = 'bg-[#E30613]' }) => (
  <button
    type="button"
    role="switch"
    aria-checked={value}
    onClick={() => onChange(!value)}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      value ? color : 'bg-gray-600'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
        value ? 'translate-x-4' : 'translate-x-0'
      }`}
    />
  </button>
);

export const AdminProductEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const { products, refresh } = useStoreData();

  const [activeTab, setActiveTab] = useState<Tab>('Basic');
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const defaultForm = (): ProductWithEmi => ({
    id: `prod-${Date.now()}`,
    slug: '',
    name: '',
    brand: '',
    category: 'smartphones',
    price: 0,
    originalPrice: 0,
    discount: 0,
    rating: 4.0,
    reviewCount: 0,
    inStock: true,
    stockQuantity: 10,
    sku: '',
    ram: '',
    storage: '',
    color: '',
    colorVariants: [],
    storageVariants: [],
    images: [''],
    description: '',
    highlights: [''],
    specifications: {},
    isFeatured: false,
    isBestDeal: false,
    isPopular: false,
    badge: '',
    isSecondHand: false,
    condition: 'Like New',
    batteryHealth: '92%',
    warrantyPeriod: '6 Months Store Warranty',
    includedAccessories: ['Original Box', 'Fast Charger', 'Charging Cable'],
    qcScore: '32-Point Quality Certified',
    deviceNotes: '',
    emiPlans: [],
    relatedProductIds: [],
  });

  const [form, setForm] = useState<ProductWithEmi>(defaultForm());

  useEffect(() => {
    if (!isNew && products.length > 0) {
      const found = products.find(p => p.id === id);
      if (found) {
        setForm({ 
          ...found, 
          emiPlans: (found as any).emiPlans ?? [],
          relatedProductIds: found.relatedProductIds ?? []
        });
        setSpecRows(Object.entries(found.specifications || {}).map(([key, value]) => ({ key, value })));
      }
    }
  }, [id, isNew, products]);

  const allCatalogProducts = React.useMemo(() => products.filter(p => p.id !== id), [id, products]);
  const [relatedSearch, setRelatedSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadMsg(null);

    try {
      const compressed: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          // Attempt direct upload to Cloudinary (or compressed base64 fallback)
          const uploadRes = await uploadToCloudinary(file);
          if (uploadRes.success && uploadRes.url) {
            compressed.push(uploadRes.url);
          } else {
            const dataUrl = await compressImageFile(file, { maxDimension: 1100, quality: 0.82 });
            compressed.push(dataUrl);
          }
        }
      }

      if (compressed.length > 0) {
        setForm(f => {
          const current = f.images.filter(img => img.trim().length > 0);
          return {
            ...f,
            images: [...current, ...compressed]
          };
        });
        setUploadMsg(`Successfully added ${compressed.length} image${compressed.length > 1 ? 's' : ''}!`);
        setTimeout(() => setUploadMsg(null), 3000);
      }
    } catch (err: any) {
      alert('Error processing image: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Specs as separate state to allow key-value editing
  const [specRows, setSpecRows] = useState<Array<{ key: string; value: string }>>(() =>
    Object.entries(form.specifications || {}).map(([key, value]) => ({ key, value }))
  );

  const setField = <K extends keyof ProductWithEmi>(key: K, value: ProductWithEmi[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push('Product name is required (Basic tab)');
    if (!form.brand.trim()) errs.push('Brand is required (Basic tab)');
    if (!form.sku.trim()) errs.push('SKU is required (Basic tab)');
    if (form.price <= 0) errs.push('Price must be greater than 0 (Pricing tab)');
    if (form.images.filter(i => i.trim()).length === 0) errs.push('At least one image URL is required (Images tab)');
    setErrors(errs);
    if (errs.length > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    return errs.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const slug = form.slug.trim() || slugify(form.name);
    const specs: Record<string, string> = {};
    specRows.filter(r => r.key.trim()).forEach(r => { specs[r.key.trim()] = r.value.trim(); });
    const toSave: ProductWithEmi = {
      ...form,
      slug,
      originalPrice: form.originalPrice > 0 ? form.originalPrice : form.price,
      images: form.images.filter(i => i.trim()),
      highlights: form.highlights.filter(h => h.trim()),
      specifications: specs,
    };
    
    // Sync to MongoDB backend & Local Storage
    await syncProductToMongo(toSave as Product);
    refresh();

    setSaved(true);
    setTimeout(() => { setSaved(false); navigate('/admin/products'); }, 1200);
  };

  // ─── Tab content rendered inline (no inner components) ────────────────────
  const renderTabContent = () => {
    switch (activeTab) {

      // ── BASIC ──────────────────────────────────────────────────────────────
      case 'Basic':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>Product Name *</label>
                <input
                  className={inp}
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="e.g. Samsung Galaxy S24 Ultra (12GB/256GB | Titanium Black)"
                />
              </div>
              <div>
                <label className={lbl}>Brand *</label>
                <input
                  className={inp}
                  value={form.brand}
                  onChange={e => setField('brand', e.target.value)}
                  placeholder="e.g. Samsung"
                />
              </div>
              <div>
                <label className={lbl}>Category *</label>
                <select
                  className={inp}
                  value={form.category}
                  onChange={e => setField('category', e.target.value as ProductCategory)}
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>SKU *</label>
                <input
                  className={inp}
                  value={form.sku}
                  onChange={e => setField('sku', e.target.value)}
                  placeholder="e.g. 10089234"
                />
              </div>
              <div>
                <label className={lbl}>URL Slug (auto-generated if blank)</label>
                <input
                  className={inp}
                  value={form.slug}
                  onChange={e => setField('slug', e.target.value)}
                  placeholder="e.g. samsung-galaxy-s24-ultra"
                />
              </div>
              <div>
                <label className={lbl}>Rating (0–5)</label>
                <input
                  className={inp}
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={form.rating}
                  onChange={e => setField('rating', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className={lbl}>Review Count</label>
                <input
                  className={inp}
                  type="number"
                  min={0}
                  value={form.reviewCount}
                  onChange={e => setField('reviewCount', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="md:col-span-2">
                <label className={lbl}>Description</label>
                <textarea
                  className={`${inp} min-h-28 resize-y`}
                  value={form.description}
                  onChange={e => setField('description', e.target.value)}
                  placeholder="Product description shown on detail page..."
                />
              </div>
            </div>
          </div>
        );

      // ── PRICING ────────────────────────────────────────────────────────────
      case 'Pricing':
        return (
          <div className="space-y-4 max-w-lg">
            <div>
              <label className={lbl}>Selling Price (₹) *</label>
              <input
                className={inp}
                type="number"
                min={0}
                value={form.price || ''}
                onChange={e => {
                  const price = parseInt(e.target.value) || 0;
                  setForm(f => ({ ...f, price, discount: calcDiscount(price, f.originalPrice) }));
                }}
                placeholder="e.g. 79999"
              />
            </div>
            <div>
              <label className={lbl}>Original / MRP (₹)</label>
              <input
                className={inp}
                type="number"
                min={0}
                value={form.originalPrice || ''}
                onChange={e => {
                  const original = parseInt(e.target.value) || 0;
                  setForm(f => ({ ...f, originalPrice: original, discount: calcDiscount(f.price, original) }));
                }}
                placeholder="e.g. 89999"
              />
            </div>
            <div className="bg-gray-800/60 rounded-xl px-4 py-3 border border-gray-700">
              <div className="text-xs text-gray-400">Auto-calculated Discount</div>
              <div className="text-2xl font-black text-green-400 mt-1">{form.discount}% OFF</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Savings: ₹{Math.max(0, form.originalPrice - form.price).toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <label className={lbl}>Override Discount % (optional)</label>
              <input
                className={inp}
                type="number"
                min={0}
                max={100}
                value={form.discount || ''}
                onChange={e => setField('discount', parseInt(e.target.value) || 0)}
                placeholder="Leave 0 to auto-calculate from prices"
              />
            </div>
          </div>
        );

      // ── STOCK ──────────────────────────────────────────────────────────────
      case 'Stock':
        return (
          <div className="space-y-5 max-w-sm">
            <div className="flex items-center justify-between bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-4">
              <div>
                <div className="text-white font-bold text-sm">In Stock</div>
                <div className="text-gray-400 text-xs mt-0.5">Toggle product availability</div>
              </div>
              <Toggle value={form.inStock} onChange={v => setField('inStock', v)} />
            </div>
            <div>
              <label className={lbl}>Stock Quantity</label>
              <input
                className={inp}
                type="number"
                min={0}
                value={form.stockQuantity}
                onChange={e => setField('stockQuantity', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className={lbl}>RAM</label>
              <input
                className={inp}
                value={form.ram ?? ''}
                onChange={e => setField('ram', e.target.value)}
                placeholder="e.g. 8 GB"
              />
            </div>
            <div>
              <label className={lbl}>Storage</label>
              <input
                className={inp}
                value={form.storage ?? ''}
                onChange={e => setField('storage', e.target.value)}
                placeholder="e.g. 256 GB"
              />
            </div>
            <div>
              <label className={lbl}>Color</label>
              <input
                className={inp}
                value={form.color ?? ''}
                onChange={e => setField('color', e.target.value)}
                placeholder="e.g. Titanium Black"
              />
            </div>
          </div>
        );

      // ── 2ND HAND / PRE-OWNED ────────────────────────────────────────────────
      case '2nd Hand':
        return (
          <div className="space-y-6 max-w-3xl">
            {/* Master Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-800/80 rounded-2xl border border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  form.isSecondHand ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-700 text-gray-400'
                }`}>
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Sell as Certified Pre-Owned / Second Hand</div>
                  <div className="text-gray-400 text-xs mt-0.5">
                    Enables pre-owned badges, battery health score, condition grades, warranty seals & trust verification on the storefront.
                  </div>
                </div>
              </div>
              <Toggle
                value={!!form.isSecondHand}
                onChange={v => {
                  setField('isSecondHand', v);
                  if (v && !form.badge) setField('badge', 'Pre-Owned');
                }}
              />
            </div>

            {form.isSecondHand ? (
              <div className="space-y-6">
                {/* Condition Grader */}
                <div>
                  <label className={lbl}>Cosmetic Condition Grade *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                    {[
                      { id: 'Like New', title: 'Like New (10/10)', desc: 'Flawless condition. Zero scratches, pristine screen & back.', color: 'border-emerald-500 text-emerald-400 bg-emerald-950/20' },
                      { id: 'Superb', title: 'Superb (9/10)', desc: 'Minimal faint sign of pocket wear. Screen is 100% scratch-free.', color: 'border-blue-500 text-blue-400 bg-blue-950/20' },
                      { id: 'Good', title: 'Good (8/10)', desc: 'Light cosmetic scratches on frame. Fully functional & tested.', color: 'border-yellow-500 text-yellow-400 bg-yellow-950/20' },
                      { id: 'Fair', title: 'Fair (7/10)', desc: 'Visible marks/scratches on body. Deep budget discount.', color: 'border-orange-500 text-orange-400 bg-orange-950/20' }
                    ].map(c => {
                      const selected = form.condition === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setField('condition', c.id as any)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            selected
                              ? `${c.color} shadow-lg ring-1 ring-white/20`
                              : 'border-gray-700 bg-gray-800/40 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-sm mb-1">
                            <span>{c.title}</span>
                            {selected && <Check className="w-4 h-4" />}
                          </div>
                          <p className="text-[11px] text-gray-400 leading-snug">{c.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Battery Health & Warranty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/60">
                    <label className={lbl}>Battery Health %</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="relative flex-1">
                        <BatteryCharging className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          className={`${inp} pl-9`}
                          value={form.batteryHealth ?? '92%'}
                          onChange={e => setField('batteryHealth', e.target.value)}
                          placeholder="e.g. 94%"
                        />
                      </div>
                    </div>
                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {['100%', '96%', '92%', '88%', '85%'].map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setField('batteryHealth', preset)}
                          className="px-2 py-0.5 text-[10px] bg-gray-700 hover:bg-gray-600 text-gray-300 rounded font-bold"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/60">
                    <label className={lbl}>Warranty Duration</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="relative flex-1">
                        <ShieldCheck className="w-4 h-4 text-[#0796D2] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          className={`${inp} pl-9`}
                          value={form.warrantyPeriod ?? '6 Months Store Warranty'}
                          onChange={e => setField('warrantyPeriod', e.target.value)}
                          placeholder="e.g. 6 Months Store Warranty"
                        />
                      </div>
                    </div>
                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {['6 Months Store Warranty', '3 Months Store Warranty', '1 Year Brand Warranty', '7 Days Testing Warranty'].map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setField('warrantyPeriod', preset)}
                          className="px-2 py-0.5 text-[10px] bg-gray-700 hover:bg-gray-600 text-gray-300 rounded font-bold"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quality Check Certification */}
                <div>
                  <label className={lbl}>QC & Diagnostic Certification</label>
                  <input
                    className={inp}
                    value={form.qcScore ?? '32-Point Quality Certified'}
                    onChange={e => setField('qcScore', e.target.value)}
                    placeholder="e.g. 32-Point Quality Certified"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Displays a trust seal on the product detail page confirming hardware, camera, speaker, and display inspection.
                  </p>
                </div>

                {/* Included in the Box (Accessories) */}
                <div>
                  <label className={lbl}>Included In The Box / With Device</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {[
                      'Original Box',
                      'Fast Charger',
                      'Charging Cable',
                      'SIM Ejector Pin',
                      'GST Tax Invoice / Bill',
                      'Protective Cover / Case',
                      'Tempered Glass Applied'
                    ].map(acc => {
                      const list = form.includedAccessories ?? [];
                      const included = list.includes(acc);
                      return (
                        <button
                          key={acc}
                          type="button"
                          onClick={() => {
                            if (included) {
                              setField('includedAccessories', list.filter(item => item !== acc));
                            } else {
                              setField('includedAccessories', [...list, acc]);
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-colors ${
                            included
                              ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300'
                              : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          <span>{acc}</span>
                          {included ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5 opacity-40" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Physical Device Inspection Notes */}
                <div>
                  <label className={lbl}>Physical Device Inspection Notes (Shown to Buyers)</label>
                  <textarea
                    className={`${inp} min-h-20 resize-y`}
                    value={form.deviceNotes ?? ''}
                    onChange={e => setField('deviceNotes', e.target.value)}
                    placeholder="e.g. Pristine front glass, 100% original OLED screen, faint micro-scratch on bottom speaker grill, verified non-repaired OEM motherboard."
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-800/20 rounded-2xl border border-dashed border-gray-700 text-gray-400">
                <p className="text-sm font-semibold">This product is currently configured as Brand New.</p>
                <p className="text-xs text-gray-500 mt-1">
                  Toggle "Sell as Certified Pre-Owned" above to configure condition grade, battery health, warranty, and inspection points.
                </p>
              </div>
            )}
          </div>
        );

      // ── IMAGES ─────────────────────────────────────────────────────────────
      case 'Images': {
        const validImages = form.images.filter(img => img.trim().length > 0);
        return (
          <div className="space-y-6 max-w-3xl">
            {/* Direct Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 hover:border-[#E30613] bg-gray-800/40 hover:bg-gray-800/80 rounded-2xl p-6 text-center cursor-pointer transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-14 h-14 rounded-full bg-red-950/50 text-[#E30613] group-hover:bg-[#E30613] group-hover:text-white flex items-center justify-center mx-auto mb-3 transition-colors shadow-inner">
                <Upload className="w-7 h-7" />
              </div>
              <div className="text-white font-bold text-base">
                {isUploading ? 'Compressing & Uploading Photos...' : 'Upload Photos from Computer / Phone'}
              </div>
              <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                Select PNG, JPG, or WebP. Automatically optimized client-side to prevent storage limits. Ideal for showing front, back, and sides of second-hand devices!
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-gray-700/60 text-gray-300 rounded-full text-xs font-semibold">
                <ImageIcon className="w-3.5 h-3.5 text-yellow-400" />
                <span>Supports multiple file selection</span>
              </div>
            </div>

            {uploadMsg && (
              <div className="flex items-center gap-2 p-3 bg-emerald-950/50 border border-emerald-600/50 rounded-xl text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{uploadMsg}</span>
              </div>
            )}

            {/* Current Images Gallery / Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={lbl}>Current Product Images ({validImages.length})</label>
                <span className="text-[11px] text-gray-400">First image is the primary cover image</span>
              </div>

              {validImages.length === 0 ? (
                <div className="p-6 text-center bg-gray-800/30 rounded-xl border border-gray-700/60 text-gray-400 text-xs">
                  No images uploaded yet. Upload device photos above or paste an image URL below.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {validImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative group bg-gray-900 rounded-xl overflow-hidden border-2 transition-all ${
                        idx === 0 ? 'border-[#E30613] shadow-md shadow-red-950/40' : 'border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="aspect-square bg-gray-800 flex items-center justify-center overflow-hidden">
                        <img
                          src={img}
                          alt={`Product photo ${idx + 1}`}
                          className="w-full h-full object-contain"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/202020/white?text=Broken+Image'; }}
                        />
                      </div>

                      {/* Badges */}
                      {idx === 0 && (
                        <div className="absolute top-2 left-2 bg-[#E30613] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                          ★ Main Photo
                        </div>
                      )}

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...validImages];
                              const [moved] = list.splice(idx, 1);
                              list.unshift(moved);
                              setField('images', list);
                            }}
                            className="w-full py-1 px-2 bg-[#E30613] hover:bg-red-700 text-white rounded text-[10px] font-bold shadow"
                          >
                            Set as Main
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const list = validImages.filter((_, j) => j !== idx);
                            setField('images', list.length > 0 ? list : ['']);
                          }}
                          className="w-full py-1 px-2 bg-red-900/80 hover:bg-red-800 text-red-200 rounded text-[10px] font-bold flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Manual Image URL Inputs */}
            <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Add Image by Web URL</span>
                <button
                  type="button"
                  onClick={() => setField('images', [...form.images, ''])}
                  className="flex items-center gap-1 text-xs text-[#E30613] hover:text-red-400 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add URL Field
                </button>
              </div>
              <div className="space-y-2">
                {form.images.map((img, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs w-5 shrink-0">{i + 1}</span>
                    <input
                      className={`${inp} flex-1 text-xs`}
                      value={img}
                      onChange={e => {
                        const imgs = [...form.images];
                        imgs[i] = e.target.value;
                        setField('images', imgs);
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    {form.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setField('images', form.images.filter((_, j) => j !== i))}
                        className="text-red-500 hover:text-red-400 p-1.5 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // ── VARIANTS ───────────────────────────────────────────────────────────
      case 'Variants':
        return (
          <div className="space-y-7 max-w-2xl">
            {/* Color Variants */}
            <div>
              <label className={lbl}>Color Variants</label>
              <div className="space-y-2 mt-1">
                {(form.colorVariants ?? []).map((cv, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className={`${inp} flex-1`}
                      value={cv.name}
                      onChange={e => {
                        const arr = [...(form.colorVariants ?? [])];
                        arr[i] = { ...arr[i], name: e.target.value };
                        setField('colorVariants', arr);
                      }}
                      placeholder="Color name, e.g. Midnight Blue"
                    />
                    <input
                      type="color"
                      value={cv.hex ?? '#000000'}
                      onChange={e => {
                        const arr = [...(form.colorVariants ?? [])];
                        arr[i] = { ...arr[i], hex: e.target.value };
                        setField('colorVariants', arr);
                      }}
                      className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer shrink-0"
                      title="Pick color"
                    />
                    <button
                      type="button"
                      onClick={() => setField('colorVariants', (form.colorVariants ?? []).filter((_, j) => j !== i))}
                      className="text-red-500 hover:text-red-400 p-1.5 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setField('colorVariants', [...(form.colorVariants ?? []), { name: '', hex: '#000000' }])}
                  className="flex items-center gap-1.5 text-[#E30613] hover:text-red-400 text-sm font-bold mt-1"
                >
                  <Plus className="w-4 h-4" /> Add Color
                </button>
              </div>
            </div>

            {/* Storage Variants */}
            <div>
              <label className={lbl}>Storage Variants</label>
              <div className="space-y-2 mt-1">
                {(form.storageVariants ?? []).map((sv, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className={`${inp} max-w-xs`}
                      value={sv}
                      onChange={e => {
                        const arr = [...(form.storageVariants ?? [])];
                        arr[i] = e.target.value;
                        setField('storageVariants', arr);
                      }}
                      placeholder="e.g. 128 GB"
                    />
                    <button
                      type="button"
                      onClick={() => setField('storageVariants', (form.storageVariants ?? []).filter((_, j) => j !== i))}
                      className="text-red-500 hover:text-red-400 p-1.5 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setField('storageVariants', [...(form.storageVariants ?? []), ''])}
                  className="flex items-center gap-1.5 text-[#E30613] hover:text-red-400 text-sm font-bold mt-1"
                >
                  <Plus className="w-4 h-4" /> Add Storage Option
                </button>
              </div>
            </div>
          </div>
        );

      // ── FLAGS ──────────────────────────────────────────────────────────────
      case 'Flags':
        return (
          <div className="space-y-3 max-w-md">
            {[
              { key: 'isFeatured' as const, label: 'Featured', desc: 'Shows in the Featured Products section on homepage' },
              { key: 'isBestDeal' as const, label: 'Best Deal', desc: 'Shows in Best Deals / Hot Deals sections' },
              { key: 'isPopular' as const, label: 'Popular', desc: 'Shows in Popular / Trending sections' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3.5">
                <div>
                  <div className="text-white font-semibold text-sm">{label}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{desc}</div>
                </div>
                <Toggle value={!!form[key]} onChange={v => setField(key, v)} />
              </div>
            ))}
            <div className="pt-2">
              <label className={lbl}>Badge Label (shown on product card)</label>
              <input
                className={inp}
                value={form.badge ?? ''}
                onChange={e => setField('badge', e.target.value)}
                placeholder="e.g. Best Seller, New Launch, Popular Choice"
              />
            </div>
          </div>
        );

      // ── EMI ────────────────────────────────────────────────────────────────
      case 'EMI': {
        const plans: EmiPlanForm[] = form.emiPlans ?? [];
        return (
          <div className="space-y-4 max-w-3xl">
            <p className="text-xs text-gray-400">Add bank-wise EMI plans for this product. These will appear on the product detail page.</p>
            {plans.map((plan, i) => (
              <div key={i} className="bg-gray-800/60 border border-gray-700 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">EMI Plan {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => setField('emiPlans', plans.filter((_, j) => j !== i))}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="col-span-2 md:col-span-1">
                    <label className={lbl}>Bank Name</label>
                    <input
                      className={inp}
                      value={plan.bank}
                      onChange={e => {
                        const arr = [...plans];
                        arr[i] = { ...arr[i], bank: e.target.value };
                        setField('emiPlans', arr);
                      }}
                      placeholder="e.g. HDFC Bank"
                    />
                  </div>
                  <div>
                    <label className={lbl}>Tenure (months)</label>
                    <select
                      className={inp}
                      value={plan.tenureMonths}
                      onChange={e => {
                        const arr = [...plans];
                        arr[i] = { ...arr[i], tenureMonths: parseInt(e.target.value) };
                        setField('emiPlans', arr);
                      }}
                    >
                      {[3, 6, 9, 12, 18, 24].map(t => <option key={t} value={t}>{t} months</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Monthly EMI (₹)</label>
                    <input
                      className={inp}
                      type="number"
                      min={0}
                      value={plan.monthlyEmi || ''}
                      onChange={e => {
                        const arr = [...plans];
                        arr[i] = { ...arr[i], monthlyEmi: parseInt(e.target.value) || 0 };
                        setField('emiPlans', arr);
                      }}
                      placeholder="e.g. 8333"
                    />
                  </div>
                  <div>
                    <label className={lbl}>Interest Rate (%)</label>
                    <input
                      className={inp}
                      type="number"
                      min={0}
                      step={0.1}
                      value={plan.interestRate || ''}
                      onChange={e => {
                        const arr = [...plans];
                        arr[i] = { ...arr[i], interestRate: parseFloat(e.target.value) || 0 };
                        setField('emiPlans', arr);
                      }}
                      placeholder="0 for no-cost"
                    />
                  </div>
                  <div>
                    <label className={lbl}>Total Cost (₹)</label>
                    <input
                      className={inp}
                      type="number"
                      min={0}
                      value={plan.totalCost || ''}
                      onChange={e => {
                        const arr = [...plans];
                        arr[i] = { ...arr[i], totalCost: parseInt(e.target.value) || 0 };
                        setField('emiPlans', arr);
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SmallToggle
                    value={plan.isNoCost}
                    onChange={v => {
                      const arr = [...plans];
                      arr[i] = { ...arr[i], isNoCost: v };
                      setField('emiPlans', arr);
                    }}
                    color="bg-emerald-500"
                  />
                  <span className="text-xs text-gray-300 font-semibold">No-Cost EMI</span>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setField('emiPlans', [...plans, {
                bank: '', tenureMonths: 6, interestRate: 0,
                monthlyEmi: 0, totalCost: form.price, isNoCost: true
              }])}
              className="flex items-center gap-2 text-[#E30613] hover:text-red-400 text-sm font-bold"
            >
              <Plus className="w-4 h-4" /> Add EMI Plan
            </button>
          </div>
        );
      }

      // ── SPECS ──────────────────────────────────────────────────────────────
      case 'Specs':
        return (
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs text-gray-400">Enter product specifications as key-value pairs.</p>
            {specRows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={`${inp} flex-1`}
                  value={row.key}
                  onChange={e => {
                    const arr = [...specRows];
                    arr[i] = { ...arr[i], key: e.target.value };
                    setSpecRows(arr);
                  }}
                  placeholder="Spec name, e.g. Display Size"
                />
                <input
                  className={`${inp} flex-1`}
                  value={row.value}
                  onChange={e => {
                    const arr = [...specRows];
                    arr[i] = { ...arr[i], value: e.target.value };
                    setSpecRows(arr);
                  }}
                  placeholder="Value, e.g. 6.7 inch AMOLED"
                />
                <button
                  type="button"
                  onClick={() => setSpecRows(specRows.filter((_, j) => j !== i))}
                  className="text-red-500 hover:text-red-400 p-1.5 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSpecRows([...specRows, { key: '', value: '' }])}
              className="flex items-center gap-1.5 text-[#E30613] hover:text-red-400 text-sm font-bold"
            >
              <Plus className="w-4 h-4" /> Add Specification
            </button>
          </div>
        );

      // ── HIGHLIGHTS ─────────────────────────────────────────────────────────
      case 'Highlights':
        return (
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs text-gray-400">Bullet points shown on the product page under key highlights.</p>
            {form.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-gray-500 text-xs w-5 shrink-0">{i + 1}</span>
                <input
                  className={`${inp} flex-1`}
                  value={h}
                  onChange={e => {
                    const arr = [...form.highlights];
                    arr[i] = e.target.value;
                    setField('highlights', arr);
                  }}
                  placeholder={`Highlight ${i + 1}, e.g. 50MP Triple Camera System`}
                />
                {form.highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setField('highlights', form.highlights.filter((_, j) => j !== i))}
                    className="text-red-500 hover:text-red-400 p-1.5 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setField('highlights', [...form.highlights, ''])}
              className="flex items-center gap-1.5 text-[#E30613] hover:text-red-400 text-sm font-bold"
            >
              <Plus className="w-4 h-4" /> Add Highlight
            </button>
          </div>
        );

      case 'Related': {
        const selectedIds = form.relatedProductIds ?? [];
        const selectedProducts = allCatalogProducts.filter(p => selectedIds.includes(p.id));
        const filteredCatalog = allCatalogProducts.filter(p => 
          p.name.toLowerCase().includes(relatedSearch.toLowerCase()) ||
          p.brand.toLowerCase().includes(relatedSearch.toLowerCase()) ||
          p.category.toLowerCase().includes(relatedSearch.toLowerCase())
        );

        const toggleProduct = (prodId: string) => {
          if (selectedIds.includes(prodId)) {
            setField('relatedProductIds', selectedIds.filter(x => x !== prodId));
          } else {
            setField('relatedProductIds', [...selectedIds, prodId]);
          }
        };

        const autoPickSameCategory = () => {
          const sameCatIds = allCatalogProducts
            .filter(p => p.category === form.category)
            .slice(0, 4)
            .map(p => p.id);
          setField('relatedProductIds', sameCatIds);
        };

        const autoPickSameBrand = () => {
          const sameBrandIds = allCatalogProducts
            .filter(p => p.brand.toLowerCase() === form.brand.toLowerCase())
            .slice(0, 4)
            .map(p => p.id);
          setField('relatedProductIds', sameBrandIds);
        };

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-700/60">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Configure Related Products
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Select which products to showcase in the "Related Products" section on this product's detail page.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={autoPickSameCategory}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                >
                  ⚡ Auto-Pick Same Category
                </button>
                <button
                  type="button"
                  onClick={autoPickSameBrand}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                >
                  🏷️ Auto-Pick Same Brand
                </button>
                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setField('relatedProductIds', [])}
                    className="text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Currently Selected Products Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-300">
                  Selected Related Products ({selectedIds.length})
                </span>
                <span className="text-gray-500 text-[11px]">
                  {selectedIds.length === 0 ? 'Automatic fallback: same category' : 'Custom selection active'}
                </span>
              </div>

              {selectedProducts.length === 0 ? (
                <div className="p-5 rounded-xl border border-dashed border-gray-700 text-center text-xs text-gray-500 bg-gray-900/20">
                  No specific products selected. The storefront will automatically display 4 products from the same category ({form.category}).
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {selectedProducts.map(p => (
                    <div
                      key={p.id}
                      className="bg-gray-800/80 border border-red-500/40 rounded-xl p-3 flex items-center justify-between gap-2 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 object-contain p-1 rounded bg-gray-900 border border-gray-700 shrink-0"
                        />
                        <div className="truncate">
                          <p className="text-white font-bold text-xs truncate">{p.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">₹{p.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleProduct(p.id)}
                        className="text-gray-400 hover:text-red-400 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Catalog Search and Selection */}
            <div className="space-y-3 pt-4 border-t border-gray-700/60">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="font-bold text-xs text-gray-300">Available Products in Catalog</span>
                <input
                  type="text"
                  value={relatedSearch}
                  onChange={e => setRelatedSearch(e.target.value)}
                  placeholder="Search catalog by name or brand..."
                  className="bg-gray-800 border border-gray-700 text-xs text-white rounded-lg px-3 py-1.5 w-64 focus:ring-1 focus:ring-[#E30613] focus:outline-none"
                />
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-800 border border-gray-700 rounded-xl bg-gray-900/40 pr-1">
                {filteredCatalog.map(p => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleProduct(p.id)}
                      className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-red-950/20 hover:bg-red-950/30' : 'hover:bg-gray-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 object-contain p-1 rounded bg-gray-800 border border-gray-700 shrink-0"
                        />
                        <div className="truncate">
                          <p className="text-white font-bold text-xs truncate">{p.name}</p>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">
                            {p.brand} • {p.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-mono font-bold text-xs text-gray-200">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-[#E30613] border-[#E30613] text-white'
                              : 'border-gray-600 bg-gray-800 text-transparent hover:border-gray-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="text-gray-400 hover:text-white p-1.5 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">{isNew ? 'Add New Product' : 'Edit Product'}</h1>
            {!isNew && <p className="text-xs text-gray-400 mt-0.5">{form.name}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
            saved ? 'bg-emerald-600 text-white' : 'bg-[#E30613] hover:bg-[#c40510] text-white'
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : (isNew ? 'Create Product' : 'Save Changes')}
        </button>
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 space-y-1.5">
          <div className="text-red-300 font-bold text-xs mb-1">Please fix the following:</div>
          {errors.map((e, i) => (
            <div key={i} className="flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{e}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 overflow-hidden">
        {/* Tab bar */}
        <div className="flex overflow-x-auto border-b border-gray-700/50 bg-gray-800/30 scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'text-white border-[#E30613] bg-gray-800/40'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30 border-transparent'
              }`}
            >
              <span>{tab}</span>
              {tab === '2nd Hand' && form.isSecondHand && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs animate-pulse" title="Pre-Owned Enabled" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5 md:p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Bottom Save button */}
      <div className="flex justify-end pb-4">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#E30613] hover:bg-[#c40510] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-md"
        >
          <Save className="w-4 h-4" />
          {isNew ? 'Create Product' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};
