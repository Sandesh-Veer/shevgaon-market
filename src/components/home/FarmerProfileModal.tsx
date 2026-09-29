import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadCloud,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Package,
  Trash2,
  Sprout
} from 'lucide-react';
import { Business, db } from '../../services/db';
import { uploadImage, uploadMultipleImages } from '../../services/imageUpload';

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFarmerAdded?: () => void;
}

type PackageType = 'basic' | 'premium';

interface PackageOption {
  id: PackageType;
  name: string;
  marathiName: string;
  badge?: string;
  maxGalleryPhotos: number;
  description: string;
}

const PACKAGES: PackageOption[] = [
  {
    id: 'basic',
    name: 'Basic Package',
    marathiName: 'बेसिक पॅकेज',
    maxGalleryPhotos: 1,
    description: 'कमाल १ उत्पादन फोटो (Max 1 gallery photo)',
  },
  {
    id: 'premium',
    name: 'Premium Package',
    marathiName: 'प्रीमियम पॅकेज',
    badge: 'शिफारस केलेले (Popular)',
    maxGalleryPhotos: 4,
    description: 'कमाल ४ उत्पादन फोटो (Max 4 gallery photos)',
  },
];

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  isOpen,
  onClose,
  onFarmerAdded,
}) => {
  // Form fields
  const [farmerName, setFarmerName] = useState('');
  const [cropName, setCropName] = useState('');
  const [cropCat, setCropCat] = useState('भाजीपाला');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('किलो');
  const [quantity, setQuantity] = useState('');
  const [village, setVillage] = useState('शेवगांव');
  const [phone, setPhone] = useState('');

  // Selected package
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('basic');

  // Single Profile Photo file & live preview
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  // Multiple Gallery Photos files & live previews
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Submission & UI states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // File input refs
  const profileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const currentPkg = PACKAGES.find((p) => p.id === selectedPackage) || PACKAGES[0];
  const maxPhotosAllowed = currentPkg.maxGalleryPhotos;

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // When package switches from Premium to Basic, trim gallery photos if they exceed limit
  const handlePackageSelect = (pkgId: PackageType) => {
    setSelectedPackage(pkgId);
    setErrorMsg(null);

    const newLimit = pkgId === 'basic' ? 1 : 4;
    if (galleryFiles.length > newLimit) {
      // Free memory for dropped previews
      galleryPreviews.slice(newLimit).forEach((url) => URL.revokeObjectURL(url));

      setGalleryFiles((prev) => prev.slice(0, newLimit));
      setGalleryPreviews((prev) => prev.slice(0, newLimit));
      setErrorMsg(
        `पॅकेज बदलल्यामुळे गॅलरी फोटो मर्यादेनुसार फक्त ${newLimit} फोटो ठेवण्यात आले आहेत.`
      );
    }
  };

  // 1. Single Profile Photo selection handler
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      setErrorMsg('कृपया वैध इमेज फाईल निवडा (PNG, JPG, JPEG, WEBP).');
      return;
    }

    // Limit single file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('प्रोफाईल फोटोचा आकार १० MB पेक्षा कमी असावा.');
      return;
    }

    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleRemoveProfilePhoto = () => {
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }
    setProfileFile(null);
    setProfilePreview(null);
    if (profileInputRef.current) {
      profileInputRef.current.value = '';
    }
  };

  // 2. Multiple Gallery Photos selection handler with package limit restriction
  const handleGalleryPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFiles = Array.from(e.target.files);

    // Validate that all files are images
    const invalidFiles = selectedFiles.filter((f) => !f.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setErrorMsg('केवळ फोटो फाईल्स (Images) अपलोड करता येतील.');
      return;
    }

    const availableSlots = maxPhotosAllowed - galleryFiles.length;

    // Strict validation check against package limit
    if (selectedFiles.length > availableSlots) {
      setErrorMsg(
        `तुम्ही निवडलेल्या '${currentPkg.marathiName}' मध्ये कमाल ${maxPhotosAllowed} गॅलरी फोटो अपलोड करण्याची मर्यादा आहे. अधिक फोटो जोडण्यासाठी कृपया 'प्रीमियम' पॅकेज निवडा.`
      );
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      return;
    }

    // Append new files & generate real preview thumbnails
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));

    setGalleryFiles((prev) => [...prev, ...selectedFiles]);
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);

    // Reset input so user can re-select same file if needed
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setErrorMsg(null);
    if (galleryPreviews[index]) {
      URL.revokeObjectURL(galleryPreviews[index]);
    }
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 3. Form Submission with real Cloudinary / Firebase Storage upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic validation
    if (
      !farmerName.trim() ||
      !cropName.trim() ||
      !price.trim() ||
      !quantity.trim() ||
      !phone.trim()
    ) {
      setErrorMsg('कृपया सर्व आवश्यक शेती माहिती भरा (नाव, पीक, किंमत, प्रमाण आणि मोबाईल).');
      return;
    }

    if (phone.trim().length < 10) {
      setErrorMsg('कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा.');
      return;
    }

    setIsUploading(true);
    setUploadStatusText('प्रतिमा सुरक्षितपणे अपलोड होत आहेत...');

    try {
      let uploadedProfileUrl = '';
      let uploadedGalleryUrls: string[] = [];

      // A. Upload Profile Photo if selected
      if (profileFile) {
        setUploadStatusText('शेतकरी प्रोफाईल फोटो अपलोड होत आहे...');
        uploadedProfileUrl = await uploadImage(profileFile, {
          folder: 'shevgaon/farmers/profiles',
        });
      }

      // B. Upload Product/Gallery Photos if selected
      if (galleryFiles.length > 0) {
        setUploadStatusText(
          `गॅलरीचे ${galleryFiles.length} फोटो अपलोड होत आहेत...`
        );
        uploadedGalleryUrls = await uploadMultipleImages(galleryFiles, {
          folder: 'shevgaon/farmers/crops',
        });
      }

      setUploadStatusText('माहिती सुरक्षितपणे साठवली जात आहे...');

      // C. Build new Business record without ANY dummy/fake image URLs
      const newFarmerObj: Business = {
        id: 'crop_' + Date.now(),
        name: farmerName.trim(),
        ownerName: farmerName.trim(),
        description: cropName.trim(),
        category: 'mandi',
        phone: phone.trim(),
        whatsapp: phone.trim(),
        email: '',
        address: village,
        village: village,
        taluka: 'शेवगांव',
        district: 'अहमदनगर',
        mapLink: 'https://maps.google.com',
        openingTime: 'सकाळी ०७:००',
        closingTime: 'संध्याकाळी ०७:००',
        // Clean uploaded image URLs (No fake image generators!)
        logo: uploadedProfileUrl,
        banner: uploadedGalleryUrls[0] || uploadedProfileUrl || '',
        photos: uploadedGalleryUrls,
        isApproved: true,
        planId: selectedPackage,
        cropCat,
        cropPrice: price.trim(),
        cropUnit: unit,
        cropQty: quantity.trim(),
        createdAt: new Date().toISOString(),
      };

      // D. Save to local/persistent storage database
      db.saveBusiness(newFarmerObj);

      setSuccessMsg('शेतकरी प्रोफाइल व शेतमाल यशस्वीरित्या नोंदणीकृत झाला!');
      setTimeout(() => {
        if (onFarmerAdded) onFarmerAdded();
        handleClose();
      }, 1200);
    } catch (err: any) {
      console.error('Farmer profile creation / upload error:', err);
      setErrorMsg(
        err?.message ||
          'फोटो अपलोड करताना त्रुटी आली. कृपया इंटरनेट कनेक्शन तपासा किंवा पुन्हा प्रयत्न करा.'
      );
    } finally {
      setIsUploading(false);
      setUploadStatusText('');
    }
  };

  const handleClose = () => {
    // Revoke any temporary blob URLs
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    galleryPreviews.forEach((url) => URL.revokeObjectURL(url));

    setProfileFile(null);
    setProfilePreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 my-auto overflow-hidden text-left"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-5 text-white">
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shadow-sm disabled:opacity-50"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 backdrop-blur-sm text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sprout size={13} /> शेतकरी बाजार नोंदणी
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              🌾 शेतकरी प्रोफाईल आणि शेतमाल नोंदणी
            </h2>
            <p className="text-xs text-emerald-100 mt-1 font-light">
              खरेदीदारांसाठी तुमचा शेतमाल आणि अस्सल शेती फोटो अपलोड करा
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Error / Success Notifications */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 shadow-sm"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 p-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-sm font-semibold"
              >
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* 1. PACKAGE SELECTION UI */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Package size={14} className="text-emerald-600" />
                  पॅकेज निवडा (Select Package)
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  गॅलरी फोटो मर्यादा: {maxPhotosAllowed} फोटो
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handlePackageSelect(pkg.id)}
                      className={`cursor-pointer rounded-2xl p-3.5 border-2 transition-all relative ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-sm'
                          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/40'
                      }`}
                    >
                      {pkg.badge && (
                        <span className="absolute -top-2.5 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          {pkg.badge}
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                          {pkg.marathiName}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        {pkg.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. PROFILE PHOTO SECTION (Single File Upload) */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Camera size={14} className="text-emerald-600" />
                    शेतकरी प्रोफाईल फोटो (Profile Photo)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    तुमचा स्वतःचा किंवा फार्मचा एक स्पष्ट फोटो निवडा (Single Photo)
                  </p>
                </div>
              </div>

              {/* Hidden single file input */}
              <input
                type="file"
                accept="image/*"
                ref={profileInputRef}
                onChange={handleProfilePhotoChange}
                className="hidden"
                id="farmer-profile-photo-input"
              />

              {/* Live Preview / Upload Trigger */}
              {profilePreview ? (
                <div className="flex items-center gap-4 pt-2">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-white shrink-0 group">
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveProfilePhoto}
                      className="absolute top-1 right-1 w-5 h-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow transition-all"
                      title="फोटो काढून टाका"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {profileFile?.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {profileFile && (profileFile.size / 1024).toFixed(0)} KB • Live Preview
                    </p>
                    <button
                      type="button"
                      onClick={() => profileInputRef.current?.click()}
                      className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline text-[11px]"
                    >
                      फोटो बदला (Change)
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => profileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-xl p-4 flex items-center justify-center gap-3 transition-colors bg-white/70 dark:bg-slate-900/40"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                    <UploadCloud size={20} />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      येथे क्लिक करून प्रोफाईल फोटो निवडा
                    </span>
                    <span className="text-[11px] text-slate-400">
                      PNG, JPG, WEBP (जास्तीत जास्त १० MB)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. PRODUCT / GALLERY PHOTOS SECTION (Multiple Upload with strict package enforcement) */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-emerald-600" />
                    उत्पादन / गॅलरी फोटो (Product & Gallery Photos)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    {currentPkg.marathiName} मर्यादा: {galleryFiles.length} / {maxPhotosAllowed} फोटो
                  </p>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    galleryFiles.length >= maxPhotosAllowed
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                  }`}
                >
                  {galleryFiles.length >= maxPhotosAllowed ? 'मर्यादा पूर्ण' : 'फोटो जोडा'}
                </span>
              </div>

              {/* Hidden multiple file input */}
              <input
                type="file"
                accept="image/*"
                multiple
                ref={galleryInputRef}
                onChange={handleGalleryPhotosChange}
                className="hidden"
                id="farmer-gallery-photos-input"
              />

              {/* Gallery live preview grid */}
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {galleryPreviews.map((previewUrl, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-xl overflow-hidden border border-emerald-400 shadow-sm bg-white dark:bg-slate-900 group"
                    >
                      <img
                        src={previewUrl}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded-md font-mono">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryPhoto(idx)}
                        className="absolute top-1 right-1 w-6 h-6 bg-rose-600/90 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow transition-all"
                        title="काढून टाका"
                      >
                        <Trash2 size={11} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Upload trigger button (only enabled if under package limit) */}
              {galleryFiles.length < maxPhotosAllowed ? (
                <div
                  onClick={() => galleryInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl p-3.5 flex items-center justify-center gap-2.5 transition-colors bg-white/70 dark:bg-slate-900/40 text-center"
                >
                  <UploadCloud size={18} className="text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    + नवीन उत्पादन फोटो निवडा ({maxPhotosAllowed - galleryFiles.length} शिल्लक)
                  </span>
                </div>
              ) : (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-center">
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    {currentPkg.marathiName} मध्ये जास्तीत जास्त {maxPhotosAllowed} फोटो अनुमत आहेत. अधिक फोटोंसाठी प्रीमियम पॅकेज निवडा.
                  </p>
                </div>
              )}
            </div>

            {/* 4. FARMER & CROP DETAILS INPUTS */}
            <div className="space-y-4">
              {/* Farmer Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  शेतकरी नाव *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. रामचंद्र देवकर"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Crop Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    पिकाचे नाव *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. गावरान लसूण / डाळिंब"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    माल श्रेणी (Category)
                  </label>
                  <select
                    value={cropCat}
                    onChange={(e) => setCropCat(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="भाजीपाला">भाजीपाला (Vegetables)</option>
                    <option value="फळे">फळे (Fruits)</option>
                    <option value="धान्य">धान्य (Grains / Pulses)</option>
                    <option value="फुले">फुले (Flowers)</option>
                    <option value="इतर">इतर (Other)</option>
                  </select>
                </div>
              </div>

              {/* Price, Unit & Quantity */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    किंमत (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="उदा. ५०"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    एकक (Unit)
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="किलो">किलो (Kg)</option>
                    <option value="जुडी">जुडी (Bundle)</option>
                    <option value="डझन">डझन (Dozen)</option>
                    <option value="क्विंटल">क्विंटल (Quintal)</option>
                    <option value="नग">नग (Piece)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    प्रमाण (Qty) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="उदा. १००"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Village & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    गाव (Village)
                  </label>
                  <select
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="शेवगांव">शेवगांव</option>
                    <option value="दहिगाव">दहिगाव</option>
                    <option value="बाभुळगांव">बाभुळगांव</option>
                    <option value="तांदूळनेर">तांदूळनेर</option>
                    <option value="भातकुडगाव">भातकुडगाव</option>
                    <option value="वरुर">वरुर</option>
                    <option value="राक्षी">राक्षी</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    संपर्क क्रमांक (Mobile) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="उदा. ९८xxxxxx१०"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{uploadStatusText || 'अपलोड होत आहे...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>शेतकरी प्रोफाइल व शेतमाल बाजारात जोडा</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FarmerProfileModal;
