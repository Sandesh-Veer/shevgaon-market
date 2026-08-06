import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Store, 
  Phone, 
  ShieldCheck, 
  LogOut, 
  Edit3, 
  CheckCircle2, 
  Plus, 
  Package, 
  MapPin, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function MerchantProfile() {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('hotel');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('९:०० AM - ९:०० PM');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load merchant's shop data from Firestore 'vendors/{uid}'
  useEffect(() => {
    if (!user) return;
    const fetchShopData = async () => {
      try {
        const shopRef = doc(db, 'vendors', user.uid);
        const snap = await getDoc(shopRef);
        if (snap.exists()) {
          const data = snap.data();
          setShopName(data.shopName || '');
          setCategory(data.category || 'hotel');
          setAddress(data.address || '');
          setOpeningHours(data.openingHours || '९:०० AM - ९:०० PM');
        }
      } catch (err: any) {
        console.error('Error fetching merchant shop data:', err);
      }
    };
    fetchShopData();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!shopName.trim()) {
      setErrorMsg('कृपया दुकानाचे / व्यवसायाचे नाव प्रविष्ट करा.');
      return;
    }

    setErrorMsg('');
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const shopRef = doc(db, 'vendors', user.uid);
      await setDoc(shopRef, {
        vendorId: user.uid,
        phoneNumber: user.phoneNumber,
        shopName: shopName.trim(),
        category,
        address: address.trim(),
        openingHours,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to save merchant data:', err);
      setErrorMsg('डेटा सेव्ह करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 text-left">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide">
              <ShieldCheck size={14} className="text-emerald-300" />
              <span>विक्रेता प्रोफाइल (Merchant Access)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {shopName ? shopName : 'माझे दुकान (Merchant Dashboard)'}
            </h1>
            <p className="text-xs md:text-sm text-white/80 flex items-center gap-2 font-medium">
              <Phone size={14} />
              <span>{user?.phoneNumber || 'मोबाईल नंबर प्रविष्ट केला आहे'}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all backdrop-blur-sm"
          >
            <LogOut size={15} />
            लॉगआउट (Logout)
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form to manage Shop Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card border border-gray-200/80 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-soft">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-200/50 dark:border-slate-800">
              <Store className="text-brand-purple" size={22} />
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  दुकानाची माहिती अद्ययावत करा
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  फक्त तुम्हीच तुमच्या दुकानाची माहिती सुधारू शकता.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {saveSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2"
              >
                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                <span>माहिती यशस्वीपणे सेव्ह केली आहे! (Data updated in Firestore)</span>
              </motion.div>
            )}

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  दुकानाचे नाव (Shop Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. शेवगाव स्वीट्स & बेकरी"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  श्रेणी (Category)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-brand-purple"
                >
                  <option value="hotel">🍔 हॉटेल / खानावळ</option>
                  <option value="sweethome">🧁 स्वीट होम & बेकरी</option>
                  <option value="mobileshop">📱 मोबाईल व इलेक्ट्रॉनिक्स</option>
                  <option value="shetkari">👨‍🌾 शेतकरी / कृषी केंद्र</option>
                  <option value="cyber">💻 सायबर कॅफे & सेतू</option>
                  <option value="beauty">💇‍♀️ ब्युटी पार्लर & सलून</option>
                  <option value="gym">🏋️‍♂️ जिम & फिटनेस</option>
                  <option value="hospital">🏥 हॉस्पिटल & मेडिकल</option>
                  <option value="gharguti-seva">🛠️ घरगुती सेवा</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin size={13} className="text-brand-purple" />
                  पत्ता (Location Address)
                </label>
                <input
                  type="text"
                  placeholder="उदा. बस स्टँड जवळ, शेवगाव"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock size={13} className="text-brand-purple" />
                  वेळ (Opening Hours)
                </label>
                <input
                  type="text"
                  placeholder="उदा. ९:०० AM - ९:०० PM"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-brand-purple"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full mt-4 bg-gradient-brand text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
              >
                <Edit3 size={16} />
                {isSaving ? 'सेव्ह करत आहे...' : 'माहिती सेव्ह करा (Save Profile)'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Account Status & Quick Actions */}
        <div className="space-y-6">
          
          {/* Security & Role Badge Card */}
          <div className="glass-card border border-gray-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              खाते सुरक्षा व भूमिका (Account Security)
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                <ShieldCheck size={18} />
                <span>सुरक्षित Merchant खाते</span>
              </div>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-400 font-medium leading-relaxed">
                तुमच्या खात्याची ओळख Firestore `users` आणि `vendors` डेटाबेसमध्ये पडताळलेली आहे.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="font-semibold">User ID:</span>
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[140px]">{user?.uid}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="font-semibold">Role:</span>
                <span className="px-2 py-0.5 rounded-md bg-brand-purple/10 text-brand-purple font-bold">
                  {userProfile?.role || 'merchant'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold">Phone:</span>
                <span className="font-bold">{user?.phoneNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="glass-card border border-gray-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              त्वरित कृती (Quick Actions)
            </h3>
            
            <button 
              onClick={() => navigate('/vendor/dashboard')}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Package size={16} className="text-brand-purple" />
                उत्पादने / सेवा व्यवस्थापित करा
              </span>
              <Plus size={16} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
