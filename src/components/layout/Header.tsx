import { useState, useEffect } from 'react';
import { Menu, ArrowUpRight, User, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/75 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-800 shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
        
        {/* Left: Hamburger menu toggle button & Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuToggle}
            className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-gray-200/60 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center text-brand-dark dark:text-slate-200"
            title="मेन्यू उघडा/बंद करा (Toggle Menu)"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu size={20} />
          </button>
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group shrink-0"
          >
            <span className="w-8.5 h-8.5 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              S
            </span>
            <span className="text-base font-display font-bold tracking-tight text-brand-dark dark:text-white">
              Shevgaon<span className="text-brand-blue">.</span>Market
            </span>
          </Link>
        </div>

        {/* Right: Theme Toggle, Partner Registration & Login triggers */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Universal Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center justify-center"
            title={isDarkMode ? 'लाइट मोड चालू करा (Light Mode)' : 'डार्क मोड चालू करा (Dark Mode)'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-700" />}
          </button>

          <Link 
            to="/login"
            className="py-2 px-4 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple hover:bg-brand-purple hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
          >
            <User size={13} />
            लॉगिन / नोंदणी
          </Link>

          <Link
            to="/vendor/register"
            className="hidden sm:inline-flex items-center gap-1 bg-gradient-brand text-white font-semibold text-xs px-4.5 py-2 rounded-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            भागीदार व्हा
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </header>
  );
}

