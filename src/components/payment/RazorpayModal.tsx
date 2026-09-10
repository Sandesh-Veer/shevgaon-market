import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  Loader2, 
  Lock, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  title: string;
  description?: string;
  merchantName?: string;
  customerPhone?: string;
  onSuccess: (paymentResponse: { paymentId: string; amount: number; method: string }) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  amount,
  title,
  description,
  merchantName = 'Shevgaon Market',
  customerPhone,
  onSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);

    // Simulate authentic Razorpay transaction processing
    setTimeout(() => {
      const generatedId = `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
      setPaymentId(generatedId);
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        onSuccess({
          paymentId: generatedId,
          amount,
          method: selectedMethod,
        });
        setIsSuccess(false);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-left"
      >
        {/* Razorpay Branded Top Header */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-extrabold text-blue-400 tracking-wider">
              RZP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold tracking-tight">Razorpay Checkout</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500 text-white uppercase tracking-wider">
                  Test / Secure
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                {merchantName} • सुरक्षित पेमेंट गेटवे
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors z-10 disabled:opacity-50"
          >
            <X size={18} />
          </button>

          {/* Ambient Glow */}
          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-blue-600/30 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Success State Overlay */}
        <AnimatePresence>
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center space-y-4 my-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  पेमेंट यशस्वी झाले! (Payment Successful)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Transaction ID: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{paymentId}</span>
                </p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                  ₹{amount} यशस्वीरीत्या जमा झाले.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="p-6 space-y-5">
              
              {/* Amount & Plan Summary Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:to-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    एकूण देय रक्कम (Total Due)
                  </span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    ₹{amount}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate max-w-[220px]">
                    {description || title}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <ShieldCheck size={26} />
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  पेमेंट पद्धत निवडा (Choose Payment Mode)
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === 'upi'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Smartphone size={18} />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span>कार्ड (Card)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === 'netbanking'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Building2 size={18} />
                    <span>नेट बँकिंग</span>
                  </button>
                </div>
              </div>

              {/* Selected Method Details */}
              {selectedMethod === 'upi' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    UPI ॲप निवडा किंवा QR कोड स्कॅन करा
                  </span>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'gpay', label: 'Google Pay' },
                      { id: 'phonepe', label: 'PhonePe' },
                      { id: 'paytm', label: 'Paytm' },
                      { id: 'qr', label: 'QR Code' }
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiApp(app.id as any)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all ${
                          upiApp === app.id
                            ? 'bg-white dark:bg-slate-700 border-blue-500 text-blue-600 dark:text-blue-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-700'
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Lock size={12} className="text-emerald-500" />
                      <span>{customerPhone ? `+91 ${customerPhone}` : 'UPI ID द्वारे थेट पेमेंट'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      Verified
                    </span>
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 space-y-2 text-xs">
                  <input
                    type="text"
                    disabled
                    value="•••• •••• •••• 4242 (Razorpay Test Card)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-mono text-slate-700 dark:text-slate-300"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      disabled
                      value="12/28"
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-center font-mono text-slate-700 dark:text-slate-300"
                    />
                    <input
                      type="text"
                      disabled
                      value="CVV: 123"
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-center font-mono text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-semibold">सर्व प्रमुख बँका उपलब्ध:</p>
                  <p className="text-[11px] text-slate-500">
                    SBI, HDFC Bank, ICICI Bank, Axis Bank, Bank of Maharashtra
                  </p>
                </div>
              )}

              {/* Pay Now Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full bg-[#0c2340] hover:bg-[#11335d] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75 disabled:cursor-not-allowed group"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-blue-400" />
                    <span>पेमेंट प्रक्रिया सुरू आहे... (Processing)</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} className="text-emerald-400" />
                    <span>₹{amount} सुरक्षित भरा (Pay Now via Razorpay)</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span>256-bit SSL एन्क्रिप्शन • Razorpay अधिकृत सुरक्षा</span>
              </div>

            </div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default RazorpayModal;
