import React, { useState } from 'react';
import { Eye, EyeOff, Save, AlertCircle, CheckCircle2, RotateCcw, ShieldCheck, Loader2 } from 'lucide-react';
import { changeAdminPasswordOnBackend, resetAllData } from '../data/adminData';
import { useBrand } from '../context/BrandContext';

const inputCls = "w-full bg-gray-800 text-gray-200 text-sm rounded-xl px-3.5 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E30613] placeholder-gray-500";
const labelCls = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

export const AdminSettings: React.FC = () => {
  const { brandName, setBrandName } = useBrand();
  const [localBrand, setLocalBrand] = useState(brandName);
  const [brandSaved, setBrandSaved] = useState(false);

  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSaved, setPwdSaved] = useState(false);

  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const saveBrand = () => {
    if (!localBrand.trim()) return;
    setBrandName(localBrand.trim());
    setBrandSaved(true);
    setTimeout(() => setBrandSaved(false), 2000);
  };

  const [pwdLoading, setPwdLoading] = useState(false);

  const changePassword = async () => {
    setPwdError('');
    if (!oldPwd) { setPwdError('Please enter your current password.'); return; }
    if (newPwd.length < 6) { setPwdError('New password must be at least 6 characters.'); return; }
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match.'); return; }

    setPwdLoading(true);
    try {
      const res = await changeAdminPasswordOnBackend(oldPwd, newPwd);
      if (!res.success) {
        setPwdError(res.error || 'Failed to update password.');
      } else {
        setOldPwd(''); setNewPwd(''); setConfirmPwd('');
        setPwdSaved(true);
        setTimeout(() => setPwdSaved(false), 3000);
      }
    } catch {
      setPwdError('Server connection error. Please try again.');
    } finally {
      setPwdLoading(false);
    }
  };

  const doReset = () => {
    resetAllData();
    setResetDone(true);
    setResetConfirm(false);
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-black text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage admin password, brand name, and data reset</p>
      </div>

      {/* Brand Name */}
      <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 p-6 space-y-4">
        <h3 className="text-white font-bold text-sm">Brand Name</h3>
        <div>
          <label className={labelCls}>Site-wide Brand Name</label>
          <input className={inputCls} value={localBrand} onChange={e => setLocalBrand(e.target.value)} placeholder="e.g. Shivangi Mobile" />
          <div className="text-[11px] text-gray-500 mt-1.5">This name appears in the header, footer, and page titles.</div>
        </div>
        <button
          onClick={saveBrand}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm ${brandSaved ? 'bg-emerald-600 text-white' : 'bg-[#E30613] hover:bg-[#c40510] text-white'}`}
        >
          {brandSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {brandSaved ? 'Brand Updated!' : 'Save Brand Name'}
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 p-6 space-y-4">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#E30613]" /> Change Admin Password
        </h3>
        <div>
          <label className={labelCls}>Current Password</label>
          <div className="relative">
            <input type={showOld ? 'text' : 'password'} className={`${inputCls} pr-10`} value={oldPwd} onChange={e => { setOldPwd(e.target.value); setPwdError(''); }} placeholder="••••••••" />
            <button type="button" onClick={() => setShowOld(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className={labelCls}>New Password</label>
          <div className="relative">
            <input type={showNew ? 'text' : 'password'} className={`${inputCls} pr-10`} value={newPwd} onChange={e => { setNewPwd(e.target.value); setPwdError(''); }} placeholder="Min. 4 characters" />
            <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className={labelCls}>Confirm New Password</label>
          <input type="password" className={inputCls} value={confirmPwd} onChange={e => { setConfirmPwd(e.target.value); setPwdError(''); }} placeholder="Repeat new password" />
        </div>

        {pwdError && (
          <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/40 text-red-400 rounded-xl px-3 py-2 text-xs">
            <AlertCircle className="w-3.5 h-3.5" /> {pwdError}
          </div>
        )}
        {pwdSaved && (
          <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-700/40 text-emerald-400 rounded-xl px-3 py-2 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Password updated successfully!
          </div>
        )}

        <button
          onClick={changePassword}
          disabled={pwdLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-[#E30613] hover:bg-[#c40510] disabled:opacity-50 text-white transition-colors"
        >
          {pwdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          {pwdLoading ? 'Updating Password...' : 'Update Password'}
        </button>
      </div>

      {/* Data Reset */}
      <div className="bg-[#1B2430] rounded-2xl border border-red-900/40 p-6 space-y-4">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-red-500" /> Reset All Data
        </h3>
        <p className="text-gray-400 text-xs">
          This will clear all product edits, offer changes, and store info from localStorage and restore everything to the original default values. Your admin password will be preserved.
        </p>
        {resetDone ? (
          <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-700/40 text-emerald-400 rounded-xl px-3 py-2 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Reset complete. Reloading...
          </div>
        ) : resetConfirm ? (
          <div className="space-y-3">
            <div className="text-yellow-400 text-xs font-bold bg-yellow-900/20 border border-yellow-700/40 rounded-xl px-3 py-2">
              ⚠️ Are you absolutely sure? All your edits will be lost permanently.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setResetConfirm(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2.5 rounded-xl font-bold text-sm">Cancel</button>
              <button onClick={doReset} className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm">Yes, Reset Everything</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setResetConfirm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-red-900/30 border border-red-700/40 text-red-400 hover:bg-red-800/40 transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset to Defaults
          </button>
        )}
      </div>
    </div>
  );
};
