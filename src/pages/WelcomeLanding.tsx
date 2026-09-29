import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function WelcomeLanding() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err: unknown) => {
        console.warn('Autoplay failed or requires interaction:', err);
      });
    }
  }, []);

  const handleStart = () => {
    navigate('/home');
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black font-sans select-none">
      {/* 1. LIVE LOOPING HERO BACKGROUND VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        src="/hero-bg.mp4"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />
      {/* 2. TOP-LEFT BRAND LOGO */}
      <header className="absolute top-0 left-0 z-30 w-full px-6 py-6 sm:px-10 sm:py-8 flex justify-start items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleStart}
          className="pointer-events-auto cursor-pointer flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-xl drop-shadow-lg hover:bg-black/55 transition-colors group"
        >
          <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
            S
          </span>
          <span className="text-sm sm:text-base font-semibold tracking-tight text-white drop-shadow-md">
            Shevgaon<span className="text-blue-400">.</span>Market
          </span>
        </motion.div>
      </header>

      {/* 3. CTA BUTTON - FIXED AT BOTTOM (NO CONFLICTS) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="fixed bottom-12 left-0 right-0 z-[9999] w-full flex justify-center px-4 pointer-events-none"
      >
        <button
          onClick={handleStart}
          className="pointer-events-auto w-[90%] max-w-[280px] flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-devanagari font-bold text-lg sm:text-xl px-6 py-4 rounded-2xl shadow-2xl shadow-black/60 drop-shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 border border-white/20 group"
        >
          <span className="tracking-wide text-white font-extrabold whitespace-nowrap drop-shadow-md">
            सुरू करा
          </span>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-1.5 transition-transform duration-200 shrink-0 drop-shadow-md" />
        </button>
      </motion.div>
    </div>
  );
}