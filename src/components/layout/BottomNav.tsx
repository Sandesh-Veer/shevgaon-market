import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid, PlusCircle, Store, Shield } from 'lucide-react';

interface BottomNavProps {
  onOpenSidebar?: () => void;
  activeSection?: string;
  onSectionClick?: (href: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onOpenSidebar,
  activeSection = 'home',
  onSectionClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/home';

  const navItems = [
    {
      id: 'home',
      label: 'होम',
      icon: Home,
      isActive: isHome && (!activeSection || activeSection === 'home'),
      onClick: () => {
        if (!isHome) {
          navigate('/home');
        } else if (onSectionClick) {
          onSectionClick('home');
        }
      },
    },
    {
      id: 'categories',
      label: 'कॅटेगरीज',
      icon: Grid,
      isActive: isHome && activeSection === 'services',
      onClick: () => {
        if (!isHome) {
          navigate('/home');
          setTimeout(() => onSectionClick && onSectionClick('services'), 200);
        } else if (onSectionClick) {
          onSectionClick('services');
        } else if (onOpenSidebar) {
          onOpenSidebar();
        }
      },
    },
    {
      id: 'add-shop',
      label: 'दुकान जोडा',
      icon: PlusCircle,
      isActive: location.pathname === '/add-shop',
      isPrimary: true,
      onClick: () => navigate('/add-shop'),
    },
    {
      id: 'vendor',
      label: 'दुकानदार',
      icon: Store,
      isActive:
        location.pathname.startsWith('/vendor') ||
        location.pathname.startsWith('/merchant-'),
      onClick: () => navigate('/merchant-dashboard'),
    },
    {
      id: 'admin',
      label: 'ॲडमिन',
      icon: Shield,
      isActive: location.pathname === '/admin',
      onClick: () => navigate('/admin'),
    },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 px-3 max-w-md mx-auto pointer-events-none lg:hidden">
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-1.5 flex items-center justify-between"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="relative flex flex-col items-center justify-center -top-3 group focus:outline-none"
                title={item.label}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-200 ${
                    active
                      ? 'bg-blue-600 shadow-blue-500/30 scale-105 ring-4 ring-white dark:ring-slate-900'
                      : 'bg-gradient-to-tr from-brand-blue to-brand-purple shadow-brand-blue/30 hover:scale-105 active:scale-95 ring-4 ring-white dark:ring-slate-900'
                  }`}
                >
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-blue-100/80 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <Icon size={19} strokeWidth={2} className="shrink-0" />
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[56px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
