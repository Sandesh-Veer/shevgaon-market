import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Store,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MerchantLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginMerchant, isMerchantLoggedIn } = useAuth();

  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Destination route after login (e.g., /merchant-dashboard or /add-shop)
  const from = (location.state as any)?.from?.pathname || '/merchant-dashboard';

  // If already logged in, redirect directly
  useEffect(() => {
    if (isMerchantLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isMerchantLoggedIn, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('कृपया १० अंकी अचूक मोबाईल नंबर प्रविष्ट करा.');
      return;
    }

    if (pin && pin.length < 4) {
      setErrorMsg('कृपया किमान ४ अंकी पासवर्ड किंवा पिन प्रविष्ट करा.');
      return;
    }

    setLoading(true);

    try {
      const res = await loginMerchant(cleanPhone, shopName, pin || '123456');
      if (res.success) {
        setSuccessMsg('दुकानदार लॉगिन यशस्वी! पुनर्निर्देशित करत आहे...');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 600);
      } else {
        setErrorMsg(res.error || 'लॉगिन करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'लॉगिन अयशस्वी झाले. कृपया नेटवर्क तपासा.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Top Header & Icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm ring-8 ring-blue-50/50 dark:ring-blue-950/20">
            <Store size={32} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            दुकानदार लॉगिन
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            शेवगाव मार्केट व्यापारी पोर्टल – तुमची दुकाने, उत्पादने व ग्राहक ऑर्डर्स व्यवस्थापित करा.
          </p>
        </div>

        {/* Apple Settings / GPay Style Elevated Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-5"
        >
          {/* Status Notifications */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-medium">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* 1. Mobile Number Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                नोंदणीकृत मोबाईल नंबर <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1 text-slate-400 pointer-events-none">
                  <Phone size={16} strokeWidth={2} />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 pl-1 border-r border-slate-200 dark:border-slate-700 pr-2">
                    +91
                  </span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="९८७६५४३२१०"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-20 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* 2. Shop / Business Name (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                दुकानाचे नाव (ऐच्छिक)
              </label>
              <div className="relative flex items-center">
                <Store
                  size={16}
                  strokeWidth={2}
                  className="absolute left-3.5 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="उदा. साई समर्थ इलेक्ट्रॉनिक्स"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* 3. Security Passkey / PIN */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  सुरक्षा पिन / पासवर्ड
                </label>
                <span className="text-[10px] text-slate-400">
                  डिफॉल्ट: <code className="text-blue-600 font-mono">123456</code>
                </span>
              </div>
              <div className="relative flex items-center">
                <Lock
                  size={16}
                  strokeWidth={2}
                  className="absolute left-3.5 text-slate-400 pointer-events-none"
                />
                <input
                  type="password"
                  placeholder="किमान ४ अंकी पिन"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>पडताळणी सुरू आहे...</span>
              ) : (
                <>
                  <span>दुकानदार पोर्टलमध्ये प्रवेश करा</span>
                  <ArrowRight size={16} strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          {/* Quick Features Highlight */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              <span>सुरक्षित दुकानदार खाते</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500 shrink-0" />
              <span>दुकान व ऑफर्स व्यवस्थापन</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Switcher */}
        <div className="text-center space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            तुम्ही सामान्य ग्राहक आहात का?{' '}
            <Link
              to="/login"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              येथे ग्राहक लॉगिन करा
            </Link>
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            प्रशासक आहात?{' '}
            <Link
              to="/admin"
              className="font-bold text-slate-700 dark:text-slate-300 hover:underline"
            >
              प्रशासक पॅनेल (Admin)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
