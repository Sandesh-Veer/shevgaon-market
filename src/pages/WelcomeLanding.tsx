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
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleStart}
          className="cursor-pointer flex items-center gap-2.5 bg-white/80 hover:bg-white/95 backdrop-blur-md border border-white/90 px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-lg transition-all duration-300 group"
        >
          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
            S
          </span>
          <span className="text-base sm:text-lg font-display font-extrabold tracking-tight text-slate-900">
            Shevgaon<span className="text-blue-600">.</span>Market
          </span>
        </motion.div>
      </header>

      {/* 3. CTA BUTTON: TRANSPARENT GLASS BUTTON DECREASED IN WIDTH TO MATCH THE TRUCK CONTAINER */}
      <main className="relative z-20 flex-1 w-full flex flex-col items-center justify-end text-center px-4 pb-5 sm:pb-7 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[210px] sm:max-w-[240px] md:max-w-[260px] flex justify-center"
        >
          <button
            onClick={handleStart}
            className="flex items-center justify-center gap-2.5 bg-white/45 hover:bg-white/65 active:bg-white/80 backdrop-blur-md border border-white/80 text-slate-950 font-devanagari font-bold text-lg sm:text-xl px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group w-full"
          >
            <span className="tracking-wide text-slate-950 font-extrabold whitespace-nowrap">
              सुरू करा
            </span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700 group-hover:translate-x-1.5 transition-transform duration-300 shrink-0" />
          </button>
        </motion.div>
      </main>

      {/* Footer space balance */}
      <div className="relative z-20 h-2 pointer-events-none" />
    </div>
  );
}
