import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, MapPin, Clock, Star, Share2, Heart, AlertTriangle, Send, Camera, X, MessageSquare, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, Business, Review } from '../services/db';

export default function BusinessDetail() {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();

  const [biz, setBiz] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Business[]>([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  
  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  // Gallery slider state
  const [activePhoto, setActivePhoto] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!id) return;
    const item = db.getBusinessById(id);
    if (item) {
      setBiz(item);
      setActivePhoto(item.logo || item.photos[0] || '');
      setReviews(db.getReviewsForBusiness(id));
      
      // Related listings
      const list = db.getApprovedBusinesses()
        .filter(b => b.category === item.category && b.id !== item.id)
        .slice(0, 3);
      setRelated(list);

      // Check favourite status
      const favs = JSON.parse(localStorage.getItem('db_favourites') || '[]');
      setIsFavourite(favs.includes(id));
    }
  }, [id, category]);

  if (!biz) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-brand-dark">व्यवसाय आढळला नाही.</h2>
        <button onClick={() => navigate('/')} className="text-brand-purple font-bold hover:underline flex items-center justify-center gap-1.5 mx-auto text-sm">
          <ArrowLeft size={16} /> मुखपृष्ठावर जा
        </button>
      </div>
    );
  }

  // Toggle Favorite
  const toggleFavourite = () => {
    const favs: string[] = JSON.parse(localStorage.getItem('db_favourites') || '[]');
    if (favs.includes(biz.id)) {
      const updated = favs.filter(fid => fid !== biz.id);
      localStorage.setItem('db_favourites', JSON.stringify(updated));
      setIsFavourite(false);
    } else {
      favs.push(biz.id);
      localStorage.setItem('db_favourites', JSON.stringify(favs));
      setIsFavourite(true);
    }
  };

  // Share Copy Link
  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Report Listing submit
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    db.saveReport({
      id: 'rep_' + Date.now(),
      businessId: biz.id,
      businessName: biz.name,
      reason: reportReason,
      createdAt: new Date().toISOString()
    });

    setReportSuccess(true);
    setReportReason('');
    setTimeout(() => {
      setShowReportModal(false);
      setReportSuccess(false);
    }, 1800);
  };

  // Review Photo upload base64 converter
  const handleReviewPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const promises = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(base64s => {
      setReviewPhotos(prev => [...prev, ...base64s]);
    });
  };

  // Save Review submit
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');

    if (!reviewName.trim()) {
      setReviewError('कृपया आपले नाव लिहा.');
      return;
    }
    if (!reviewEmail.trim() || !reviewEmail.includes('@')) {
      setReviewError('कृपया वैध ईमेल आयडी लिहा.');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('कृपया अभिप्राय लिहा.');
      return;
    }

    const reviewObj: Review = {
      id: editingReviewId || 'rev_' + Date.now(),
      businessId: biz.id,
      rating: reviewRating,
      comment: reviewComment,
      userEmail: reviewEmail,
      userName: reviewName,
      photos: reviewPhotos,
      createdAt: new Date().toISOString()
    };

    db.saveReview(reviewObj);
    setReviews(db.getReviewsForBusiness(biz.id));

    setReviewSuccess(true);
    setReviewComment('');
    setReviewPhotos([]);
    setEditingReviewId(null);
    setTimeout(() => setReviewSuccess(false), 2500);
  };

  // Delete own review
  const handleDeleteReview = (reviewId: string) => {
    if (confirm('तुम्हाला खरोखर तुमचे पुनरावलोकन हटवायचे आहे का?')) {
      db.deleteReview(reviewId);
      setReviews(db.getReviewsForBusiness(biz.id));
    }
  };

  // Edit review helper
  const handleEditReview = (rev: Review) => {
    setEditingReviewId(rev.id);
    setReviewName(rev.userName);
    setReviewEmail(rev.userEmail);
    setReviewRating(rev.rating);
    setReviewComment(rev.comment);
    setReviewPhotos(rev.photos);
    
    // Scroll form into view
    document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto pt-4 pb-16 px-4 space-y-10 text-left">
      
      {/* Back navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-purple transition-colors bg-white/50 border border-gray-200/50 py-1.5 px-3 rounded-full self-start shadow-sm backdrop-blur-sm"
      >
        <ArrowLeft size={13} /> मागे जा (Back)
      </button>

      {/* 1. HERO HEADER AREA */}
      <div className="glass-card border border-white/70 shadow-soft overflow-hidden">
        {/* Banner Cover */}
        <div className="h-48 md:h-72 w-full bg-slate-100 relative">
          {biz.banner ? (
            <img src={biz.banner} alt="cover banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-brand-blue/15 to-brand-purple/15 flex items-center justify-center font-display font-extrabold text-3xl text-brand-purple/40">
              {biz.name}
            </div>
          )}
          {/* Action tags */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={copyShareLink}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 flex items-center justify-center text-brand-dark hover:bg-white hover:text-brand-purple shadow-sm transition-all"
            >
              <Share2 size={16} />
            </button>
            <button 
              onClick={toggleFavourite}
              className={`w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 flex items-center justify-center shadow-sm transition-all ${
                isFavourite ? 'text-rose-500 hover:bg-white' : 'text-brand-dark hover:text-rose-500'
              }`}
            >
              <Heart size={16} className={isFavourite ? 'fill-rose-500' : ''} />
            </button>
          </div>

          {/* Copy toast */}
          <AnimatePresence>
            {copiedLink && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 right-4 bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg"
              >
                लिंक कॉपी झाली!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Details Block */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-4 md:gap-5 items-start">
            {biz.logo ? (
              <img src={biz.logo} alt="shop logo" className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-gray-200/50 shadow-sm shrink-0 bg-white" />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-100 border border-gray-200 flex items-center justify-center shrink-0">
                <ImageIcon size={32} className="text-slate-400" />
              </div>
            )}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-brand-dark">{biz.name}</h1>
                <span className="bg-brand-purple/5 text-brand-purple text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-brand-purple/10">
                  {biz.category === 'mandi' && 'शेतकरी'}
                  {biz.category === 'technician' && 'घरगुती सेवा'}
                  {biz.category === 'material' && 'बांधकाम साहित्य'}
                  {biz.category === 'hotel' && 'हॉटेल'}
                  {biz.category === 'vehicle' && 'वाहन'}
                  {biz.category === 'mechanics' && 'मेकॅनिक'}
                  {biz.category === 'offers' && 'ऑफर / सेल'}
                </span>
              </div>
              <p className="text-xs text-brand-muted font-light">मालक: <b className="font-semibold text-brand-dark">{biz.ownerName}</b> | गाव: {biz.village}</p>
              
              {/* Average Ratings */}
              <div className="flex items-center gap-1.5 pt-1.5">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      size={14} 
                      className={s <= Math.round(db.getAverageRating(biz.id)) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-brand-dark">
                  {db.getAverageRating(biz.id)} ({reviews.length} पुनरावलोकने)
                </span>
              </div>
            </div>
          </div>

          {/* Quick contact actions */}
          <div className="flex gap-2.5 shrink-0 self-start md:self-auto">
            <a 
              href={`tel:${biz.phone}`}
              className="py-3 px-5 rounded-xl border border-gray-200 text-brand-dark font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 shadow-sm bg-white"
            >
              <Phone size={14} /> कॉल करा
            </a>
            <a 
              href={`https://wa.me/${biz.whatsapp}?text=नमस्कार, मला तुमच्या व्यवसायाबद्दल माहिती हवी आहे.`}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/10"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* 2. BODY CONTENT - LEFT-RIGHT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: ABOUT, PHOTOS, PRODUCTS, RATINGS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About description */}
          <div className="glass-card p-6 border border-white/70 space-y-4">
            <h3 className="text-lg font-bold text-brand-dark border-b border-gray-100 pb-2">व्यवसायाबद्दल माहिती</h3>
            <p className="text-sm text-brand-muted leading-relaxed font-light whitespace-pre-line">{biz.description}</p>
          </div>

          {/* Category-Specific Item Details */}

          {/* A. Crops / Mandi fields */}
          {biz.category === 'mandi' && (
            <div className="p-6 bg-emerald-50/20 border border-emerald-100/50 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold text-emerald-900 border-b border-emerald-100 pb-2">शेतमाल माहिती (Produce Specs)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-emerald-700 font-medium">शेती वर्गीकरण</span>
                  <p className="font-bold text-slate-800 text-sm">{biz.cropCat}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-700 font-medium">दर (रुपये)</span>
                  <p className="font-bold text-slate-800 text-sm">₹{biz.cropPrice} / {biz.cropUnit}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-700 font-medium">उपलब्ध प्रमाण</span>
                  <p className="font-bold text-slate-800 text-sm">{biz.cropQty}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-700 font-medium">पत्ता (पिन)</span>
                  <p className="font-bold text-slate-800 text-sm">{biz.village}</p>
                </div>
              </div>
            </div>
          )}

          {/* B. Technicians */}
          {biz.category === 'technician' && (
            <div className="p-6 bg-brand-purple/5 border border-brand-purple/10 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold text-brand-purple border-b border-brand-purple/10 pb-2">कारागीर तपशील (Service Details)</h3>
              <div className="grid grid-cols-3 gap-4 text-xs text-center">
                <div className="bg-white/60 p-3 rounded-xl border border-brand-purple/10 shadow-sm">
                  <span className="text-brand-muted">काम वर्गीकरण</span>
                  <p className="font-extrabold text-brand-dark text-sm mt-1">{biz.techCat}</p>
                </div>
                <div className="bg-white/60 p-3 rounded-xl border border-brand-purple/10 shadow-sm">
                  <span className="text-brand-muted">कामाचा अनुभव</span>
                  <p className="font-extrabold text-brand-dark text-sm mt-1">{biz.techExp} वर्षे</p>
                </div>
                <div className="bg-white/60 p-3 rounded-xl border border-brand-purple/10 shadow-sm">
                  <span className="text-brand-muted">एकूण कामे</span>
                  <p className="font-extrabold text-brand-dark text-sm mt-1">{biz.techWorks}+ यशस्वी</p>
                </div>
              </div>
            </div>
          )}

          {/* C. Material */}
          {biz.category === 'material' && (
            <div className="p-6 bg-amber-50/20 border border-amber-100/50 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold text-amber-900 border-b border-amber-100 pb-2">बांधकाम साहित्य (Items Available)</h3>
              <p className="text-sm font-semibold text-slate-800 bg-white/80 p-4 border border-amber-200/50 rounded-2xl shadow-inner">
                <b>उपलब्ध साहित्याची यादी:</b> {biz.materialItems || biz.description}
              </p>
            </div>
          )}

          {/* D. Hotel / Food Details */}
          {biz.category === 'hotel' && (
            <div className="glass-card p-6 border border-white/70 space-y-6">
              
              {/* Dish info header */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-brand-dark">हॉटेल मेनू आणि आजचे खास</h3>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                  biz.hotelType === 'Pure Veg' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  biz.hotelType === 'Veg' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {biz.hotelType === 'Pure Veg' ? 'शुद्ध शाकाहारी' : biz.hotelType === 'Veg' ? 'शाकाहारी' : 'मांसाहारी / व्हेज'}
                </span>
              </div>

              {/* Special dish banner */}
              {biz.todaysSpecial && (
                <div className="bg-gradient-to-r from-rose-500/5 to-amber-500/5 border border-rose-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">🔥 आजचे विशेष डिश (Today's Special)</span>
                    <h4 className="font-extrabold text-brand-dark text-base">{biz.todaysSpecial}</h4>
                  </div>
                  <div className="font-mono font-bold text-lg text-rose-600 bg-white px-3.5 py-1.5 rounded-xl border border-rose-200/60 shadow-sm shrink-0">
                    ₹{biz.specialPrice || '१५०'}
                  </div>
                </div>
              )}

              {/* Menu items list table */}
              {biz.menu && biz.menu.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-brand-muted">डिजिटल मेनू कार्ड</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {biz.menu.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50/50 border border-gray-100 rounded-xl p-3 text-xs font-semibold">
                        <span className="text-slate-800">{item.name}</span>
                        <span className="font-mono text-brand-purple">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* E. Vehicles */}
          {biz.category === 'vehicle' && (
            <div className="glass-card p-6 border border-white/70 space-y-4">
              <h3 className="text-lg font-bold text-brand-dark border-b border-gray-100 pb-2">वाहन तपशील (Specifications)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-center text-xs">
                <div className="bg-slate-50 border border-gray-100 rounded-xl p-3 shadow-inner">
                  <span className="text-brand-muted">मॉडल वर्ष</span>
                  <p className="font-bold text-brand-dark mt-1 text-sm">{biz.vehicleYear}</p>
                </div>
                <div className="bg-slate-50 border border-gray-100 rounded-xl p-3 shadow-inner">
                  <span className="text-brand-muted">अंतर (Km)</span>
                  <p className="font-bold text-brand-dark mt-1 text-sm">{biz.vehicleKm}</p>
                </div>
                <div className="bg-slate-50 border border-gray-100 rounded-xl p-3 shadow-inner">
                  <span className="text-brand-muted">इंधन</span>
                  <p className="font-bold text-brand-dark mt-1 text-sm">{biz.vehicleFuel}</p>
                </div>
                <div className="bg-slate-50 border border-gray-100 rounded-xl p-3 shadow-inner">
                  <span className="text-brand-muted">श्रेणी</span>
                  <p className="font-bold text-brand-dark mt-1 text-sm">{biz.vehicleCat}</p>
                </div>
                <div className="bg-slate-50 border border-gray-100 rounded-xl p-3 shadow-inner col-span-2 sm:col-span-1">
                  <span className="text-brand-muted text-rose-500 font-bold">किंमत</span>
                  <p className="font-extrabold text-rose-600 mt-1 text-sm">₹{biz.vehiclePrice}</p>
                </div>
              </div>
            </div>
          )}

          {/* F. Mechanics */}
          {biz.category === 'mechanics' && (
            <div className="p-6 bg-sky-50/20 border border-sky-100/50 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold text-sky-900 border-b border-sky-100 pb-2">मेकॅनिक आणि गॅरेज सेवा</h3>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                <div>
                  <span className="text-sky-700 font-medium">वाहन दुरुस्ती प्रकार:</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{biz.mechanicType || 'गॅरेज'}</p>
                </div>
                <div className="bg-sky-50 border border-sky-200/50 px-4 py-2 rounded-xl text-sky-700 font-bold">
                  🚨 {biz.mechanicEmergency || '२४x७ उपलब्ध'}
                </div>
              </div>
            </div>
          )}

          {/* G. Offers */}
          {biz.category === 'offers' && (
            <div className="p-6 bg-fuchsia-50/25 border border-fuchsia-100/50 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold text-fuchsia-900 border-b border-fuchsia-100 pb-2">सवलती आणि धमाका ऑफर्स</h3>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-fuchsia-700 text-xs font-medium">{biz.offerBanner || 'स्पेशल सेल'}</span>
                  <p className="font-extrabold text-slate-800 text-sm leading-relaxed">{biz.offerDesc || biz.description}</p>
                </div>
                <div className="bg-fuchsia-500 text-white font-extrabold text-xl px-5 py-3 rounded-2xl shadow-md shrink-0">
                  {biz.offerDiscount || '१०'}% सूट (Flat)
                </div>
              </div>
            </div>
          )}

          {/* Shop Photos Image Slider / Gallery */}
          {biz.photos && biz.photos.length > 0 && (
            <div className="glass-card p-6 border border-white/70 space-y-4">
              <h3 className="text-lg font-bold text-brand-dark border-b border-gray-100 pb-2">गॅलरी फोटो (Shop Gallery)</h3>
              
              {/* Main Active Photo */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-50 border border-gray-100 shadow-inner relative flex items-center justify-center">
                <img src={activePhoto} alt="active display" className="w-full h-full object-cover" />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {[biz.logo, ...biz.photos].filter(Boolean).map((photo, i) => (
                  <button 
                    key={i}
                    onClick={() => setActivePhoto(photo)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activePhoto === photo ? 'border-brand-purple shadow-sm' : 'border-gray-200'
                    }`}
                  >
                    <img src={photo} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- REVIEWS LISTING & SUBMIT SYSTEM --- */}
          <div className="space-y-6">
            
            {/* Reviews Head */}
            <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
              <h3 className="text-lg font-bold text-brand-dark">ग्राहक पुनरावलोकने ({reviews.length})</h3>
              <a href="#review-form" className="text-brand-purple text-xs font-bold hover:underline">पुनरावलोकन जोडा</a>
            </div>

            {/* List */}
            {reviews.length === 0 ? (
              <div className="py-10 text-center glass-card border border-dashed border-slate-200/60 flex flex-col items-center justify-center gap-2">
                <MessageSquare size={32} className="text-slate-300" />
                <p className="text-xs text-brand-muted font-light">या व्यवसायासाठी अद्याप कोणतीही पुनरावलोकने नाहीत. पहिले पुनरावलोकन तुम्ही जोडा!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="glass-card p-5 border border-white/70 shadow-sm text-xs space-y-3">
                    
                    {/* Stars and dates */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="font-extrabold text-brand-dark text-sm block">{rev.userName}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              size={12} 
                              className={s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-brand-muted font-light">
                          {new Date(rev.createdAt).toLocaleDateString('mr-IN')}
                        </span>
                        
                        {/* Edit / Delete triggers if match user session */}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditReview(rev)}
                            className="text-brand-blue font-bold hover:underline"
                          >
                            सुधारा
                          </button>
                          <button 
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-rose-500 font-bold hover:underline"
                          >
                            हटवा
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-brand-muted leading-relaxed font-light text-sm">{rev.comment}</p>

                    {/* Review attachments */}
                    {rev.photos && rev.photos.length > 0 && (
                      <div className="flex gap-2 pt-1.5">
                        {rev.photos.map((p, idx) => (
                          <div key={idx} className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                            <img src={p} alt="review attachment" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Owner reply box if present */}
                    {rev.reply && (
                      <div className="mt-3 p-3 bg-brand-purple/5 border-l-2 border-brand-purple rounded-r-xl space-y-1 text-[11px]">
                        <span className="font-bold text-brand-purple">व्यवसाय मालकाचे उत्तर:</span>
                        <p className="text-brand-dark leading-relaxed font-medium">{rev.reply}</p>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}

            {/* Review Form Box */}
            <div id="review-form" className="glass-card p-6 border border-white/70 space-y-5">
              <h3 className="text-base font-extrabold text-brand-dark">
                {editingReviewId ? 'अभिप्राय दुरुस्त करा (Edit Review)' : 'नवीन अभिप्राय जोडा (Write a Review)'}
              </h3>

              {reviewError && <span className="text-xs text-rose-500 font-bold block">{reviewError}</span>}
              {reviewSuccess && <span className="text-xs text-emerald-500 font-bold block">अभिप्राय यशस्वीरीत्या जतन केला!</span>}

              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-semibold">
                
                {/* 1. Star Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-brand-dark uppercase tracking-wider block">रेटिंग निवडा (Star Rating) *</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star size={24} className={s <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-dark uppercase tracking-wider">आपले पूर्ण नाव *</label>
                    <input 
                      type="text" 
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="उदा. रमेश गायकवाड" 
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-dark uppercase tracking-wider">ईमेल पत्ता (पडताळणीसाठी) *</label>
                    <input 
                      type="email" 
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      placeholder="उदा. name@email.com" 
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>
                </div>

                {/* 3. Comment */}
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark uppercase tracking-wider">तुमचा अभिप्राय (Comment) *</label>
                  <textarea 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="दुकानाची सेवा, माल आणि अनुभवाबद्दल सविस्तर लिहा..." 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple transition-all"
                  />
                </div>

                {/* 4. Photos uploads */}
                <div className="space-y-2">
                  <label className="text-[10px] text-brand-dark uppercase tracking-wider block">अभिप्राय फोटो जोडा (Optional)</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative border border-dashed border-gray-300 w-16 h-16 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={handleReviewPhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Camera size={16} className="text-brand-purple mb-0.5" />
                      <span className="text-[8px] text-brand-muted">अपलोड</span>
                    </div>

                    {/* Preview upload attachments */}
                    {reviewPhotos.map((p, idx) => (
                      <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 relative group">
                        <img src={p} alt="upload preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setReviewPhotos(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-0.5 right-0.5 bg-rose-500 text-white rounded-full p-0.5 opacity-80 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 justify-end pt-2">
                  {editingReviewId && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingReviewId(null);
                        setReviewComment('');
                        setReviewPhotos([]);
                      }}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-brand-muted uppercase text-[10px]"
                    >
                      रद्द करा
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="bg-gradient-brand text-white px-5 py-2.5 rounded-xl hover:shadow-[0_8px_20px_rgba(79,124,255,0.2)] hover:-translate-y-0.5 transition-all flex items-center gap-1 uppercase tracking-wider text-[10px]"
                  >
                    अभिप्राय पाठवा <Send size={10} />
                  </button>
                </div>

              </form>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: LOCATION, WORKING HOURS, RELATED LISTS */}
        <div className="space-y-8">
          
          {/* Address & Maps Details */}
          <div className="glass-card p-6 border border-white/70 space-y-4">
            <h3 className="text-lg font-bold text-brand-dark border-b border-gray-100 pb-2">लोकेशन & पत्ता</h3>
            <div className="space-y-3.5 text-xs text-brand-muted font-light leading-relaxed">
              <span className="flex items-start gap-2">
                <MapPin size={16} className="text-brand-purple shrink-0 mt-0.5" />
                <span>
                  <b>गाव:</b> {biz.village}, {biz.taluka}, {biz.district} <br />
                  <b>पत्ता:</b> {biz.address}
                </span>
              </span>
              
              {/* Map embed / View Link button */}
              <a 
                href={biz.mapLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 block text-center rounded-xl bg-slate-50 border border-gray-200 text-brand-purple hover:bg-slate-100 transition-all font-bold"
              >
                नकाशा उघडा (View Location)
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="glass-card p-6 border border-white/70 space-y-4">
            <h3 className="text-lg font-bold text-brand-dark border-b border-gray-100 pb-2">कामाची वेळ (Hours)</h3>
            <div className="flex justify-between items-center text-xs font-semibold text-brand-muted">
              <span className="flex items-center gap-1.5 font-light">
                <Clock size={16} className="text-brand-purple" />
                दररोज उघडे
              </span>
              <span className="text-slate-800 font-bold">
                {biz.openingTime} ते {biz.closingTime}
              </span>
            </div>
          </div>

          {/* Report Button Link */}
          <button 
            onClick={() => setShowReportModal(true)}
            className="w-full py-2 bg-rose-50/50 hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-bold text-xs rounded-xl border border-rose-200/50 transition-all flex items-center justify-center gap-1 shadow-sm"
          >
            <AlertTriangle size={13} /> या व्यवसायाची तक्रार करा (Report)
          </button>

          {/* Related Listings Grid */}
          {related.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-brand-dark border-b border-gray-200/60 pb-2">समान इतर व्यवसाय</h3>
              <div className="space-y-4">
                {related.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => { navigate(`/business/${item.category}/${item.id}`); window.scrollTo(0, 0); }}
                    className="glass-card p-4 border border-white/70 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-soft transition-all"
                  >
                    {item.logo ? (
                      <img src={item.logo} alt="logo" className="w-10 h-10 rounded-lg object-cover border border-gray-200/50 bg-white" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-gray-200 flex items-center justify-center shrink-0">
                        <ImageIcon size={16} className="text-slate-400" />
                      </div>
                    )}
                    <div className="space-y-0.5 text-xs text-left">
                      <h4 className="font-bold text-brand-dark line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-brand-muted font-light">{item.village} | {item.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* REPORT CONFLICT MODAL OVERLAY */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/20 backdrop-blur-md p-4 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-sm glass-card p-6 border border-white shadow-2xl relative text-left"
            >
              <button 
                onClick={() => setShowReportModal(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-white text-brand-dark transition-colors shadow-sm font-bold text-xs"
              >
                ✕
              </button>

              <h3 className="text-lg font-extrabold text-brand-dark mb-2">तक्रार प्रविष्ट करा (Report)</h3>
              <p className="text-xs text-brand-muted font-light mb-4">तुम्हाला या व्यवसायाबद्दल चुकीची माहिती किंवा खोटे व्यवहार आढळले असल्यास कृपया खाली कारण प्रविष्ट करा.</p>

              {reportSuccess && <span className="text-xs text-emerald-500 font-bold block mb-4">तक्रार यशस्वीरित्या नोंदवली!</span>}

              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs font-semibold">
                <textarea 
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  rows={3}
                  placeholder="तक्रारीचे कारण लिहा..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple transition-all"
                />
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors shadow-md"
                >
                  तक्रार पाठवा (Submit Report)
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
