import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Modern Apple / GPay Inspired Main Layout Wrapper
 * Features:
 * - Clean off-white canvas (bg-slate-50 dark:bg-slate-950)
 * - Containerized layout with generous whitespace & breathing room
 * - Soft drop shadows with no harsh dark borders
 * - Responsive desktop sidebar + mobile drawer
 * - Modern floating mobile bottom navigation with active pill state
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Responsive sidebar state (collapsible on desktop & mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return window.innerWidth >= 1024;
  });

  const [activeSection, setActiveSection] = useState('home');

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle sidebar navigation & scrollspy jump
  const handleSectionClick = (href: string) => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    setActiveSection(href);

    if (location.pathname !== '/home') {
      navigate('/home');
      setTimeout(() => {
        const element = document.getElementById(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      const element = document.getElementById(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Listen to window scroll to update active scrollspy section
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/home') return;
      const scrollPosition = window.scrollY + 200;

      const sectionIds = [
        'home',
        'shetkari',
        'offers',
        'gharguti-seva',
        'hotel',
        'vehicle',
        'water',
        'beauty',
        'cyber',
        'mess',
        'photoshop',
        'gym',
        'hospital',
        'mobileshop',
        'sweethome',
        'reviews',
        'contact',
      ];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-hidden flex antialiased w-full max-w-full">
      {/* 1. Ambient Background Glow for depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[350px] bg-gradient-to-b from-blue-100/40 via-purple-100/20 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 blur-3xl" />
      </div>

      {/* 2. Grouped Apple / GPay Style Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
      />

      {/* 3. Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 4. Main Content Canvas */}
      <div
        className={`relative z-10 flex flex-col min-h-screen flex-grow transition-all duration-300 ease-in-out w-full max-w-full overflow-x-hidden ${
          isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
        }`}
      >
        {/* Sticky Header */}
        <Header onMenuToggle={toggleSidebar} />

        {/* Main Content Area with generous whitespace */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-5 pb-28 lg:pb-10 overflow-x-hidden">
          {children}
        </main>

        {/* 5. Modern Floating Mobile Bottom Navigation */}
        <BottomNav
          onOpenSidebar={toggleSidebar}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
        />
      </div>
    </div>
  );
};

export default MainLayout;
