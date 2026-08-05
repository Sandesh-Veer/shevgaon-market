import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  CheckCircle, 
  ArrowLeft, 
  Info,
  Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginRegistration() {
  const navigate = useNavigate();
  
  // Tab states: 'login' or 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login type states: 'mobile' or 'email'
  const [loginType, setLoginType] = useState<'mobile' | 'email'>('mobile');
  
  // Form values
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(60);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register values
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('customer'); // customer, farmer, partner
  const [regPassword, setRegPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regTerms, setRegTerms] = useState(false);

  // Modals / Statuses
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmailOrPhone, setForgotEmailOrPhone] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any;
    if (isOtpSent && otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    } else if (otpCountdown === 0) {
      // countdown finished
    }
    return () => clearInterval(interval);
  }, [isOtpSent, otpCountdown]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      setFormErrors({ mobileNumber: 'कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा.' });
      return;
    }
    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsOtpSent(true);
      setOtpCountdown(60);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.length < 4) {
      setFormErrors({ otpCode: 'कृपया वैध ४ अंकी OTP प्रविष्ट करा.' });
      return;
    }
    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg('लॉगिन यशस्वी झाले!');
      setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 1500);
    }, 1200);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'कृपया वैध ईमेल आयडी प्रविष्ट करा.';
    }
    if (!password.trim() || password.length < 6) {
      errors.password = 'पासवर्ड किमान ६ अंकी असावा.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg('लॉगिन यशस्वी झाले!');
      setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 1500);
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!regName.trim()) errors.regName = 'कृपया पूर्ण नाव प्रविष्ट करा.';
    if (!regMobile.trim() || regMobile.length < 10) errors.regMobile = 'वैध १० अंकी मोबाईल नंबर प्रविष्ट करा.';
    if (!regEmail.trim() || !/\S+@\S+\.\S+/.test(regEmail)) errors.regEmail = 'वैध ईमेल प्रविष्ट करा.';
    if (!regPassword.trim() || regPassword.length < 6) errors.regPassword = 'पासवर्ड किमान ६ अंकी असावा.';
    if (!regTerms) errors.regTerms = 'नोंदणीसाठी अटी व शर्ती मान्य करणे आवश्यक आहे.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg('नोंदणी यशस्वी झाली! आता लॉगिन करा.');
      setTimeout(() => {
        setSuccessMsg('');
        setActiveTab('login');
        // Clear reg form
        setRegName('');
        setRegMobile('');
        setRegEmail('');
        setRegPassword('');
        setRegTerms(false);
      }, 2000);
    }, 1500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmailOrPhone.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setForgotSent(true);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg('Google द्वारे लॉगिन यशस्वी!');
      setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto pt-6 pb-16 px-4 text-left relative z-10">
      
      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-purple hover:text-brand-blue mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> मुख्य पानावर जा
      </Link>

      {/* Success alert banner */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 glass-card border-emerald-500/50 bg-emerald-50/50 text-emerald-800 text-sm flex items-center gap-3"
          >
            <CheckCircle className="text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Glass Box */}
      <div className="glass-card border border-white/70 p-6 md:p-8 shadow-soft relative overflow-hidden">
        
        {/* Dual Tab toggler */}
        <div className="flex bg-slate-100/80 border border-gray-200/50 rounded-2xl p-1 mb-8">
          <button
            onClick={() => { setActiveTab('login'); setFormErrors({}); }}
            className={`flex-1 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
              activeTab === 'login' 
                ? 'bg-gradient-brand text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            लॉगिन (Login)
          </button>
          <button
            onClick={() => { setActiveTab('register'); setFormErrors({}); }}
            className={`flex-1 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
              activeTab === 'register' 
                ? 'bg-gradient-brand text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            नोंदणी (Register)
          </button>
        </div>

        {/* Tab 1: LOGIN FLOW */}
        {activeTab === 'login' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-brand-dark">स्वागत आहे!</h2>
              <p className="text-xs text-brand-muted font-light">तुमच्या खात्यात लॉगिन करण्यासाठी योग्य पर्याय निवडा.</p>
            </div>

            {/* Login Type selection pills */}
            <div className="flex gap-2">
              <button
                onClick={() => { setLoginType('mobile'); setFormErrors({}); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  loginType === 'mobile'
                    ? 'bg-brand-purple/10 border-brand-purple/30 text-brand-purple'
                    : 'bg-white/40 border-gray-200/60 text-brand-muted hover:text-brand-dark'
                }`}
              >
                मोबाईल नंबर
              </button>
              <button
                onClick={() => { setLoginType('email'); setFormErrors({}); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  loginType === 'email'
                    ? 'bg-brand-purple/10 border-brand-purple/30 text-brand-purple'
                    : 'bg-white/40 border-gray-200/60 text-brand-muted hover:text-brand-dark'
                }`}
              >
                ईमेल आयडी
              </button>
            </div>

            {/* A. MOBILE LOGIN METHOD */}
            {loginType === 'mobile' && (
              <div className="space-y-4">
                {!isOtpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                        <Phone size={13} className="text-brand-purple" />
                        मोबाईल नंबर
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="उदा. ९८xxxxxx१०"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        className={`w-full bg-white/50 border rounded-2xl py-3.5 px-4 text-brand-dark text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-purple/20 transition-all ${
                          formErrors.mobileNumber ? 'border-red-400' : 'border-gray-200/80 focus:border-brand-purple'
                        }`}
                      />
                      {formErrors.mobileNumber && (
                        <p className="text-xs text-red-500 font-medium">{formErrors.mobileNumber}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-brand text-white font-semibold py-4 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-80"
                    >
                      {isSubmitting ? 'OTP पाठवत आहे...' : 'OTP मिळवा'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    {/* OTP Received Indicator */}
                    <div className="p-3.5 bg-brand-purple/5 border border-brand-purple/20 rounded-2xl text-xs text-brand-purple leading-relaxed flex gap-2 items-start">
                      <Info size={16} className="shrink-0 mt-0.5" />
                      <div>
                        आम्ही <b>+91 {mobileNumber}</b> या क्रमांकावर ४-अंकी OTP पाठवला आहे.
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                        <Lock size={13} className="text-brand-purple" />
                        OTP संकेतशब्द (४-अंकी)
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="xxxx"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className={`w-full bg-white/50 border rounded-2xl py-3.5 px-4 text-center tracking-widest font-mono text-lg text-brand-dark placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-purple/20 transition-all ${
                          formErrors.otpCode ? 'border-red-400' : 'border-gray-200/80 focus:border-brand-purple'
                        }`}
                      />
                      {formErrors.otpCode && (
                        <p className="text-xs text-red-500 font-medium">{formErrors.otpCode}</p>
                      )}
                    </div>

                    {/* Resend timer or trigger */}
                    <div className="flex justify-between items-center text-xs px-1">
                      <span className="text-brand-muted flex items-center gap-1">
                        <Clock size={12} /> {otpCountdown > 0 ? `00:${otpCountdown < 10 ? '0' : ''}${otpCountdown}` : 'वेळ संपली'}
                      </span>
                      <button
                        type="button"
                        disabled={otpCountdown > 0}
                        onClick={() => {
                          setOtpCountdown(60);
                          setOtpCode('');
                        }}
                        className={`font-semibold transition-colors ${
                          otpCountdown > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-brand-purple hover:text-brand-blue'
                        }`}
                      >
                        पुन्हा पाठवा (Resend)
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-brand text-white font-semibold py-4 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {isSubmitting ? 'पडताळणी करत आहे...' : 'लॉगिन करा'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsOtpSent(false);
                        setOtpCode('');
                      }}
                      className="w-full text-center text-xs font-semibold text-brand-muted hover:text-brand-dark pt-1"
                    >
                      नंबर बदला
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* B. EMAIL LOGIN METHOD */}
            {loginType === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                    <Mail size={13} className="text-brand-purple" />
                    ईमेल आयडी
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-white/50 border rounded-2xl py-3.5 px-4 text-brand-dark text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-purple/20 transition-all ${
                      formErrors.email ? 'border-red-400' : 'border-gray-200/80 focus:border-brand-purple'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                      <Lock size={13} className="text-brand-purple" />
                      पासवर्ड
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-brand-purple font-semibold hover:underline"
                    >
                      पासवर्ड विसरलात?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full bg-white/50 border rounded-2xl py-3.5 px-4 pr-10 text-brand-dark text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-purple/20 transition-all ${
                        formErrors.password ? 'border-red-400' : 'border-gray-200/80 focus:border-brand-purple'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-brand-dark transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.password}</p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center gap-2 px-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-brand-purple border-gray-300 rounded focus:ring-brand-purple"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-brand-muted cursor-pointer select-none">
                    मला लक्षात ठेवा (Remember Me)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-brand text-white font-semibold py-4 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-80"
                >
                  {isSubmitting ? 'लॉगिन होत आहे...' : 'लॉगिन करा'}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <span className="absolute inset-x-0 h-px bg-gray-200" />
              <span className="relative bg-white/90 backdrop-blur-md px-3 text-xs text-brand-muted uppercase font-bold tracking-wider">
                किंवा
              </span>
            </div>

            {/* Google Sign-in */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 bg-white border border-gray-200 rounded-2xl text-brand-dark text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38C17,15.17,14.93,16.5,12,16.5c-3.03,0-5.61-2.05-6.53-4.82C5.24,10.98,5.12,10.25,5.12,9.5s0.12-1.48,0.35-2.18C6.39,4.55,8.97,2.5,12,2.5c1.9,0,3.64,0.73,4.98,2L19,2.5C17.18,0.95,14.7,0,12,0,7.34,0,3.35,2.68,1.47,6.6A11.75,11.75,0,0,0,1.12,9.5a11.75,11.75,0,0,0,0.35,2.9C3.35,16.32,7.34,19,12,19c3.15,0,5.79-1.04,7.72-2.85C22.25,14.07,22.7,11.1,21.35,11.1Z" fill="#EA4335" />
                  <path d="M12,24c3.24,0,5.97-1.08,7.96-2.91l-3.8-2.95c-1.15,0.77-2.61,1.26-4.16,1.26-3.2,0-5.91-2.16-6.88-5.07L1.31,17.22C3.26,21.15,7.31,24,12,24Z" fill="#34A853" />
                  <path d="M5.12,14.33A7.1,7.1,0,0,1,4.75,12a7.1,7.1,0,0,1,0.37-2.33L1.31,6.78a11.91,11.91,0,0,0,0,10.44Z" fill="#FBBC05" />
                  <path d="M12,4.75c1.77,0,3.35,0.61,4.6,1.8l3.42-3.42C17.95,1.19,15.15,0,12,0,7.31,0,3.26,2.85,1.31,6.78L5.12,9.67C6.09,6.76,8.8,4.75,12,4.75Z" fill="#4285F4" />
                </g>
              </svg>
              Google सह लॉगिन करा
            </button>
          </div>
        )}

        {/* Tab 2: REGISTRATION FLOW */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-brand-dark">खाते तयार करा</h2>
              <p className="text-xs text-brand-muted font-light">अचूक माहिती भरून नोंदणी प्रक्रिया पूर्ण करा.</p>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                <User size={13} className="text-brand-purple" />
                पूर्ण नाव
              </label>
              <input
                type="text"
                placeholder="उदा. रामराव पाटील"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className={`w-full bg-white/50 border rounded-2xl py-3 px-4 text-brand-dark text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-purple/20 transition-all ${
                  formErrors.regName ? 'border-red-400' : 'border-gray-200/80 focus:border-brand-purple'
                }`}
              />
              {formErrors.regName && (
                <p className="text-xs text-red-500 font-medium">{formErrors.regName}</p>
              )}
            </div>

            {/* Mobile Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                <Phone size={13} className="text-brand-purple" />
                मोबाईल नंबर
              </label>
              <input
                type="tel"
                maxLength={10}
                placeholder="उदा. ९८xxxxxx१०"
                value={regMobile}
                onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                className={`w-full bg-white/50 border rounded-2xl py-3 px-4 text-brand-dark text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-purple/20 transition-all ${
                  formErrors.regMobile ? 'border-red-400' : 'border-gray-200/80 focus:border-brand-purple'
                }`}
              />
              {formErrors.regMobile && (
                <p className="text-xs text-red-500 font-medium">{formErrors.regMobile}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                <Mail size={13} className="text-brand-purple" />
                ईमेल आयडी
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className={`w-full bg-white/50 border rounded-2xl py-3 px-4 text-brand-dark text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-purple/20 transition-all ${
                  formErrors.regEmail ? 'border-red-400' : 'border-gray-200/80 focus:border-brand-purple'
                }`}
              />
              {formErrors.regEmail && (
                <p className="text-xs text-red-500 font-medium">{formErrors.regEmail}</p>
              )}
            </div>

            {/* Role Select Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                भूमिका निवडा (Role)
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="w-full bg-white/60 border border-gray-200 rounded-2xl py-3 px-4 text-brand-dark text-sm focus:outline-none focus:bg-white focus:border-brand-purple transition-all"
              >
                <option value="customer">ग्राहक (Customer)</option>
                <option value="farmer">शेतकरी (Farmer)</option>
                <option value="partner">व्यावसायिक (Business Partner)</option>
              </select>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                <Lock size={13} className="text-brand-purple" />
                संकेतशब्द (पासवर्ड)
              </label>
              <div className="relative">
                <input
                  type={regShowPassword ? 'text' : 'password'}
                  placeholder="किमान ६ अक्षरे/अंक"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className={`w-full bg-white/50 border rounded-2xl py-3 px-4 pr-10 text-brand-dark text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-purple/20 transition-all ${
                    formErrors.regPassword ? 'border-red-400' : 'border-gray-200/80 focus:border-brand-purple'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setRegShowPassword(!regShowPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-brand-dark transition-colors"
                >
                  {regShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formErrors.regPassword && (
                <p className="text-xs text-red-500 font-medium">{formErrors.regPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-1">
              <div className="flex items-start gap-2 px-1 pt-1">
                <input
                  type="checkbox"
                  id="regTerms"
                  checked={regTerms}
                  onChange={(e) => setRegTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-brand-purple border-gray-300 rounded focus:ring-brand-purple"
                />
                <label htmlFor="regTerms" className="text-xs text-brand-muted cursor-pointer select-none leading-normal">
                  मी या प्लॅटफॉर्मचे सर्व नियम, अटी आणि गोपनीयता धोरणे मान्य करतो.
                </label>
              </div>
              {formErrors.regTerms && (
                <p className="text-xs text-red-500 font-medium px-1">{formErrors.regTerms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-brand text-white font-semibold py-4 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-80"
            >
              {isSubmitting ? 'नोंदणी करत आहे...' : 'नोंदणी करा'}
            </button>
          </form>
        )}

      </div>

      {/* Forgot Password Popup Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-sm glass-card p-6 md:p-8 border border-white shadow-2xl relative text-left"
            >
              <button
                onClick={() => { setShowForgotModal(false); setForgotSent(false); setForgotEmailOrPhone(''); }}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-white text-brand-dark transition-colors shadow-sm font-bold text-xs"
              >
                ✕
              </button>

              {!forgotSent ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-brand-dark">पासवर्ड विसरलात?</h3>
                    <p className="text-xs text-brand-muted font-light leading-normal">
                      तुमचा नोंदणीकृत ईमेल किंवा मोबाईल नंबर खाली भरा. पासवर्ड रिसेट लिंक किंवा संकेतशब्द पाठवला जाईल.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="उदा. name@example.com किंवा ९८xxxxxx१०"
                      value={forgotEmailOrPhone}
                      onChange={(e) => setForgotEmailOrPhone(e.target.value)}
                      className="w-full bg-white/60 border border-gray-200 rounded-xl py-3 px-4 text-brand-dark text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-purple transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-brand text-white font-semibold py-3.5 rounded-xl hover:shadow-md transition-all disabled:opacity-80"
                  >
                    {isSubmitting ? 'पाठवत आहे...' : 'माहिती सबमिट करा'}
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-4 py-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto">
                    <CheckCircle className="text-emerald-600" size={28} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-brand-dark text-lg">दुवा पाठवला आहे!</h4>
                    <p className="text-xs text-brand-muted font-light leading-relaxed">
                      आम्ही <b>{forgotEmailOrPhone}</b> या पत्त्यावर पासवर्ड रिसेट करण्याचे दिशानिर्देश पाठवले आहेत.
                    </p>
                  </div>
                  <button
                    onClick={() => { setShowForgotModal(false); setForgotSent(false); setForgotEmailOrPhone(''); }}
                    className="w-full py-3 bg-slate-100 hover:bg-white border border-gray-200 text-brand-dark font-semibold rounded-xl text-xs transition-all"
                  >
                    बंद करा
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
