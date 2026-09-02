import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { db, Business, Section, WebsiteSettings } from '../services/db';
import UniversalCard from '../components/ui/UniversalCard';
import {
  Sparkles,
  ArrowRight,
  Search as SearchIcon,
  Star,
  Mail,
  ArrowUp,
  Phone,
  MapPin,
  PlusCircle,
  Store
} from 'lucide-react';

// Countdown Timer Component in Marathi
function Countdown({ initialSeconds, seconds }: { initialSeconds?: number; seconds?: number }) {
  const startSec = seconds ?? initialSeconds ?? 7200;
  const [timeLeft, setTimeLeft] = useState(startSec);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  if (timeLeft <= 0) {
    return <span className="text-red-500 font-bold text-sm">ऑफर संपली!</span>;
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex gap-1.5 items-center justify-center">
      <span className="bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold px-2 py-0.5 rounded-md">
        {hours < 10 ? '0' : ''}{hours} तास
      </span>
      <span className="text-brand-purple text-xs font-bold">:</span>
      <span className="bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold px-2 py-0.5 rounded-md">
        {minutes < 10 ? '0' : ''}{minutes} मि
      </span>
      <span className="text-brand-purple text-xs font-bold">:</span>
      <span className="bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold px-2 py-0.5 rounded-md">
        {secs < 10 ? '0' : ''}{secs} सेकंद
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------------------
// DATA DEFINITIONS

// Mandi Crops initial data
export const initialCrops = [
  {
    id: 1,
    farmer: "बापूराव तांबे",
    cropName: "ताजी मेथी",
    category: "भाजीपाला",
    price: "१५",
    unit: "जुडी",
    quantity: "५०",
    village: "शेवगांव",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80",
    phone: "9876543210"
  },
  {
    id: 2,
    farmer: "विठ्ठल ढोले",
    cropName: "केशर आंबा",
    category: "फळे",
    price: "३५०",
    unit: "डझन",
    quantity: "१५",
    village: "दहिगाव",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=300&q=80",
    phone: "9822334455"
  },
  {
    id: 3,
    farmer: "शिवाजी देवडे",
    cropName: "लोकवन गहू",
    category: "धान्य",
    price: "२८००",
    unit: "क्विंटल",
    quantity: "४०",
    village: "बाभुळगांव",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80",
    phone: "9422001122"
  },
  {
    id: 4,
    farmer: "नवनाथ गर्जे",
    cropName: "सेंद्रिय टोमॅटो",
    category: "भाजीपाला",
    price: "४०",
    unit: "किलो",
    quantity: "१००",
    village: "तांदूळनेर",
    image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=300&q=80",
    phone: "9011223344"
  }
];

// Mandi Rates list
export const mandiRates = [
  { item: "कांदा (Onion)", rate: "₹२० - ₹३५ / किलो", status: "up" },
  { item: "बटाटा (Potato)", rate: "₹२२ - ₹३० / किलो", status: "down" },
  { item: "टोमॅटो (Tomato)", rate: "₹३० - ₹५० / किलो", status: "up" },
  { item: "गहू (Wheat)", rate: "₹२,६०० - ₹३,१०० / क्विंटल", status: "stable" },
  { item: "सोयाबीन (Soybean)", rate: "₹४,२०० - ₹४,७०० / क्विंटल", status: "up" },
  { item: "हरभरा (Chana)", rate: "₹५,५०० - ₹६,००० / क्विंटल", status: "stable" }
];

// Agri Services
export const agriServices = [
  {
    name: "माउली ट्रॅक्टर भाड्याने",
    type: "ट्रॅक्टर भाड्याने",
    contact: "9850123456",
    rating: 4.8,
    reviews: 18,
    map: "https://maps.google.com"
  },
  {
    name: "जय श्रीराम कृषी सेवा केंद्र",
    type: "कृषी सेवा केंद्र / बी-बियाणे",
    contact: "9420789012",
    rating: 4.7,
    reviews: 32,
    map: "https://maps.google.com"
  },
  {
    name: "बळीराजा खत डेपो",
    type: "खत दुकाने / अवजारे",
    contact: "9011456123",
    rating: 4.5,
    reviews: 14,
    map: "https://maps.google.com"
  }
];

// Home Services Technicians
export const initialTechnicians = [
  {
    id: 1,
    name: "ज्ञानेश्वर शिंदे",
    category: "इलेक्ट्रिशियन",
    experience: "८ वर्षे",
    rating: 4.9,
    reviews: 42,
    works: 240,
    photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&h=150&q=80",
    location: "शेवगांव",
    availability: "उपलब्ध",
    phone: "9890123456",
    gallery: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=300&q=80"
    ]
  },
  {
    id: 2,
    name: "अर्जुन गवारे",
    category: "गवंडी",
    experience: "१२ वर्षे",
    rating: 4.8,
    reviews: 56,
    works: 110,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    location: "बाभुळगांव",
    availability: "कामात व्यस्त",
    phone: "9011789012",
    gallery: [
      "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80"
    ]
  },
  {
    id: 3,
    name: "राहुल गायकवाड",
    category: "प्लंबर",
    experience: "५ वर्षे",
    rating: 4.7,
    reviews: 28,
    works: 180,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    location: "शेवगांव",
    availability: "उपलब्ध",
    phone: "9422456789",
    gallery: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1542013936693-8848e574047e?auto=format&fit=crop&w=300&q=80"
    ]
  },
  {
    id: 4,
    name: "संतोष लहाने",
    category: "कारपेंटर",
    experience: "१० वर्षे",
    rating: 4.9,
    reviews: 35,
    works: 150,
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
    location: "दहिगाव",
    availability: "उपलब्ध",
    phone: "8888123456",
    gallery: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80"
    ]
  }
];

// Material Suppliers
export const materialSuppliers = [
  { name: "जगदंबा स्टील आणि सिमेंट", contact: "9922114455", items: "सिमेंट, स्टील, विटा", map: "https://maps.google.com" },
  { name: "साईनाथ सँड & सप्लायर्स", contact: "9422557788", items: "वाळू, खडी, विटा", map: "https://maps.google.com" },
  { name: "अलंकार मार्बल & ग्रॅनाईट", contact: "9823445566", items: "मार्बल, ग्रॅनाईट, टाईल्स", map: "https://maps.google.com" }
];

