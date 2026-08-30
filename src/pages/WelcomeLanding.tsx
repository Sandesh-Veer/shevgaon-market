import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function WelcomeLanding() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/home');
  };

  return (
    <div className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col justify-between items-center select-none bg-white font-sans">
      {/* 1. 100% RAW, UNTOUCHED, BRIGHT FULL HD HERO BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/shevgaon-hero.jpg"
          alt="Shevgaon Hero Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. TOP-LEFT BRAND LOGO */}
      <header className="relative z-20 w-full px-6 py-6 sm:px-10 sm:py-8 flex justify-start items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleStart}
          className="cursor-pointer flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-colors group"
        >
          <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
            S
          </span>
          <span className="text-sm sm:text-base font-semibold tracking-tight text-white/90">
            Shevgaon<span className="text-blue-400">.</span>Market
          </span>
        </motion.div>
      </header>

      {/* 3. CTA BUTTON: SOLID HIGH-CONTRAST PRIMARY BUTTON */}
      <main className="relative z-20 flex-1 w-full flex flex-col items-center justify-end text-center px-4 pb-8 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[240px] sm:max-w-[280px] flex justify-center"
        >
          <button
            onClick={handleStart}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-devanagari font-bold text-lg sm:text-xl px-6 py-3.5 sm:py-4 rounded-2xl shadow-xl shadow-blue-600/35 hover:shadow-2xl hover:shadow-blue-600/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer group w-full"
          >
            <span className="tracking-wide text-white font-extrabold whitespace-nowrap">
              सुरू करा
            </span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-1.5 transition-transform duration-200 shrink-0" />
          </button>
        </motion.div>
      </main>

      {/* Footer space balance */}
      <div className="relative z-20 h-2 pointer-events-none" />
    </div>
  );
}
