import React, { useState } from 'react';
import { Plus, Trash2, Edit, Save, X, CheckCircle2 } from 'lucide-react';
import { loadBankOffers, saveBankOffers, loadHeroSlides, saveHeroSlides, loadCoupons, saveCoupons, BankOffer, Coupon } from '../data/adminData';
import { HeroSlide } from '../data/offers';

const inputCls = "w-full bg-gray-800 text-gray-200 text-sm rounded-xl px-3.5 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E30613] placeholder-gray-500";
const labelCls = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

// ─── Bank Offers ───────────────────────────────────────────────────────────────
const BankOffersSection: React.FC = () => {
  const [offers, setOffers] = useState<BankOffer[]>(() => loadBankOffers());
  const [editing, setEditing] = useState<BankOffer | null>(null);
  const [saved, setSaved] = useState(false);

  const save = (list: BankOffer[]) => {
    saveBankOffers(list);
    setOffers(list);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleSave = () => {
    if (!editing) return;
    const exists = offers.find(o => o.id === editing.id);
    save(exists ? offers.map(o => o.id === editing.id ? editing : o) : [...offers, editing]);
    setEditing(null);
  };

  const del = (id: string) => save(offers.filter(o => o.id !== id));
  const newOffer = (): BankOffer => ({ id: `offer-${Date.now()}`, bank: '', badge: '', title: '', description: '', code: '' });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-sm">Bank Offers</h3>
        <button onClick={() => setEditing(newOffer())} className="flex items-center gap-1.5 bg-[#E30613] hover:bg-[#c40510] text-white px-3 py-1.5 rounded-xl text-xs font-bold">
          <Plus className="w-3.5 h-3.5" /> Add Offer
        </button>
      </div>
      <div className="space-y-2.5">
        {offers.map(o => (
          <div key={o.id} className="bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">{o.title || '(Untitled)'}</div>
              <div className="text-gray-400 text-xs mt-0.5">{o.bank} · Code: <span className="font-mono text-yellow-400">{o.code}</span></div>
            </div>
            <button onClick={() => setEditing({ ...o })} className="text-gray-400 hover:text-[#E30613] p-1.5"><Edit className="w-4 h-4" /></button>
            <button onClick={() => del(o.id)} className="text-gray-400 hover:text-red-500 p-1.5"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {offers.length === 0 && <div className="text-gray-500 text-xs text-center py-4">No bank offers. Add one above.</div>}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#1B2430] border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-black">{offers.find(o => o.id === editing.id) ? 'Edit' : 'New'} Bank Offer</h4>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            {(['bank', 'badge', 'title', 'description', 'code'] as (keyof BankOffer)[]).map(field => (
              <div key={field}>
                <label className={labelCls}>{field}</label>
                <input className={inputCls} value={(editing as any)[field]} onChange={e => setEditing({ ...editing, [field]: e.target.value })} placeholder={field} />
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={() => setEditing(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2.5 rounded-xl font-bold text-sm">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-[#E30613] hover:bg-[#c40510] text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Coupons ──────────────────────────────────────────────────────────────────
const CouponsSection: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadCoupons());
  const [editing, setEditing] = useState<Coupon | null>(null);

  const save = (list: Coupon[]) => { saveCoupons(list); setCoupons(list); };
  const handleSave = () => {
    if (!editing) return;
    const exists = coupons.find(c => c.code === editing.code);
    save(exists ? coupons.map(c => c.code === editing.code ? editing : c) : [...coupons, editing]);
    setEditing(null);
  };
  const newCoupon = (): Coupon => ({ code: '', discountAmount: 0, minCartValue: 0, description: '' });
  const del = (code: string) => save(coupons.filter(c => c.code !== code));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-sm">Discount Coupons</h3>
        <button onClick={() => setEditing(newCoupon())} className="flex items-center gap-1.5 bg-[#E30613] hover:bg-[#c40510] text-white px-3 py-1.5 rounded-xl text-xs font-bold">
          <Plus className="w-3.5 h-3.5" /> Add Coupon
        </button>
      </div>
      <div className="space-y-2.5">
        {coupons.map(c => (
          <div key={c.code} className="bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-mono text-yellow-400 font-bold text-sm">{c.code}</div>
              <div className="text-gray-400 text-xs mt-0.5">₹{c.discountAmount} OFF · Min ₹{c.minCartValue}</div>
              <div className="text-gray-500 text-[11px] mt-0.5">{c.description}</div>
            </div>
            <button onClick={() => setEditing({ ...c })} className="text-gray-400 hover:text-[#E30613] p-1.5"><Edit className="w-4 h-4" /></button>
            <button onClick={() => del(c.code)} className="text-gray-400 hover:text-red-500 p-1.5"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#1B2430] border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-black">Coupon</h4>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className={labelCls}>Coupon Code</label>
              <input className={inputCls} value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value.toUpperCase() })} placeholder="e.g. SAVE500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Discount Amount (₹)</label>
                <input className={inputCls} type="number" value={editing.discountAmount} onChange={e => setEditing({ ...editing, discountAmount: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className={labelCls}>Min Cart Value (₹)</label>
                <input className={inputCls} type="number" value={editing.minCartValue} onChange={e => setEditing({ ...editing, minCartValue: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <input className={inputCls} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Brief description" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditing(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2.5 rounded-xl font-bold text-sm">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-[#E30613] hover:bg-[#c40510] text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Hero Slides ──────────────────────────────────────────────────────────────
const HeroSlidesSection: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(() => loadHeroSlides());
  const [editing, setEditing] = useState<HeroSlide | null>(null);

  const save = (list: HeroSlide[]) => { saveHeroSlides(list); setSlides(list); };
  const handleSave = () => {
    if (!editing) return;
    const exists = slides.find(s => s.id === editing.id);
    save(exists ? slides.map(s => s.id === editing.id ? editing : s) : [...slides, editing]);
    setEditing(null);
  };
  const del = (id: string) => save(slides.filter(s => s.id !== id));
  const newSlide = (): HeroSlide => ({ id: `slide-${Date.now()}`, badge: '', title: '', subtitle: '', ctaText: 'Shop Now', ctaLink: '/', bgColor: 'from-[#E30613] to-[#c40510]', accentColor: '#FFD700', image: '', tag: '' });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-sm">Hero Banner Slides</h3>
        <button onClick={() => setEditing(newSlide())} className="flex items-center gap-1.5 bg-[#E30613] hover:bg-[#c40510] text-white px-3 py-1.5 rounded-xl text-xs font-bold">
          <Plus className="w-3.5 h-3.5" /> Add Slide
        </button>
      </div>
      <div className="space-y-2.5">
        {slides.map((s, i) => (
          <div key={s.id} className="bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3">
            {s.image && <img src={s.image} alt={s.title} className="w-14 h-10 rounded-lg object-cover bg-gray-700 shrink-0" />}
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">{s.title || '(Untitled Slide)'}</div>
              <div className="text-gray-400 text-xs mt-0.5">{s.badge} · {s.ctaLink}</div>
            </div>
            <button onClick={() => setEditing({ ...s })} className="text-gray-400 hover:text-[#E30613] p-1.5"><Edit className="w-4 h-4" /></button>
            <button onClick={() => del(s.id)} className="text-gray-400 hover:text-red-500 p-1.5"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1B2430] border border-gray-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 my-4">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-black">Hero Slide</h4>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            {([
              { key: 'badge', label: 'Badge', placeholder: 'e.g. SUPERFESTIVAL SPECIAL' },
              { key: 'title', label: 'Title', placeholder: 'Main heading' },
              { key: 'subtitle', label: 'Subtitle', placeholder: 'Supporting text' },
              { key: 'ctaText', label: 'CTA Button Text', placeholder: 'e.g. Shop Now' },
              { key: 'ctaLink', label: 'CTA Link', placeholder: '/shop/smartphones' },
              { key: 'image', label: 'Image URL', placeholder: 'https://...' },
              { key: 'tag', label: 'Tag (small text)', placeholder: 'e.g. 90 MIN DELIVERY' },
              { key: 'bgColor', label: 'Bg Gradient (Tailwind)', placeholder: 'from-[#E30613] to-[#c40510]' },
            ] as Array<{ key: keyof HeroSlide; label: string; placeholder: string }>).map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input className={inputCls} value={(editing as any)[key] ?? ''} onChange={e => setEditing({ ...editing, [key]: e.target.value })} placeholder={placeholder} />
              </div>
            ))}
            {editing.image && <img src={editing.image} alt="Preview" className="w-full h-28 object-cover rounded-xl bg-gray-800" />}
            <div className="flex gap-3">
              <button onClick={() => setEditing(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2.5 rounded-xl font-bold text-sm">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-[#E30613] hover:bg-[#c40510] text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const AdminOffers: React.FC = () => (
  <div className="space-y-8 max-w-3xl">
    <div>
      <h1 className="text-xl font-black text-white">Offers & Banners</h1>
      <p className="text-sm text-gray-400 mt-0.5">Manage hero slides, bank offers, and discount coupons</p>
    </div>

    <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 p-5">
      <HeroSlidesSection />
    </div>

    <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 p-5">
      <BankOffersSection />
    </div>

    <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 p-5">
      <CouponsSection />
    </div>
  </div>
);
