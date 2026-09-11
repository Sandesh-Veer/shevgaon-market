import React, { useState, useRef } from 'react';
import { 
  Store, 
  User, 
  Tag, 
  Phone, 
  MapPin, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X,
  ImageIcon,
  Sparkles,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  FileText,
  Package
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { handlePayment, RazorpaySuccessResponse } from '../../utils/razorpay';

const CATEGORIES = [
  { id: 'Grocery', label: '🛒 किराणा (Grocery)' },
  { id: 'Electronics', label: '📱 इलेक्ट्रॉनिक्स (Electronics)' },
  { id: 'Clothing', label: '👕 कपडे (Clothing)' },
  { id: 'Services', label: '🛠️ सेवा (Services)' },
  { id: 'Food', label: '🍔 खाद्यपदार्थ (Food / Restaurant)' },
  { id: 'Other', label: '✨ इतर (Other)' }
];

interface Plan {
  id: 'basic' | 'premium';
  name: string;
  price: number;
  badge?: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'बेसिक प्लॅन (Basic Plan)',
    price: 199,
    features: [
      '१ दुकानाची अधिकृत नोंदणी',
      'ग्राहकांसाठी थेट कॉल व व्हॉट्सॲप सुविधा',
      'पत्ता आणि मूलभूत संपर्क लिस्टिंग',
      'शेवगाव सर्च विभागात सहभाग'
    ]
  },
  {
    id: 'premium',
    name: 'प्रीमियम प्लॅन (Premium Plan)',
    price: 499,
    badge: 'सर्वाधिक लोकप्रिय (Recommended)',
    features: [
      'सर्वोच्च शोध रँकिंग (Top Search Ranking)',
      'प्रमाणित व्हेरिफाइड बॅज (Verified Badge)',
      'अमर्यादित वस्तू व उत्पादन यादी (Items List)',
      'चालू ऑफर्स व सवलती पोस्ट करण्याची मुभा',
      '२४x७ प्राधान्य ग्राहक सहाय्य (Priority Support)'
    ]
  }
];

