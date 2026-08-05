import { useState } from 'react';
import { CheckCircle2, ShieldCheck, Building, Phone, MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorRegistration() {
  const [step, setStep] = useState(1);
  const [isPaid, setIsPaid] = useState(false);

  const handlePaymentSimulate = () => {
    setIsPaid(true);
    setTimeout(() => {
      setStep(3); // Success step
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto space-y-8 pt-6 pb-16 px-4 text-left">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-purple">भागीदार नोंदणी</span>
        <h1 className="text-3xl font-extrabold text-brand-dark">आमच्या नेटवर्कमध्ये सामील व्हा</h1>
        <p className="text-sm text-brand-muted max-w-xs mx-auto font-light">
          तुमची डिजिटल प्रोफाईल तयार करा आणि काही मिनिटांतच ग्राहकांपर्यंत पोहोचा.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              step >= s ? 'bg-gradient-brand' : 'bg-gray-200'
            }`} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-6 border border-white/70 shadow-soft space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-brand-dark">व्यवसाय प्रोफाइल</h2>
              <p className="text-brand-muted text-xs font-light mt-1">कृपया खालील फॉर्ममध्ये दुकानाची अचूक माहिती भरा.</p>
            </div>
            
            <div className="space-y-4">
              {/* Shop name */}
              <div className="space-y-1">
                <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">दुकानाचे नाव</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full bg-white/60 border border-gray-200 rounded-xl p-3 pl-10 text-brand-dark text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-all" 
                    placeholder="उदा. रमेश इलेक्ट्रिक वर्क्स" 
                  />
                  <Building size={16} className="absolute left-3.5 top-3.5 text-brand-purple" />
                </div>
              </div>
              
              {/* WhatsApp mobile number */}
              <div className="space-y-1">
                <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">व्हॉट्सॲप क्रमांक</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    className="w-full bg-white/60 border border-gray-200 rounded-xl p-3 pl-10 text-brand-dark text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-all" 
                    placeholder="उदा. ९८xxxxxx१०" 
                  />
                  <Phone size={16} className="absolute left-3.5 top-3.5 text-brand-purple" />
                </div>
              </div>

              {/* Location details */}
              <div className="space-y-1">
                <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">पत्ता / परिसर</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full bg-white/60 border border-gray-200 rounded-xl p-3 pl-10 text-brand-dark text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-all" 
                    placeholder="उदा. क्रांती चौक, शेवगांव" 
                  />
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-brand-purple" />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-gradient-brand text-white font-semibold py-3.5 rounded-xl hover:shadow-[0_8px_20px_rgba(79,124,255,0.25)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-1.5"
            >
              खाते सक्रिय करण्यासाठी पुढे जा
              <ArrowRight size={15} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-6 border border-white/70 shadow-soft space-y-6 text-center"
          >
            <div className="text-left space-y-1">
              <h2 className="text-xl font-bold text-brand-dark">खाते सक्रिय करा</h2>
              <p className="text-brand-muted text-xs font-light">प्रोफाईल पडताळणी व नोंदणी सक्रिय करण्यासाठी ₹९९ चे एकवेळ शुल्क भरा.</p>
            </div>
            
            {/* QR Scanner visual box */}
            <div className="bg-slate-50 border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
              <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <img src="/payment_qr.png" alt="PhonePe QR Code" className="w-[180px] h-[180px] object-contain select-none" />
              </div>
              
              <div className="mt-5 font-mono font-bold text-xs text-brand-purple bg-brand-purple/5 border border-brand-purple/20 px-4 py-1.5 rounded-full">
                कोणत्याही UPI ॲपने स्कॅन करा
              </div>
              
              <AnimatePresence>
                {isPaid && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-emerald-500/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-white"
                  >
                    <CheckCircle2 size={64} className="mb-2 text-white drop-shadow-sm" />
                    <span className="font-bold text-xl">पेमेंट यशस्वी झाले!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!isPaid && (
              <button 
                onClick={handlePaymentSimulate}
                className="w-full bg-white border border-gray-200 text-brand-purple hover:bg-slate-50 font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                पेमेंट पडताळणी सिम्युलेट करा
              </button>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-8 border border-white/70 shadow-soft flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
              <ShieldCheck size={40} className="text-emerald-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-brand-dark">तुमचे खाते सुरू झाले आहे!</h2>
              <p className="text-brand-muted text-sm font-light leading-relaxed px-2">
                तुमचे भागीदार खाते यशस्वीरित्या सुरू झाले असून आता ते ग्राहकांना दिसू लागेल.
              </p>
            </div>
            
            <a 
              href="/vendor/dashboard"
              className="w-full block text-center bg-gradient-brand text-white font-semibold py-3.5 rounded-xl hover:shadow-[0_8px_20px_rgba(79,124,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
            >
              डॅशबोर्डवर जा
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
