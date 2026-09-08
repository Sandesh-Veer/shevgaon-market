import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import WelcomeLanding from './pages/WelcomeLanding';
import LoginRegistration from './pages/LoginRegistration';
import MerchantLogin from './pages/MerchantLogin';
import VendorDashboard from './pages/VendorDashboard';
import VendorRegistration from './pages/VendorRegistration';
import BusinessDetail from './pages/BusinessDetail';
import AdminDashboard from './pages/AdminDashboard';
import MerchantProfile from './pages/MerchantProfile';
import AddShopPage from './pages/AddShopPage';
import OfflineFallback from './components/OfflineFallback';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();

  const isLandingPage =
    location.pathname === '/' ||
    location.pathname === '/welcome' ||
    location.pathname === '/landing';

  // Initialize theme from localStorage on initial load
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Dedicated Fullscreen Landing Page rendering
  if (isLandingPage) {
    return (
      <div className="w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] overflow-hidden bg-slate-950">
        <OfflineFallback />
        <Routes>
          <Route path="/" element={<WelcomeLanding />} />
          <Route path="/welcome" element={<WelcomeLanding />} />
          <Route path="/landing" element={<WelcomeLanding />} />
        </Routes>
      </div>
    );
  }

  return (
    <MainLayout>
      {/* Global Offline Network Status Overlay */}
      <OfflineFallback />

      {/* Pages Content */}
      <Routes>
        {/* Public & Customer Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginRegistration />} />
        <Route path="/business/:category/:id" element={<BusinessDetail />} />
        <Route path="/vendor/register" element={<VendorRegistration />} />

        {/* 1. Dedicated Shopkeeper (Merchant) Login */}
        <Route path="/merchant-login" element={<MerchantLogin />} />

        {/* 2. Protected Merchant Dashboard & Shop Management */}
        <Route
          path="/merchant-dashboard"
          element={
            <ProtectedRoute redirectTo="/merchant-login">
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute redirectTo="/merchant-login">
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/merchant-profile"
          element={
            <ProtectedRoute redirectTo="/merchant-login">
              <MerchantProfile />
            </ProtectedRoute>
          }
        />

        {/* 3. Shopkeeper Add Shop (Protected Behind Merchant Login) */}
        <Route
          path="/add-shop"
          element={
            <ProtectedRoute redirectTo="/merchant-login">
              <AddShopPage />
            </ProtectedRoute>
          }
        />

        {/* 4. Admin Panel Route (Handles its own secure login session) */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </MainLayout>
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
