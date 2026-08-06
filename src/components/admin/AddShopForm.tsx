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
  ImageIcon
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

const CATEGORIES = [
  { id: 'Grocery', label: '🛒 किराणा (Grocery)' },
  { id: 'Electronics', label: '📱 इलेक्ट्रॉनिक्स (Electronics)' },
  { id: 'Clothing', label: '👕 कपडे (Clothing)' },
  { id: 'Services', label: '🛠️ सेवा (Services)' },
  { id: 'Food', label: '🍔 खाद्यपदार्थ (Food / Restaurant)' },
  { id: 'Other', label: '✨ इतर (Other)' }
];

export default function AddShopForm() {
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      throw new Error('VITE_IMGBB_API_KEY is not configured in .env file. Please provide a valid ImgBB API key.');
    }

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!shopName.trim() || !ownerName.trim() || !mobileNumber.trim() || !address.trim()) {
      setErrorMsg('कृपया सर्व आवश्यक माहिती प्रविष्ट करा.');
      return;
    }

    if (!imageFile) {
      setErrorMsg('कृपया दुकानाची फोटो/इमेज अपलोड करण्यासाठी निवडा.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. ImgBB Upload
      const uploadedImageUrl = await uploadToImgBB(imageFile);

      // 2. Save document to Firestore 'shops' collection
      await addDoc(collection(db, 'shops'), {
        shopName: shopName.trim(),
        ownerName: ownerName.trim(),
        category,
        mobileNumber: mobileNumber.trim(),
        address: address.trim(),
        imageUrl: uploadedImageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSuccessMsg('दुकान/व्यवसाय प्रोफाइल यशस्वीपणे जोडले गेले!');

      // Reset form
      setShopName('');
      setOwnerName('');
      setCategory('Grocery');
      setMobileNumber('');
      setAddress('');
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('AddShopForm submission error:', err);
      setErrorMsg(err.message || 'डेटा जतन करताना त्रुटी आली. पुन्हा प्रयत्न करा.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-card border border-white/80 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 text-left">
      
      {/* Title Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200/60 dark:border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-md">
          <Store size={24} />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            नवीन दुकान जोडणे (Add Shop Profile)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            ImgBB द्वारे ऑटो-इमेज अपलोड आणि Firestore डेटाबेस एकत्रीकरण
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle size={18} className="text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Row 1: Shop Name & Owner Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
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
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
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
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
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
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
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
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin size={13} className="text-brand-purple" />
            दुकानाचा पत्ता (Shop Address) *
          </label>
          <textarea
            rows={2}
            required
            placeholder="उदा. बस स्टँड रोड, शेवगाव, जि. अहिल्यानगर"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 transition-all resize-none"
          />
        </div>

        {/* Row 4: Image File Upload Input with Preview */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ImageIcon size={13} className="text-brand-purple" />
            दुकानाची फोटो (Shop Image File) *
          </label>

          {!imagePreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 cursor-pointer transition-all space-y-2 group"
            >
              <UploadCloud className="w-8 h-8 mx-auto text-slate-400 group-hover:text-brand-purple transition-colors" />
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                प्रतिमा अपलोड करण्यासाठी येथे क्लिक करा (Click to choose image)
              </p>
              <p className="text-[10px] text-slate-400">
                ImgBB द्वारे ऑटोमॅटिक अपलोड होईल (PNG, JPG max 10MB)
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
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 group">
              <img 
                src={imagePreview} 
                alt="Shop preview" 
                className="w-full h-full object-cover" 
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors shadow-lg"
                title="प्रतिमा काढा (Remove image)"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-gradient-brand text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Uploading & Saving...</span>
            </>
          ) : (
            <span>दुकान जतन करा (Save Shop Profile)</span>
          )}
        </button>

      </form>

    </div>
  );
}
