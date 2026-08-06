import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

export default function OfflineFallback() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      if (navigator.onLine) {
        setIsOffline(false);
      }
      setIsChecking(false);
    }, 800);
  };

  if (!isOffline) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md text-center"
      >
        <motion.div
          initial={{ scale: 0.85, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden"
        >
          {/* Top Decorative Background Glow */}
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-amber-500/10 dark:bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Cartoon-Style Sleeping Cloud & Disconnected Wifi SVG Illustration */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
            
            {/* Cute Cartoon Cloud SVG */}
            <svg
              viewBox="0 0 200 160"
              className="w-full h-full drop-shadow-lg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Soft Cloud Shadow */}
              <ellipse cx="100" cy="142" rx="60" ry="8" fill="#CBD5E1" opacity="0.5" />

              {/* Cloud Body */}
              <path
                d="M45 125 C30 125 18 112 18 96 C18 82 28 70 42 68 C46 45 66 28 90 28 C112 28 131 43 137 63 C149 63 160 72 163 84 C174 86 182 96 182 108 C182 122 170 125 155 125 Z"
                fill="url(#cloudGrad)"
              />

              {/* Cartoon Face: Sleeping Zzz Curves */}
              {/* Left Eye (Sad / Closed Curve) */}
              <path d="M68 85 Q75 92 82 85" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Right Eye (Sad / Closed Curve) */}
              <path d="M118 85 Q125 92 132 85" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" />

              {/* Cute Blush Cheeks */}
              <circle cx="62" cy="93" r="6" fill="#F43F5E" opacity="0.35" />
              {/* Right Cheek */}
              <circle cx="138" cy="93" r="6" fill="#F43F5E" opacity="0.35" />

              {/* Mouth (Cute O-mouth expression) */}
              <ellipse cx="100" cy="95" rx="5" ry="6" fill="#475569" />

              {/* Disconnected Plugs / Broken Line floating below */}
              <path d="M70 125 L65 140" stroke="#F43F5E" strokeWidth="3" strokeDasharray="3 3" strokeLinecap="round" />
              <path d="M130 125 L135 140" stroke="#F43F5E" strokeWidth="3" strokeDasharray="3 3" strokeLinecap="round" />

              {/* Floating Sad Raindrop Tears */}
              <motion.path
                animate={{ y: [0, 8, 0], opacity: [0.3, 0.9, 0.3] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                d="M50 110 Q50 118 53 118 Q56 118 56 110 Q53 105 50 110 Z"
                fill="#3B82F6"
              />
              <motion.path
                animate={{ y: [0, 10, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: 0.5 }}
                d="M148 108 Q148 116 151 116 Q154 116 154 108 Q151 103 148 108 Z"
                fill="#3B82F6"
              />

              {/* Gradients */}
              <defs>
                <linearGradient id="cloudGrad" x1="18" y1="28" x2="182" y2="125" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F8FAFC" />
                  <stop offset="1" stopColor="#E2E8F0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Animated Wifi-Off Badge */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -top-1 -right-1 w-11 h-11 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900"
            >
              <WifiOff size={22} />
            </motion.div>

            {/* Little Zzz Cartoon Floating Elements */}
            <motion.span
              animate={{ opacity: [0, 1, 0], y: [0, -15], x: [0, 8] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.2 }}
              className="absolute top-2 left-6 text-slate-400 font-extrabold text-xs"
            >
              z
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0], y: [0, -20], x: [0, 12] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.9 }}
              className="absolute -top-3 left-12 text-slate-400 font-extrabold text-sm"
            >
              Z
            </motion.span>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Oops! You're offline
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-xs mx-auto">
              Please check your internet connection and try again.
            </p>
          </div>

          {/* Status Indicator & Action Button */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleManualCheck}
              disabled={isChecking}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75"
            >
              <RefreshCw size={16} className={isChecking ? 'animate-spin' : ''} />
              {isChecking ? 'Checking Connection...' : 'Retry Connection'}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <AlertCircle size={13} className="text-amber-500" />
              <span>Auto-reconnects when network is restored</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