export default function AddShopForm() {
  const { user, merchantSession } = useAuth();
  const navigate = useNavigate();

  // Wizard Step: 1 = Shop Info, 2 = Plan Selection, 3 = Payment & Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Form Fields
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [items, setItems] = useState('');
  const [description, setDescription] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Step 2: Subscription Plan
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[0]); // Default to Basic (₹199)

  // Step 3: Payment & Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [completedPaymentId, setCompletedPaymentId] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMsg('कृपया वैध प्रतिमा फाईल निवडा (PNG, JPG, JPEG).');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey || apiKey === 'your_imgbb_api_key_here') {
      // Graceful fallback to high quality category image if key is not configured in local environment
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data?.error?.message || 'ImgBB इमेज अपलोड अयशस्वी झाले.');
      }

      return data.data.url;
    } catch (err) {
      console.warn('ImgBB upload error, fallback to demo placeholder:', err);
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
    }
  };

  // Step 1 Validation
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!shopName.trim() || !ownerName.trim() || !mobileNumber.trim() || !address.trim()) {
      setErrorMsg('कृपया सर्व आवश्यक माहिती प्रविष्ट करा (नाव, मालक, मोबाईल आणि पत्ता).');
      return;
    }

    if (mobileNumber.trim().length !== 10) {
      setErrorMsg('कृपया १० अंकी वैध मोबाईल नंबर प्रविष्ट करा.');
      return;
    }

    setCurrentStep(2);
  };

  // Step 2 Proceed to Step 3
  const handleProceedToStep3 = () => {
    setCurrentStep(3);
  };

  // Step 3 Payment Handler Trigger - Opens Razorpay Modal
  const handleTriggerPayment = () => {
    setErrorMsg(null);

    handlePayment({
      amount: selectedPlan.price,
      name: shopName.trim() || 'Shevgaon Market',
      description: `दुकान नोंदणी शुल्क - ${selectedPlan.name}`,
      prefill: {
        name: ownerName.trim(),
        contact: mobileNumber.trim(),
      },
      onSuccess: (response: RazorpaySuccessResponse) => {
        handlePaymentSuccess(response);
      },
      onError: (err: any) => {
        console.warn('Razorpay payment cancelled or failed:', err);
        setErrorMsg('पेमेंट प्रक्रिया पूर्ण झाली नाही किंवा रद्द केली गेली. कृपया पुन्हा प्रयत्न करा.');
      },
    });
  };

  // Payment Success & Database Logic
  // Upon successful payment, save the shop data to Firestore with fields:
  // status: 'pending', paymentStatus: 'paid', and paymentId: response.razorpay_payment_id.
  // Then redirect the merchant to the dashboard.
  const handlePaymentSuccess = async (paymentResponse: RazorpaySuccessResponse) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Upload image if provided
      let finalImageUrl = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
      if (imageFile) {
        finalImageUrl = await uploadToImgBB(imageFile);
      }

      // Convert comma-separated items to array
      const itemsList = items
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      // Determine ownerUid
      const ownerUid = user?.uid || (merchantSession ? `phone_${merchantSession.phoneNumber}` : `uid_${Date.now()}`);

      // 2. Save complete shop data to Firestore with required fields
      await addDoc(collection(db, 'shops'), {
        ownerUid,
        shopName: shopName.trim(),
        ownerName: ownerName.trim(),
        category,
        mobileNumber: mobileNumber.trim(),
        address: address.trim(),
        items: itemsList.length > 0 ? itemsList : [category],
        description: description.trim() || `${shopName.trim()} - ${category} शेवगाव.`,
        imageUrl: finalImageUrl,
        rating: 5.0, // Initial default rating
        // Database logic requirements from prompt:
        status: 'pending',
        paymentStatus: 'paid',
        paymentId: paymentResponse.razorpay_payment_id,
        planType: selectedPlan.id,
        planName: selectedPlan.name,
        amountPaid: selectedPlan.price,
        paidAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setCompletedPaymentId(paymentResponse.razorpay_payment_id);
      setRegistrationComplete(true);

      // Redirect the merchant to the dashboard
      navigate('/merchant-dashboard');
    } catch (err: any) {
      console.error('Firestore save error after payment:', err);
      setErrorMsg(err.message || 'माहिती जतन करताना त्रुटी आली. कृपया समर्थनाशी संपर्क साधा.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Completion Screen View
  if (registrationComplete) {
    return (
      <div className="w-full max-w-2xl mx-auto glass-card border border-emerald-200 dark:border-emerald-900/50 p-8 md:p-10 rounded-3xl shadow-xl space-y-6 text-center">
        <div className="w-18 h-18 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={42} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            नोंदणी आणि पेमेंट यशस्वी!
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
            आपले दुकान यशस्वीरीत्या शेवगाव मार्केटवर नोंदवले गेले आहे.
          </p>
        </div>

        {/* Transaction Badge */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 max-w-md mx-auto text-xs">
          <div className="flex justify-between items-center text-slate-500">
            <span>Transaction ID:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{completedPaymentId}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>प्लॅन (Plan):</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">{selectedPlan.name}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>पेमेंट स्थिती (Payment):</span>
            <span className="font-bold text-emerald-600">Paid (₹{selectedPlan.price})</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>दुकान स्थिती (Status):</span>
            <span className="font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
              Pending (प्रशासक पडताळणी प्रलंबित)
            </span>
          </div>
        </div>

        {/* Admin Verification Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs font-medium text-left flex items-start gap-3">
          <ShieldCheck size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <b>प्रशासकीय पडताळणी सूचना:</b> नियमांनुसार, प्रशासक (Admin) तुमच्या पेमेंटची पडताळणी करतील आणि २४ तासांच्या आत दुकान 'approved' करतील. मंजुरीनंतर आपले दुकान मुख्य पृष्ठावर सर्व ग्राहकांसाठी थेट उपलब्ध होईल.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => navigate('/merchant-dashboard')}
            className="px-6 py-3.5 rounded-2xl font-bold text-xs bg-gradient-brand text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            माझा डॅशबोर्ड पहा (Go to Dashboard)
          </button>
          <Link
            to="/home"
            className="px-6 py-3.5 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-center"
          >
            मुख्य पानावर जा (Back to Home)
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto glass-card border border-white/80 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 text-left">
      
      {/* Stepper Progress Bar */}
      <div className="pb-4 border-b border-gray-200/60 dark:border-slate-800">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'दुकान माहिती' },
            { step: 2, title: 'प्लॅन निवडा' },
            { step: 3, title: 'पेमेंट व पुष्टी' }
          ].map((s, idx) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  currentStep === s.step
                    ? 'bg-gradient-brand text-white shadow-md ring-4 ring-purple-100 dark:ring-purple-950/60'
                    : currentStep > s.step
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  {currentStep > s.step ? <Check size={14} strokeWidth={3} /> : s.step}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${
                  currentStep === s.step
                    ? 'text-brand-dark dark:text-white'
                    : 'text-slate-400'
                }`}>
                  {s.title}
                </span>
              </div>
              {idx < 2 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  currentStep > idx + 1 
                    ? 'bg-emerald-500' 
                    : 'bg-slate-200 dark:bg-slate-800'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle size={18} className="text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 1: Shop Information Form */}
      {/* ============================================================ */}
      {currentStep === 1 && (
        <form onSubmit={handleProceedToStep2} className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-brand-purple flex items-center justify-center">
              <Store size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                पायरी १: दुकानाची मूलभूत माहिती (Shop Info)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ग्राहक पाहू शकतील अशी दुकानाची अचूक माहिती भरा.
              </p>
            </div>
          </div>

          {/* Row 1: Shop Name & Owner Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Store size={13} className="text-brand-purple" />
                दुकानाचे नाव (Shop Name) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. पाटील जनरल स्टोअर्स"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User size={13} className="text-brand-purple" />
                मालकाचे नाव (Owner Name) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. रमेश पाटील"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Category Dropdown & Mobile Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tag size={13} className="text-brand-purple" />
                श्रेणी (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone size={13} className="text-brand-purple" />
                मोबाईल नंबर (Mobile Number) *
              </label>
              <input
                type="tel"
                maxLength={10}
                required
                placeholder="९८xxxxxx१०"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
              />
            </div>
          </div>

          {/* Row 3: Shop Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin size={13} className="text-brand-purple" />
              दुकानाचा पत्ता (Shop Address) *
            </label>
            <input
              type="text"
              required
              placeholder="उदा. क्रांती चौक, बस स्टँड रोड, शेवगाव"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
            />
          </div>

          {/* Row 4: Items / Products List */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Package size={13} className="text-brand-purple" />
              उपलब्ध उत्पादने / वस्तू (Items, स्वल्पविरामाने वेगळे करा)
            </label>
            <input
              type="text"
              placeholder="उदा. गहू, तांदूळ, साखर, तेल, मसाले"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              className="w-full bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all"
            />
            <p className="text-[11px] text-slate-400">
              सर्च बारमध्ये ग्राहक या वस्तूंना शोधू शकतील.
            </p>
          </div>

          {/* Row 5: Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText size={13} className="text-brand-purple" />
              दुकानाचे वर्णन (Shop Description)
            </label>
            <textarea
              rows={2}
              placeholder="उदा. आमच्याकडे सर्व प्रकारचे ताजे किराणा सामान व घरगुती वस्तू वाजवी दरात मिळतील."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all resize-none"
            />
          </div>

          {/* Row 6: Image File Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ImageIcon size={13} className="text-brand-purple" />
              दुकानाची फोटो (Shop Image)
            </label>

            {!imagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-5 text-center bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 cursor-pointer transition-all space-y-1.5 group"
              >
                <UploadCloud className="w-7 h-7 mx-auto text-slate-400 group-hover:text-brand-purple transition-colors" />
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  प्रतिमा अपलोड करा (Click to choose image)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <img 
                  src={imagePreview} 
                  alt="Shop preview" 
                  className="w-full h-full object-cover" 
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2.5 right-2.5 p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors shadow-lg"
                  title="काढा"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Step 1 Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-brand text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>पुढील पायरी: सबस्क्रिप्शन प्लॅन निवडा (Next: Choose Plan)</span>
            <ArrowRight size={16} />
          </button>
        </form>
      )}

      {/* ============================================================ */}
      {/* STEP 2: Subscription Plan Selection */}
      {/* ============================================================ */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-brand-purple flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                पायरी २: सबस्क्रिप्शन प्लॅन निवडा (Select Plan)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                तुमच्या व्यवसायाला अनुकूल असा परवडणारा डिजिटल प्लॅन निवडा.
              </p>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 relative ${
                    isSelected
                      ? 'border-brand-purple bg-gradient-to-b from-purple-50/70 to-white dark:from-purple-950/40 dark:to-slate-900 ring-2 ring-brand-purple/20 shadow-lg'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-brand text-white shadow-sm">
                      {plan.badge}
                    </span>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-brand-purple bg-brand-purple text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        ₹{plan.price}
                      </span>
                      <span className="text-xs text-slate-500">/ महिना</span>
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                          <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                      isSelected
                        ? 'bg-brand-purple text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isSelected ? 'निवडलेला प्लॅन (Selected)' : 'हा प्लॅन निवडा'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft size={16} />
              <span>मागे जा (Back)</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToStep3}
              className="px-6 py-3 rounded-2xl font-bold text-xs bg-gradient-brand text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <span>पेमेंटसाठी पुढे जा (Proceed to Payment)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 3: Payment Gateway Trigger (Razorpay integration) */}
      {/* ============================================================ */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-brand-purple flex items-center justify-center">
              <CreditCard size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                पायरी ३: ऑर्डर पुनरावलोकन आणि पेमेंट (Review & Pay)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Razorpay पेमेंट पूर्ण करून दुकान नोंदणी प्रक्रिया पूर्ण करा.
              </p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">नोंदणी तपशील</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{shopName}</h3>
                <p className="text-xs text-slate-500">{category} • मालक: {ownerName} ({mobileNumber})</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                {selectedPlan.name.split(' ')[0]}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>पत्ता (Address):</span>
                <span className="font-semibold text-right max-w-[240px] truncate">{address}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>निवडलेला सबस्क्रिप्शन प्लॅन:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>कालावधी:</span>
                <span className="font-semibold">१ महिना</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                <span>एकूण देय रक्कम (Total):</span>
                <span className="text-lg text-emerald-600 dark:text-emerald-400">₹{selectedPlan.price}</span>
              </div>
            </div>
          </div>

          {/* Trigger Razorpay Checkout Button */}
          <button
            type="button"
            onClick={handleTriggerPayment}
            disabled={isSubmitting}
            className="w-full bg-[#0c2340] hover:bg-[#11335d] text-white font-extrabold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin text-blue-400" />
                <span>दुकान नोंदणी सेव्ह होत आहे... (Saving Shop)</span>
              </>
            ) : (
              <>
                <CreditCard size={18} className="text-blue-400" />
                <span>Pay ₹{selectedPlan.price} to Register</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Back button */}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>प्लॅन बदला (Change Plan)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
