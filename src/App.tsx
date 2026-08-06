import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';
import Header from './components/layout/Header';
import Home from './pages/Home';
import LoginRegistration from './pages/LoginRegistration';
import VendorDashboard from './pages/VendorDashboard';
import VendorRegistration from './pages/VendorRegistration';
import BusinessDetail from './pages/BusinessDetail';
import AdminDashboard from './pages/AdminDashboard';
import MerchantProfile from './pages/MerchantProfile';
import OfflineFallback from './components/OfflineFallback';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  // Responsive sidebar state (collapsible on desktop & mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return window.innerWidth >= 1024;
  });
  const [activeSection, setActiveSection] = useState('home');

  // Sidebar Items
  const sidebarItems = [
    { id: 'home', label: '🏠 Home', href: 'home' },
    { id: 'shetkari', label: '👨‍🌾 शेतकरी (Farmers)', href: 'shetkari' },
    { id: 'gharguti-seva', label: '🛠️ घरगुती सेवा (Home Services)', href: 'gharguti-seva' },
    { id: 'hotel', label: '🍔 हॉटेल (Hotel)', href: 'hotel' },
    { id: 'vehicle', label: '🚗 वाहन (Vahan / Vehicles)', href: 'vehicle' },
    { id: 'water', label: '🚰 वॉटर जार (Water Jar)', href: 'water' },
    { id: 'beauty', label: '💇‍♀️ ब्युटी पार्लर (Beauty Parlour)', href: 'beauty' },
    { id: 'cyber', label: '💻 सायबर कॅफे (Cyber Cafe)', href: 'cyber' },
    { id: 'mess', label: '🍲 मेस (Mess / खानावळ)', href: 'mess' },
    { id: 'photoshop', label: '📸 फोटोशॉप (Photoshop Studio)', href: 'photoshop' },
    { id: 'gym', label: '🏋️‍♂️ जिम (Gym & Fitness)', href: 'gym' },
    { id: 'hospital', label: '🏥 हॉस्पिटल (Hospital)', href: 'hospital' },
    { id: 'mobileshop', label: '📱 मोबाईल शॉप (Mobile Shop)', href: 'mobileshop' },
    { id: 'sweethome', label: '🧁 स्वीट होम (Sweet Home)', href: 'sweethome' },
    { id: 'offers', label: '🛍️ ऑफर्स (Offers)', href: 'offers' },
    { id: 'reviews', label: '⭐ Reviews', href: 'reviews' },
    { id: 'contact', label: '📞 संपर्क (Contact)', href: 'contact' }
  ];

  // Scroll to section helper
  const handleSidebarClick = (href: string) => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    setActiveSection(href);

    if (location.pathname !== '/') {
      navigate('/');
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

  // Initialize theme from localStorage on initial load
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Listen to window scroll to update active scrollspy section
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/') return;
      const scrollPosition = window.scrollY + 200;

      for (const item of sidebarItems) {
        const el = document.getElementById(item.href);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.href);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-hidden selection:bg-brand-purple/20 selection:text-brand-purple flex">
      {/* Global Offline Network Status Overlay */}
      <OfflineFallback />
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-brand-blue/15 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 50, 0],
            y: [0, 50, -40, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-brand-purple/15 to-transparent blur-[120px]"
        />
      </div>

      {/* A. DESKTOP & MOBILE RESPONSIVE SIDEBAR */}
      <aside 
        className={`fixed left-0 top-0 h-screen w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-gray-200/50 dark:border-slate-800 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl lg:shadow-none p-5 text-left`}
      >
        {/* Sidebar Header with Brand & Close Button */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200/50 dark:border-slate-800 shrink-0">
          <Link 
            to="/" 
            onClick={() => handleSidebarClick('home')}
            className="flex items-center gap-2 group shrink-0"
          >
            <span className="w-8.5 h-8.5 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform duration-300">
              S
            </span>
            <span className="text-base font-display font-bold tracking-tight text-brand-dark dark:text-white">
              Shevgaon<span className="text-brand-blue">.</span>Market
            </span>
          </Link>
          
          <button 
            onClick={toggleSidebar}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="नेव्हिगेशन बंद करा"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Navigation Options List (Vertical Scroll Enabled) */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-140px)] py-4 pr-1 space-y-1 custom-scrollbar">
          <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-2 px-2">
            श्रेणी आणि विभाग (Categories)
          </p>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSidebarClick(item.href)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-200 ${
                  activeSection === item.href && location.pathname === '/'
                    ? 'bg-gradient-brand text-white shadow-sm shadow-brand-blue/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-brand-purple dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer actions inside Sidebar */}
        <div className="space-y-3 pt-4 border-t border-gray-200/50 dark:border-slate-800 shrink-0">
          <Link 
            to="/admin"
            onClick={() => {
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
          >
            <ShieldAlert size={15} />
            प्रशासक पॅनेल (Admin)
          </Link>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light px-2">© {new Date().getFullYear()} Shevgaon Market</p>
        </div>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
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

      {/* MAIN RIGHT CONTAINER */}
      <div 
        className={`relative z-10 flex flex-col min-h-screen flex-grow transition-all duration-300 ease-in-out overflow-x-hidden w-full ${
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        }`}
      >
        {/* Sticky Header with Hamburger trigger */}
        <Header onMenuToggle={toggleSidebar} />
        
        {/* Pages Content */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-6 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginRegistration />} />
            
            {/* Protected Merchant Routes */}
            <Route 
              path="/merchant-profile" 
              element={
                <ProtectedRoute allowedRoles={['merchant', 'admin']}>
                  <MerchantProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vendor/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['merchant', 'admin']}>
                  <VendorDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/vendor/register" element={<VendorRegistration />} />
            <Route path="/business/:category/:id" element={<BusinessDetail />} />
            
            {/* Strict Protected Admin Route */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

      </div>

    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
