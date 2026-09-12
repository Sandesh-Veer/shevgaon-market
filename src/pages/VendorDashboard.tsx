import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Edit2, 
  MapPin, 
  Phone, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock3, 
  CreditCard, 
  Package, 
  Layers, 
  Share2, 
  ArrowRight, 
  PlusCircle, 
  Loader2, 
  X,
  MessageSquare
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db as firestoreDb } from '../services/firebase';
import { useAuth, MerchantShop } from '../context/AuthContext';
import { db } from '../services/db';

export default function VendorDashboard() {
  const { user, merchantSession } = useAuth();
  const currentUid = user?.uid;

  // Single shop state: Fetch and display ONLY the shop document where ownerUid === currentUser.uid
  const [shop, setShop] = useState<MerchantShop | null>(null);
  const [loadingShop, setLoadingShop] = useState<boolean>(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editItems, setEditItems] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    // If not logged in, end loading
    if (!currentUid && !merchantSession?.phoneNumber) {
      setLoadingShop(false);
      return;
    }

    setLoadingShop(true);

    // TASK 1: Fetch and display ONLY the shop document where ownerUid === currentUser.uid. Do not fetch all shops.
    let q;
    if (currentUid) {
      q = query(
        collection(firestoreDb, 'shops'),
        where('ownerUid', '==', currentUid)
      );
    } else {
      q = query(
        collection(firestoreDb, 'shops'),
        where('mobileNumber', '==', merchantSession!.phoneNumber)
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot: any) => {
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          const data = { id: docSnap.id, ...(docSnap.data() as any) };
          setShop(data);

          // Populate edit form initial values
          setEditName(data.shopName || '');
          setEditCategory(data.category || '');
          setEditPhone(data.mobileNumber || '');
          setEditAddress(data.address || '');
          setEditDescription(data.description || '');
          setEditItems(
            Array.isArray(data.items) 
              ? data.items.join(', ') 
              : data.items || ''
          );

          // Load local reviews if any
          const loadedReviews = db.getReviewsForBusiness(docSnap.id);
          setReviews(loadedReviews);
        } else {
          // If no doc found with ownerUid, fallback to phone match if available
          if (user?.phoneNumber) {
            const cleanPhone = user.phoneNumber.replace(/\D/g, '').slice(-10);
            const qPhone = query(
              collection(firestoreDb, 'shops'),
              where('mobileNumber', '==', cleanPhone)
            );
            onSnapshot(qPhone, (phoneSnap: any) => {
              if (!phoneSnap.empty) {
                const pDoc = phoneSnap.docs[0];
                const pData = { id: pDoc.id, ...(pDoc.data() as any) };
                setShop(pData);
                setEditName(pData.shopName || '');
                setEditCategory(pData.category || '');
                setEditPhone(pData.mobileNumber || '');
                setEditAddress(pData.address || '');
                setEditDescription(pData.description || '');
                setEditItems(Array.isArray(pData.items) ? pData.items.join(', ') : pData.items || '');
              } else {
                setShop(null);
              }
              setLoadingShop(false);
            });
            return;
          }
          setShop(null);
        }
        setLoadingShop(false);
      },
      (error: any) => {
        console.error('Error fetching merchant shop:', error);
        setLoadingShop(false);
      }
    );

    return () => unsubscribe();
  }, [currentUid, merchantSession?.phoneNumber, user?.phoneNumber]);

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop?.id) return;

    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      const shopRef = doc(firestoreDb, 'shops', shop.id);
      
      const itemsArray = editItems
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      await updateDoc(shopRef, {
        shopName: editName.trim(),
        category: editCategory.trim(),
        mobileNumber: editPhone.trim(),
        address: editAddress.trim(),
        description: editDescription.trim(),
        items: itemsArray,
        updatedAt: serverTimestamp(),
      });

      setSaveSuccess('दुकान माहिती यशस्वीरीत्या अद्ययावत केली!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSaveSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error('Error updating shop:', err);
      setSaveError(err.message || 'माहिती अद्ययावत करताना त्रुटी आली.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareShop = () => {
    if (!shop) return;
    const shareUrl = `${window.location.origin}/home`;
    const shareText = `शेवगाव मार्केटवर आमचे दुकान "${shop.shopName}" पहा:\n${shareUrl}`;
    if (navigator.share) {
      navigator.share({ title: shop.shopName, text: shareText, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert('दुकान लिंक कॉपी केली आहे!');
    }
  };







// done 
  if (loadingShop) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-purple animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          तुमच्या दुकानाची माहिती लोड होत आहे... (Loading your shop)
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pt-4 pb-20 px-3 sm:px-6 text-left">
      
      {/* Top Header Card */}
      <div className="p-6 md:p-8 glass-card border border-white/80 dark:border-slate-800 rounded-3xl shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-brand text-white flex items-center justify-center shadow-lg shadow-brand-purple/20 shrink-0">
            <Store size={30} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                दुकानदार डॅशबोर्ड
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300">
                Merchant
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
              तुमचे वैयक्तिक दुकान व्यवस्थापन आणि चालू सबस्क्रिप्शन तपशील.
            </p>
          </div>
        </div>

        {shop && (
          <div className="flex flex-wrap gap-2.5 items-center">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Edit2 size={14} className="text-brand-purple" />
              <span>माहिती बदला (Edit)</span>
            </button>
            <button
              onClick={handleShareShop}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-purple text-white hover:bg-purple-700 transition-all flex items-center gap-1.5 shadow-sm shadow-brand-purple/30"
            >
              <Share2 size={14} />
              <span>शेअर करा</span>
            </button>
          </div>
        )}
      </div>

      {/* Case 1: No Registered Shop Found for this user */}
      {!shop ? (
        <div className="py-16 px-6 text-center glass-card border-2 border-dashed border-slate-300/80 dark:border-slate-800 rounded-3xl space-y-5 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              कोणतेही नोंदणीकृत दुकान आढळले नाही
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              तुमच्या या खात्यावर अद्याप कोणतेही दुकान जोडलेले नाही. शेवगाव मार्केटवर आपले दुकान नोंदवण्यासाठी खालील बटणावर क्लिक करा.
            </p>
          </div>
          <Link
            to="/add-shop"
            className="inline-flex items-center gap-2 bg-gradient-brand text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <PlusCircle size={18} />
            <span>नवीन दुकान नोंदवा (Add Shop Now)</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        /* Case 2: Display ONLY the merchant's registered shop document */
        <div className="space-y-6">

          {/* Status & Monetization Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Status Card */}
            <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
              shop.status === 'approved' 
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900' 
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
            }`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                shop.status === 'approved' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-amber-500 text-white animate-pulse'
              }`}>
                {shop.status === 'approved' ? <CheckCircle2 size={22} /> : <Clock3 size={22} />}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  मंजुरी स्थिती (Approval Status)
                </span>
                <p className={`text-sm font-extrabold truncate ${
                  shop.status === 'approved' 
                    ? 'text-emerald-700 dark:text-emerald-300' 
                    : 'text-amber-700 dark:text-amber-300'
                }`}>
                  {shop.status === 'approved' ? 'प्रमाणित व चालू (Approved)' : 'पडताळणी प्रलंबित (Pending Approval)'}
                </p>
              </div>
            </div>

            {/* Payment Status Card */}
            <div className="p-4 rounded-2xl border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <CreditCard size={22} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  पेमेंट स्थिती (Payment)
                </span>
                <p className="text-sm font-extrabold text-blue-700 dark:text-blue-300 truncate flex items-center gap-1.5">
                  <span>{shop.paymentStatus === 'paid' ? 'यशस्वी (Paid)' : 'मोफत / प्रलंबित'}</span>
                  {shop.amountPaid && <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">₹{shop.amountPaid}</span>}
                </p>
              </div>
            </div>

            {/* Subscription Plan Card */}
            <div className="p-4 rounded-2xl border bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Sparkles size={22} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  सबस्क्रिप्शन प्लॅन (Plan)
                </span>
                <p className="text-sm font-extrabold text-purple-700 dark:text-purple-300 truncate">
                  {shop.planType === 'premium' ? 'प्रीमियम (Premium Plan)' : 'बेसिक प्लॅन (Basic Plan)'}
                </p>
              </div>
            </div>

          </div>

          {/* If Pending Approval Alert */}
          {shop.status === 'pending' && (
            <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs font-medium flex items-start gap-3">
              <Clock3 size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">प्रशासक पडताळणी प्रलंबित आहे (Under Verification)</p>
                <p className="mt-0.5 text-amber-700 dark:text-amber-300">
                  तुमचे पेमेंट यशस्वी झाले असून आमचे ॲडमिन तुमच्या दुकानाची माहिती तपासून २४ तासांच्या आत मान्यता देतील. त्यानंतर तुमचे दुकान मुख्य पृष्ठावर ग्राहकांना दिसेल.
                </p>
              </div>
            </div>
          )}

          {/* Main Shop Document Card */}
          <div className="glass-card border border-white/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-soft">
            
            {/* Banner / Cover Header */}
            <div className="h-44 sm:h-56 w-full relative bg-slate-900 overflow-hidden">
              <img
                src={shop.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80'}
                alt={shop.shopName}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold">
                    <Layers size={13} />
                    <span>{shop.category}</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                    {shop.shopName}
                  </h2>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5">
                    <MapPin size={13} className="text-brand-purple" />
                    <span>{shop.address || 'शेवगाव, अहिल्यानगर'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-900 font-extrabold text-xs flex items-center gap-1 shadow-md">
                    <Star size={13} fill="currentColor" />
                    <span>{shop.rating || 5.0} रेटिंग</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Shop Details Content */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">दुकान मालक (Owner)</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{shop.ownerName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">संपर्क नंबर (Mobile)</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Phone size={13} className="text-brand-purple" />
                    <a href={`tel:${shop.mobileNumber}`} className="hover:underline">{shop.mobileNumber}</a>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">नोंदणी ओळख (Document ID)</span>
                  <p className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 truncate">
                    {shop.id}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  दुकानाची माहिती (Description)
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800">
                  {shop.description || 'शेवगाव परिसरातील ग्राहकांसाठी दर्जेदार उत्पादने आणि तत्पर ग्राहक सेवा.'}
                </p>
              </div>

              {/* Items / Products Available */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Package size={14} className="text-brand-purple" />
                  <span>उपलब्ध वस्तू / सेवा (Available Items)</span>
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {shop.items ? (
                    (Array.isArray(shop.items) ? shop.items : shop.items.split(',')).map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-brand-purple/10 text-brand-purple dark:text-purple-300 border border-brand-purple/20"
                      >
                        {item.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 font-light italic">
                      कोणत्याही वस्तू नमूद केलेल्या नाहीत.
                    </span>
                  )}
                </div>
              </div>

              {/* Promotional Offers Quick Link */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-purple/10 via-brand-blue/10 to-transparent border border-brand-purple/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles size={16} className="text-amber-500" />
                    <span>सणासुदीची विशेष ऑफर पोस्ट करा!</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    शेवगाव मार्केटच्या मुख्य Offers विभागात तुमची सवलत झळकवा.
                  </p>
                </div>
                <Link
                  to="/home#offers"
                  className="px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold hover:shadow-md transition-all self-start sm:self-auto shrink-0 flex items-center gap-1.5"
                >
                  <span>ऑफर विभागात जा</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>

          </div>

          {/* Customer Reviews Section */}
          <div className="p-6 md:p-8 glass-card border border-white/80 dark:border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare size={16} className="text-brand-purple" />
                <span>ग्राहक पुनरावलोकने (Customer Reviews)</span>
              </h3>
              <span className="text-xs text-slate-500">
                एकूण: {reviews.length}
              </span>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                अद्याप कोणतेही ग्राहक पुनरावलोकन उपलब्ध नाही.
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{rev.userName}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Edit Shop Details Modal */}
      <AnimatePresence>
        {isEditModalOpen && shop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 my-8 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit2 size={18} className="text-brand-purple" />
                  <span>दुकान माहिती संपादित करा</span>
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              {saveError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-500" />
                  <span>{saveError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateShop} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    दुकानाचे नाव (Shop Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      श्रेणी (Category)
                    </label>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full mt-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      मोबाईल नंबर (Mobile Number) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full mt-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    पत्ता (Address)
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    वस्तू / आयटम्स (Items, स्वल्पविरामाने वेगळे करा)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. किराणा, गहू, तांदूळ, तेल"
                    value={editItems}
                    onChange={(e) => setEditItems(e.target.value)}
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    दुकानाची माहिती (Description)
                  </label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full mt-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    रद्द करा (Cancel)
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-brand text-white hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-75"
                  >
                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                    <span>जतन करा (Save Changes)</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
