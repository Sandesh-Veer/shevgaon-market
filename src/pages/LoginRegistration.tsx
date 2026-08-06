import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Lock, 
  CheckCircle, 
  ArrowLeft, 
  Info,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginRegistration() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, user, role } = useAuth();
  
  // Form values
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(60);
  
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // If user is already logged in, redirect according to role
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/merchant-profile', { replace: true });
      }
    }
  }, [user, role, navigate]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any;
    if (isOtpSent && otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, otpCountdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = mobileNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      setFormError('कृपया १० अंकी मोबाईल नंबर प्रविष्ट करा.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    try {
      await sendOtp(cleanNumber);
      setIsOtpSent(true);
      setOtpCountdown(60);
      setSuccessMsg('OTP तुमच्या मोबाईल नंबरवर पाठवला गेला आहे.');
    } catch (err: any) {
      console.error('OTP Send error:', err);
      setFormError(err.message || 'OTP पाठवताना त्रुटी आली. कृपया नंबर तपासा किंवा पुन्हा प्रयत्न करा.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpCode.replace(/\D/g, '');
    if (cleanOtp.length < 6) {
      setFormError('कृपया ६-अंकी OTP प्रविष्ट करा.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    try {
      const res = await verifyOtp(cleanOtp);
      if (res.success) {
        setSuccessMsg('लॉगिन यशस्वी झाले!');
        setTimeout(() => {
          if (res.role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/merchant-profile', { replace: true });
          }
        }, 1000);
      } else {
        setFormError(res.error || 'OTP पडताळणी अयशस्वी. पुन्हा प्रयत्न करा.');
      }
    } catch (err: any) {
      setFormError(err.message || 'अवैध OTP प्रविष्ट केला गेला आहे.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-6 pb-16 px-4 text-left relative z-10">
      
      {/* Container for Firebase Invisible Recaptcha */}
      <div id="recaptcha-container"></div>

      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-purple hover:text-brand-blue mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> मुख्य पानावर जा (Back to Home)
      </Link>

      {/* Success alert banner */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 glass-card border-emerald-500/50 bg-emerald-50/50 text-emerald-800 text-sm flex items-center gap-3 rounded-2xl"
          >
            <CheckCircle className="text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error alert banner */}
      <AnimatePresence>
        {formError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 glass-card border-rose-500/50 bg-rose-50/50 text-rose-800 text-sm flex items-center gap-3 rounded-2xl"
          >
            <AlertCircle className="text-rose-600 flex-shrink-0" />
            <span className="font-semibold">{formError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Glass Box */}
      <div className="glass-card border border-white/70 p-6 md:p-8 shadow-soft relative overflow-hidden rounded-3xl">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-brand text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              सुरक्षित मोबाईल लॉगिन
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Phone OTP Verified Login & Role Routing
            </p>
          </div>
        </div>

        {/* MOBILE OTP FLOW */}
        <div className="space-y-4">
          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone size={14} className="text-brand-purple" />
                  मोबाईल नंबर (10-Digit Mobile)
                </label>

                {/* Input field with fixed +91 prefix */}
                <div className="flex items-center rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 overflow-hidden focus-within:ring-2 focus-within:ring-brand-purple/30 transition-all">
                  <span className="px-4 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm border-r border-gray-200 dark:border-slate-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="९८xxxxxx१०"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-transparent py-3.5 px-4 text-slate-800 dark:text-slate-100 font-semibold text-sm focus:outline-none placeholder-slate-400"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-normal">
                  उदाहरण: ९८७६५४३२१० (OTP एसएमएस द्वारे येईल)
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-brand text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-80 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'OTP पाठवत आहे...' : 'OTP पाठवा (Get OTP)'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* OTP Received Info */}
              <div className="p-3.5 bg-brand-purple/10 border border-brand-purple/20 rounded-2xl text-xs text-brand-purple leading-relaxed flex gap-2.5 items-start">
                <Info size={18} className="shrink-0 mt-0.5" />
                <div>
                  आम्ही <b>+91 {mobileNumber}</b> या क्रमांकावर ६-अंकी OTP पाठवला आहे.
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock size={14} className="text-brand-purple" />
                  OTP प्रविष्ट करा (6-Digit OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="xxxxxx"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl py-3.5 px-4 text-center tracking-[0.4em] font-mono font-bold text-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
                />
              </div>

              {/* Resend timer */}
              <div className="flex justify-between items-center text-xs px-1">
                <span className="text-slate-400 flex items-center gap-1 font-medium">
                  <Clock size={13} /> {otpCountdown > 0 ? `00:${otpCountdown < 10 ? '0' : ''}${otpCountdown}` : 'वेळ संपली'}
                </span>
                <button
                  type="button"
                  disabled={otpCountdown > 0}
                  onClick={() => {
                    setOtpCountdown(60);
                    setOtpCode('');
                    handleSendOtp({ preventDefault: () => {} } as any);
                  }}
                  className={`font-semibold transition-colors ${
                    otpCountdown > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-brand-purple hover:text-brand-blue'
                  }`}
                >
                  पुन्हा पाठवा (Resend OTP)
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-brand text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-80"
              >
                {isSubmitting ? 'पडताळणी करत आहे...' : 'लॉगिन करा (Verify & Login)'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOtpSent(false);
                  setOtpCode('');
                  setFormError('');
                }}
                className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pt-1"
              >
                ← मोबाईल नंबर बदला
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
