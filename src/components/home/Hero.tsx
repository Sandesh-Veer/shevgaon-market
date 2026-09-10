import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Store } from 'lucide-react';
import { WebsiteSettings } from '../../services/db';

interface HeroProps {
  settings: WebsiteSettings;
  onOffersClick?: () => void;
}

/**
 * Modern Full-Width SaaS Hero Component for Shevgaon Market
 * 
 * 1. Full-Width Background: Absolute wrapper at root with `absolute inset-0 w-full h-full overflow-hidden`
 * 2. Extend to the Top: Pulls up behind the translucent glass Navbar (-mt-16 sm:-mt-20) starting from top-0
 * 3. Centered Content: Text, buttons, and floating badges stay centered in `max-w-7xl mx-auto relative z-10`
 */
export const Hero: React.FC<HeroProps> = ({ settings, onOffersClick }) => {
  const handleOffersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOffersClick) {
      onOffersClick();
    } else {
      document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="home"
      className="relative w-full -mt-16 sm:-mt-20 pt-20 sm:pt-24 pb-12 sm:pb-20 overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* 1. FULL-WIDTH BACKGROUND (ABSOLUTE INSET-0 WRAPPER SPANNING EDGE-TO-EDGE) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
        {/* Soft background base tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-100/40 via-purple-50/20 to-transparent dark:from-violet-950/30 dark:via-slate-900/40 dark:to-transparent" />

        {/* Glowing Orb 1 - Top Left (Violet / Purple Glow spanning to top-0) */}
        <div className="absolute -top-16 -left-20 sm:-top-24 sm:-left-32 w-80 h-80 sm:w-[560px] sm:h-[560px] rounded-full bg-gradient-to-br from-purple-600 to-violet-500 blur-[100px] opacity-30 animate-float-slow" />

        {/* Glowing Orb 2 - Top Right (Indigo / Blue Glow spanning to top-0) */}
        <div className="absolute -top-16 -right-20 sm:-top-24 sm:-right-32 w-80 h-80 sm:w-[520px] sm:h-[520px] rounded-full bg-gradient-to-bl from-blue-500 to-indigo-600 blur-[100px] opacity-30 animate-float-medium" />

        {/* Glowing Orb 3 - Ambient Center Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[720px] h-[300px] sm:h-[460px] rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-violet-600/25 to-blue-400/20 blur-[120px] opacity-35" />

        {/* Subtle Modern Mesh Dot Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_25%,#000_65%,transparent_100%)]" />
      </div>

      {/* ========================================================================= */}
      {/* 3. CENTERED CONTENT CONTAINER (MAX-W-7XL MX-AUTO RELATIVE Z-10)          */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center w-full">
        {/* Top Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/70 border border-violet-200/60 dark:border-violet-800/60 backdrop-blur-xl shadow-xs text-xs font-semibold text-violet-700 dark:text-violet-300 mb-5 sm:mb-7 max-w-[95%] text-center"
        >
          <Sparkles size={14} className="text-violet-600 dark:text-violet-400 animate-pulse shrink-0" />
          <span className="truncate">✨ शेवगावचा स्वतःचा प्रीमियम डिजिटल प्लॅटफॉर्म</span>
        </motion.div>

        {/* Headline with Floating Badges */}
        <div className="relative w-full max-w-4xl px-3 sm:px-6">
          {/* Floating Badge 1 - Left: 50+ Shops */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="absolute -top-3 left-0 sm:-left-4 lg:-left-12 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/80 dark:border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] text-xs font-bold text-slate-800 dark:text-slate-100 z-20 select-none animate-float-slow"
          >
            <span className="text-amber-500">⭐</span>
            <span>50+ Shops</span>
          </motion.div>

          {/* Floating Badge 2 - Right: Daily Offers */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="absolute -top-1 right-0 sm:-right-4 lg:-right-12 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/80 dark:border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] text-xs font-bold text-slate-800 dark:text-slate-100 z-20 select-none animate-float-medium"
          >
            <span>🚀</span>
            <span>Daily Offers</span>
          </motion.div>

          {/* Floating Badge 3 - Subtle Local Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="absolute -bottom-4 right-6 sm:right-16 hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-violet-200/50 dark:border-violet-800/50 shadow-xs text-[11px] font-semibold text-violet-700 dark:text-violet-300 z-20 select-none animate-float-fast"
          >
            <span>⚡</span>
            <span>100% शेवगाव लोकल</span>
          </motion.div>

          {/* Main Heading with Gradient Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-2xl sm:text-5xl lg:text-7xl font-extrabold w-full tracking-tight leading-[1.2] sm:leading-[1.15] mb-4 sm:mb-6 text-brand-dark dark:text-white text-center break-words"
          >
            {settings.title !== 'Shevgaon Market' ? (
              settings.title
            ) : (
              <>
                सर्व स्थानिक सेवा आणि व्यवहार <br className="hidden sm:inline" />{' '}
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm dark:from-violet-400 dark:via-purple-300 dark:to-indigo-300">
                  आता एकाच ठिकाणी
                </span>
              </>
            )}
          </motion.h1>

          {/* Mobile floating badges */}
          <div className="flex sm:hidden items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/70 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-xs">
              ⭐ 50+ Shops
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/70 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-xs">
              🚀 Daily Offers
            </span>
          </div>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs sm:text-base md:text-lg text-brand-muted dark:text-slate-400 w-full max-w-2xl font-normal mx-auto mb-6 sm:mb-10 px-2 sm:px-4 leading-relaxed text-center"
          >
            {settings.description}
          </motion.p>
        </div>

        {/* Enhanced CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center px-4 sm:px-6 max-w-lg mb-10 sm:mb-16 z-10 mx-auto"
        >
          {/* Primary CTA with soft glowing purple shadow & hover scaling */}
          <a
            href="#offers"
            onClick={handleOffersClick}
            className="w-full sm:w-auto bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:shadow-[0_0_25px_rgba(124,58,237,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group text-sm sm:text-base select-none cursor-pointer"
          >
            <span>नवीन ऑफर्स पहा</span>
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Secondary CTA with glassmorphism & hover scaling */}
          <Link
            to="/add-shop"
            className="w-full sm:w-auto bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md text-slate-800 dark:text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:border-violet-500/50 hover:shadow-[0_4px_20px_rgba(124,58,237,0.15)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 text-center text-sm sm:text-base select-none"
          >
            <Store size={18} className="text-violet-600 dark:text-violet-400" />
            <span>दुकान नोंदणी करा</span>
          </Link>
        </motion.div>

        {/* Glass Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full max-w-5xl rounded-2xl sm:rounded-3xl overflow-hidden glass-card p-1.5 sm:p-2.5 md:p-3 relative shadow-soft border border-white/80 dark:border-slate-800/80"
        >
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-inner bg-slate-50 dark:bg-slate-900 relative aspect-[16/9] w-full">
            {/* Header control dots */}
            <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 flex gap-1.5 z-20">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56] shadow-xs" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E] shadow-xs" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F] shadow-xs" />
            </div>

            <img
              src={settings.bannerUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"}
              alt="Shevgaon Market UI"
              className="w-full h-full object-cover select-none pointer-events-none hover:scale-[1.02] transition-transform duration-700"
            />

            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 p-4 sm:p-5 glass-card max-w-[280px] hidden md:block text-left z-20 border border-white/70 dark:border-slate-700/70 animate-float-slow backdrop-blur-xl">
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400">ताजा भाजीपाला बाजार</span>
              <h3 className="text-sm sm:text-base font-bold text-brand-dark dark:text-white mt-1 mb-1">थेट शेतकरी विक्री</h3>
              <p className="text-xs text-brand-muted dark:text-slate-400">ग्राहकांना थेट शेतातील ताजी पिके आणि सेंद्रिय माल खरेदी करण्याची संधी.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
