import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Store, 
  Tag, 
  Phone, 
  FileText, 
  Percent, 
  Image as ImageIcon, 
  CreditCard, 
  Loader2, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db as firestoreDb } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import RazorpayModal from '../payment/RazorpayModal';

interface AddOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOfferAdded?: () => void;
}

export const AddOfferModal: React.FC<AddOfferModalProps> = ({
  isOpen,
  onClose,
  onOfferAdded,
}) => {
  const { user, merchantSession, userShop } = useAuth();

  // Form Fields
  const [offerTitle, setOfferTitle] = useState('');
  const [shopName, setShopName] = useState(userShop?.shopName || merchantSession?.shopName || '');
  const [category, setCategory] = useState(userShop?.category || 'कपडे');
  const [discount, setDiscount] = useState('20');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(userShop?.mobileNumber || merchantSession?.phoneNumber || '');
  const [imageUrl, setImageUrl] = useState('');

  // Payment states
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const PAY_PER_POST_FEE = 49; // Pay-per-post fee in INR

  if (!isOpen) return null;

  const handleValidateForm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!offerTitle.trim() || !shopName.trim() || !phone.trim()) {
      setErrorMsg('कृपया ऑफरचे शीर्षक, दुकानाचे नाव आणि संपर्क नंबर प्रविष्ट करा.');
      return;
    }

    if (phone.replace(/\D/g, '').length !== 10) {
      setErrorMsg('कृपया वैध १० अंकी संपर्क नंबर प्रविष्ट करा.');
      return;
    }

    // Open Razorpay for ₹49 pay-per-post fee
    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = async (paymentResponse: { paymentId: string; amount: number; method: string }) => {
    setIsRazorpayOpen(false);
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const finalImage = imageUrl.trim() || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80';
      const ownerUid = user?.uid || (merchantSession ? merchantSession.phoneNumber : 'merchant_' + Date.now());

      // Calculate expiresAt timestamp: exactly 24 hours ahead of the current time
      const expiresAt = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

      // Save to Firebase 'offers' collection
      await addDoc(collection(firestoreDb, 'offers'), {
        title: offerTitle.trim(),
        name: shopName.trim(),
        shopName: shopName.trim(),
        category,
        discount: discount.trim(),
        offerDiscount: discount.trim(),
        offerBanner: offerTitle.trim(),
        description: description.trim(),
        offerDesc: description.trim(),
        phone: phone.trim(),
        imageUrl: finalImage,
        logo: finalImage,
        photos: [finalImage],
        ownerUid,
        paymentStatus: 'paid',
        amountPaid: PAY_PER_POST_FEE,
        paymentId: paymentResponse.paymentId,
        paymentMethod: paymentResponse.method,
        status: 'active',
        createdAt: serverTimestamp(),
        expiresAt,
      });

      setSuccessMsg('ऑफर यशस्वीरीत्या पोस्ट झाली! शेवगाव मार्केटच्या चालू ऑफर्स विभागात ही ऑफर झळकेल.');

      if (onOfferAdded) {
        onOfferAdded();
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Error saving paid offer to Firestore:', err);
      setErrorMsg(err.message || 'ऑफर जतन करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-left my-8"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight">
                  नवीन ऑफर जोडा (Add Paid Offer)
                </h3>
                <p className="text-[11px] text-rose-100 font-medium">
                  Pay-per-post • शेवगावमधील हजारो ग्राहकांपर्यंत पोहोचवा
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Pay-per-post Pricing Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                  पोस्टिंग शुल्क (Pay-per-post Fee)
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  शेवगाव मार्केटवर ऑफर प्रसिद्ध करण्यासाठी नाममात्र शुल्क
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  ₹{PAY_PER_POST_FEE}
                </span>
                <p className="text-[10px] text-slate-400">/ प्रति पोस्ट</p>
              </div>
            </div>

            {/* Error / Success Alerts */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleValidateForm} className="space-y-4 text-xs">
              
              {/* Offer Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-rose-500" />
                  <span>ऑफरचे शीर्षक (Offer Headline) *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. दिवाळी महा धमाका - २०% ते ५०% सूट!"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              {/* Shop Name & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Store size={13} className="text-rose-500" />
                    <span>दुकानाचे नाव (Shop Name) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. पाटील क्लॉथ सेंटर"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Percent size={13} className="text-rose-500" />
                    <span>सूट टक्केवारी (% Discount) *</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    placeholder="उदा. 20"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              {/* Category & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Tag size={13} className="text-rose-500" />
                    <span>श्रेणी (Category)</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  >
                    <option value="कपडे">👕 कपडे (Clothing)</option>
                    <option value="स्वीट मार्ट">🧁 स्वीट मार्ट (Sweets)</option>
                    <option value="मोबाईल शॉप">📱 मोबाईल शॉप (Mobiles)</option>
                    <option value="किराणा">🛒 किराणा (Grocery)</option>
                    <option value="हॉटेल्स">🍔 हॉटेल्स (Food)</option>
                    <option value="इतर">✨ इतर (Other)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone size={13} className="text-rose-500" />
                    <span>संपर्क मोबाईल *</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="९८xxxxxx१०"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ImageIcon size={13} className="text-rose-500" />
                  <span>ऑफर बॅनर इमेज लिंक (Image URL)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://... (रिकामे सोडल्यास डीफॉल्ट आकर्षक इमेज वापरली जाईल)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText size={13} className="text-rose-500" />
                  <span>ऑफरचे तपशील व अटी (Offer Details)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="उदा. प्रत्येक ₹१००० च्या खरेदीवर थेट सूट. स्टॉक असेपर्यंत वैध."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-none"
                />
              </div>

              {/* Submit / Pay Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>ऑफर सेव्ह होत आहे...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    <span>₹{PAY_PER_POST_FEE} भरा आणि ऑफर प्रसिद्ध करा (Pay & Post)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Razorpay Checkout Trigger for ₹49 */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={PAY_PER_POST_FEE}
        title={`ऑफर पोस्टिंग फी: ${offerTitle}`}
        merchantName={shopName || 'Shevgaon Market'}
        customerPhone={phone}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default AddOfferModal;