// Hotels & street food
export const initialHotels = [
  {
    id: 1,
    name: "हॉटेल जगदंब स्पेशल थाळी",
    category: "Non Veg",
    vegType: "Non Veg",
    rating: 4.8,
    reviews: 120,
    timing: "सकाळी ११ ते रात्री ११",
    distance: "०.८ किमी",
    location: "क्रांती चौक, शेवगांव",
    phone: "9850121212",
    map: "https://maps.google.com",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80",
    todaysSpecial: "स्पेशल मटण थाळी (Mutton Thali)",
    offer: "१ मटण थाळीवर सोलकढी मोफत",
    specialDishImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80",
    menu: [
      { item: "व्हेज थाळी", price: "१५०" },
      { item: "मटण थाळी", price: "३२०" },
      { item: "चिकन बिर्याणी", price: "२२०" },
      { item: "तांबडा पांढरा रस्सा", price: "१००" }
    ]
  },
  {
    id: 2,
    name: "हॉटेल राजवाडा प्युअर व्हेज",
    category: "Pure Veg",
    vegType: "Pure Veg",
    rating: 4.7,
    reviews: 95,
    timing: "सकाळी ९ ते रात्री १०:३०",
    distance: "१.५ किमी",
    location: "नगर रोड, शेवगांव",
    phone: "9422003311",
    map: "https://maps.google.com",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80",
    todaysSpecial: "काजू करी आणि स्पेशल तंदुरी रोटी",
    offer: "१०% सूट (एकूण बिलावर)",
    specialDishImage: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=300&q=80",
    menu: [
      { item: "व्हेज कोल्हापुरी", price: "१६०" },
      { item: "काजू मसाला", price: "१८०" },
      { item: "दाल तडका", price: "१२०" },
      { item: "जीरा राईस", price: "११०" }
    ]
  },
  {
    id: 3,
    name: "कृष्णा सँडविच & कॅफे",
    category: "Cafe",
    vegType: "Veg",
    rating: 4.5,
    reviews: 64,
    timing: "सकाळी १० ते रात्री ९:३०",
    distance: "०.३ किमी",
    location: "बस स्टँड समोर, शेवगांव",
    phone: "9011445566",
    map: "https://maps.google.com",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
    todaysSpecial: "स्पेशल तंदुरी सँडविच & ओरेओ शेक",
    offer: "२ सँडविचवर १ चहा मोफत",
    specialDishImage: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&q=80",
    menu: [
      { item: "तंदुरी सँडविच", price: "८०" },
      { item: "ओरेओ शेक", price: "९०" },
      { item: "मिरची वडा पाव", price: "२०" },
      { item: "कोल्ड कॉफी", price: "६०" }
    ]
  }
];



// ----------------------------------------------------------------------------------
// DATA INITIALIZATION & INTERFACES
// ----------------------------------------------------------------------------------

// Offers Section initial data
export const offersList = [
  {
    id: 1,
    shopName: "महालक्ष्मी रेडीमेड कपडे",
    category: "कपडे",
    banner: "गणेशोत्सव स्पेशल सेल!",
    discount: "३०",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
    secondsLeft: 7200, // 2 hours
    desc: "सर्व कापडांवर फ्लॅट ३०% सवलत आणि हमखास गिफ्ट कूपन मिळवा."
  },
  {
    id: 2,
    shopName: "गजानन स्वीट होम",
    category: "स्वीट मार्ट",
    banner: "१ किलो पेढ्यावर पाव किलो बुंदी मोफत",
    discount: "२५",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    secondsLeft: 10800, // 3 hours
    desc: "पेढे, बर्फी आणि इतर मिठायांवर बंपर ऑफर फक्त आज रात्री पर्यंत."
  },
  {
    id: 3,
    shopName: "ओम मोबाईल गॅलरी",
    category: "मोबाईल शॉप",
    banner: "मोबाईल खरेदीवर ग्लासगार्ड आणि कव्हर मोफत",
    discount: "१५",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    secondsLeft: 300, // 5 min
    desc: "स्मार्टफोन्सवर १५% थेट सवलत आणि मोफत ॲक्सेसरीज मिळवा."
  }
];

// Second hand vehicles listings
export const vehicleListings = [
  {
    id: 1,
    title: "महिंद्रा २५५ DI ट्रॅक्टर",
    category: "Tractor",
    price: "२,७५,०००",
    owner: "बाळासाहेब गरड",
    location: "शेवगांव",
    year: "२०१८",
    km: "१,८०० तास",
    fuel: "डिझेल",
    image: "https://images.unsplash.com/photo-1578144592144-474005026512?auto=format&fit=crop&w=400&q=80",
    phone: "9860112233"
  },
  {
    id: 2,
    title: "हिरो स्प्लेंडर प्लस i3S",
    category: "Bikes",
    price: "५२,०००",
    owner: "योगेश फटांगरे",
    location: "दहिगाव",
    year: "२०२०",
    km: "१४,५०० किमी",
    fuel: "पेट्रोल",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80",
    phone: "9404223344"
  },
  {
    id: 3,
    title: "मारुती सुझुकी स्विफ्ट VXI",
    category: "Cars",
    price: "४,९०,०००",
    owner: "अमोल देशमुख",
    location: "शेवगांव",
    year: "२०१७",
    km: "५६,००० किमी",
    fuel: "पेट्रोल + CNG",
    image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=400&q=80",
    phone: "9921456123"
  }
];

// Mechanics lists
export const localMechanics = [
  { name: "माउली गॅरेज (टु-व्हीलर / फोर-व्हीलर)", contact: "9890123123", emergency: "२४x७ उपलब्ध", map: "https://maps.google.com" },
  { name: "महाराष्ट्र टायर्स आणि पंक्चर शॉप", contact: "9422789789", emergency: "रात्री १० वाजेपर्यंत", map: "https://maps.google.com" },
  { name: "हायवे इमर्जन्सी २-व्हीलर रिपेअर", contact: "9011456456", emergency: "२४ तास आपत्कालीन सेवा", map: "https://maps.google.com" }
];



