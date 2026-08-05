export interface Business {
  id: string;
  name: string;
  ownerName: string;
  description: string;
  category: 
    | 'mandi' 
    | 'technician' 
    | 'material' 
    | 'hotel' 
    | 'vehicle' 
    | 'mechanics' 
    | 'offers'
    | 'beauty'
    | 'water'
    | 'cyber'
    | 'mess'
    | 'photoshop'
    | 'gym'
    | 'hospital'
    | 'mobileshop'
    | 'sweethome';
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  village: string;
  taluka: string;
  district: string;
  mapLink: string;
  openingTime: string;
  closingTime: string;
  logo: string;
  banner: string;
  photos: string[];
  isApproved: boolean;
  subscriptionStatus?: 'active' | 'expired' | 'pending';
  subscriptionExpiresAt?: string;
  planId?: string;
  postLimit?: number;
  isSuspended?: boolean;
  createdAt?: string;

  // Category specific fields
  cropCat?: string;
  cropPrice?: string;
  cropUnit?: string;
  cropQty?: string;
  techCat?: string;
  techExp?: string;
  techWorks?: string;
  materialItems?: string;
  hotelType?: string;
  todaysSpecial?: string;
  specialPrice?: string;
  hotelOffer?: string;
  menu?: { name: string; price: string }[];
  vehicleCat?: string;
  vehicleYear?: string;
  vehicleKm?: string;
  vehicleFuel?: string;
  vehiclePrice?: string;
  mechanicType?: string;
  mechanicEmergency?: string;
  offerDiscount?: string;
  offerBanner?: string;
  offerDesc?: string;
}

export interface ActivityLog {
  id: string;
  merchantId?: string;
  merchantName: string;
  businessName: string;
  category: string;
  action: 'ADD' | 'UPDATE' | 'DELETE';
  details: string;
  timestamp: string;
}

export interface Review {
  id: string;
  businessId: string;
  rating: number;
  comment: string;
  userEmail: string;
  userName: string;
  photos: string[];
  reply?: string;
  createdAt: string;
}

export interface Section {
  id: string;
  title: string;
  desc: string;
  visible: boolean;
  order: number;
}

export interface WebsiteSettings {
  title: string;
  description: string;
  bannerUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export interface Report {
  id: string;
  businessId: string;
  businessName: string;
  reason: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  postLimit: number;
  description: string;
  durationDays: number;
}

// Default initial website sections
const defaultSections: Section[] = [
  { id: 'hero', title: 'मुख्य', desc: 'मुख्य मुखपृष्ठ', visible: true, order: 1 },
  { id: 'shetkari', title: '🌾 शेतकरी आणि भाजीपाला बाजार', desc: 'थेट शेतातून ताजा भाजीपाला, फळे आणि कृषी अवजारे सेवा मिळवा.', visible: true, order: 2 },
  { id: 'gharguti-seva', title: '🛠️ घरगुती सेवा आणि साहित्य पुरवठादार', desc: 'कुशल कारागीर (प्लंबर, इलेक्ट्रिशियन) आणि घरबांधणी साहित्य पुरवठादार.', visible: true, order: 3 },
  { id: 'hotel', title: '🍔 हॉटेल्स आणि स्ट्रीट फूड', desc: 'शेवगावमधील प्रसिद्ध हॉटेल्स, रेस्टॉरंट आणि स्वादिष्ट स्ट्रीट फूडचे डिजिटल मेनू.', visible: true, order: 4 },
  { id: 'vehicle', title: '🚗 सेकंड हँड वाहने आणि मेकॅनिक', desc: 'सेकंड हँड वाहनांची खरेदी-विक्री आणि २४ तास हायवे आपत्कालीन मेकॅनिक गॅरेज.', visible: true, order: 5 },
  { id: 'beauty', title: '💇‍♀️ ब्युटी पार्लर', desc: 'शेवगाव मधील सर्वोत्तम लेडिज व जेंट्स ब्युटी पार्लर आणि सलून सेवा.', visible: true, order: 6 },
  { id: 'water', title: '🚰 वॉटर जार सेवा', desc: 'घरगुती व व्यावसायिक प्रसंगांसाठी थंड व शुद्ध पिण्याचे पाणी वॉटर जार सप्लाय.', visible: true, order: 7 },
  { id: 'cyber', title: '💻 सायबर कॅफे व ऑनलाईन सेवा', desc: 'सरकारी योजना अर्ज, पॅन कार्ड, आधार कार्ड आणि कॉम्प्युटर प्रिंटिंग कामे.', visible: true, order: 8 },
  { id: 'mess', title: '🍲 मेस व खानावळ', desc: 'विद्यार्थी व नोकरदारांसाठी घरगुती चवीचे शाकाहारी व मांसाहारी जेवण मेस.', visible: true, order: 9 },
  { id: 'photoshop', title: '📸 फोटोशॉप व फोटोग्राफी स्टुडिओ', desc: 'लग्नकार्य, वाढदिवस, पासपोर्ट फोटो आणि व्हिडिओ शूटिंग सर्व्हिसेस.', visible: true, order: 10 },
  { id: 'gym', title: '🏋️‍♂️ जिम व फिटनेस सेंटर', desc: 'बॉडीबिल्डिंग, वजन कमी करणे आणि अत्याधुनिक वर्कआउट जिम सेंटर.', visible: true, order: 11 },
  { id: 'hospital', title: '🏥 हॉस्पिटल व आरोग्य सेवा', desc: '२४ तास आपत्कालीन वैद्यकीय उपचार, डॉक्टर्स क्लीनिक व मेडिकल स्टोअर्स.', visible: true, order: 12 },
  { id: 'mobileshop', title: '📱 मोबाईल शॉप व रिपेअरिंग', desc: 'नवीन स्मार्टफोन्स, मोबाईल अ‍ॅक्सेसरीज आणि त्वरित मोबाईल दुरुस्ती.', visible: true, order: 13 },
  { id: 'sweethome', title: '🧁 स्वीट होम व बेकरी', desc: 'ताजी मिठाई, वाढदिवस केक, नमकीन आणि फरसाण विक्री केंद्र.', visible: true, order: 14 },
  { id: 'offers', title: '🛍️ चालू ऑफर्स आणि सूट (Offers)', desc: 'शेवगाव बाजारपेठेतील दुकानांमधील सर्वोत्तम ऑफर्स आणि सवलती पहा.', visible: true, order: 15 },
  { id: 'contact', title: '📞 संपर्क साधा', desc: 'आम्हाला संदेश पाठवा आणि तुमच्या शंकांचे निरसन करा.', visible: true, order: 16 }
];

// Default initial website settings
const defaultSettings: WebsiteSettings = {
  title: 'Shevgaon Market',
  description: 'शेवगाव मधील स्थानिक बाजारपेठ आणि कुशल कारागीर जोडणारा डिजिटल प्लॅटफॉर्म.',
  bannerUrl: '',
  contactEmail: 'contact@shevgaonmarket.com',
  contactPhone: '9422456789',
  contactAddress: 'क्रांती चौक, शेवगांव, अहमदनगर - ४१४५०२'
};

// Map original hardcoded crop listings to unified Business schema
const defaultBusinesses: Business[] = [
  // 1. Crops
  {
    id: 'crop_1',
    name: 'ज्ञानेश्वर काकडे',
    ownerName: 'ज्ञानेश्वर काकडे',
    description: 'सेंद्रिय पद्धतीने पिकवलेली ताजी कोथिंबीर थेट शेतातून उपलब्ध आहे.',
    category: 'mandi',
    phone: '9850123456',
    whatsapp: '9850123456',
    email: '',
    address: 'जवळके रस्ता, शेवगांव',
    village: 'शेवगांव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी ०७:००',
    closingTime: 'संध्याकाळी ०६:००',
    logo: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=150&h=150&q=80',
    banner: '',
    photos: [
      'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1508482238927-42877e570944?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    cropCat: 'भाजीपाला',
    cropPrice: '२०',
    cropUnit: 'जुडी',
    cropQty: '१५० जुड्या'
  },
  {
    id: 'crop_2',
    name: 'रामदास मरकड',
    ownerName: 'रामदास मरकड',
    description: 'उत्कृष्ट दर्जाचा गावरान गहू (लोकवन) विक्रीसाठी उपलब्ध.',
    category: 'mandi',
    phone: '9421345678',
    whatsapp: '9421345678',
    email: '',
    address: 'दहिगाव रोड, शेवगांव',
    village: 'दहिगाव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी ०८:००',
    closingTime: 'संध्याकाळी ०७:००',
    logo: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=150&h=150&q=80',
    banner: '',
    photos: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    cropCat: 'धान्य',
    cropPrice: '२,६००',
    cropUnit: 'क्विंटल',
    cropQty: '२५ क्विंटल'
  },
  {
    id: 'agri_1',
    name: 'माउली ट्रॅक्टर भाड्याने',
    ownerName: 'बाळासाहेब गरड',
    description: 'ट्रॅक्टर आणि शेतीची आधुनिक अवजारे योग्य दरात भाड्याने मिळतील.',
    category: 'mandi',
    phone: '9850123456',
    whatsapp: '9850123456',
    email: '',
    address: 'जवळके रस्ता, शेवगांव',
    village: 'शेवगांव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी ०८:००',
    closingTime: 'संध्याकाळी ०६:००',
    logo: 'https://images.unsplash.com/photo-1578144592144-474005026512?auto=format&fit=crop&w=150&h=150&q=80',
    banner: '',
    photos: [
      'https://images.unsplash.com/photo-1578144592144-474005026512?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    cropCat: 'कृषी सेवा',
    cropPrice: '१,०००',
    cropUnit: 'दिवस',
    cropQty: 'सक्रिय'
  },
  {
    id: 'agri_2',
    name: 'जय श्रीराम कृषी सेवा केंद्र',
    ownerName: 'रामदास मरकड',
    description: 'आमच्याकडे उच्च दर्जाचे बी-बियाणे, खते आणि कीटकनाशके मिळतील.',
    category: 'mandi',
    phone: '9420789012',
    whatsapp: '9420789012',
    email: '',
    address: 'क्रांती चौक, शेवगांव',
    village: 'शेवगांव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी ०८:००',
    closingTime: 'रात्री ०८:००',
    logo: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=150&h=150&q=80',
    banner: '',
    photos: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    cropCat: 'कृषी सेवा',
    cropPrice: 'विविध',
    cropUnit: 'नग',
    cropQty: 'सक्रिय'
  },
  {
    id: 'agri_3',
    name: 'बळीराजा खत डेपो',
    ownerName: 'सोमनाथ फटांगरे',
    description: 'रासायनिक आणि सेंद्रिय खते, तसेच शेतीची अवजारे वाजवी दरात मिळतील.',
    category: 'mandi',
    phone: '9011456123',
    whatsapp: '9011456123',
    email: '',
    address: 'दहिगाव रोड, शेवगांव',
    village: 'दहिगाव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी ०८:००',
    closingTime: 'संध्याकाळी ०७:००',
    logo: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=150&h=150&q=80',
    banner: '',
    photos: [
      'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    cropCat: 'कृषी सेवा',
    cropPrice: 'विविध',
    cropUnit: 'नग',
    cropQty: 'सक्रिय'
  },

  // 2. Technicians
  {
    id: 'tech_1',
    name: 'सचिन कुलकर्णी (विद्युत तज्ज्ञ)',
    ownerName: 'सचिन कुलकर्णी',
    description: 'घरगुती आणि औद्योगिक वायरिंग, मोटर दुरुस्ती आणि इतर सर्व विद्युत कामे केली जातील.',
    category: 'technician',
    phone: '9422456789',
    whatsapp: '9422456789',
    email: 'sachin@email.com',
    address: 'क्रांती चौक, शेवगांव',
    village: 'शेवगांव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी ०९:००',
    closingTime: 'रात्री ०८:००',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    banner: '',
    photos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    techCat: 'इलेक्ट्रिशियन',
    techExp: '८',
    techWorks: '२४०+'
  },
  {
    id: 'tech_2',
    name: 'बाळासाहेब गरड (प्लंबिंग सर्व्हिसेस)',
    ownerName: 'बाळासाहेब गरड',
    description: 'नळ दुरुस्ती, नवीन प्लंबिंग फिटिंग, बोअरवेल मोटर फिटिंग आणि वॉशबेसिन दुरुस्ती कामे.',
    category: 'technician',
    phone: '8888990011',
    whatsapp: '8888990011',
    email: '',
    address: 'पाथर्डी रोड, शेवगांव',
    village: 'शेवगांव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी ०८:००',
    closingTime: 'संध्याकाळी ०७:००',
    logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    banner: '',
    photos: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    techCat: 'प्लंबर',
    techExp: '५',
    techWorks: '१८०+'
  },

  // 3. Materials
  {
    id: 'mat_1',
    name: 'जगदंबा स्टील आणि सिमेंट',
    ownerName: 'संजय माने',
    description: 'सर्व प्रकारच्या नामांकित कंपन्यांचे सिमेंट, दर्जेदार स्टील सळ्या, आणि बांधकामाच्या विटा घाऊक दरात उपलब्ध.',
    category: 'material',
    phone: '9922114455',
    whatsapp: '9922114455',
    email: 'jagdambasteel@email.com',
    address: 'बायपास रोड, शेवगांव परिसर',
    village: 'शेवगांव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी ०९:००',
    closingTime: 'रात्री ०८:००',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=150&h=150&q=80',
    banner: '',
    photos: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    materialItems: 'सिमेंट, स्टील, विटा, सिमेंट पत्रे'
  },

  // 4. Hotels
  {
    id: 'hotel_1',
    name: 'हॉटेल जगदंब स्पेशल थाळी',
    ownerName: 'अमोल काटे',
    description: 'शेवगावमधील प्रसिद्ध गावरान मटण आणि चिकन थाळीचे एकमेव ठिकाण. चुलीवरचे जेवण.',
    category: 'hotel',
    phone: '9420789012',
    whatsapp: '9420789012',
    email: 'hoteljagdamb@email.com',
    address: 'नवे बस स्थानक जवळ, शेवगांव',
    village: 'शेवगांव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी ११:००',
    closingTime: 'रात्री ११:००',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&h=150&q=80',
    banner: '',
    photos: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    hotelType: 'Non Veg',
    todaysSpecial: 'चुलीवरची स्पेशल मटण थाळी',
    specialPrice: '२५०',
    hotelOffer: '१ बिर्याणीवर १ हाफ बिर्याणी मोफत',
    menu: [
      { name: 'स्पेशल मटण थाळी', price: '२५०' },
      { name: 'स्पेशल चिकन थाळी', price: '२००' },
      { name: 'मटण बिर्याणी', price: '१८०' },
      { name: 'चिकन बिर्याणी', price: '१५०' },
      { name: 'बाजरीची भाकरी', price: '१५' }
    ]
  },
  {
    id: 'hotel_2',
    name: 'हॉटेल वृंदावन व्हेज पैठणकर',
    ownerName: 'प्रवीण पैठणकर',
    description: 'शुद्ध शाकाहारी जेवण, वातानुकूलित बैठक व्यवस्था आणि स्पेशल पनीर डिशेस.',
    category: 'hotel',
    phone: '9011456123',
    whatsapp: '9011456123',
    email: '',
    address: 'शिवाजी चौक, शेवगांव',
    village: 'शेवगांव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी १०:००',
    closingTime: 'रात्री १०:३०',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&h=150&q=80',
    banner: '',
    photos: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    hotelType: 'Pure Veg',
    todaysSpecial: 'पनीर लबाबदार आणि तंदुरी नान',
    specialPrice: '१८०',
    hotelOffer: 'कुटुंबासह जेवणावर १०% सूट',
    menu: [
      { name: 'पनीर लबाबदार', price: '१८०' },
      { name: 'शेव भाजी स्पेशल', price: '१२०' },
      { name: 'व्हेज कोल्हापुरी', price: '१३०' },
      { name: 'दाल तडका', price: '१००' },
      { name: 'तंदुरी नान', price: '२५' }
    ]
  },

  // 5. Vehicles
  {
    id: 'vehicle_1',
    name: 'महिंद्रा २५५ DI ट्रॅक्टर (विक्रीसाठी)',
    ownerName: 'बाळासाहेब गरड',
    description: 'उत्कृष्ट कंडिशनमध्ये ट्रॅक्टर विक्रीसाठी उपलब्ध आहे. टायर नवीन आहेत.',
    category: 'vehicle',
    phone: '9860112233',
    whatsapp: '9860112233',
    email: '',
    address: 'राठी गल्ली, शेवगांव',
    village: 'शेवगांव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी ०९:००',
    closingTime: 'संध्याकाळी ०६:००',
    logo: 'https://images.unsplash.com/photo-1578144592144-474005026512?auto=format&fit=crop&w=150&h=150&q=80',
    banner: '',
    photos: [
      'https://images.unsplash.com/photo-1578144592144-474005026512?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    vehicleCat: 'Tractor',
    vehiclePrice: '२,७५,०००',
    vehicleYear: '२०१८',
    vehicleKm: '१,८०० तास',
    vehicleFuel: 'डिझेल'
  },

  // 6. Mechanics
  {
    id: 'mech_1',
    name: 'माउली गॅरेज',
    ownerName: 'ज्ञानेश्वर दराडे',
    description: 'सर्व प्रकारच्या दुचाकी आणि चारचाकी वाहनांची दुरुस्ती, ऑइल चेंज आणि पंक्चर काढण्याचे काम.',
    category: 'mechanics',
    phone: '9890123123',
    whatsapp: '9890123123',
    email: '',
    address: 'बीड रोड हायवे, शेवगांव',
    village: 'शेवगांव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी ०८:००',
    closingTime: 'रात्री १०:००',
    logo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=150&h=150&q=80',
    banner: '',
    photos: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    mechanicEmergency: '२४x७ उपलब्ध',
    mechanicType: 'टू-व्हीलर / फोर-व्हीलर रिपेअर'
  },

  // 7. Offers
  {
    id: 'offer_1',
    name: 'महालक्ष्मी रेडीमेड कपडे',
    ownerName: 'अमित साळुंके',
    description: 'सणासुदीच्या निमित्ताने सर्व प्रकारच्या पुरुषांच्या, महिलांच्या आणि लहान मुलांच्या कपड्यांवर आकर्षक सवलत.',
    category: 'offers',
    phone: '9922557788',
    whatsapp: '9922557788',
    email: '',
    address: 'मुख्य सराफ बाजार, शेवगांव',
    village: 'शेवगांव',
    taluka: 'शेवगांव',
    district: 'अहमदनगर',
    mapLink: 'https://maps.google.com',
    openingTime: 'सकाळी ०९:३०',
    closingTime: 'रात्री ०९:००',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=150&h=150&q=80',
    banner: 'गणेशोत्सव स्पेशल सेल!',
    photos: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80'
    ],
    isApproved: true,
    offerDiscount: '३०',
    offerBanner: 'गणेशोत्सव स्पेशल सेल!',
    offerDesc: 'सर्व कपड्यांवर फ्लॅट ३०% सवलत आणि हमखास गिफ्ट कूपन मिळवा.'
  }
];

// Default initial mock reviews
const defaultReviews: Review[] = [
  {
    id: 'rev_1',
    businessId: 'hotel_1',
    rating: 5,
    comment: 'शेवगावातील मटण थाळीसाठी सर्वात सर्वोत्तम हॉटेल! चुलीवरची भाकरी आणि रस्सा अप्रतिम आहे.',
    userEmail: 'ram@gmail.com',
    userName: 'रामराजे माने',
    photos: [],
    reply: 'धन्यवाद रामराजेजी! तुमची सेवा करत राहण्यास आम्हास आनंद वाटतो.',
    createdAt: '2026-07-10T12:00:00Z'
  },
  {
    id: 'rev_2',
    businessId: 'hotel_1',
    rating: 4,
    comment: 'चिकन थाळी मस्त आहे, पण रविवारी गर्दी असल्यामुळे खूप वेळ थांबावे लागते.',
    userEmail: 'sanjay@gmail.com',
    userName: 'संजय फटांगरे',
    photos: [],
    reply: 'पुढच्या वेळी आम्ही सेवा अधिक जलद करण्याचा नक्की प्रयत्न करू. अभिप्राय दिल्याबद्दल धन्यवाद!',
    createdAt: '2026-07-11T14:30:00Z'
  },
  {
    id: 'rev_3',
    businessId: 'tech_1',
    rating: 5,
    comment: 'खूप अनुभवी कामगार आहेत. माझ्या दुकानातील शॉर्ट सर्किट अवघ्या १५ मिनिटांत दुरुस्त केले. अत्यंत प्रामाणिक स्वभाव.',
    userEmail: 'vishal@gmail.com',
    userName: 'विशाल लहाने',
    photos: [],
    createdAt: '2026-07-09T09:00:00Z'
  }
];

const defaultActivityLogs: ActivityLog[] = [
  {
    id: 'log_1',
    merchantName: 'ज्ञानेश्वर काकडे',
    businessName: 'ज्ञानेश्वर काकडे (ताजी कोथिंबीर)',
    category: 'mandi',
    action: 'ADD',
    details: 'नवीन भाजीपाला व्यापार प्रोफाइल जोडले.',
    timestamp: '2026-08-01T10:30:00Z'
  },
  {
    id: 'log_2',
    merchantName: 'अमोल काटे',
    businessName: 'हॉटेल जगदंब स्पेशल थाळी',
    category: 'hotel',
    action: 'UPDATE',
    details: 'आजची स्पेशल मटण थाळी आणि नवीन ऑफर अपडेट केली.',
    timestamp: '2026-08-02T14:15:00Z'
  },
  {
    id: 'log_3',
    merchantName: 'सचिन कुलकर्णी',
    businessName: 'सचिन कुलकर्णी (विद्युत तज्ज्ञ)',
    category: 'technician',
    action: 'ADD',
    details: 'इलेक्ट्रिशियन सेवा प्रोफाइल नोंदणी केली.',
    timestamp: '2026-08-03T09:00:00Z'
  },
  {
    id: 'log_4',
    merchantName: 'अमित साळुंके',
    businessName: 'महालक्ष्मी रेडीमेड कपडे',
    category: 'offers',
    action: 'UPDATE',
    details: 'गणेशोत्सव स्पेशल सेल डिस्काउंट अपडेट केला.',
    timestamp: '2026-08-03T16:45:00Z'
  }
];

const defaultSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan_basic',
    name: 'बेसिक प्लॅन (Basic Plan)',
    price: 99,
    postLimit: 2,
    description: 'लहान व्यापाऱ्यांसाठी २ पोस्ट मर्यादेसह मूलभूत प्लॅन.',
    durationDays: 30
  },
  {
    id: 'plan_pro',
    name: 'प्रो प्लॅन (Pro Plan)',
    price: 499,
    postLimit: 10,
    description: 'मध्यम उद्योगांसाठी १० पोस्ट मर्यादेसह व्यावसायिक प्लॅन.',
    durationDays: 180
  },
  {
    id: 'plan_unlimited',
    name: 'प्रीमियम अमर्याद (Premium Unlimited)',
    price: 999,
    postLimit: 100,
    description: 'मोठ्या व्यापाऱ्यांसाठी १०० पोस्ट मर्यादेसह अमर्याद प्लॅन.',
    durationDays: 365
  }
];

// LocalDatabase Service simulating standard Database client SDK
class LocalDatabase {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem('db_sections')) {
      localStorage.setItem('db_sections', JSON.stringify(defaultSections));
    }
    if (!localStorage.getItem('db_settings')) {
      localStorage.setItem('db_settings', JSON.stringify(defaultSettings));
    }
    if (!localStorage.getItem('db_my_businesses') && !localStorage.getItem('db_crops')) {
      // Set initial businesses list
      localStorage.setItem('db_my_businesses', JSON.stringify(defaultBusinesses));
      // For reverse-compatibility with Home.tsx state keys, set individual keys too
      localStorage.setItem('db_crops', JSON.stringify(defaultBusinesses.filter(b => b.category === 'mandi')));
      localStorage.setItem('db_hotels', JSON.stringify(defaultBusinesses.filter(b => b.category === 'hotel')));
      localStorage.setItem('db_technicians', JSON.stringify(defaultBusinesses.filter(b => b.category === 'technician')));
      localStorage.setItem('db_materials', JSON.stringify(defaultBusinesses.filter(b => b.category === 'material')));
      localStorage.setItem('db_vehicles', JSON.stringify(defaultBusinesses.filter(b => b.category === 'vehicle')));
      localStorage.setItem('db_mechanics', JSON.stringify(defaultBusinesses.filter(b => b.category === 'mechanics')));
      localStorage.setItem('db_offers', JSON.stringify(defaultBusinesses.filter(b => b.category === 'offers')));
    }
    if (!localStorage.getItem('db_reviews')) {
      localStorage.setItem('db_reviews', JSON.stringify(defaultReviews));
    }
    if (!localStorage.getItem('db_reports')) {
      localStorage.setItem('db_reports', JSON.stringify([]));
    }
    if (!localStorage.getItem('db_activity_logs')) {
      localStorage.setItem('db_activity_logs', JSON.stringify(defaultActivityLogs));
    }
    if (!localStorage.getItem('db_subscription_plans')) {
      localStorage.setItem('db_subscription_plans', JSON.stringify(defaultSubscriptionPlans));
    }
  }

  // --- SECTIONS API ---
  getSections(): Section[] {
    return JSON.parse(localStorage.getItem('db_sections') || '[]');
  }

  saveSections(sections: Section[]): void {
    localStorage.setItem('db_sections', JSON.stringify(sections));
  }

  // --- WEBSITE SETTINGS API ---
  getSettings(): WebsiteSettings {
    return JSON.parse(localStorage.getItem('db_settings') || JSON.stringify(defaultSettings));
  }

  saveSettings(settings: WebsiteSettings): void {
    localStorage.setItem('db_settings', JSON.stringify(settings));
  }

  // --- BUSINESSES API ---
  getBusinesses(): Business[] {
    const list: Business[] = JSON.parse(localStorage.getItem('db_my_businesses') || '[]');
    // Seed new entries if they are missing
    if (list.length > 0 && !list.some(b => b.id === 'agri_1')) {
      const agriItems = defaultBusinesses.filter(b => b.id.startsWith('agri_'));
      list.push(...agriItems);
      localStorage.setItem('db_my_businesses', JSON.stringify(list));
      
      // Seed individual keys for compatibility
      this.propagateLegacyArrays('mandi');
    }

    // Ensure subscriptionStatus and isSuspended defaults for all records
    return list.map((b, idx) => ({
      ...b,
      subscriptionStatus: b.subscriptionStatus || (idx % 3 === 0 ? 'expired' : idx % 5 === 0 ? 'pending' : 'active'),
      subscriptionExpiresAt: b.subscriptionExpiresAt || (idx % 3 === 0 ? '2026-06-30' : '2027-08-01'),
      isSuspended: b.isSuspended || false
    }));
  }

