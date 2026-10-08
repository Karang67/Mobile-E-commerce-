import React, { useEffect, useState, useCallback } from 'react';
import { Download, X, Smartphone, Share, PlusSquare, CheckCircle2, Sparkles, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

const STORAGE_KEYS = {
  SHOWN_ONCE: 'shivangi_pwa_shown_once',
  INSTALLED: 'shivangi_pwa_installed',
};

export const InstallPWA: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBar, setShowBar] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [justInstalled, setJustInstalled] = useState<boolean>(false);

  // Check if running in standalone mode (already installed)
  const checkIsStandalone = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    return isStandaloneMode || isIOSStandalone;
  }, []);

  // Check if user has already seen the popup bar (ONLY ONCE requirement)
  const hasSeenOnce = useCallback((): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SHOWN_ONCE) === 'true';
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // 1. If already installed in standalone mode, never show
    if (checkIsStandalone()) {
      setIsInstalled(true);
      return;
    }

    // 2. Detect iOS / iPadOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: boolean }).MSStream;
    setIsIOS(isAppleDevice);

    // 3. Listen for browser's beforeinstallprompt
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    // 4. Listen for native appinstalled
    const handleAppInstalled = () => {
      setShowBar(false);
      setShowIOSGuide(false);
      setShowDesktopGuide(false);
      setInstallPrompt(null);
      setIsInstalled(true);
      setJustInstalled(true);
      try {
        localStorage.setItem(STORAGE_KEYS.INSTALLED, 'true');
        localStorage.setItem(STORAGE_KEYS.SHOWN_ONCE, 'true');
      } catch {
        // ignore
      }
      setTimeout(() => setJustInstalled(false), 5000);
    };

    // 5. Allow manual re-triggering from navigation buttons anytime
    const handleManualTrigger = () => {
      if (checkIsStandalone()) return;
      if (isAppleDevice) {
        setShowIOSGuide(true);
      } else if (installPrompt) {
        installPrompt.prompt();
      } else {
        setShowBar(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('trigger_pwa_install', handleManualTrigger);

    // 6. SHOW POPUP BAR WHEN USER ENTERS THE WEBSITE (APPEAR ONLY ONCE)
    if (!hasSeenOnce()) {
      const enterTimer = setTimeout(() => {
        setShowBar(true);
        // Mark as shown so it appears only once across all future visits
        try {
          localStorage.setItem(STORAGE_KEYS.SHOWN_ONCE, 'true');
        } catch {
          // ignore
        }
      }, 1500); // 1.5 seconds smooth entrance delay

      return () => {
        clearTimeout(enterTimer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('trigger_pwa_install', handleManualTrigger);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('trigger_pwa_install', handleManualTrigger);
    };
  }, [checkIsStandalone, hasSeenOnce, installPrompt]);

  const handleInstallClick = async () => {
    // On iPhone / iPad Safari
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    // On Android / Desktop with native prompt
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowBar(false);
          setInstallPrompt(null);
          setIsInstalled(true);
        } else {
          setShowBar(false);
        }
      } catch (err) {
        console.warn('[PWA Install] Prompt error:', err);
      }
      return;
    }

    // On Desktop without prompt available (e.g. guide to address bar)
    setShowDesktopGuide(true);
  };

  const handleDismiss = () => {
    setShowBar(false);
    setShowIOSGuide(false);
    setShowDesktopGuide(false);
    try {
      localStorage.setItem(STORAGE_KEYS.SHOWN_ONCE, 'true');
    } catch {
      // ignore
    }
  };

  // If already installed in standalone mode, do not render
  if (isInstalled && !justInstalled) {
    return null;
  }

  return (
    <>
      {/* ─── Success Toast when Installation Completes ─── */}
      {justInstalled && (
        <aside
          aria-label="App installed"
          className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/40 animate-slide-up"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold">Shivangi Mobile Installed!</p>
            <p className="text-[11px] text-gray-300">Open from your home screen anytime.</p>
          </div>
        </aside>
      )}

      {/* ─── iOS Step-by-Step Guide Modal ─── */}
      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-100 transform transition-all animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E30613] to-[#c40510] flex items-center justify-center text-white shadow-md">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Install on iPhone / iPad</h3>
                  <p className="text-xs text-gray-500">Fast access right from your home screen</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-red-50 text-[#E30613] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs text-gray-700 leading-relaxed">
                  Tap the <strong className="text-gray-900 font-semibold inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 bg-gray-100 rounded">Share <Share className="w-3.5 h-3.5 inline text-blue-600" /></strong> button at the bottom toolbar of Safari.
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-red-50 text-[#E30613] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs text-gray-700 leading-relaxed">
                  Scroll down the menu and tap <strong className="text-gray-900 font-semibold inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 bg-gray-100 rounded">Add to Home Screen <PlusSquare className="w-3.5 h-3.5 inline text-gray-700" /></strong>.
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-red-50 text-[#E30613] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs text-gray-700 leading-relaxed">
                  Tap <strong className="text-[#E30613] font-semibold">Add</strong> in the top-right corner to finish!
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowIOSGuide(false);
                setShowBar(false);
              }}
              className="w-full py-3 bg-gradient-to-r from-[#E30613] to-[#c40510] hover:from-[#c40510] hover:to-[#a0040d] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}

      {/* ─── Desktop Chrome/Edge Guide Modal ─── */}
      {showDesktopGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowDesktopGuide(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-100 transform transition-all animate-slide-up text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E30613] flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Monitor className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Install from Browser</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Click the small <strong>Install Icon (🖥️ ⬇️)</strong> located at the right side of your browser&apos;s address bar next to the star bookmark icon.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowDesktopGuide(false);
                setShowBar(false);
              }}
              className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* ─── POPUP BAR (APPEARS ONCE ON SITE ENTRY) ─── */}
      {showBar && (
        <div
          role="banner"
          aria-label="Install App announcement bar"
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#17212D] via-[#202D3B] to-[#121B24] text-white border-b border-red-500/40 shadow-[0_8px_30px_rgba(0,0,0,0.3)] animate-slide-down"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-2 flex items-center justify-between gap-3">
            {/* Left: App Logo + Info */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="/pwa-192x192.png"
                  alt="Shivangi Mobile"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-white/20 bg-white p-0.5 shadow-sm"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/logo.png';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 bg-[#E30613] text-white p-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide truncate">
                    Shivangi Mobile App
                  </span>
                  <span className="text-[9px] font-bold bg-[#E30613] text-white px-1.5 py-0.2 rounded uppercase tracking-wider">
                    Official
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-gray-300 truncate max-w-xs sm:max-w-md">
                  {isIOS
                    ? 'Add to Home Screen for fast mobile access & offline deals'
                    : 'Install our lightweight app for faster shopping & exclusive deals!'}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="py-1.5 px-3 sm:px-4 bg-gradient-to-r from-[#E30613] to-[#c40510] hover:from-[#c40510] hover:to-[#a0040d] text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isIOS ? 'Install Guide' : 'Install App'}</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Dismiss and never show again"
                title="Dismiss (won't show again)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPWA;