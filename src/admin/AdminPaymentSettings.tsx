import React, { useState, useRef } from 'react';
import {
  QrCode,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
  ShieldCheck,
  Banknote,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { loadPaymentSettings, savePaymentSettings } from '../data/adminData';
import { PaymentSettings } from '../types';
import { uploadToCloudinary } from '../utils/cloudinaryService';
import { compressImageFile } from '../utils/imageCompressor';

const inputCls = "w-full bg-gray-800 text-gray-200 text-sm rounded-xl px-3.5 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E30613] placeholder-gray-500";
const labelCls = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

export const AdminPaymentSettings: React.FC = () => {
  const [settings, setSettings] = useState<PaymentSettings>(() => loadPaymentSettings());
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const result = await uploadToCloudinary(file);
      if (result?.url) {
        setSettings((prev: PaymentSettings) => ({ ...prev, qrCodeImage: result.url }));
      } else {
        const compressed = await compressImageFile(file, { maxDimension: 1000, quality: 0.9 });
        setSettings((prev: PaymentSettings) => ({ ...prev, qrCodeImage: compressed }));
      }
    } catch (err: any) {
      console.error('Failed to upload QR code image', err);
      setUploadError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const generateDynamicQr = () => {
    if (!settings.upiId.trim()) return;
    const upiUri = `upi://pay?pa=${encodeURIComponent(settings.upiId.trim())}&pn=${encodeURIComponent(settings.payeeName.trim() || 'Shivangi Mobile')}&cu=INR`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(upiUri)}`;
    setSettings((prev: PaymentSettings) => ({ ...prev, qrCodeImage: qrUrl }));
  };

  const copyUpi = () => {
    if (!settings.upiId) return;
    navigator.clipboard.writeText(settings.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#E30613]/10 text-[#E30613]">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">QR Scanner & Payment Settings</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Configure your store UPI scanner, accepted payment methods, and customer instructions.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Payment Method Toggles */}
          <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 p-5 space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E30613]" /> Active Payment Methods
            </h3>

            {/* Scanner Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-800/60 border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-200">UPI QR Scanner</div>
                  <div className="text-[11px] text-gray-400">Customer scans QR code & uploads payment screenshot</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableQrScanner}
                  onChange={e => setSettings({ ...settings, enableQrScanner: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E30613]"></div>
              </label>
            </div>

            {/* COD Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-800/60 border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-200">Cash on Delivery (COD)</div>
                  <div className="text-[11px] text-gray-400">Customer pays upon receiving their parcel</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableCod}
                  onChange={e => setSettings({ ...settings, enableCod: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E30613]"></div>
              </label>
            </div>
          </div>

          {/* UPI Account Details */}
          <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 p-5 space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#E30613]" /> Shop UPI Details
            </h3>

            <div>
              <label className={labelCls}>Store UPI ID / VPA *</label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.upiId}
                  onChange={e => setSettings({ ...settings, upiId: e.target.value })}
                  placeholder="e.g. shivangimobile@upi or 78419769690@paytm"
                  className={`${inputCls} font-mono`}
                  required
                />
                <button
                  type="button"
                  onClick={copyUpi}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs flex items-center gap-1 bg-gray-700/60 px-2.5 py-1 rounded-md"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">This UPI ID is displayed to customers for manual payment or copying.</p>
            </div>

            <div>
              <label className={labelCls}>Account / Payee Name *</label>
              <input
                type="text"
                value={settings.payeeName}
                onChange={e => setSettings({ ...settings, payeeName: e.target.value })}
                placeholder="e.g. Shivangi Mobile Showroom"
                className={inputCls}
                required
              />
              <p className="text-[11px] text-gray-500 mt-1">Beneficiary name registered with your UPI bank.</p>
            </div>

            <div>
              <label className={labelCls}>Customer Payment Instructions</label>
              <textarea
                value={settings.instructions}
                onChange={e => setSettings({ ...settings, instructions: e.target.value })}
                rows={3}
                placeholder="Instructions shown to customer during checkout..."
                className={inputCls}
              />
            </div>
          </div>

          {/* QR Code Upload / Generator */}
          <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 p-5 space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#E30613]" /> Scanner QR Code Image
            </h3>

            <div>
              <label className={labelCls}>QR Image URL or Upload</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.qrCodeImage}
                  onChange={e => setSettings({ ...settings, qrCodeImage: e.target.value })}
                  placeholder="https://... or upload image below"
                  className={`${inputCls} font-mono text-xs`}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {uploadError && (
              <div className="text-xs text-red-400 bg-red-950/40 border border-red-800/50 p-2.5 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={generateDynamicQr}
                className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 bg-red-950/40 border border-red-800/40 px-3.5 py-2 rounded-xl transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Generate QR from UPI ID</span>
              </button>
              <span className="text-[11px] text-gray-500">Generates instant standard UPI QR code</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-[#E30613] hover:bg-[#c40510] text-white px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Settings Saved!' : 'Save Payment Settings'}</span>
            </button>
            {saved && (
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Updated & synchronized with checkout!
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Live Customer Checkout Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-gray-400" />
            <span>Customer Checkout Preview</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-200 text-gray-900 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#E30613]" />
                <span className="font-black text-sm text-gray-900">Scan & Pay with Any UPI App</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Active
              </span>
            </div>

            {/* QR Scanner Card */}
            <div className="bg-gradient-to-b from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center space-y-3">
              <div className="w-44 h-44 mx-auto bg-white p-2 rounded-xl shadow-md border border-gray-200 flex items-center justify-center overflow-hidden">
                {settings.qrCodeImage ? (
                  <img
                    src={settings.qrCodeImage}
                    alt="Store QR Scanner"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-xs flex flex-col items-center gap-1">
                    <QrCode className="w-10 h-10 text-gray-300" />
                    <span>Upload QR Image</span>
                  </div>
                )}
              </div>

              <div>
                <div className="font-mono text-xs font-black text-gray-900 bg-white border border-gray-200 py-1.5 px-3 rounded-lg inline-flex items-center gap-2">
                  <span>{settings.upiId || 'yourstore@upi'}</span>
                  <Copy className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                </div>
                <div className="text-[11px] text-gray-500 font-semibold mt-1">
                  Payee: <strong className="text-gray-800">{settings.payeeName || 'Store Name'}</strong>
                </div>
              </div>

              <div className="text-[11px] text-gray-600 bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-left leading-relaxed">
                ℹ️ {settings.instructions}
              </div>
            </div>

            {/* Upload Screenshot Preview Box */}
            <div className="border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50/50 text-center space-y-1">
              <div className="text-xs font-bold text-gray-800 flex items-center justify-center gap-1">
                <Upload className="w-3.5 h-3.5 text-[#E30613]" />
                <span>Upload Payment Screenshot</span>
              </div>
              <p className="text-[10px] text-gray-500">
                Customer attaches screenshot here for admin verification.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