  getApprovedBusinesses(): Business[] {
    return this.getBusinesses().filter(b => b.isApproved && !b.isSuspended);
  }

  getBusinessById(id: string): Business | undefined {
    return this.getBusinesses().find(b => b.id === id);
  }

  saveBusiness(biz: Business): void {
    const list = this.getBusinesses();
    const index = list.findIndex(b => b.id === biz.id);
    if (index >= 0) {
      list[index] = biz;
    } else {
      list.unshift(biz);
    }
    localStorage.setItem('db_my_businesses', JSON.stringify(list));

    // Propagate changes to legacy individual arrays for backward compatibility in Home.tsx
    this.propagateLegacyArrays(biz.category);
  }

  deleteBusiness(id: string, category: string): void {
    const list = this.getBusinesses();
    const updated = list.filter(b => b.id !== id);
    localStorage.setItem('db_my_businesses', JSON.stringify(updated));

    // Remove reviews associated with it
    const reviews = this.getReviews().filter(r => r.businessId !== id);
    localStorage.setItem('db_reviews', JSON.stringify(reviews));

    this.propagateLegacyArrays(category);
  }

  private propagateLegacyArrays(category: string) {
    const list = this.getBusinesses();
    const filtered = list.filter(b => b.category === category);
    
    // Map internal business listings schema to legacy public arrays
    let legacyKey = '';
    let legacyData: any[] = [];

    if (category === 'mandi') {
      legacyKey = 'db_crops';
      legacyData = filtered.map(b => ({
        id: b.id,
        farmer: b.name,
        cropName: b.cropCat === 'इतर' ? b.description.split('\n')[0] : b.cropCat,
        category: b.cropCat || 'भाजीपाला',
        price: b.cropPrice || '५०',
        unit: b.cropUnit || 'किलो',
        quantity: b.cropQty || '१०',
        village: b.village,
        image: b.logo || b.photos[0] || 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=300&q=80',
        phone: b.phone,
        isApproved: b.isApproved
      }));
    } else if (category === 'hotel') {
      legacyKey = 'db_hotels';
      legacyData = filtered.map(b => ({
        id: b.id,
        name: b.name,
        category: b.hotelType || 'Veg',
        vegType: b.hotelType || 'Veg',
        rating: this.getAverageRating(b.id),
        reviews: this.getReviewsForBusiness(b.id).length,
        timing: `${b.openingTime} ते ${b.closingTime}`,
        distance: '०.५ किमी',
        location: `${b.village}, ${b.address}`,
        phone: b.phone,
        map: b.mapLink || 'https://maps.google.com',
        image: b.logo || b.photos[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
        todaysSpecial: b.todaysSpecial || 'विशेष थाळी',
        offer: b.hotelOffer || 'नवीन स्पेशल ऑफर',
        specialDishImage: b.photos[0] || b.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
        menu: b.menu || [{ name: b.todaysSpecial || 'विशेष थाळी', price: b.specialPrice || '१२०' }],
        isApproved: b.isApproved
      }));
    } else if (category === 'technician') {
      legacyKey = 'db_technicians';
      legacyData = filtered.map(b => ({
        id: b.id,
        name: b.name,
        category: b.techCat || 'इलेक्ट्रिशियन',
        experience: (b.techExp || '२') + ' वर्षे',
        rating: this.getAverageRating(b.id),
        reviews: this.getReviewsForBusiness(b.id).length,
        works: parseInt(b.techWorks || '10') || 10,
        photo: b.logo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
        location: b.village,
        availability: 'उपलब्ध',
        phone: b.phone,
        gallery: b.photos.length > 0 ? b.photos : [b.logo || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80'],
        isApproved: b.isApproved
      }));
    } else if (category === 'material') {
      legacyKey = 'db_materials';
      legacyData = filtered.map(b => ({
        id: b.id,
        name: b.name,
        contact: b.phone,
        items: b.materialItems || b.description,
        map: b.mapLink || 'https://maps.google.com',
        isApproved: b.isApproved
      }));
    } else if (category === 'vehicle') {
      legacyKey = 'db_vehicles';
      legacyData = filtered.map(b => ({
        id: b.id,
        title: b.name,
        category: b.vehicleCat || 'Cars',
        price: b.vehiclePrice || '५,००,०००',
        owner: b.description.split('\n')[0] || 'विक्रेता',
        location: b.village,
        year: b.vehicleYear || '2020',
        km: b.vehicleKm || '१५,००० किमी',
        fuel: b.vehicleFuel || 'पेट्रोल',
        image: b.logo || b.photos[0] || 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=400&q=80',
        phone: b.phone,
        isApproved: b.isApproved
      }));
    } else if (category === 'mechanics') {
      legacyKey = 'db_mechanics';
      legacyData = filtered.map(b => ({
        id: b.id,
        name: b.name,
        contact: b.phone,
        emergency: b.mechanicEmergency || '२४x७ उपलब्ध',
        map: b.mapLink || 'https://maps.google.com',
        isApproved: b.isApproved
      }));
    } else if (category === 'offers') {
      legacyKey = 'db_offers';
      legacyData = filtered.map(b => ({
        id: b.id,
        shopName: b.name,
        category: b.description.split('\n')[0] || 'ऑफर',
        banner: b.offerBanner || 'मोठी सूट!',
        discount: b.offerDiscount || '१०',
        image: b.logo || b.photos[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
        secondsLeft: 7200,
        desc: b.offerDesc || b.description,
        isApproved: b.isApproved
      }));
    }

    if (legacyKey) {
      localStorage.setItem(legacyKey, JSON.stringify(legacyData));
    }
  }

  // --- REVIEWS API ---
  getReviews(): Review[] {
    return JSON.parse(localStorage.getItem('db_reviews') || '[]');
  }

  getReviewsForBusiness(businessId: string): Review[] {
    return this.getReviews().filter(r => r.businessId === businessId);
  }

  getAverageRating(businessId: string): number {
    const list = this.getReviewsForBusiness(businessId);
    if (list.length === 0) return 5.0; // default rating
    const total = list.reduce((sum, r) => sum + r.rating, 0);
    return Math.round((total / list.length) * 10) / 10;
  }

  saveReview(review: Review): void {
    const list = this.getReviews();
    const index = list.findIndex(r => r.id === review.id);
    if (index >= 0) {
      list[index] = review;
    } else {
      list.unshift(review);
    }
    localStorage.setItem('db_reviews', JSON.stringify(list));

    // Update rating indicators inside legacy data models
    const biz = this.getBusinessById(review.businessId);
    if (biz) {
      this.propagateLegacyArrays(biz.category);
    }
  }

  deleteReview(id: string): void {
    const list = this.getReviews();
    const target = list.find(r => r.id === id);
    const updated = list.filter(r => r.id !== id);
    localStorage.setItem('db_reviews', JSON.stringify(updated));

    if (target) {
      const biz = this.getBusinessById(target.businessId);
      if (biz) {
        this.propagateLegacyArrays(biz.category);
      }
    }
  }

  // --- REPORTS API ---
  getReports(): Report[] {
    return JSON.parse(localStorage.getItem('db_reports') || '[]');
  }

  saveReport(report: Report): void {
    const list = this.getReports();
    list.unshift(report);
    localStorage.setItem('db_reports', JSON.stringify(list));
  }

  deleteReport(id: string): void {
    const list = this.getReports();
    const updated = list.filter(r => r.id !== id);
    localStorage.setItem('db_reports', JSON.stringify(updated));
  }

  // --- ACTIVITY LOGS API ---
  getActivityLogs(): ActivityLog[] {
    return JSON.parse(localStorage.getItem('db_activity_logs') || '[]');
  }

  saveActivityLog(log: ActivityLog): void {
    const list = this.getActivityLogs();
    list.unshift(log);
    localStorage.setItem('db_activity_logs', JSON.stringify(list));
  }

  logMerchantActivity(
    merchantName: string,
    businessName: string,
    category: string,
    action: 'ADD' | 'UPDATE' | 'DELETE',
    details: string
  ): void {
    const log: ActivityLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      merchantName: merchantName || 'अज्ञात व्यापारी',
      businessName: businessName || 'व्यवसाय माहिती',
      category: category || 'General',
      action,
      details,
      timestamp: new Date().toISOString()
    };
    this.saveActivityLog(log);
  }

  toggleSuspendBusiness(id: string): boolean {
    const list = this.getBusinesses();
    const biz = list.find(b => b.id === id);
    if (biz) {
      biz.isSuspended = !biz.isSuspended;
      this.saveBusiness(biz);
      return biz.isSuspended;
    }
    return false;
  }

  // --- SUBSCRIPTION PLANS API ---
  getSubscriptionPlans(): SubscriptionPlan[] {
    return JSON.parse(localStorage.getItem('db_subscription_plans') || JSON.stringify(defaultSubscriptionPlans));
  }

  saveSubscriptionPlan(plan: SubscriptionPlan): void {
    const list = this.getSubscriptionPlans();
    const idx = list.findIndex(p => p.id === plan.id);
    if (idx >= 0) {
      list[idx] = plan;
    } else {
      list.push(plan);
    }
    localStorage.setItem('db_subscription_plans', JSON.stringify(list));
  }

  deleteSubscriptionPlan(id: string): void {
    const list = this.getSubscriptionPlans();
    const updated = list.filter(p => p.id !== id);
    localStorage.setItem('db_subscription_plans', JSON.stringify(updated));
  }
}

export const db = new LocalDatabase();
