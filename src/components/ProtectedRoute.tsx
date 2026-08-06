import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          सुरक्षा पडताळणी सुरू आहे... (Verifying authentication)
        </p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role restriction check
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // If merchant trying to access admin dashboard, strictly redirect to merchant-profile
    if (role === 'merchant' && location.pathname.startsWith('/admin')) {
      return (
        <div className="max-w-md mx-auto my-12 p-8 glass-card border border-rose-200 dark:border-rose-950 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center mx-auto text-rose-600">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              प्रवेश नाकारला (Access Restricted)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              तुम्हाला प्रशासक (Admin) पॅनेलमध्ये प्रवेश करण्याची परवानगी नाही. तुम्हाला तुमच्या विक्रेता प्रोफाईलवर पुनर्निर्देशित केले जात आहे.
            </p>
          </div>
          <Navigate to="/merchant-profile" replace />
        </div>
      );
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