export default function Home() {
  const navigate = useNavigate();

  // Load dynamic lists and configuration from Unified Local Database
  const [businesses, setBusinesses] = useState<Business[]>(() => db.getApprovedBusinesses());
  const [sections, setSections] = useState<Section[]>(() => db.getSections().sort((a, b) => a.order - b.order));
  const [settings] = useState<WebsiteSettings>(() => db.getSettings());

  // Derive categorised lists for compatibility with rendering grids
  const crops = businesses.filter(b => b.category === 'mandi');
  const hotelsList = businesses.filter(b => b.category === 'hotel');
  const technicians = businesses.filter(b => b.category === 'technician');
  const materials = businesses.filter(b => b.category === 'material');
  const vehicles = businesses.filter(b => b.category === 'vehicle');
  const mechanics = businesses.filter(b => b.category === 'mechanics');
  const offers = businesses.filter(b => b.category === 'offers');

  // Trigger data refresh from database
  const refreshData = () => {
    setBusinesses(db.getApprovedBusinesses());
    setSections(db.getSections().sort((a, b) => a.order - b.order));
  };

  // Listen to admin layout changes in sections list
  useEffect(() => {
    const handleStorageChange = () => {
      refreshData();
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(refreshData, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 1. Mandi state & Filters
  const [mandiSearch, setMandiSearch] = useState('');
  const [mandiCatFilter, setMandiCatFilter] = useState('All');
  const [mandiVillageFilter, setMandiVillageFilter] = useState('All');
  const [showCropUploadModal, setShowCropUploadModal] = useState(false);

  // Crop upload states
  const [newFarmer, setNewFarmer] = useState('');
  const [newCropName, setNewCropName] = useState('');
  const [newCropCat, setNewCropCat] = useState('भाजीपाला');
  const [newPrice, setNewPrice] = useState('');
  const [newUnit, setNewUnit] = useState('किलो');
  const [newQty, setNewQty] = useState('');
  const [newVillage, setNewVillage] = useState('शेवगांव');
  const [newPhone, setNewPhone] = useState('');

  // 2. Home Services State
  const [techCatFilter, setTechCatFilter] = useState('All');

  // 3. Hotels & Street Food State
  const [hotelFilter, setHotelFilter] = useState('All');

  // 4. Vehicles Section State
  const [vehicleCatFilter, setVehicleCatFilter] = useState('All');

  // 5. Offers Section State
  const [offersFilter, setOffersFilter] = useState('All');
  const [offersSearch, setOffersSearch] = useState('');

  // 6. Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', msg: '' });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [contactSuccess, setContactSuccess] = useState(false);

  // Crop Upload submit to database
  const handleCropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmer.trim() || !newCropName.trim() || !newPrice.trim() || !newQty.trim() || !newPhone.trim()) {
      return;
    }
    const newCropObj: Business = {
      id: 'crop_' + Date.now(),
      name: newFarmer,
      ownerName: newFarmer,
      description: newCropName,
      category: 'mandi',
      phone: newPhone,
      whatsapp: newPhone,
      email: '',
      address: newVillage,
      village: newVillage,
      taluka: 'शेवगांव',
      district: 'अहमदनगर',
      mapLink: 'https://maps.google.com',
      openingTime: 'सकाळी ०८:००',
      closingTime: 'संध्याकाळी ०६:००',
      logo: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=150&h=150&q=80',
      banner: '',
      photos: [],
      isApproved: true,
      cropCat: newCropCat,
      cropPrice: newPrice,
      cropUnit: newUnit,
      cropQty: newQty
    };
    db.saveBusiness(newCropObj);
    refreshData();
    setShowCropUploadModal(false);

    // Clear inputs
    setNewFarmer('');
    setNewCropName('');
    setNewPrice('');
    setNewQty('');
    setNewPhone('');
  };



  // Mandi list filter logic
  const filteredCrops = crops.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(mandiSearch.toLowerCase()) ||
      c.description?.toLowerCase().includes(mandiSearch.toLowerCase());
    const matchesCategory = mandiCatFilter === 'All' || c.cropCat === mandiCatFilter || c.category === mandiCatFilter;
    const matchesVillage = mandiVillageFilter === 'All' || c.village === mandiVillageFilter;
    return matchesSearch && matchesCategory && matchesVillage;
  });

  // Home Services filter logic
  const filteredTechnicians = techCatFilter === 'All'
    ? technicians
    : technicians.filter(t => t.techCat === techCatFilter || t.category === techCatFilter);

  // Hotels list filter logic
  const filteredHotels = hotelFilter === 'All'
    ? hotelsList
    : hotelsList.filter(h => h.hotelType === hotelFilter || (hotelFilter === 'Veg' && h.hotelType === 'Pure Veg'));

  // Vehicles filter logic
  const filteredVehicles = vehicleCatFilter === 'All'
    ? vehicles
    : vehicles.filter(v => v.vehicleCat === vehicleCatFilter || v.category === vehicleCatFilter);

  // Offers filter logic
  const filteredOffers = offers.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(offersSearch.toLowerCase()) ||
      o.offerBanner?.toLowerCase().includes(offersSearch.toLowerCase()) ||
      o.description.toLowerCase().includes(offersSearch.toLowerCase());
    const matchesCategory = offersFilter === 'All' || o.offerDesc === offersFilter || o.category === offersFilter;
    return matchesSearch && matchesCategory;
  });
  // Contact Form submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!contactForm.name.trim()) errors.name = "कृपया आपले पूर्ण नाव लिहा.";
    if (!contactForm.phone.trim() || contactForm.phone.length < 10) errors.phone = "वैध १० अंकी मोबाईल नंबर आवश्यक आहे.";
    if (!contactForm.msg.trim()) errors.msg = "कृपया संदेश प्रविष्ट करा.";

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }
    setContactErrors({});
    setContactSuccess(true);
    setContactForm({ name: '', email: '', phone: '', msg: '' });
    setTimeout(() => setContactSuccess(false), 3000);
  };

  const renderSectionContent = (s: Section) => {
    switch (s.id) {
      case 'hero':
        return (
          <section id="home" key={s.id} className="relative pt-12 flex flex-col items-center text-center">
            {/* Glow Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass-badge mb-6"
            >
              <Sparkles size={13} className="text-brand-purple animate-pulse" />
              <span>✨ शेवगावचा स्वतःचा प्रीमियम डिजिटल प्लॅटफॉर्म</span>
            </motion.div>

            {/* Large Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-7xl font-extrabold max-w-4xl tracking-tight leading-[1.15] mb-4 sm:mb-6 text-brand-dark text-center px-2"
            >
              {settings.title !== 'Shevgaon Market' ? settings.title : <>सर्व स्थानिक सेवा आणि व्यवहार <br className="hidden sm:inline" /> <span className="text-gradient">आता एकाच ठिकाणी</span></>}
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-brand-muted max-w-2xl font-light mb-8 sm:mb-10 px-4 leading-relaxed text-center"
            >
              {settings.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center px-4 sm:px-6 max-w-lg mb-12 sm:mb-16 z-10 mx-auto"
            >


              {/* done */}
              <a
                href="#offers"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full sm:w-auto bg-gradient-brand text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl hover:shadow-[0_12px_24px_rgba(79,124,255,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                नवीन ऑफर्स पहा
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                to="/add-shop"
                className="w-full sm:w-auto bg-white/70 dark:bg-slate-900/70 border border-brand-purple/30 backdrop-blur-md text-brand-purple dark:text-purple-300 font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl hover:bg-brand-purple hover:text-white hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-center shadow-sm text-sm sm:text-base"
              >
                <Store size={18} />
                <span>दुकान नोंदणी करा</span>
              </Link>
            </motion.div>

            {/* Glass Mockup Preview */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="w-full max-w-5xl rounded-3xl overflow-hidden glass-card p-2 md:p-3 relative shadow-soft border border-white/80"
            >
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-slate-50 relative aspect-[16/9]">
                {/* Header control buttons */}
                <div className="absolute top-4 left-4 flex gap-1.5 z-20">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>

                {/* Ambient image background */}
                <img
                  src={settings.bannerUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"}
                  alt="Mandi Market UI"
                  className="w-full h-full object-cover select-none pointer-events-none hover:scale-[1.02] transition-transform duration-700"
                />

                {/* Floating glass panel overlay */}
                <div className="absolute bottom-6 right-6 p-5 glass-card max-w-[280px] hidden md:block text-left z-20 border border-white/70 animate-float-slow">
                  <span className="text-xs font-semibold text-brand-purple">ताजा भाजीपाला बाजार</span>
                  <h3 className="text-base sm:text-lg font-bold text-brand-dark mt-1 mb-1"> थेट शेतकरी विक्री </h3>
                  <p className="text-xs text-brand-muted">ग्राहकांना थेट शेतातील ताजी पिके आणि सेंद्रिय माल खरेदी करण्याची संधी.</p>
                </div>
              </div>
            </motion.div>
          </section>
        );

      case 'shetkari':
        return (
          <section id="shetkari" key={s.id} className="max-w-6xl mx-auto px-4 md:px-8 text-left scroll-mt-20">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-bold text-brand-purple">🌾 शेतकरी विभाग</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark text-center">{s.title}</h2>
              <p className="text-brand-muted max-w-xl mx-auto font-light text-sm text-center">{s.desc}</p>
            </div>

            {/* Mandi Content Grid */}
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch justify-between">
                <div className="relative flex-grow max-w-md">
                  <input
                    type="text"
                    placeholder="शेतकरी किंवा पीक शोधा..."
                    value={mandiSearch}
                    onChange={(e) => setMandiSearch(e.target.value)}
                    className="w-full bg-white/60 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-xs text-brand-dark placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all"
                  />
                  <SearchIcon size={14} className="absolute left-3 top-3.5 text-slate-400" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={mandiCatFilter}
                    onChange={(e) => setMandiCatFilter(e.target.value)}
                    className="bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="All">सर्व श्रेणी (All Category)</option>
                    <option value="भाजीपाला">भाजीपाला</option>
                    <option value="फळे">फळे</option>
                    <option value="धान्य">धान्य</option>
                  </select>

                  <select
                    value={mandiVillageFilter}
                    onChange={(e) => setMandiVillageFilter(e.target.value)}
                    className="bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark focus:outline-none"
                  >
                    <option value="All">सर्व गावे (All Villages)</option>
                    <option value="शेवगांव">शेवगांव</option>
                    <option value="दहिगाव">दहिगाव</option>
                    <option value="बाभुळगांव">बाभुळगांव</option>
                    <option value="तांदूळनेर">तांदूळनेर</option>
                  </select>

                  <button
                    onClick={() => setShowCropUploadModal(true)}
                    className="bg-brand-purple text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-brand-blue transition-colors shadow-sm shadow-brand-purple/10"
                  >
                    <PlusCircle size={14} /> माल अपलोड करा
                  </button>
                </div>
              </div>

              {/* Standardized Grid cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredCrops.length > 0 ? (
                    filteredCrops.map((c) => (
                      <UniversalCard
                        key={c.id}
                        id={c.id}
                        title={c.description}
                        subtitle={c.name}
                        location={c.village}
                        categoryBadge={c.cropCat || 'भाजीपाला'}
                        image={c.logo || c.photos[0] || 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=400&q=80'}
                        phone={c.phone}
                        whatsapp={c.phone}
                        whatsappMessage={`नमस्कार, मला तुमच्याकडील ${c.description} खरेदी करायचे आहे.`}
                        showWhatsappInsteadOfDetails={true}
                        metaItems={[
                          { label: 'दर', value: `₹${c.cropPrice} / ${c.cropUnit}`, highlight: true },
                          { label: 'उपलब्ध', value: c.cropQty || 'उपलब्ध' }
                        ]}
                        detailsPath={`/business/mandi/${c.id}`}
                        onCardClick={() => navigate(`/business/mandi/${c.id}`)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-xs text-brand-muted">
                      पिके किंवा भाजीपाला सापडला नाही.
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Agri Services grid */}
              <div className="border-t border-gray-200/50 pt-12 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-brand-dark">🚜 कृषी आणि शेती सेवा (Agriculture Services)</h3>
                  <p className="text-brand-muted text-xs font-normal">भाड्याने ट्रॅक्टर, खते, कृषी सेवा केंद्र आणि शेतीची अवजारे पुरवठादार.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {businesses.filter(b => b.category === 'mandi' && b.cropCat === 'कृषी सेवा').map((s) => (
                    <UniversalCard
                      key={s.id}
                      id={s.id}
                      title={s.name}
                      location={s.village || 'शेवगांव'}
                      categoryBadge={s.cropQty === 'सक्रिय' ? 'कृषी सेवा' : s.cropCat || 'कृषी सेवा'}
                      categoryBadgeColor="bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      image={s.logo || s.photos[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80'}
                      rating={db.getAverageRating(s.id) || undefined}
                      reviewsCount={db.getReviewsForBusiness(s.id).length}
                      phone={s.phone}
                      metaItems={[
                        { label: 'प्रकार', value: s.description ? (s.description.length > 35 ? s.description.slice(0, 35) + '...' : s.description) : 'ट्रॅक्टर व अवजारे भाड्याने' }
                      ]}
                      detailsPath={`/business/mandi/${s.id}`}
                      onCardClick={() => navigate(`/business/mandi/${s.id}`)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'gharguti-seva':
        return (
          <section id="gharguti-seva" key={s.id} className="max-w-6xl mx-auto px-4 md:px-8 text-left scroll-mt-20">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-bold text-brand-purple">🛠️ घरगुती सेवा</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark text-center">{s.title}</h2>
              <p className="text-brand-muted max-w-xl mx-auto font-light text-sm text-center">{s.desc}</p>
            </div>

            <div className="space-y-6 mb-12">
              {/* Category Filter - Left aligned */}
              <div className="flex flex-wrap gap-2 justify-start mb-6">
                {['All', 'गवंडी', 'प्लंबर', 'इलेक्ट्रिशियन', 'कारपेंटर'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTechCatFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${techCatFilter === cat
                      ? 'bg-gradient-brand text-white border-transparent shadow-sm'
                      : 'bg-white/60 border-gray-200 text-slate-700 hover:bg-white hover:text-brand-dark'
                      }`}
                  >
                    {cat === 'All' ? 'सर्व कारागीर' : cat}
                  </button>
                ))}
              </div>

              {/* Technicians list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredTechnicians.map((t) => (
                  <UniversalCard
                    key={t.id}
                    id={t.id}
                    title={t.name}
                    subtitle={t.techCat || 'कारागीर'}
                    location={t.village || 'शेवगांव'}
                    categoryBadge={t.techCat || 'कारागीर'}
                    categoryBadgeColor="bg-purple-50/95 dark:bg-purple-950/90 text-brand-purple dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                    image={t.photos[0] || t.logo || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'}
                    rating={db.getAverageRating(t.id) || undefined}
                    reviewsCount={db.getReviewsForBusiness(t.id).length}
                    phone={t.phone}
                    metaItems={[
                      { label: 'अनुभव', value: t.techExp || '३+ वर्षे अनुभव' },
                      { label: 'कामे', value: `${t.techWorks || '५०+'}+ पूर्ण` }
                    ]}
                    detailsPath={`/business/technician/${t.id}`}
                    onCardClick={() => navigate(`/business/technician/${t.id}`)}
                  />
                ))}
              </div>

              {/* Material Suppliers */}
              <div className="border-t border-gray-200/50 pt-12 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-brand-dark">🧱 बांधकाम साहित्य पुरवठादार (Material Suppliers)</h3>
                  <p className="text-brand-muted text-xs font-normal">सिमेंट, वाळू, खडी, स्टील, विटा, मार्बल आणि ग्रॅनाईटचे घाऊक पुरवठादार.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {materials.map((m) => (
                    <UniversalCard
                      key={m.id}
                      id={m.id}
                      title={m.name}
                      location={m.village || 'शेवगांव'}
                      categoryBadge="बांधकाम साहित्य"
                      categoryBadgeColor="bg-amber-50/95 dark:bg-amber-950/90 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      image={m.logo || m.photos[0] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'}
                      phone={m.phone}
                      metaItems={[
                        { label: 'साहित्य', value: (m.materialItems || m.description || 'सिमेंट, वाळू, विटा').slice(0, 35) }
                      ]}
                      detailsPath={`/business/material/${m.id}`}
                      onCardClick={() => navigate(`/business/material/${m.id}`)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'hotel':
        return (
          <section id="hotel" key={s.id} className="max-w-6xl mx-auto px-4 md:px-8 text-left scroll-mt-20">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-bold text-brand-purple">🍔 हॉटेल विभाग</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark text-center">{s.title}</h2>
              <p className="text-brand-muted max-w-xl mx-auto font-light text-sm text-center">{s.desc}</p>
            </div>

            <div className="space-y-6 mb-12">
              {/* Hotel Filter - Left Aligned */}
              <div className="flex flex-wrap justify-start gap-2 mb-6">
                {['All', 'Veg', 'Non Veg', 'Pure Veg'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setHotelFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${hotelFilter === filter
                      ? 'bg-gradient-brand text-white border-transparent shadow-sm'
                      : 'bg-white/60 border-gray-200 text-slate-700 hover:bg-white hover:text-brand-dark'
                      }`}
                  >
                    {filter === 'All' ? 'सर्व हॉटेल्स' : filter}
                  </button>
                ))}
              </div>

              {/* Hotels grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredHotels.map((h) => {
                  const avgRating = db.getAverageRating(h.id);
                  const totalReviews = db.getReviewsForBusiness(h.id).length;
                  return (
                    <UniversalCard
                      key={h.id}
                      id={h.id}
                      title={h.name}
                      location={`${h.village || 'शेवगांव'}, ${h.address || ''}`}
                      categoryBadge={h.hotelType || 'Veg'}
                      categoryBadgeColor={(h.hotelType || 'Veg') === 'Pure Veg' ? 'bg-emerald-50/90 text-emerald-700' : (h.hotelType || 'Veg') === 'Veg' ? 'bg-green-50/90 text-green-700' : 'bg-red-50/90 text-red-700'}
                      image={h.logo || h.photos[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'}
                      rating={avgRating || undefined}
                      reviewsCount={totalReviews}
                      phone={h.phone}
                      callLabel="ऑर्डर"
                      detailsLabel="मेनू कार्ड"
                      metaItems={[
                        { label: 'वेळ', value: `${h.openingTime} ते ${h.closingTime}` }
                      ]}
                      extraContent={
                        (h.hotelOffer || h.todaysSpecial) ? (
                          <div className="space-y-1.5 pt-1">
                            {h.hotelOffer && (
                              <div className="bg-brand-purple/5 border border-brand-purple/20 p-1.5 rounded-xl text-brand-purple">
                                <p className="text-xs font-semibold flex items-center gap-1 line-clamp-1">
                                  🎁 {h.hotelOffer}
                                </p>
                              </div>
                            )}
                            {h.todaysSpecial && (
                              <div className="bg-amber-50/60 border border-amber-200/50 p-1.5 rounded-xl">
                                <p className="text-xs font-normal text-slate-700 line-clamp-1">
                                  ⭐ <b>आजचे:</b> {h.todaysSpecial}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : null
                      }
                      detailsPath={`/business/hotel/${h.id}`}
                      onCardClick={() => navigate(`/business/hotel/${h.id}`)}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        );

      case 'vehicle':
        return (
          <section id="vehicle" key={s.id} className="max-w-6xl mx-auto px-4 md:px-8 text-left scroll-mt-20">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-bold text-brand-purple">🚗 वाहन विभाग</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark text-center">{s.title}</h2>
              <p className="text-brand-muted max-w-xl mx-auto font-light text-sm text-center">{s.desc}</p>
            </div>

            <div className="space-y-6 mb-12">
              {/* Vehicle Filter - Left Aligned */}
              <div className="flex flex-wrap justify-start gap-2 mb-6 overflow-x-auto no-scrollbar">
                {['All', 'Bikes', 'Cars', 'Tractor'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setVehicleCatFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${vehicleCatFilter === filter
                      ? 'bg-gradient-brand text-white border-transparent shadow-sm'
                      : 'bg-white/60 border-gray-200 text-slate-700 hover:bg-white hover:text-brand-dark'
                      }`}
                  >
                    {filter === 'All' ? 'सर्व वाहने' : filter === 'Bikes' ? 'बाइक्स' : filter === 'Cars' ? 'कार्स' : 'ट्रॅक्टर'}
                  </button>
                ))}
              </div>

              {/* Vehicles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredVehicles.map((v) => (
                  <UniversalCard
                    key={v.id}
                    id={v.id}
                    title={v.name}
                    subtitle={v.ownerName || 'स्थानिक'}
                    location={v.village || 'शेवगांव'}
                    categoryBadge={v.vehicleCat || 'वाहन'}
                    image={v.logo || v.photos[0] || 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=400&q=80'}
                    phone={v.phone}
                    metaItems={[
                      { label: 'किंमत', value: `₹${v.vehiclePrice}`, highlight: true },
                      { label: 'वर्ष / इंधन', value: `${v.vehicleYear || '२०२०'} • ${v.vehicleFuel || 'पेट्रोल'}` }
                    ]}
                    detailsPath={`/business/vehicle/${v.id}`}
                    onCardClick={() => navigate(`/business/vehicle/${v.id}`)}
                  />
                ))}
              </div>

              {/* Garages list */}
              <div className="border-t border-gray-200/50 pt-12 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-brand-dark">🛠️ स्थानिक गॅरेज आणि पंक्चर दुरुस्ती (Emergency Mechanic)</h3>
                  <p className="text-brand-muted text-xs font-normal">जवळचे मेकॅनिक, टायर्स पंक्चर दुरुस्ती आणि २४x७ हायवे सपोर्ट नंबर.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {mechanics.map((m) => (
                    <UniversalCard
                      key={m.id}
                      id={m.id}
                      title={m.name}
                      location={m.village || 'शेवगांव'}
                      categoryBadge="मेकॅनिक"
                      categoryBadgeColor="bg-slate-100 text-slate-800"
                      statusBadge={m.mechanicEmergency || '२४x७ उपलब्ध'}
                      statusBadgeColor="bg-rose-500 text-white"
                      image={m.logo || m.photos[0] || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80'}
                      phone={m.phone}
                      metaItems={[
                        { label: 'सेवा', value: m.description ? (m.description.length > 35 ? m.description.slice(0, 35) + '...' : m.description) : 'पंक्चर व गॅरेज' }
                      ]}
                      detailsPath={`/business/mechanics/${m.id}`}
                      onCardClick={() => navigate(`/business/mechanics/${m.id}`)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'offers':
        return (
          <section id="offers" key={s.id} className="max-w-6xl mx-auto px-4 md:px-8 text-left scroll-mt-20">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-bold text-brand-purple">🛍️ ऑफर्स विभाग</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark text-center">{s.title}</h2>
              <p className="text-brand-muted max-w-xl mx-auto font-light text-sm text-center">{s.desc}</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-3 items-stretch justify-between">
                <div className="relative flex-grow max-w-md">
                  <input
                    type="text"
                    placeholder="दुकान किंवा ऑफर शोधा..."
                    value={offersSearch}
                    onChange={(e) => setOffersSearch(e.target.value)}
                    className="w-full bg-white/60 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-xs text-brand-dark placeholder-slate-400 focus:outline-none focus:bg-white"
                  />
                  <SearchIcon size={14} className="absolute left-3 top-3.5 text-slate-400" />
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {['All', 'कपडे', 'स्वीट मार्ट', 'मोबाईल शॉप'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setOffersFilter(filter)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${offersFilter === filter ? 'bg-gradient-brand text-white border-transparent shadow-sm' : 'bg-white/60 border-gray-200 text-slate-700'
                        }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Standardized Offers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredOffers.length > 0 ? (
                    filteredOffers.map((o) => (
                      <UniversalCard
                        key={o.id}
                        id={o.id}
                        title={o.offerBanner || 'मोठी सूट!'}
                        subtitle={o.name}
                        categoryBadge="ऑफर"
                        statusBadge={`${o.offerDiscount || '१०'}% सूट`}
                        statusBadgeColor="bg-rose-500 text-white font-bold"
                        image={o.logo || o.photos[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
                        phone={o.phone}
                        metaItems={[
                          { label: 'माहिती', value: (o.offerDesc || o.description || '').slice(0, 40) }
                        ]}
                        extraContent={
                          <div className="pt-2 border-t border-gray-100/80 space-y-1.5">
                            <div className="flex justify-between items-center text-xs text-brand-muted">
                              <span>वेळ सीमित:</span>
                              <span className="font-bold text-rose-500">त्वरा करा!</span>
                            </div>
                            <Countdown seconds={7200} />
                          </div>
                        }
                        detailsPath={`/business/offers/${o.id}`}
                        onCardClick={() => navigate(`/business/offers/${o.id}`)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-xs text-brand-muted">
                      ऑफर्स सापडल्या नाहीत.
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section id="contact" key={s.id} className="scroll-mt-24 max-w-5xl mx-auto px-4 md:px-8 space-y-8">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-bold text-brand-purple">📞 संपर्क विभाग</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark text-center">{s.title}</h2>
              <p className="text-brand-muted max-w-xl mx-auto font-light text-sm text-center">{s.desc}</p>
            </div>

            <div className="glass-card border border-white/70 p-6 sm:p-8 md:p-10 shadow-soft rounded-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                {/* Left pane: Contact details */}
                <div className="space-y-6 text-left">
                  <div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2">आमच्याशी संपर्क साधा</h3>
                    <p className="text-brand-muted text-xs sm:text-sm font-normal leading-relaxed">
                      तुम्हाला काही अडचणी असल्यास, नवीन व्यवसाय जोडायचा असल्यास किंवा मदत हवी असल्यास खालील माहितीवर संपर्क करा.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0">
                        <Phone size={18} />
                      </div>
                      <div>
                        <span className="text-xs text-brand-muted block font-normal">फोन नंबर</span>
                        <a href={`tel:${settings.contactPhone}`} className="text-sm font-bold text-slate-800 hover:underline">{settings.contactPhone}</a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0">
                        <Mail size={18} />
                      </div>
                      <div>
                        <span className="text-xs text-brand-muted block font-normal">ईमेल पत्ता</span>
                        <a href={`mailto:${settings.contactEmail}`} className="text-sm font-bold text-slate-800 hover:underline">{settings.contactEmail}</a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <span className="text-xs text-brand-muted block font-normal">कार्यालय पत्ता</span>
                        <p className="text-sm font-bold text-slate-800">{settings.contactAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right pane: Contact form */}
                <form onSubmit={handleContactSubmit} className="space-y-4 text-left p-4 sm:p-6 bg-slate-50/70 border border-gray-100 rounded-2xl">
                  {contactSuccess && (
                    <div className="bg-emerald-50 text-emerald-700 p-3.5 border border-emerald-200 rounded-xl text-center text-xs font-semibold">
                      तुमचा संदेश यशस्वीरित्या पाठवला गेला आहे!
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-dark block">नाव *</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                    />
                    {contactErrors.name && <span className="text-rose-500 font-semibold text-xs">{contactErrors.name}</span>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-dark block">मोबाईल क्रमांक *</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                    />
                    {contactErrors.phone && <span className="text-rose-500 font-semibold text-xs">{contactErrors.phone}</span>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brand-dark block">तुमचा संदेश *</label>
                    <textarea
                      value={contactForm.msg}
                      onChange={(e) => setContactForm({ ...contactForm, msg: e.target.value })}
                      rows={3}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                    />
                    {contactErrors.msg && <span className="text-rose-500 font-semibold text-xs">{contactErrors.msg}</span>}
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[44px] bg-gradient-brand text-white py-2.5 rounded-xl hover:shadow-[0_8px_20px_rgba(79,124,255,0.2)] transition-all font-bold text-sm mt-2"
                  >
                    संदेश पाठवा (Send Message)
                  </button>
                </form>
              </div>
            </div>
          </section>
        );

      default:
        // Render custom created empty sections if admin added them dynamically
        return (
          <section id={s.id} key={s.id} className="scroll-mt-24 max-w-6xl mx-auto px-4 md:px-8 text-left space-y-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark text-center">{s.title}</h2>
              <p className="text-brand-muted max-w-xl mx-auto font-light text-sm text-center">{s.desc}</p>
            </div>
            <div className="py-12 text-center bg-white/50 border border-gray-200/50 rounded-3xl shadow-sm">
              <p className="text-xs text-brand-muted font-normal">या विभागात अद्याप व्यवसाय जोडलेले नाहीत.</p>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="space-y-24 md:space-y-36 pb-16">

      {/* Loop dynamically ordered sections */}
      {sections.filter(s => s.visible).map(s => renderSectionContent(s))}

      {/* 7. CUSTOMER TESTIMONIALS / REVIEWS SECTION */}
      <section id="reviews" className="scroll-mt-24 max-w-6xl mx-auto px-4 md:px-8 text-left">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-brand-purple">⭐ ग्राहक अभिप्राय</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark text-center">ग्राहकांचे अनुभव आणि विश्वास (Testimonials)</h2>
          <p className="text-brand-muted max-w-xl mx-auto font-light text-sm text-center">
            आमच्या डिजिटल प्लॅटफॉर्मचा वापर करून खरेदी आणि व्यवहार करणाऱ्या नागरिकांचे अभिप्राय.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "संजय गायकवाड (ग्राहक)",
              text: "या वेबसाईटमुळे आम्हाला ताज्या भाजीपाल्याचा थेट दर कळतो आणि शेतकऱ्यांशी संपर्क करणे सुलभ झाले आहे. अप्रतिम काम!",
              stars: 5
            },
            {
              name: "दीपक मरकड (हॉटेल मालक)",
              text: "आमचे मेनू आणि आजचे स्पेशल पदार्थ लोकांपर्यंत पोहोचवण्यासाठी डिजिटल मेनू कार्ड खूप फायदेशीर ठरत आहे.",
              stars: 5
            },
            {
              name: "राहुल वाघ (वाहन खरेदीदार)",
              text: "दुचाकी आणि सेकंड हँड ट्रॅक्टर शोधण्यासाठी शेवगावमध्ये आता फिरावे लागत नाही. ही सुविधा अत्यंत उत्कृष्ट आहे.",
              stars: 5
            }
          ].map((rev, i) => (
            <div key={i} className="glass-card border border-white/70 p-6 shadow-sm flex flex-col justify-between text-xs leading-relaxed space-y-4 rounded-2xl">
              <p className="text-brand-muted font-normal text-xs sm:text-sm">"{rev.text}"</p>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="font-bold text-brand-dark text-xs sm:text-sm">{rev.name}</span>
                <div className="flex text-amber-400">
                  {Array.from({ length: rev.stars }).map((_, idx) => (
                    <Star key={idx} size={12} className="fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 pt-16 pb-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto px-4 md:px-8 mb-12">

          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="w-8.5 h-8.5 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-bold text-base shadow-sm shadow-brand-blue/20">
                S
              </span>
              <span className="text-lg font-display font-bold tracking-tight text-brand-dark">
                Shevgaon.Market
              </span>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed font-normal">
              शेवगाव मधील स्थानिक बाजारपेठ आणि कुशल कारागीर जोडणारा डिजिटल प्लॅटफॉर्म. थेट संपर्क, वेगवान व्यवहार.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-brand-dark text-sm">महत्वाचे विभाग</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#shetkari" onClick={(e) => { e.preventDefault(); document.getElementById('shetkari')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-brand-muted hover:text-brand-purple transition-colors">शेतकरी बाजार</a>
              </li>
              <li>
                <a href="#gharguti-seva" onClick={(e) => { e.preventDefault(); document.getElementById('gharguti-seva')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-brand-muted hover:text-brand-purple transition-colors">घरगुती सेवा</a>
              </li>
              <li>
                <a href="#hotel" onClick={(e) => { e.preventDefault(); document.getElementById('hotel')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-brand-muted hover:text-brand-purple transition-colors">हॉटेल्स & फूड</a>
              </li>
              <li>
                <a href="#vehicle" onClick={(e) => { e.preventDefault(); document.getElementById('vehicle')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-brand-muted hover:text-brand-purple transition-colors">वाहन खरेदी-विक्री</a>
              </li>
            </ul>
          </div>

          {/* Partnership Pages */}
          <div className="space-y-4">
            <h3 className="font-bold text-brand-dark text-sm">भागीदार पोर्टल</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/vendor/register" className="text-brand-muted hover:text-brand-purple transition-colors">नोंदणी करा (Partner Registration)</Link>
              </li>
              <li>
                <Link to="/vendor/dashboard" className="text-brand-muted hover:text-brand-purple transition-colors">भागीदार डॅशबोर्ड</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-4">
            <h3 className="font-bold text-brand-dark text-sm">सोशल मीडिया सपोर्ट</h3>
            <p className="text-xs text-brand-muted font-normal leading-normal">
              अडचणी असल्यास किंवा काही प्रश्न असल्यास आमच्याशी थेट व्हॉट्सॲप, फेसबुक किंवा इंस्टाग्राम द्वारे संपर्क साधा.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://wa.me/9881622381" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold">
                WA
              </a>

              <a href="https://www.instagram.com/iloveshevgaon414502?igsh=MXUzb2htcXB1Y2Izdg==" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 hover:bg-pink-500 hover:text-white transition-all text-xs font-bold">
                IG
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-brand-muted max-w-6xl mx-auto px-4 md:px-8">
          <p>© {new Date().getFullYear()} Shevgaon Market. सर्व हक्क राखीव.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-dark transition-colors">गोपनीयता धोरण (Privacy)</a>
            <a href="#" className="hover:text-brand-dark transition-colors">अटी व शर्ती (Terms)</a>
          </div>
        </div>
      </footer>

      {/* Crop Upload Dialog Box */}
      <AnimatePresence>
        {showCropUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md glass-card p-6 border border-white shadow-2xl relative text-left"
            >
              <button
                onClick={() => setShowCropUploadModal(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-white text-brand-dark transition-colors shadow-sm font-bold text-xs"
              >
                ✕
              </button>

              <form onSubmit={handleCropSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-brand-purple">मंडी माल अपलोड</span>
                  <h3 className="text-lg font-bold text-brand-dark">🌾 नवीन पीक / माल विक्री जोडा</h3>
                </div>

                {/* Farmer Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-brand-dark">शेतकरी नाव</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. रामचंद्र देवकर"
                    value={newFarmer}
                    onChange={(e) => setNewFarmer(e.target.value)}
                    className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark focus:outline-none focus:border-brand-purple"
                  />
                </div>

                {/* Crop Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-dark">पिकाचे नाव</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. गावरान लसूण"
                      value={newCropName}
                      onChange={(e) => setNewCropName(e.target.value)}
                      className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-dark">माल श्रेणी (Category)</label>
                    <select
                      value={newCropCat}
                      onChange={(e) => setNewCropCat(e.target.value)}
                      className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark focus:outline-none focus:border-brand-purple"
                    >
                      <option value="भाजीपाला">भाजीपाला</option>
                      <option value="फळे">फळे</option>
                      <option value="धान्य">धान्य</option>
                    </select>
                  </div>
                </div>

                {/* Price and quantity */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-dark">किंमत (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="उदा. ५०"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-dark">एकक (Unit)</label>
                    <select
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark focus:outline-none focus:border-brand-purple"
                    >
                      <option value="किलो">किलो (Kg)</option>
                      <option value="जुडी">जुडी (Bundle)</option>
                      <option value="डझन">डझन (Dozen)</option>
                      <option value="क्विंटल">क्विंटल (Quintal)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-dark">प्रमाण (Qty)</label>
                    <input
                      type="number"
                      required
                      placeholder="उदा. ५०"
                      value={newQty}
                      onChange={(e) => setNewQty(e.target.value)}
                      className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>

                {/* Village and phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-dark">गाव</label>
                    <select
                      value={newVillage}
                      onChange={(e) => setNewVillage(e.target.value)}
                      className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark focus:outline-none focus:border-brand-purple"
                    >
                      <option value="शेवगांव">शेवगांव</option>
                      <option value="दहिगाव">दहिगाव</option>
                      <option value="बाभुळगांव">बाभुळगांव</option>
                      <option value="तांदूळनेर">तांदूळनेर</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-dark">संपर्क क्रमांक (Mobile)</label>
                    <input
                      type="tel"
                      required
                      placeholder="उदा. ९८xxxxxx१०"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-white/60 border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-brand text-white font-semibold py-3.5 rounded-xl text-center shadow-sm"
                >
                  माल बाजारात विक्रीसाठी ठेवा
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {window.scrollY > 400 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-gradient-brand text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-40"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}

