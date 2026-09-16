import React, { useState } from 'react';
import { Save, CheckCircle2, MapPin } from 'lucide-react';
import { loadStore, saveStore } from '../data/adminData';
import { Store } from '../types';

const inputCls = "w-full bg-gray-800 text-gray-200 text-sm rounded-xl px-3.5 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E30613] placeholder-gray-500";
const labelCls = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

export const AdminStore: React.FC = () => {
  const [form, setForm] = useState<Store>(() => loadStore());
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof Store>(key: K, value: Store[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSave = () => {
    saveStore(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const mapsUrl = `https://www.google.com/maps?q=${form.lat},${form.lng}`;

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-white">Store Info</h1>
          <p className="text-sm text-gray-400 mt-0.5">Edit your store's contact details and location</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            saved ? 'bg-emerald-600 text-white' : 'bg-[#E30613] hover:bg-[#c40510] text-white'
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Store Info'}
        </button>
      </div>

      <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 p-6 space-y-5">
        <div>
          <label className={labelCls}>Store Name</label>
          <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Shivangi Mobile - Adoni Outlet" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>City</label>
            <input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Adoni" />
          </div>
          <div>
            <label className={labelCls}>State</label>
            <input className={inputCls} value={form.state} onChange={e => set('state', e.target.value)} placeholder="Andhra Pradesh" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Full Address</label>
          <textarea className={`${inputCls} min-h-20 resize-y`} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street address, landmark, pincode..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} placeholder="store@example.com" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Opening Hours</label>
          <input className={inputCls} value={form.hours} onChange={e => set('hours', e.target.value)} placeholder="10:00 AM - 9:30 PM (All Days)" />
        </div>

        <div>
          <div className={labelCls}>GPS Coordinates (for map pin)</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input className={inputCls} type="number" step={0.0001} value={form.lat} onChange={e => set('lat', parseFloat(e.target.value) || 0)} placeholder="Latitude, e.g. 15.6322" />
              <div className="text-[11px] text-gray-500 mt-1">Latitude</div>
            </div>
            <div>
              <input className={inputCls} type="number" step={0.0001} value={form.lng} onChange={e => set('lng', parseFloat(e.target.value) || 0)} placeholder="Longitude, e.g. 77.2728" />
              <div className="text-[11px] text-gray-500 mt-1">Longitude</div>
            </div>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#E30613] hover:underline font-semibold"
          >
            <MapPin className="w-3.5 h-3.5" /> Preview on Google Maps ↗
          </a>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 p-5">
        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3">Store Card Preview</div>
        <div className="bg-white rounded-xl p-4 text-gray-800">
          <div className="font-black text-base text-[#E30613] leading-tight">{form.name || 'Store Name'}</div>
          <div className="text-xs text-gray-500 mt-1 flex items-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#E30613] mt-0.5 shrink-0" />
            <span>{form.address || 'Address not set'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-600">
            <div>📞 {form.phone}</div>
            <div>⏰ {form.hours}</div>
            <div className="col-span-2">✉️ {form.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
