import React, { useState } from 'react';
import { adminLogin, isAdminLoggedIn } from '../data/adminData';
import { ShieldCheck, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  onSuccess: () => void;
}

// SEC-003 FIX: AdminLogin now calls the backend via adminLogin() (async fetch),
// which returns a JWT that is verified server-side on every subsequent request.
// The hardcoded password 'vinod67@' and localStorage session flag are removed.
export const AdminLogin: React.FC<Props> = ({ onSuccess }) => {
  const [email, setEmail] = useState('karangehlot5686@gmail.com');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await adminLogin(email, password);
    setLoading(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B2430] via-[#202D3B] to-[#111820] flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden ${shaking ? 'animate-shake' : ''}`}
        style={{ animation: shaking ? 'shake 0.5s ease' : undefined }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#E30613] to-[#c40510] px-8 py-7 text-white text-center">
          <img
            src="/images/logo.png"
            alt="Shivangi Mobile Sumerpur"
            className="w-16 h-16 object-contain rounded-full bg-white p-1 shadow-lg border-2 border-white/80 mx-auto mb-3"
          />
          <h1 className="text-xl font-black tracking-wide">Admin Portal</h1>
          <p className="text-red-100 text-xs mt-1">Shivangi Mobile — Sumerpur (Rajasthan)</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
              Admin Email ID
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="karangehlot5686@gmail.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter admin password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                autoFocus
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E30613] hover:bg-[#c40510] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors shadow-md text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying…
              </>
            ) : (
              'Login to Admin'
            )}
          </button>

          <p className="text-center text-[11px] text-gray-400">
            This panel is for authorized store administrators only.
          </p>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.5s ease; }
      `}</style>
    </div>
  );
};

// Guard component — shows login if not authenticated
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authed, setAuthed] = React.useState(isAdminLoggedIn);

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }
  return <>{children}</>;
};
