import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mail, 
  User,
  Phone,
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Truck, 
  Sparkles,
  Lock,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authWarning, 
    authMode, 
    setAuthMode, 
    sendOtp, 
    verifyOtp 
  } = useAuth();

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state whenever modal opens or closes
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('form');
      setErrorMessage(null);
      setDemoCode(null);
      setOtpDigits(['', '', '', '', '', '']);
    }
  }, [isAuthModalOpen]);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (authMode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name to create an account.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const res = await sendOtp(cleanEmail);
    setLoading(false);

    if (res.success) {
      setStep('otp');
      // SEC-006: demoOtp is no longer returned in response body.
      // In dev mode, check browser console for the OTP code.
      setCountdown(30);
      // Auto focus first OTP input box
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Handle paste event or single digit
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pastedDigits.forEach((digit, i) => {
        if (index + i < 6) {
          newDigits[index + i] = digit;
        }
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(index + pastedDigits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const cleanVal = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto advance to next box
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const token = otpDigits.join('').trim();
    if (token.length !== 6) {
      setErrorMessage('Please enter the full 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const res = await verifyOtp(email.trim().toLowerCase(), token);
    setLoading(false);

    if (res.success) {
      // Save name and phone to local profile if this was a sign-up
      if (fullName.trim() || phone.trim()) {
        try {
          const profileRaw = localStorage.getItem('shivangi_user_profile');
          const p = profileRaw ? JSON.parse(profileRaw) : {};
          if (fullName.trim()) p.fullName = fullName.trim();
          if (phone.trim()) p.phone = phone.trim();
          localStorage.setItem('shivangi_user_profile', JSON.stringify(p));
        } catch {}
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative animate-scale-up text-gray-800">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: FORM (Sign Up or Sign In Mode) */}
        {step === 'form' && (
          <div className="space-y-4">
            {/* Mode Switcher Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-4">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-[#E30613] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account (Sign Up)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-[#E30613] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>

            {/* Modal Header */}
            <div className="text-center space-y-1 mb-3">
              <div className="w-11 h-11 bg-red-50 text-[#E30613] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs border border-red-100">
                {authMode === 'signup' ? <Sparkles className="w-5 h-5 text-yellow-500" /> : <Lock className="w-5 h-5" />}
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back! Sign In'}
              </h2>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                {authMode === 'signup'
                  ? 'Register with your email to receive a 6-digit OTP code (Clerk Auth)'
                  : 'Enter your registered email to receive your sign-in OTP code'}
              </p>
            </div>

            {/* Warning Banner (e.g. from Cart) */}
            {authWarning && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Account Required to Order</span>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    {authWarning}
                  </p>
                </div>
              </div>
            )}

            {/* Error Notification */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-xs text-red-700 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendOtp} className="space-y-3">
              {/* Full Name field (Only shown for Sign Up) */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Shivangi Sharma"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                      required={authMode === 'signup'}
                    />
                  </div>
                </div>
              )}

              {/* Phone field (Optional, for Sign Up) */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Number (For Delivery Updates)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                    />
                  </div>
                </div>
              )}

              {/* Email Address field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {authMode === 'signup' ? 'Email Address (Will receive OTP) *' : 'Registered Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                    required
                    autoFocus={authMode === 'signin'}
                  />
                </div>
              </div>

              {/* Value propositions */}
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Real-time delivery progress & live tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Secure 6-digit passwordless Clerk OTP verification</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E30613] hover:bg-[#c40510] text-white py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'signup' ? 'Register & Send 6-Digit OTP' : 'Send Sign-In OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom switcher helper */}
            <div className="text-center text-xs text-gray-500 pt-1">
              {authMode === 'signup' ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMessage(null);
                    }}
                    className="text-[#E30613] font-bold hover:underline cursor-pointer"
                  >
                    Click here to Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage(null);
                    }}
                    className="text-[#E30613] font-bold hover:underline cursor-pointer"
                  >
                    Create a Free Account
                  </button>
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: ENTER 6-DIGIT OTP FORM */}
        {step === 'otp' && (
          <div className="space-y-4">
            <div className="text-center space-y-1 mb-4">
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                Enter Verification Code
              </h2>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                We sent a 6-digit verification OTP to <strong className="text-gray-800">{email}</strong>
              </p>
            </div>

            {/* Demo OTP Banner (only shown if demoCode state is set — not used with Clerk) */}
            {demoCode && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 animate-fade-in">
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Development Preview Code</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Your 6-digit OTP code is: <strong className="font-mono text-sm tracking-widest text-[#E30613] bg-white px-2 py-0.5 rounded border border-emerald-300 ml-1">{demoCode}</strong>
                </p>
              </div>
            )}

            {/* Error Notification */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-xs text-red-700 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Enter 6-Digit Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="text-[11px] text-[#E30613] font-bold hover:underline cursor-pointer"
                  >
                    Change Email / Edit Details
                  </button>
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { inputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleKeyDown(idx, e)}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-black font-mono bg-gray-50 border-2 border-gray-200 focus:border-[#E30613] focus:bg-white rounded-xl focus:outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Resend OTP button & timer */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-500">Didn't receive the OTP?</span>
                {countdown > 0 ? (
                  <span className="font-mono text-gray-400 font-bold">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[#E30613] font-bold hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6}
                className="w-full bg-[#E30613] hover:bg-[#c40510] text-white py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Code & Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
