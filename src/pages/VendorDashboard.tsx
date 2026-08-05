import { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, Plus, Settings, Edit2, Trash2, X, MapPin, Phone, Mail, Clock, Eye, MessageSquare, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, Business } from '../services/db';

export default function VendorDashboard() {
  const [myBusinesses, setMyBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem('db_my_businesses');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('mandi');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [village, setVillage] = useState('');
  const [taluka, setTaluka] = useState('शेवगांव');
  const [district, setDistrict] = useState('अहमदनगर');
  const [mapLink, setMapLink] = useState('');
  const [openingTime, setOpeningTime] = useState('09:00 AM');
  const [closingTime, setClosingTime] = useState('09:00 PM');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // Category Specific form fields
  const [cropCat, setCropCat] = useState('भाजीपाला');
  const [cropPrice, setCropPrice] = useState('');
  const [cropUnit, setCropUnit] = useState('किलो');
  const [cropQty, setCropQty] = useState('');
  const [techCat, setTechCat] = useState('इलेक्ट्रिशियन');
  const [techExp, setTechExp] = useState('२');
  const [techWorks, setTechWorks] = useState('');
  const [materialItems, setMaterialItems] = useState('');
  const [hotelType, setHotelType] = useState('Veg');
  const [todaysSpecial, setTodaysSpecial] = useState('');
  const [specialPrice, setSpecialPrice] = useState('');
  const [hotelOffer, setHotelOffer] = useState('');
  const [vehicleCat, setVehicleCat] = useState('Cars');
  const [vehicleYear, setVehicleYear] = useState('2020');
  const [vehicleKm, setVehicleKm] = useState('');
  const [vehicleFuel, setVehicleFuel] = useState('पेट्रोल');
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [mechanicType, setMechanicType] = useState('गॅरेज');
  const [mechanicEmergency, setMechanicEmergency] = useState('२४x७ उपलब्ध');
  const [offerDiscount, setOfferDiscount] = useState('10');
  const [offerBanner, setOfferBanner] = useState('');
  const [offerDesc, setOfferDesc] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [expandedBizId, setExpandedBizId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>({});

  useEffect(() => {
    localStorage.setItem('db_my_businesses', JSON.stringify(myBusinesses));
  }, [myBusinesses]);

  // Image base64 converter
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner' | 'photos') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'photos') {
      const promises = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(promises).then((base64s) => {
        setPhotos((prev) => [...prev, ...base64s]);
      });
    } else {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') setLogo(reader.result as string);
        if (type === 'banner') setBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate post limit usage
  const activePostLimit = myBusinesses[0]?.postLimit || 2;

  // Open modal in Add mode
  const openAddModal = () => {
    if (myBusinesses.length >= activePostLimit) {
      alert(`तुमच्या सबस्क्रिप्शन प्लॅनची पोस्ट मर्यादा (${myBusinesses.length}/${activePostLimit} पोस्ट) संपली आहे!\n\nनवीन पोस्ट जोडण्यासाठी कृपया प्रशासकाकडून तुमचा प्लॅन अपग्रेड करा.`);
      return;
    }

    setEditingId(null);
    setName('');
    setDescription('');
    setCategory('mandi');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setAddress('');
    setVillage('');
    setTaluka('शेवगांव');
    setDistrict('अहमदनगर');
    setMapLink('');
    setOpeningTime('सकाळी ०९:००');
    setClosingTime('रात्री ०९:००');
    setLogo('');
    setBanner('');
    setPhotos([]);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const openEditModal = (biz: Business) => {
    setEditingId(biz.id);
    setName(biz.name);
    setDescription(biz.description);
    setCategory(biz.category);
    setPhone(biz.phone);
    setWhatsapp(biz.whatsapp);
    setEmail(biz.email);
    setAddress(biz.address);
    setVillage(biz.village);
    setTaluka(biz.taluka);
    setDistrict(biz.district);
    setMapLink(biz.mapLink);
    setOpeningTime(biz.openingTime);
    setClosingTime(biz.closingTime);
    setLogo(biz.logo);
    setBanner(biz.banner);
    setPhotos(biz.photos);

    // Populate category-specific fields
    setCropCat(biz.cropCat || 'भाजीपाला');
    setCropPrice(biz.cropPrice || '');
    setCropUnit(biz.cropUnit || 'किलो');
    setCropQty(biz.cropQty || '');
    setTechCat(biz.techCat || 'इलेक्ट्रिशियन');
    setTechExp(biz.techExp || '२');
    setTechWorks(biz.techWorks || '');
    setMaterialItems(biz.materialItems || '');
    setHotelType(biz.hotelType || 'Veg');
    setTodaysSpecial(biz.todaysSpecial || '');
    setSpecialPrice(biz.specialPrice || '');
    setHotelOffer(biz.hotelOffer || '');
    setVehicleCat(biz.vehicleCat || 'Cars');
    setVehicleYear(biz.vehicleYear || '2020');
    setVehicleKm(biz.vehicleKm || '');
    setVehicleFuel(biz.vehicleFuel || 'पेट्रोल');
    setVehiclePrice(biz.vehiclePrice || '');
    setMechanicType(biz.mechanicType || 'गॅरेज');
    setMechanicEmergency(biz.mechanicEmergency || '२४x७ उपलब्ध');
    setOfferDiscount(biz.offerDiscount || '10');
    setOfferBanner(biz.offerBanner || '');
    setOfferDesc(biz.offerDesc || '');

    setFormErrors({});
    setIsModalOpen(true);
  };

  // Save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = 'व्यवसायाचे नाव आवश्यक आहे.';
    if (!description.trim()) errors.description = 'वर्णन आवश्यक आहे.';
    if (!phone.trim()) errors.phone = 'मोबाईल क्रमांक आवश्यक आहे.';
    if (!whatsapp.trim()) errors.whatsapp = 'व्हॉट्सॲप क्रमांक आवश्यक आहे.';
    if (!address.trim()) errors.address = 'पत्ता आवश्यक आहे.';
    if (!village.trim()) errors.village = 'गाव आवश्यक आहे.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newId = editingId || 'biz_' + Date.now();
    const editingBiz = editingId ? myBusinesses.find(b => b.id === editingId) : null;
    const businessObj: Business = {
      id: newId,
      name,
      ownerName: editingBiz?.ownerName || '',
      isApproved: editingBiz?.isApproved ?? false,
      description,
      category: category as any,
      phone,
      whatsapp,
      email,
      address,
      village,
      taluka,
      district,
      mapLink: mapLink.trim() || 'https://maps.google.com',
      openingTime,
      closingTime,
      logo,
      banner,
      photos,
      cropCat,
      cropPrice,
      cropUnit,
      cropQty,
      techCat,
      techExp,
      techWorks,
      materialItems,
      hotelType,
      todaysSpecial,
      specialPrice,
      hotelOffer,
      vehicleCat,
      vehicleYear,
      vehicleKm,
      vehicleFuel,
      vehiclePrice,
      mechanicType,
      mechanicEmergency,
      offerDiscount,
      offerBanner,
      offerDesc,
    };

    // 1. Update owner dashboard list state
    if (editingId) {
      setMyBusinesses(myBusinesses.map((b) => (b.id === editingId ? businessObj : b)));
      db.logMerchantActivity(name, name, category, 'UPDATE', 'व्यापाऱ्याने व्यवसाय प्रोफाइल माहिती अपडेट केली.');
    } else {
      setMyBusinesses([businessObj, ...myBusinesses]);
      db.logMerchantActivity(name, name, category, 'ADD', 'नवीन व्यापारी व्यवसाय प्रोफाइल जोडले.');
    }

    // 2. Synchronize to public categories lists in local storage
    syncToPublicDatabase(businessObj);

    setIsModalOpen(false);
  };

  // Synchronize dynamic details to specific Home page category arrays
  const syncToPublicDatabase = (biz: Business) => {
    const id = biz.id;

    if (biz.category === 'mandi') {
      const cropObj = {
        id,
        farmer: biz.name,
        cropName: biz.cropCat === 'इतर' ? biz.description.split('\n')[0] : biz.cropCat,
        category: biz.cropCat || 'भाजीपाला',
        price: biz.cropPrice || '५०',
        unit: biz.cropUnit || 'किलो',
        quantity: biz.cropQty || '१०',
        village: biz.village,
        image: biz.logo || biz.photos[0] || 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=300&q=80',
        phone: biz.phone,
      };
      const saved = JSON.parse(localStorage.getItem('db_crops') || '[]');
      const updated = saved.some((c: any) => c.id === id)
        ? saved.map((c: any) => (c.id === id ? cropObj : c))
        : [cropObj, ...saved];
      localStorage.setItem('db_crops', JSON.stringify(updated));

    } else if (biz.category === 'technician') {
      const techObj = {
        id,
        name: biz.name,
        category: biz.techCat || 'इलेक्ट्रिशियन',
        experience: (biz.techExp || '२') + ' वर्षे',
        rating: 5.0,
        reviews: 1,
        works: parseInt(biz.techWorks || '10') || 10,
        photo: biz.logo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
        location: biz.village,
        availability: 'उपलब्ध',
        phone: biz.phone,
        gallery: biz.photos.length > 0 ? biz.photos : [biz.logo || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80'],
      };
      const saved = JSON.parse(localStorage.getItem('db_technicians') || '[]');
      const updated = saved.some((t: any) => t.id === id)
        ? saved.map((t: any) => (t.id === id ? techObj : t))
        : [techObj, ...saved];
      localStorage.setItem('db_technicians', JSON.stringify(updated));

    } else if (biz.category === 'material') {
      const matObj = {
        id,
        name: biz.name,
        contact: biz.phone,
        items: biz.materialItems || biz.description,
        map: biz.mapLink || 'https://maps.google.com',
      };
      const saved = JSON.parse(localStorage.getItem('db_materials') || '[]');
      const updated = saved.some((m: any) => m.id === id)
        ? saved.map((m: any) => (m.id === id ? matObj : m))
        : [matObj, ...saved];
      localStorage.setItem('db_materials', JSON.stringify(updated));

    } else if (biz.category === 'hotel') {
      const hotelObj = {
        id,
        name: biz.name,
        category: biz.hotelType || 'Veg',
        vegType: biz.hotelType || 'Veg',
        rating: 5.0,
        reviews: 1,
        timing: `${biz.openingTime} ते ${biz.closingTime}`,
        distance: '०.५ किमी',
        location: `${biz.village}, ${biz.address}`,
        phone: biz.phone,
        map: biz.mapLink || 'https://maps.google.com',
        image: biz.logo || biz.photos[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
        todaysSpecial: biz.todaysSpecial || 'विशेष थाळी',
        offer: biz.hotelOffer || 'नवीन स्पेशल ऑफर',
        specialDishImage: biz.photos[0] || biz.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
        menu: [
          { name: biz.todaysSpecial || 'विशेष थाळी', price: biz.specialPrice || '१२०' }
        ]
      };
      const saved = JSON.parse(localStorage.getItem('db_hotels') || '[]');
      const updated = saved.some((h: any) => h.id === id)
        ? saved.map((h: any) => (h.id === id ? hotelObj : h))
        : [hotelObj, ...saved];
      localStorage.setItem('db_hotels', JSON.stringify(updated));

    } else if (biz.category === 'vehicle') {
      const vehObj = {
        id,
        title: biz.name,
        category: biz.vehicleCat || 'Cars',
        price: biz.vehiclePrice || '५,००,०००',
        owner: biz.description.split('\n')[0] || 'विक्रेता',
        location: biz.village,
        year: biz.vehicleYear || '2020',
        km: biz.vehicleKm || '१५,००० किमी',
        fuel: biz.vehicleFuel || 'पेट्रोल',
        image: biz.logo || biz.photos[0] || 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=400&q=80',
        phone: biz.phone,
      };
      const saved = JSON.parse(localStorage.getItem('db_vehicles') || '[]');
      const updated = saved.some((v: any) => v.id === id)
        ? saved.map((v: any) => (v.id === id ? vehObj : v))
        : [vehObj, ...saved];
      localStorage.setItem('db_vehicles', JSON.stringify(updated));

    } else if (biz.category === 'mechanics') {
      const mechObj = {
        id,
        name: biz.name,
        contact: biz.phone,
        emergency: biz.mechanicEmergency || '२४x७ उपलब्ध',
        map: biz.mapLink || 'https://maps.google.com',
      };
      const saved = JSON.parse(localStorage.getItem('db_mechanics') || '[]');
      const updated = saved.some((m: any) => m.id === id)
        ? saved.map((m: any) => (m.id === id ? mechObj : m))
        : [mechObj, ...saved];
      localStorage.setItem('db_mechanics', JSON.stringify(updated));

    } else if (biz.category === 'offers') {
      const offerObj = {
        id,
        shopName: biz.name,
        category: biz.description.split('\n')[0] || 'ऑफर',
        banner: biz.offerBanner || 'मोठी सूट!',
        discount: biz.offerDiscount || '१०',
        image: biz.logo || biz.photos[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
        secondsLeft: 7200,
        desc: biz.offerDesc || biz.description,
      };
      const saved = JSON.parse(localStorage.getItem('db_offers') || '[]');
      const updated = saved.some((o: any) => o.id === id)
        ? saved.map((o: any) => (o.id === id ? offerObj : o))
        : [offerObj, ...saved];
      localStorage.setItem('db_offers', JSON.stringify(updated));
    }
  };

  // Delete business profile
  const handleDelete = (id: string, cat: string) => {
    if (!confirm('तुम्हाला खरोखर हा व्यवसाय काढून टाकायचा आहे का?')) return;

    const targetBiz = myBusinesses.find(b => b.id === id);
    if (targetBiz) {
      db.logMerchantActivity(targetBiz.name, targetBiz.name, cat, 'DELETE', 'व्यापाऱ्याने व्यवसाय प्रोफाइल हटवले.');
    }

    // Remove from owner list
    const updatedMyBiz = myBusinesses.filter((b) => b.id !== id);
    setMyBusinesses(updatedMyBiz);

    // Remove from public lists:
    if (cat === 'mandi') {
      const list = JSON.parse(localStorage.getItem('db_crops') || '[]');
      localStorage.setItem('db_crops', JSON.stringify(list.filter((c: any) => c.id !== id)));
    } else if (cat === 'technician') {
      const list = JSON.parse(localStorage.getItem('db_technicians') || '[]');
      localStorage.setItem('db_technicians', JSON.stringify(list.filter((t: any) => t.id !== id)));
    } else if (cat === 'material') {
      const list = JSON.parse(localStorage.getItem('db_materials') || '[]');
      localStorage.setItem('db_materials', JSON.stringify(list.filter((m: any) => m.id !== id)));
    } else if (cat === 'hotel') {
      const list = JSON.parse(localStorage.getItem('db_hotels') || '[]');
      localStorage.setItem('db_hotels', JSON.stringify(list.filter((h: any) => h.id !== id)));
    } else if (cat === 'vehicle') {
      const list = JSON.parse(localStorage.getItem('db_vehicles') || '[]');
      localStorage.setItem('db_vehicles', JSON.stringify(list.filter((v: any) => v.id !== id)));
    } else if (cat === 'mechanics') {
      const list = JSON.parse(localStorage.getItem('db_mechanics') || '[]');
      localStorage.setItem('db_mechanics', JSON.stringify(list.filter((m: any) => m.id !== id)));
    } else if (cat === 'offers') {
      const list = JSON.parse(localStorage.getItem('db_offers') || '[]');
      localStorage.setItem('db_offers', JSON.stringify(list.filter((o: any) => o.id !== id)));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-6 pb-16 px-4 text-left">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-card border border-white/70 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-purple/10 flex items-center justify-center border border-brand-purple/20 shadow-inner">
            <Settings size={24} className="text-brand-purple" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-brand-dark">भागीदार डॅशबोर्ड</h2>
            <p className="text-xs text-brand-muted font-light mt-0.5">तुमचे व्यवसाय व्यवस्थापित करा आणि नवीन जाहिराती प्रसिद्ध करा.</p>
          </div>
        </div>

        <button 
          onClick={openAddModal}
          className="bg-gradient-brand text-white font-semibold py-3 px-5 rounded-xl hover:shadow-[0_8px_20px_rgba(79,124,255,0.25)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 self-start sm:self-auto text-xs uppercase tracking-wider"
        >
          <Plus size={16} /> नवीन व्यवसाय जोडा
        </button>
      </div>

      {/* Title */}
      <div className="space-y-1 border-b border-gray-200/60 pb-3">
        <h3 className="text-lg font-bold text-brand-dark">माझे नोंदणीकृत व्यवसाय</h3>
        <p className="text-xs text-brand-muted font-light">खाली तुमचे चालू असलेले दुकान किंवा सेवा दिसत आहेत. तुम्ही ते कधीही बदलू किंवा हटवू शकता.</p>
      </div>

      {/* Dashboard Listings Grid */}
      {myBusinesses.length === 0 ? (
        <div className="py-16 text-center glass-card border border-dashed border-slate-300/60 rounded-3xl flex flex-col items-center justify-center gap-3">
          <ImageIcon size={48} className="text-slate-300" />
          <p className="text-sm font-semibold text-brand-dark">अद्याप कोणताही व्यवसाय जोडलेला नाही.</p>
          <button 
            onClick={openAddModal}
            className="text-brand-purple text-xs font-bold hover:underline"
          >
            तुमचा पहिला व्यवसाय आताच नोंदवा
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myBusinesses.map((biz) => (
            <div key={biz.id} className="glass-card border border-white/70 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-soft transition-all duration-300">
              
              {/* Banner / Category Preview */}
              <div className="h-28 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {biz.banner ? (
                  <img src={biz.banner} alt="business banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 flex items-center justify-center text-brand-purple font-display font-bold">
                    Shevgaon Market
                  </div>
                )}
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-bold text-brand-purple border border-white/60 uppercase">
                  {biz.category === 'mandi' && 'शेतकरी बाजार'}
                  {biz.category === 'technician' && 'घरगुती सेवा'}
                  {biz.category === 'material' && 'साहित्य पुरवठादार'}
                  {biz.category === 'hotel' && 'हॉटेल / अन्न'}
                  {biz.category === 'vehicle' && 'वाहन विभाग'}
                  {biz.category === 'mechanics' && 'मेकॅनिक / गॅरेज'}
                  {biz.category === 'offers' && 'ऑफर / सेल'}
                </span>
              </div>

              {/* Profile body */}
              <div className="p-5 flex-grow space-y-4">
                <div className="flex gap-4">
                  {biz.logo ? (
                    <img src={biz.logo} alt="logo" className="w-12 h-12 rounded-xl object-cover border border-gray-200/50 shadow-sm shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-gray-200 flex items-center justify-center shrink-0">
                      <ImageIcon size={20} className="text-slate-400" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-brand-dark text-base">{biz.name}</h4>
                    <p className="text-xs text-brand-muted font-light line-clamp-2 leading-relaxed">{biz.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-brand-muted border-t border-gray-100 pt-3">
                  <span className="flex items-center gap-1.5 font-light">
                    <Phone size={12} className="text-brand-purple" /> {biz.phone}
                  </span>
                  <span className="flex items-center gap-1.5 font-light">
                    <MapPin size={12} className="text-brand-purple" /> {biz.village}
                  </span>
                  <span className="flex items-center gap-1.5 font-light">
                    <Clock size={12} className="text-brand-purple" /> {biz.openingTime} ते {biz.closingTime}
                  </span>
                  {biz.photos.length > 0 && (
                    <span className="flex items-center gap-1.5 font-light">
                      <Eye size={12} className="text-brand-purple" /> {biz.photos.length} फोटो अपलोड
                    </span>
                  )}
                </div>
              </div>

              {/* Actions row */}
              <div className="bg-slate-50/50 border-t border-gray-100 px-5 py-3.5 flex justify-between items-center gap-3">
                <div className="flex gap-3 items-center">
                  <a 
                    href={biz.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-purple hover:text-brand-blue font-bold text-xs flex items-center gap-1"
                  >
                    <MapPin size={12} /> नकाशा पहा
                  </a>
                  <button
                    onClick={() => setExpandedBizId(expandedBizId === biz.id ? null : biz.id)}
                    className="text-brand-purple hover:text-brand-blue font-bold text-xs flex items-center gap-1"
                  >
                    <MessageSquare size={12} /> पुनरावलोकने ({db.getReviewsForBusiness(biz.id).length})
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(biz)}
                    className="p-2 rounded-lg bg-white border border-gray-200 text-brand-dark hover:bg-slate-50 hover:border-brand-purple transition-all flex items-center gap-1 font-bold text-[10px]"
                  >
                    <Edit2 size={10} /> बदला
                  </button>
                  <button 
                    onClick={() => handleDelete(biz.id, biz.category)}
                    className="p-2 rounded-lg bg-white border border-gray-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center gap-1 font-bold text-[10px]"
                  >
                    <Trash2 size={10} /> डिलीट
                  </button>
                </div>
              </div>

              {/* Collapsible Reviews & Replies List */}
              {expandedBizId === biz.id && (
                <div className="border-t border-gray-100 p-5 bg-slate-50/30 space-y-4 text-xs">
                  <h5 className="font-bold text-brand-dark flex items-center gap-1.5">
                    <MessageSquare size={12} className="text-brand-purple" />
                    ग्राहकांचे पुनरावलोकने (Customer Reviews)
                  </h5>
                  {db.getReviewsForBusiness(biz.id).length === 0 ? (
                    <p className="text-brand-muted font-light italic">या व्यवसायासाठी अद्याप कोणतीही पुनरावलोकने नाहीत.</p>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {db.getReviewsForBusiness(biz.id).map((r) => (
                        <div key={r.id} className="p-3.5 bg-white border border-gray-100 rounded-2xl space-y-3 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-brand-dark">{r.userName}</span>
                              <span className="text-[10px] text-brand-muted ml-2">{r.userEmail}</span>
                              <div className="flex text-amber-400 gap-0.5 mt-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} size={10} className={star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                                ))}
                              </div>
                            </div>
                            <span className="text-[9px] text-brand-muted font-mono">{r.createdAt.split('T')[0]}</span>
                          </div>
                          
                          <p className="text-brand-dark font-light leading-relaxed">{r.comment}</p>
                          
                          {r.photos && r.photos.length > 0 && (
                            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
                              {r.photos.map((p, pIdx) => (
                                <img key={pIdx} src={p} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                              ))}
                            </div>
                          )}
                          
                          {/* Owner Reply */}
                          {r.reply ? (
                            <div className="bg-emerald-50/50 border border-emerald-100 text-emerald-800 p-3 rounded-xl space-y-1.5 mt-2">
                              <span className="font-bold text-[10px] text-emerald-700 block">✍️ तुमचे उत्तर (Your Reply):</span>
                              <p className="font-light">{r.reply}</p>
                              <button
                                onClick={() => {
                                  setReplies(prev => ({ ...prev, [r.id]: r.reply || '' }));
                                  const updated = { ...r, reply: '' };
                                  db.saveReview(updated);
                                }}
                                className="text-[10px] font-bold text-brand-purple hover:underline pt-1 block"
                              >
                                उत्तर बदला (Change Reply)
                              </button>
                            </div>
                          ) : (
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                const replyText = replies[r.id] || '';
                                if (!replyText.trim()) return;
                                const updated = { ...r, reply: replyText };
                                db.saveReview(updated);
                                setReplies(prev => ({ ...prev, [r.id]: '' }));
                              }}
                              className="space-y-2 mt-2 pt-2 border-t border-gray-100/50"
                            >
                              <textarea
                                placeholder="ग्राहकाच्या पुनरावलोकनाला उत्तर लिहा..."
                                value={replies[r.id] || ''}
                                onChange={(e) => setReplies(prev => ({ ...prev, [r.id]: e.target.value }))}
                                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-brand-dark placeholder-slate-400 focus:outline-none focus:border-brand-purple transition-all resize-none"
                                rows={2}
                              />
                              <button
                                type="submit"
                                className="px-3.5 py-1.5 bg-gradient-brand text-white rounded-xl font-semibold text-[10px] hover:shadow-md transition-all uppercase tracking-wider"
                              >
                                उत्तर पाठवा (Submit Reply)
                              </button>
                            </form>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Overlay Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/35 backdrop-blur-md p-4 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              className="w-full max-w-2xl bg-white/95 border border-white/80 rounded-3xl p-6 md:p-8 shadow-2xl relative text-left overflow-y-auto max-h-[90vh] glass-card"
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-brand-dark transition-colors shadow-sm font-bold text-sm"
              >
                <X size={15} />
              </button>

              <div className="mb-6 space-y-1">
                <h3 className="text-xl font-extrabold text-brand-dark">
                  {editingId ? 'व्यवसाय संपादन करा (Edit)' : 'नवीन व्यवसाय जोडा (Add Business)'}
                </h3>
                <p className="text-xs text-brand-muted font-light">खालील फॉर्म काळजीपूर्वक भरा. सर्व माहिती तात्काळ ग्राहकांसाठी प्रसिद्ध केली जाईल.</p>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                
                {/* 1. Category and Shop details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">व्यवसायाची श्रेणी (Category) *</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-sm focus:outline-none focus:border-brand-purple transition-all"
                    >
                      <option value="mandi">🌾 शेतकरी (Daily Mandi & Produce)</option>
                      <option value="technician">🛠️ घरगुती सेवा (कारागीर / Technicians)</option>
                      <option value="material">🧱 बांधकाम साहित्य पुरवठादार (Material)</option>
                      <option value="hotel">🍔 हॉटेल, रेस्टॉरंट आणि स्ट्रीट फूड (Hotels)</option>
                      <option value="vehicle">🚗 वाहन खरेदी-विक्री (Vehicles Dealer)</option>
                      <option value="mechanics">🔧 मेकॅनिक / गॅरेज आणि पंक्चर दुरुस्ती</option>
                      <option value="beauty">💇‍♀️ ब्युटी पार्लर (Beauty parlour)</option>
                      <option value="water">🚰 वॉटर जार सेवा (Water jar)</option>
                      <option value="cyber">💻 सायबर कॅफे व ऑनलाईन (Cyber cafe)</option>
                      <option value="mess">🍲 मेस व खानावळ (Mess)</option>
                      <option value="photoshop">📸 फोटोशॉप व फोटोग्राफी (Photoshop)</option>
                      <option value="gym">🏋️‍♂️ जिम व फिटनेस (Gym)</option>
                      <option value="hospital">🏥 हॉस्पिटल व रुग्णालय (Hospital)</option>
                      <option value="mobileshop">📱 मोबाईल शॉप व रिपेअरिंग (Mobile shop)</option>
                      <option value="sweethome">🧁 स्वीट होम व बेकरी (Sweet home)</option>
                      <option value="offers">🛍️ स्थानिक सेल आणि ऑफर्स (Offers)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">व्यवसाय / दुकानाचे नाव *</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="उदा. जगदंबा हार्डवेअर"
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-sm focus:outline-none focus:border-brand-purple transition-all"
                    />
                    {formErrors.name && <span className="text-[10px] text-rose-500 font-bold">{formErrors.name}</span>}
                  </div>
                </div>

                {/* 2. File Upload Blocks (Logo, Banner, Photos) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Shop Logo upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-brand-dark font-bold uppercase tracking-wider block">दुकान लोगो (Shop Logo)</label>
                    <div className="relative border border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors aspect-video">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageFile(e, 'logo')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {logo ? (
                        <img src={logo} alt="logo" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <>
                          <Camera size={18} className="text-brand-purple mb-1" />
                          <span className="text-[9px] text-brand-muted">फोटो निवडा</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Shop Banner upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-brand-dark font-bold uppercase tracking-wider block">दुकान बॅनर (Shop Banner)</label>
                    <div className="relative border border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors aspect-video">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageFile(e, 'banner')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {banner ? (
                        <img src={banner} alt="banner" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <>
                          <ImageIcon size={18} className="text-brand-purple mb-1" />
                          <span className="text-[9px] text-brand-muted">बॅनर अपलोड</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Multiple Shop Photos upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-brand-dark font-bold uppercase tracking-wider block">इतर फोटो ({photos.length} uploaded)</label>
                    <div className="relative border border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors aspect-video">
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageFile(e, 'photos')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Plus size={18} className="text-brand-purple mb-1" />
                      <span className="text-[9px] text-brand-muted">फोटो निवडा (Multiple)</span>
                    </div>
                  </div>

                </div>

                {/* Display uploaded photos gallery with delete options */}
                {photos.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[10px] text-brand-dark font-bold uppercase tracking-wider block">गॅलरी फोटो डिलीट करा (माऊस नेऊन डिलीट करा):</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {photos.map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold"
                          >
                            <Trash2 size={14} className="text-white drop-shadow" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">व्यवसायाचे सविस्तर वर्णन (Description) *</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="उदा. आमच्याकडे सर्व प्रकारचे सिमेंट, खडी आणि बांधकाम साहित्याचे घाऊक पुरवठादार आहोत..."
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-sm focus:outline-none focus:border-brand-purple transition-all"
                  />
                  {formErrors.description && <span className="text-[10px] text-rose-500 font-bold">{formErrors.description}</span>}
                </div>

                {/* 3. Category Specific Dynamic Inputs */}
                {category === 'mandi' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-emerald-800">धान्य/भाजी वर्गीकरण</label>
                      <select value={cropCat} onChange={(e) => setCropCat(e.target.value)} className="w-full p-2 bg-white border border-emerald-200 rounded-lg">
                        <option value="भाजीपाला">भाजीपाला</option>
                        <option value="फळे">फळे</option>
                        <option value="धान्य">धान्य</option>
                        <option value="इतर">इतर</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-emerald-800">किंमत (रुपये) *</label>
                      <input type="text" value={cropPrice} onChange={(e) => setCropPrice(e.target.value)} placeholder="उदा. ४०" className="w-full p-2 bg-white border border-emerald-200 rounded-lg" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-emerald-800">एकक (Unit)</label>
                      <select value={cropUnit} onChange={(e) => setCropUnit(e.target.value)} className="w-full p-2 bg-white border border-emerald-200 rounded-lg">
                        <option value="किलो">किलो</option>
                        <option value="क्विंटल">क्विंटल</option>
                        <option value="नग">नग</option>
                        <option value="डझन">डझन</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-emerald-800">उपलब्ध प्रमाण (Qty) *</label>
                      <input type="text" value={cropQty} onChange={(e) => setCropQty(e.target.value)} placeholder="उदा. ५० किलो" className="w-full p-2 bg-white border border-emerald-200 rounded-lg" />
                    </div>
                  </motion.div>
                )}

                {category === 'technician' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-brand-purple/5 border border-brand-purple/10 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-brand-purple">कारागीर वर्गवारी</label>
                      <select value={techCat} onChange={(e) => setTechCat(e.target.value)} className="w-full p-2 bg-white border border-brand-purple/20 rounded-lg">
                        <option value="इलेक्ट्रिशियन">इलेक्ट्रिशियन</option>
                        <option value="प्लंबर">प्लंबर</option>
                        <option value="गवंडी">गवंडी</option>
                        <option value="कारपेंटर">कारपेंटर</option>
                        <option value="पेंटर">पेंटर</option>
                        <option value="वेल्डर">वेल्डर / वेल्डिंग</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-brand-purple">कामाचा अनुभव (वर्षे)</label>
                      <input type="number" value={techExp} onChange={(e) => setTechExp(e.target.value)} placeholder="५" className="w-full p-2 bg-white border border-brand-purple/20 rounded-lg" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-brand-purple">झालेली कामे (Completed)</label>
                      <input type="text" value={techWorks} onChange={(e) => setTechWorks(e.target.value)} placeholder="उदा. १४०+" className="w-full p-2 bg-white border border-brand-purple/20 rounded-lg" />
                    </div>
                  </motion.div>
                )}

                {category === 'material' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-1 text-xs">
                    <label className="font-bold text-amber-800">उपलब्ध बांधकाम साहित्याची यादी</label>
                    <input type="text" value={materialItems} onChange={(e) => setMaterialItems(e.target.value)} placeholder="उदा. रेती, विटा, सिमेंट पत्रे, पाईप्स" className="w-full p-2 bg-white border border-amber-200 rounded-lg" />
                  </motion.div>
                )}

                {category === 'hotel' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-rose-800">अन्न प्रकार (Food Type)</label>
                      <select value={hotelType} onChange={(e) => setHotelType(e.target.value)} className="w-full p-2 bg-white border border-rose-200 rounded-lg">
                        <option value="Veg">शाकाहारी (Veg)</option>
                        <option value="Non Veg">मांसाहारी (Non Veg)</option>
                        <option value="Pure Veg">शुद्ध शाकाहारी (Pure Veg)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-rose-800">आजचे स्पेशल डिश (Special)</label>
                      <input type="text" value={todaysSpecial} onChange={(e) => setTodaysSpecial(e.target.value)} placeholder="मटण थाळी / पनीर मसाला" className="w-full p-2 bg-white border border-rose-200 rounded-lg" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-rose-800">स्पेशल डिश किंमत (₹)</label>
                      <input type="text" value={specialPrice} onChange={(e) => setSpecialPrice(e.target.value)} placeholder="२२०" className="w-full p-2 bg-white border border-rose-200 rounded-lg" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-rose-800">कूपन / ऑफर (Offers)</label>
                      <input type="text" value={hotelOffer} onChange={(e) => setHotelOffer(e.target.value)} placeholder="१ बिर्याणीवर १ हाफ मोफत" className="w-full p-2 bg-white border border-rose-200 rounded-lg" />
                    </div>
                  </motion.div>
                )}

                {category === 'vehicle' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-indigo-800">वाहन प्रकार</label>
                      <select value={vehicleCat} onChange={(e) => setVehicleCat(e.target.value)} className="w-full p-2 bg-white border border-indigo-200 rounded-lg">
                        <option value="Cars">फोर-व्हीलर (Cars)</option>
                        <option value="Bikes">टू-व्हीलर (Bikes)</option>
                        <option value="Tractor">ट्रॅक्टर (Tractor)</option>
                        <option value="JCB">जेसीबी / इतर</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-indigo-800">मॉडेल वर्ष (Year)</label>
                      <input type="text" value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} placeholder="२०२०" className="w-full p-2 bg-white border border-indigo-200 rounded-lg" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-indigo-800">चाललेले किमी (Km)</label>
                      <input type="text" value={vehicleKm} onChange={(e) => setVehicleKm(e.target.value)} placeholder="२५,००० किमी" className="w-full p-2 bg-white border border-indigo-200 rounded-lg" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-indigo-800">इंधन (Fuel)</label>
                      <select value={vehicleFuel} onChange={(e) => setVehicleFuel(e.target.value)} className="w-full p-2 bg-white border border-indigo-200 rounded-lg">
                        <option value="पेट्रोल">पेट्रोल</option>
                        <option value="डिझेल">डिझेल</option>
                        <option value="CNG">CNG</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-indigo-800">किंमत (₹) *</label>
                      <input type="text" value={vehiclePrice} onChange={(e) => setVehiclePrice(e.target.value)} placeholder="४,५०,०००" className="w-full p-2 bg-white border border-indigo-200 rounded-lg" />
                    </div>
                  </motion.div>
                )}

                {category === 'mechanics' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-sky-50/50 border border-sky-100 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-sky-800">गॅरेजचा प्रकार (Garage Type)</label>
                      <input type="text" value={mechanicType} onChange={(e) => setMechanicType(e.target.value)} placeholder="उदा. हायवे पंक्चर शॉप, टू-व्हीलर गॅरेज" className="w-full p-2 bg-white border border-sky-200 rounded-lg" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-sky-800">आपत्कालीन उपलब्धता (Emergency)</label>
                      <select value={mechanicEmergency} onChange={(e) => setMechanicEmergency(e.target.value)} className="w-full p-2 bg-white border border-sky-200 rounded-lg">
                        <option value="२४x७ उपलब्ध">२४x७ उपलब्ध (Emergency 24h)</option>
                        <option value="रात्री १० वाजेपर्यंत">रात्री १० वाजेपर्यंत</option>
                        <option value="२४ तास आपत्कालीन सेवा">२४ तास आपत्कालीन सेवा</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {category === 'offers' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-fuchsia-50/50 border border-fuchsia-100 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-fuchsia-800">सूट टक्केवारी (Discount %)</label>
                      <input type="number" value={offerDiscount} onChange={(e) => setOfferDiscount(e.target.value)} placeholder="२०" className="w-full p-2 bg-white border border-fuchsia-200 rounded-lg" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-fuchsia-800">ऑफर हेडलाईन (Offer Banner)</label>
                      <input type="text" value={offerBanner} onChange={(e) => setOfferBanner(e.target.value)} placeholder="उदा. दिवाळी स्पेशल धमाका ऑफर" className="w-full p-2 bg-white border border-fuchsia-200 rounded-lg" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-fuchsia-800">ऑफरचे वर्णन (Offer Desc)</label>
                      <input type="text" value={offerDesc} onChange={(e) => setOfferDesc(e.target.value)} placeholder="उदा. सर्व खरेदीवर १०% जास्तीची सूट" className="w-full p-2 bg-white border border-fuchsia-200 rounded-lg" />
                    </div>
                  </motion.div>
                )}

                {/* 4. Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">मोबाईल नंबर *</label>
                    <div className="relative">
                      <input 
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="उदा. ९८xxxxxx१०"
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 pl-9 text-brand-dark text-sm focus:outline-none focus:border-brand-purple transition-all"
                      />
                      <Phone size={14} className="absolute left-3 top-3.5 text-brand-purple" />
                    </div>
                    {formErrors.phone && <span className="text-[10px] text-rose-500 font-bold">{formErrors.phone}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">WhatsApp नंबर *</label>
                    <div className="relative">
                      <input 
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="उदा. ९८xxxxxx१०"
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 pl-9 text-brand-dark text-sm focus:outline-none focus:border-brand-purple transition-all"
                      />
                      <Phone size={14} className="absolute left-3 top-3.5 text-brand-purple" />
                    </div>
                    {formErrors.whatsapp && <span className="text-[10px] text-rose-500 font-bold">{formErrors.whatsapp}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">ईमेल पत्ता (पर्यायी)</label>
                    <div className="relative">
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="उदा. shop@email.com"
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 pl-9 text-brand-dark text-sm focus:outline-none focus:border-brand-purple transition-all"
                      />
                      <Mail size={14} className="absolute left-3 top-3.5 text-brand-purple" />
                    </div>
                  </div>

                </div>

                {/* 5. Address Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">गाव *</label>
                    <input 
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="उदा. शेवगांव"
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-sm focus:outline-none focus:border-brand-purple transition-all"
                    />
                    {formErrors.village && <span className="text-[10px] text-rose-500 font-bold">{formErrors.village}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">तालुका</label>
                    <input 
                      type="text"
                      value={taluka}
                      onChange={(e) => setTaluka(e.target.value)}
                      placeholder="उदा. शेवगांव"
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-sm focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">जिल्हा</label>
                    <input 
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="उदा. अहमदनगर"
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-sm focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">उघडण्याची / बंद वेळ</label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        placeholder="09:00 AM"
                        className="w-1/2 bg-white border border-gray-200 rounded-xl p-2 text-brand-dark text-xs focus:outline-none focus:border-brand-purple transition-all"
                      />
                      <input 
                        type="text"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        placeholder="09:00 PM"
                        className="w-1/2 bg-white border border-gray-200 rounded-xl p-2 text-brand-dark text-xs focus:outline-none focus:border-brand-purple transition-all"
                      />
                    </div>
                  </div>

                </div>

                {/* Full Address */}
                <div className="space-y-1">
                  <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">पूर्ण पत्ता (Full Address) *</label>
                  <input 
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="उदा. क्रांती चौक, बस स्टॅन्ड जवळ, शेवगांव"
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-sm focus:outline-none focus:border-brand-purple transition-all"
                  />
                  {formErrors.address && <span className="text-[10px] text-rose-500 font-bold">{formErrors.address}</span>}
                </div>

                {/* Google Maps Link */}
                <div className="space-y-1">
                  <label className="text-xs text-brand-dark font-bold uppercase tracking-wider">गुगल मॅप्स लोकेशन लिंक (Pin Location)</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={mapLink}
                      onChange={(e) => setMapLink(e.target.value)}
                      placeholder="उदा. https://maps.app.goo.gl/xxxx"
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 pl-9 text-brand-dark text-sm focus:outline-none focus:border-brand-purple transition-all"
                    />
                    <MapPin size={14} className="absolute left-3 top-3.5 text-brand-purple" />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 border border-gray-200 rounded-xl text-brand-muted hover:bg-slate-50 transition-all font-semibold text-xs uppercase"
                  >
                    रद्द करा
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-gradient-brand text-white rounded-xl hover:shadow-[0_8px_20px_rgba(79,124,255,0.25)] transition-all font-semibold text-xs uppercase"
                  >
                    व्यवसाय जतन करा (Save)
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
