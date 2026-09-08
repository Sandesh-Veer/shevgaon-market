import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  Store,
  ShieldAlert,
  ChevronDown,
  ChevronRight,
  Sprout,
  Wrench,
  Settings,
  HelpCircle,
  LogIn,
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  href?: string;
  link?: string;
  badge?: string;
}

export interface SidebarGroup {
  id: string;
  title: string;
  icon?: React.ReactNode;
  items: SidebarItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionClick: (href: string) => void;
}

export const defaultSidebarGroups: SidebarGroup[] = [
  {
    id: 'market',
    title: 'बाजार आणि शेती',
    icon: <Sprout size={15} strokeWidth={2} className="text-emerald-500" />,
    items: [
      { id: 'home', label: 'Home (मुख्य पान)', href: 'home' },
      { id: 'shetkari', label: 'शेतकरी व भाजीपाला (Farmers)', href: 'shetkari' },
      { id: 'offers', label: 'ऑफर्स आणि सेल (Offers)', href: 'offers', badge: 'New' },
    ],
  },
  {
    id: 'services',
    title: 'स्थानिक सेवा आणि दुकाने',
    icon: <Wrench size={15} strokeWidth={2} className="text-blue-500" />,
    items: [
      { id: 'gharguti-seva', label: 'घरगुती सेवा (Home Services)', href: 'gharguti-seva' },
      { id: 'hotel', label: 'हॉटेल्स आणि फूड (Hotels)', href: 'hotel' },
      { id: 'vehicle', label: 'वाहने आणि गॅरेज (Vehicles)', href: 'vehicle' },
      { id: 'water', label: 'वॉटर जार सेवा (Water Jar)', href: 'water' },
      { id: 'beauty', label: 'ब्युटी पार्लर (Beauty Parlour)', href: 'beauty' },
      { id: 'cyber', label: 'सायबर कॅफे (Cyber Cafe)', href: 'cyber' },
      { id: 'mess', label: 'मेस व खानावळ (Mess)', href: 'mess' },
      { id: 'photoshop', label: 'फोटो स्टुडिओ (Photoshop Studio)', href: 'photoshop' },
      { id: 'gym', label: 'जिम व फिटनेस (Gym & Fitness)', href: 'gym' },
      { id: 'hospital', label: 'हॉस्पिटल व आरोग्य (Hospital)', href: 'hospital' },
      { id: 'mobileshop', label: 'मोबाईल शॉप (Mobile Shop)', href: 'mobileshop' },
      { id: 'sweethome', label: 'स्वीट होम व बेकरी (Sweet Home)', href: 'sweethome' },
    ],
  },
  {
    id: 'admin',
    title: 'दुकानदार आणि प्रशासक',
    icon: <Settings size={15} strokeWidth={2} className="text-purple-500" />,
    items: [
      { id: 'add-shop', label: '🏪 दुकान नोंदणी करा (Add Shop)', link: '/add-shop' },
      { id: 'merchant-login', label: '🔐 दुकानदार लॉगिन (Merchant Login)', link: '/merchant-login' },
      { id: 'merchant-dashboard', label: '💼 दुकानदार डॅशबोर्ड (Merchant Dashboard)', link: '/merchant-dashboard' },
      { id: 'welcome-page', label: '✨ वेल्कम स्क्रीन (Welcome Page)', link: '/welcome' },
    ],
  },
  {
    id: 'support',
    title: 'माहिती व सहाय्य',
    icon: <HelpCircle size={15} strokeWidth={2} className="text-amber-500" />,
    items: [
      { id: 'reviews', label: 'ग्राहक अभिप्राय (Reviews)', href: 'reviews' },
      { id: 'contact', label: 'संपर्क व मदत (Contact & Help)', href: 'contact' },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeSection,
  onSectionClick,
}) => {
  const location = useLocation();

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    market: true,
    services: true,
    admin: true,
    support: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <aside
      aria-label="Application Sidebar"
      onClick={(e) => e.stopPropagation()}
      className={`fixed left-0 top-0 h-[100dvh] max-h-[100dvh] w-72 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/80 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } shadow-2xl lg:shadow-none p-4 text-left overscroll-contain`}
    >
      {/* 1. Header with Brand & Close Button */}
      <div className="flex items-center justify-between pb-3.5 px-1 border-b border-slate-200/60 dark:border-slate-800/80 shrink-0">
        <Link
          to="/home"
          onClick={() => {
            onSectionClick('home');
            if (window.innerWidth < 1024) onClose();
          }}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            S
          </div>
          <div>
            <div className="text-sm font-display font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              Shevgaon<span className="text-blue-600">.</span>Market
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              शेवगांवचे डिजिटल मार्केट
            </div>
          </div>
        </Link>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="नेव्हिगेशन बंद करा"
          aria-label="Close sidebar"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      {/* 2. Scrollable Navigation: Containerized Apple / GPay Card Groups */}
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="flex-1 overflow-y-auto overscroll-contain py-4 space-y-4 pr-1 custom-scrollbar"
      >
        {defaultSidebarGroups.map((group) => {
          const isGroupOpen = openGroups[group.id] ?? true;

          return (
            <div key={group.id} className="space-y-1.5">
              {/* Section Sub-header */}
              <div className="flex items-center justify-between px-1.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {group.icon && (
                    <div className="w-5 h-5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center shrink-0">
                      {group.icon}
                    </div>
                  )}
                  <span>{group.title}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
                >
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className={`transition-transform duration-200 ${
                      isGroupOpen ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>
              </div>

              {/* Grouped Card Container */}
              {isGroupOpen && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-sm border border-slate-100/80 dark:border-slate-800/80 space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      (item.href &&
                        activeSection === item.href &&
                        location.pathname === '/home') ||
                      (item.link && location.pathname === item.link);

                    // If item has a router link, use React Router <Link> tag directly
                    if (item.link) {
                      return (
                        <Link
                          key={item.id}
                          to={item.link}
                          onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="truncate flex-1 pr-2">{item.label}</span>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight
                              size={13}
                              strokeWidth={2}
                              className={`transition-colors ${
                                isActive
                                  ? 'text-blue-600 dark:text-blue-300'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </div>
                        </Link>
                      );
                    }

                    // For section jumps on the home page
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (item.href) onSectionClick(item.href);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="truncate flex-1 pr-2">{item.label}</span>

                        <div className="flex items-center gap-1 shrink-0">
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight
                            size={13}
                            strokeWidth={2}
                            className={`transition-colors ${
                              isActive
                                ? 'text-blue-600 dark:text-blue-300'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Footer Actions in Distinct Elevated Card */}
      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 shrink-0 space-y-2">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-sm border border-slate-100/80 dark:border-slate-800/80 space-y-1.5">
          {/* Add Shop Link */}
          <Link
            to="/add-shop"
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100/70 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
              <Store size={14} strokeWidth={2} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span>दुकान नोंदणी करा (Add Shop)</span>
          </Link>

          {/* Dedicated Merchant Login Link */}
          <Link
            to="/merchant-login"
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100/70 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
              <LogIn size={14} strokeWidth={2} className="text-purple-600 dark:text-purple-400" />
            </div>
            <span>दुकानदार लॉगिन (Merchant Login)</span>
          </Link>

          {/* Admin Panel Direct Link */}
          <Link
            to="/admin"
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-rose-100/80 dark:bg-rose-900/40 flex items-center justify-center shrink-0">
              <ShieldAlert size={14} strokeWidth={2} className="text-rose-600 dark:text-rose-400" />
            </div>
            <span>प्रशासक पॅनेल (Admin Panel)</span>
          </Link>
        </div>

        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal px-2 text-center">
          © {new Date().getFullYear()} Shevgaon Market
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
