import { useState, useEffect } from 'react';
import { 
  Settings, Check, X, ShieldAlert, Edit2, Trash2, ArrowUp, ArrowDown, 
  Layout, HelpCircle, UserCheck, MessageSquare, AlertTriangle, Eye, EyeOff, 
  BarChart2, Plus, Star, History, Download, Ban, Search, FileText,
  Phone, Mail, MapPin, ExternalLink, Clock, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, Business, Review, Section, WebsiteSettings, Report, ActivityLog, SubscriptionPlan } from '../services/db';

export default function AdminDashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('admin_session') === 'active';
  });

  // Login credentials state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard content tab state
  const [activeTab, setActiveTab] = useState('analytics');

  // Database states
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);

  // Editing & Viewing modal states
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);
  const [isBizModalOpen, setIsBizModalOpen] = useState(false);
  const [viewingBiz, setViewingBiz] = useState<Business | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Filters & Search
  const [activitySearch, setActivitySearch] = useState('');
  const [actionFilter, setActionFilter] = useState<'ALL' | 'ADD' | 'UPDATE' | 'DELETE'>('ALL');
  const [merchantStatusFilter, setMerchantStatusFilter] = useState<'all' | 'active' | 'expired' | 'pending' | 'suspended'>('all');

  // New section states
  const [newSectionId, setNewSectionId] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionDesc, setNewSectionDesc] = useState('');
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadData();
    }
  }, [isAdminLoggedIn]);

  const loadData = () => {
    setBusinesses(db.getBusinesses());
    setReviews(db.getReviews());
    setSections(db.getSections().sort((a, b) => a.order - b.order));
    setSettings(db.getSettings());
    setReports(db.getReports());
    setActivityLogs(db.getActivityLogs());
    setSubscriptionPlans(db.getSubscriptionPlans());
  };

  // Secure admin login check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (email === 'sandeshveer04@gmail.com' && password === 'sms@2006') {
      sessionStorage.setItem('admin_session', 'active');
      setIsAdminLoggedIn(true);
    } else {
      setLoginError('चुकीचा ईमेल किंवा पासवर्ड प्रविष्ट केला.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_session');
    setIsAdminLoggedIn(false);
  };

  // --- BUSINESS ACTION HANDLERS ---
  const handleApprove = (id: string, approve: boolean) => {
    const biz = db.getBusinessById(id);
    if (biz) {
      biz.isApproved = approve;
      db.saveBusiness(biz);
      db.logMerchantActivity(
        biz.ownerName || biz.name,
        biz.name,
        biz.category,
        'UPDATE',
        approve ? 'प्रशासकाने व्यापारी प्रोफाइल मंजूर केले.' : 'प्रशासकाने व्यापारी प्रोफाइल नामंजूर केले.'
      );
      loadData();
    }
  };

  const handleToggleSuspend = (id: string) => {
    const biz = businesses.find(b => b.id === id);
    const newSuspendedState = db.toggleSuspendBusiness(id);
    if (biz) {
      db.logMerchantActivity(
        biz.ownerName || biz.name,
        biz.name,
        biz.category,
        'UPDATE',
        newSuspendedState 
          ? 'प्रशासकाने व्यापारी खाते निलंबित (Suspend) केले.' 
          : 'प्रशासकाने व्यापारी खाते पुन्हा सक्रिय (Reactivate) केले.'
      );
    }
    loadData();
  };

  const handleDeleteBiz = (id: string, category: string) => {
    const biz = businesses.find(b => b.id === id);
    if (confirm('तुम्हाला हा व्यवसाय निश्चितपणे हटवायचा आहे का?')) {
      if (biz) {
        db.logMerchantActivity(
          biz.ownerName || biz.name,
          biz.name,
          category,
          'DELETE',
          'प्रशासकाने व्यापारी खाते नष्ट केले.'
        );
      }
      db.deleteBusiness(id, category);
      loadData();
    }
  };

  const handleSaveBizEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBiz) {
      db.saveBusiness(editingBiz);
      db.logMerchantActivity(
        editingBiz.ownerName || editingBiz.name,
        editingBiz.name,
        editingBiz.category,
        'UPDATE',
        'प्रशासकाने व्यापारी प्रोफाइल माहिती सुधारली.'
      );
      setIsBizModalOpen(false);
      setEditingBiz(null);
      loadData();
    }
  };

  // --- SUBSCRIPTION PLAN HANDLERS ---
  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlan) {
      db.saveSubscriptionPlan(editingPlan);
      setIsPlanModalOpen(false);
      setEditingPlan(null);
      loadData();
    }
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('हा सबस्क्रिप्शन प्लॅन निश्चितपणे हटवायचा आहे का?')) {
      db.deleteSubscriptionPlan(id);
      loadData();
    }
  };

  const openNewPlanModal = () => {
    setEditingPlan({
      id: 'plan_' + Date.now(),
      name: '',
      price: 199,
      postLimit: 5,
      description: '',
      durationDays: 30
    });
    setIsPlanModalOpen(true);
  };

  // --- CSV DOWNLOAD EXPORTER ---
  const handleDownloadCSV = () => {
    const headers = [
      'ID',
      'Business Name',
      'Owner Name',
      'Category',
      'Phone',
      'WhatsApp',
      'Email',
      'Village',
      'Address',
      'Approval Status',
      'Subscription Status',
      'Post Limit',
      'Is Suspended'
    ];

    const rows = businesses.map(b => [
      `"${b.id}"`,
      `"${(b.name || '').replace(/"/g, '""')}"`,
      `"${(b.ownerName || '').replace(/"/g, '""')}"`,
      `"${b.category}"`,
      `"${b.phone}"`,
      `"${b.whatsapp || ''}"`,
      `"${b.email || ''}"`,
      `"${(b.village || '').replace(/"/g, '""')}"`,
      `"${(b.address || '').replace(/"/g, '""')}"`,
      `"${b.isApproved ? 'Approved' : 'Pending'}"`,
      `"${b.subscriptionStatus || 'active'}"`,
      `"${b.postLimit || 2}"`,
      `"${b.isSuspended ? 'Yes' : 'No'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shevgaon_merchant_user_list_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- REVIEW ACTION HANDLERS ---
  const handleDeleteReview = (id: string) => {
    if (confirm('हे पुनरावलोकन निश्चितपणे हटवायचे का?')) {
      db.deleteReview(id);
      loadData();
    }
  };

  const handleSaveReviewEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview) {
      db.saveReview(editingReview);
      setIsReviewModalOpen(false);
      setEditingReview(null);
      loadData();
    }
  };

  // --- SECTIONS LAYOUT HANDLERS ---
  const handleToggleSectionVisibility = (sectionId: string, visible: boolean) => {
    const updated = sections.map(s => s.id === sectionId ? { ...s, visible } : s);
    db.saveSections(updated);
    loadData();
  };

  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sections.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newSections = [...sections];

    const tempOrder = newSections[idx].order;
    newSections[idx].order = newSections[targetIdx].order;
    newSections[targetIdx].order = tempOrder;

    db.saveSections(newSections.sort((a, b) => a.order - b.order));
    loadData();
  };

  const handleSaveSectionText = (sectionId: string, title: string, desc: string) => {
    const updated = sections.map(s => s.id === sectionId ? { ...s, title, desc } : s);
    db.saveSections(updated);
    loadData();
    alert('विभाग बदल जतन केले!');
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionId.trim() || !newSectionTitle.trim()) return;

    const newSec: Section = {
      id: newSectionId.toLowerCase().replace(/\s+/g, '-'),
      title: newSectionTitle,
      desc: newSectionDesc,
      visible: true,
      order: sections.length + 1
    };

    const updated = [...sections, newSec];
    db.saveSections(updated);
    setNewSectionId('');
    setNewSectionTitle('');
    setNewSectionDesc('');
    setShowAddSectionModal(false);
    loadData();
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('हा विभाग निश्चितपणे काढून टाकायचा का?')) {
      const updated = sections.filter(s => s.id !== sectionId).map((s, idx) => ({ ...s, order: idx + 1 }));
      db.saveSections(updated);
      loadData();
    }
  };

  // --- SETTINGS CONTENT HANDLERS ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings) {
      db.saveSettings(settings);
      alert('वेबसाइट मजकूर व सेटिंग्ज यशस्वीरीत्या जतन केल्या!');
      loadData();
    }
  };

  // --- REPORTS RESOLUTION ---
  const handleResolveReport = (reportId: string) => {
    db.deleteReport(reportId);
    loadData();
  };

  // Analytics Metrics
  const totalProfiles = businesses.length;
  const activeProfiles = businesses.filter(b => b.subscriptionStatus === 'active' && !b.isSuspended).length;
  const expiredSubscriptions = businesses.filter(b => b.subscriptionStatus === 'expired').length;
  const pendingApprovals = businesses.filter(b => !b.isApproved).length;
  const suspendedProfiles = businesses.filter(b => b.isSuspended).length;

  // Filtered Businesses list for Requests Management
  const filteredBusinesses = businesses.filter(b => {
    if (merchantStatusFilter === 'active') return b.subscriptionStatus === 'active' && !b.isSuspended && b.isApproved;
    if (merchantStatusFilter === 'expired') return b.subscriptionStatus === 'expired';
    if (merchantStatusFilter === 'pending') return !b.isApproved;
    if (merchantStatusFilter === 'suspended') return b.isSuspended;
    return true;
  });

  // Filtered Activity Logs
  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = 
      log.merchantName.toLowerCase().includes(activitySearch.toLowerCase()) ||
      log.businessName.toLowerCase().includes(activitySearch.toLowerCase()) ||
      log.details.toLowerCase().includes(activitySearch.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  // 1. ADMIN LOGIN PANEL
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md w-full mx-auto py-16 px-4 text-left overflow-x-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 border border-white/85 shadow-soft space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-rose-50 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 rounded-full flex items-center justify-center text-rose-500 mx-auto shadow-inner">
              <ShieldAlert size={26} />
            </div>
            <h2 className="text-2xl font-extrabold text-brand-dark dark:text-white">प्रशासक लॉगिन (Admin)</h2>
            <p className="text-xs text-brand-muted dark:text-slate-400 font-light max-w-[240px] mx-auto">वेबसाइट व्यवस्थापन करण्यासाठी सुरक्षितपणे ईमेल आणि पासवर्ड टाका.</p>
          </div>

          {loginError && <span className="text-xs text-rose-500 font-bold block text-center bg-rose-50 py-2 rounded-xl border border-rose-100">{loginError}</span>}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">प्रशासक ईमेल आयडी *</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="उदा. admin@email.com"
                className="w-full bg-white/70 border border-gray-200 rounded-xl p-3.5 text-brand-dark text-xs focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">प्रशासक संकेतशब्द *</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="संकेतशब्द टाका"
                className="w-full bg-white/70 border border-gray-200 rounded-xl p-3.5 text-brand-dark text-xs focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-all"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-brand text-white py-3.5 rounded-xl hover:shadow-[0_8px_20px_rgba(79,124,255,0.25)] transition-all duration-300 font-bold"
            >
              लॉगिन करा (Login)
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full mx-auto pt-4 pb-16 px-4 space-y-8 text-left overflow-x-hidden">
      
      {/* 2. ADMIN DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-card border border-white/70 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 flex items-center justify-center text-rose-500 shadow-inner">
            <ShieldAlert size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-brand-dark dark:text-white">प्रशासक नियंत्रण केंद्र (Admin Portal)</h2>
            <p className="text-xs text-brand-muted dark:text-slate-400 font-light mt-0.5">व्यापारी प्रोफाइल, पोस्ट मर्यादा प्लॅन्स, ऑडिट लॉग्स व सांख्यिकी.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="py-2.5 px-4 bg-gradient-brand text-white hover:opacity-90 rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Download size={14} />
            CSV डाऊनलोड
          </button>
          <button 
            onClick={handleLogout}
            className="py-2.5 px-4 bg-white hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 rounded-xl transition-all font-bold text-xs uppercase tracking-wider shadow-sm"
          >
            बाहेर पडा
          </button>
        </div>
      </div>

      {/* Tabs selectors list */}
      <div className="flex gap-2 border-b border-gray-200/60 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'analytics', label: 'सांख्यिकी (Analytics)', icon: BarChart2 },
          { id: 'businesses', label: 'व्यापारी प्रोफाइल व्यवस्थापन', icon: UserCheck },
          { id: 'plans', label: 'सबस्क्रिप्शन प्लॅन्स (Post Limits)', icon: Package },
          { id: 'activity', label: 'क्रियाकलाप इतिहास (Audit Log)', icon: History },
          { id: 'reviews', label: 'परीक्षणे (Reviews)', icon: MessageSquare },
          { id: 'sections', label: 'वेबसाइट मांडणी (Layout)', icon: Layout },
          { id: 'content', label: 'मजकूर & सेटिंग्ज', icon: Settings },
          { id: 'reports', label: 'तक्रार निवारण', icon: AlertTriangle }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-gradient-brand text-white shadow-sm shadow-brand-blue/10' 
                  : 'bg-white/50 dark:bg-slate-800/50 text-brand-muted dark:text-slate-400 hover:text-brand-dark border border-gray-200/50 dark:border-slate-700'
              }`}
            >
              <Icon size={14} /> {tab.label}
              {tab.id === 'businesses' && pendingApprovals > 0 && (
                <span className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                  {pendingApprovals}
                </span>
              )}
              {tab.id === 'reports' && reports.length > 0 && (
                <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                  {reports.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE TAB RENDER VIEWS */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        
        {/* A. ADMIN DASHBOARD ANALYTICS VIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            
            {/* Download CSV Bar */}
            <div className="glass-card p-4 border border-white/70 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-brand-dark dark:text-white flex items-center gap-2">
                  <FileText size={16} className="text-brand-purple" />
                  व्यापारी वापरकर्ता यादी डेटा एक्सपोर्ट (User List Download)
                </h3>
                <p className="text-xs text-brand-muted dark:text-slate-400 font-light mt-0.5">
                  सर्व (एकूण, सक्रिय, आणि मुदत संपलेले) व्यापारी प्रोफाईल एका क्लिकवर CSV फाइल फॉरमॅटमध्ये डाउनलोड करा.
                </p>
              </div>
              <button 
                onClick={handleDownloadCSV}
                className="bg-gradient-brand text-white hover:shadow-lg font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shrink-0 transition-all"
              >
                <Download size={14} /> डाऊनलोड व्यापारी यादी (CSV)
              </button>
            </div>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-5 border border-white/70 shadow-sm space-y-1">
                <span className="text-xs text-brand-muted dark:text-slate-400 font-light block">एकूण व्यापारी प्रोफाईल</span>
                <p className="text-3xl font-extrabold text-brand-dark dark:text-white">{totalProfiles}</p>
                <span className="text-[10px] text-brand-purple font-semibold block">एकूण नोंदणीकृत विक्रेते</span>
              </div>
              <div className="glass-card p-5 border border-white/70 shadow-sm space-y-1">
                <span className="text-xs text-brand-muted dark:text-slate-400 font-light block font-semibold text-emerald-600">सक्रिय प्रोफाईल (Active)</span>
                <p className="text-3xl font-extrabold text-emerald-600">{activeProfiles}</p>
                <span className="text-[10px] text-emerald-600 font-semibold block">सक्रिय व मंजूर खाती</span>
              </div>
              <div className="glass-card p-5 border border-white/70 shadow-sm space-y-1">
                <span className="text-xs text-brand-muted dark:text-slate-400 font-light block font-semibold text-amber-600">मुदत संपलेले सबस्क्रिप्शन</span>
                <p className="text-3xl font-extrabold text-amber-600">{expiredSubscriptions}</p>
                <span className="text-[10px] text-amber-600 font-semibold block">नूतनीकरण आवश्यक</span>
              </div>
              <div className="glass-card p-5 border border-white/70 shadow-sm space-y-1">
                <span className="text-xs text-brand-muted dark:text-slate-400 font-light block font-semibold text-rose-500">मंजुरी प्रलंबित / निलंबित</span>
                <p className="text-3xl font-extrabold text-rose-500">{pendingApprovals + suspendedProfiles}</p>
                <span className="text-[10px] text-rose-500 font-semibold block">प्रलंबित: {pendingApprovals} | निलंबित: {suspendedProfiles}</span>
              </div>
            </div>

            {/* Visual Graphs & Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Chart 1: Subscription Breakdown Visual Progress Bars */}
              <div className="glass-card p-6 border border-white/70 space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-extrabold text-brand-dark dark:text-white flex items-center gap-2">
                    <BarChart2 size={16} className="text-brand-purple" />
                    सबस्क्रिप्शन स्थिती आलेख (Subscription Status Breakdown)
                  </h3>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  
                  {/* Active Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-emerald-600">
                      <span>सक्रिय सबस्क्रिप्शन (Active Subscriptions)</span>
                      <span>{activeProfiles} ({totalProfiles > 0 ? Math.round((activeProfiles / totalProfiles) * 100) : 0}%)</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                        style={{ width: `${totalProfiles > 0 ? (activeProfiles / totalProfiles) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Expired Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-amber-600">
                      <span>मुदत संपलेले (Expired Subscriptions)</span>
                      <span>{expiredSubscriptions} ({totalProfiles > 0 ? Math.round((expiredSubscriptions / totalProfiles) * 100) : 0}%)</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                        style={{ width: `${totalProfiles > 0 ? (expiredSubscriptions / totalProfiles) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Pending Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-rose-500">
                      <span>मंजुरी प्रलंबित (Pending Approval)</span>
                      <span>{pendingApprovals} ({totalProfiles > 0 ? Math.round((pendingApprovals / totalProfiles) * 100) : 0}%)</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                        style={{ width: `${totalProfiles > 0 ? (pendingApprovals / totalProfiles) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Suspended Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>निलंबित खाती (Suspended Accounts)</span>
                      <span>{suspendedProfiles} ({totalProfiles > 0 ? Math.round((suspendedProfiles / totalProfiles) * 100) : 0}%)</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-500 rounded-full transition-all duration-500" 
                        style={{ width: `${totalProfiles > 0 ? (suspendedProfiles / totalProfiles) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Chart 2: Profiles Breakdown By Business Category Bar Chart */}
              <div className="glass-card p-6 border border-white/70 space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-extrabold text-brand-dark dark:text-white flex items-center gap-2">
                    <UserCheck size={16} className="text-brand-blue" />
                    श्रेणीनिहाय व्यापारी वितरण (Profiles by Category)
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs font-semibold max-h-[300px] overflow-y-auto pr-1">
                  {[
                    { cat: 'mandi', name: '🌾 शेतकरी व भाजीपाला', color: 'bg-emerald-500' },
                    { cat: 'technician', name: '🛠️ घरगुती सेवा', color: 'bg-blue-500' },
                    { cat: 'hotel', name: '🍔 हॉटेल्स व स्ट्रीट फूड', color: 'bg-amber-500' },
                    { cat: 'material', name: '🏗️ बांधकाम साहित्य', color: 'bg-purple-500' },
                    { cat: 'vehicle', name: '🚗 वाहने', color: 'bg-cyan-500' },
                    { cat: 'beauty', name: '💇‍♀️ ब्युटी पार्लर', color: 'bg-pink-500' },
                    { cat: 'water', name: '🚰 वॉटर जार सेवा', color: 'bg-teal-500' },
                    { cat: 'cyber', name: '💻 सायबर कॅफे', color: 'bg-indigo-500' },
                    { cat: 'mess', name: '🍲 मेस व खानावळ', color: 'bg-orange-500' },
                    { cat: 'photoshop', name: '📸 फोटोशॉप स्टुडिओ', color: 'bg-violet-500' },
                    { cat: 'gym', name: '🏋️‍♂️ जिम व फिटनेस', color: 'bg-yellow-500' },
                    { cat: 'hospital', name: '🏥 हॉस्पिटल', color: 'bg-red-500' },
                    { cat: 'mobileshop', name: '📱 मोबाईल शॉप', color: 'bg-sky-500' },
                    { cat: 'sweethome', name: '🧁 स्वीट होम', color: 'bg-rose-400' },
                    { cat: 'mechanics', name: '🔧 गॅरेज व मेकॅनिक', color: 'bg-slate-600' },
                    { cat: 'offers', name: '🛍️ ऑफर्स व डिस्काउंट', color: 'bg-rose-500' }
                  ].map(c => {
                    const count = businesses.filter(b => b.category === c.cat).length;
                    const pct = totalProfiles > 0 ? (count / totalProfiles) * 100 : 0;
                    return (
                      <div key={c.cat} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-brand-dark dark:text-slate-300 font-medium">{c.name}</span>
                          <span className="text-brand-muted font-bold">{count} नोंदणी ({Math.round(pct)}%)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${c.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Quick pending approval log */}
            <div className="glass-card p-6 border border-white/70 space-y-4">
              <h3 className="text-base font-bold text-brand-dark dark:text-white">मंजुरी प्रलंबित व्यापारी यादी</h3>
              {businesses.filter(b => !b.isApproved).length === 0 ? (
                <p className="text-xs text-brand-muted dark:text-slate-400 font-light">कोणताही व्यवसाय मंजुरीसाठी प्रलंबित नाही.</p>
              ) : (
                <div className="space-y-3">
                  {businesses.filter(b => !b.isApproved).map(b => (
                    <div key={b.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-slate-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-xl gap-4 text-xs">
                      <div>
                        <h4 className="font-extrabold text-brand-dark dark:text-white">{b.name} ({b.ownerName})</h4>
                        <p className="text-[10px] text-brand-muted dark:text-slate-400 font-light">{b.category} | {b.village} | {b.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApprove(b.id, true)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Check size={12} /> मंजूर (Approve)
                        </button>
                        <button 
                          onClick={() => handleDeleteBiz(b.id, b.category)}
                          className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <X size={12} /> फेटाळा (Delete)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* B. MERCHANT REQUEST & PROFILE MANAGEMENT VIEW */}
        {activeTab === 'businesses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-gray-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-brand-dark dark:text-white">व्यापारी प्रोफाइल व अर्ज व्यवस्थापन</h3>
                <p className="text-xs text-brand-muted dark:text-slate-400 font-light">प्रोफाइल पहा, संपादित करा, निलंबित करा किंवा हटवा.</p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-xl text-[11px] font-bold">
                {[
                  { id: 'all', label: `सर्व (${businesses.length})` },
                  { id: 'active', label: `सक्रिय (${activeProfiles})` },
                  { id: 'expired', label: `मुदत संपलेले (${expiredSubscriptions})` },
                  { id: 'pending', label: `प्रलंबित (${pendingApprovals})` },
                  { id: 'suspended', label: `निलंबित (${suspendedProfiles})` }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setMerchantStatusFilter(f.id as any)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      merchantStatusFilter === f.id 
                        ? 'bg-white dark:bg-slate-700 text-brand-purple dark:text-white shadow-sm' 
                        : 'text-brand-muted hover:text-brand-dark dark:hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            
            {filteredBusinesses.length === 0 ? (
              <div className="glass-card p-8 text-center text-xs text-brand-muted font-light">
                या फिल्टरसाठी कोणताही व्यापारी प्रोफाईल आढळला नाही.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBusinesses.map((b) => (
                  <div key={b.id} className="glass-card p-4 border border-white/70 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                    
                    <div className="flex items-center gap-3">
                      {b.logo ? (
                        <img src={b.logo} alt="logo" className="w-12 h-12 rounded-xl object-cover border border-gray-200/50 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                          <HelpCircle size={20} className="text-slate-400" />
                        </div>
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-extrabold text-brand-dark dark:text-white text-sm">{b.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                            {b.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-muted dark:text-slate-400 font-light mt-0.5">
                          मालक: <b>{b.ownerName || 'N/A'}</b> | गाव: {b.village} | पोस्ट मर्यादा: <b>{b.postLimit || 2} पोस्ट्स</b>
                        </p>
                        
                        {/* Badges status line */}
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {b.isApproved ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[9px] font-bold">✓ मंजूर</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[9px] font-bold">⏳ प्रलंबित</span>
                          )}

                          {b.subscriptionStatus === 'expired' ? (
                            <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[9px] font-bold">⚠️ सबस्क्रिप्शन मुदत संपली</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[9px] font-bold">⚡ सक्रिय सबस्क्रिप्शन</span>
                          )}

                          {b.isSuspended && (
                            <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[9px] font-bold">🚫 खाते निलंबित</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls for Admin */}
                    <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end shrink-0">
                      
                      {/* 1. View Profile Button */}
                      <button 
                        onClick={() => setViewingBiz(b)}
                        className="px-3 py-1.5 rounded-lg border border-brand-purple/20 bg-brand-purple/5 text-brand-purple dark:text-purple-300 hover:bg-brand-purple hover:text-white flex items-center gap-1 font-bold text-[11px] transition-all"
                        title="संपूर्ण प्रोफाईल पहा"
                      >
                        <Eye size={12} /> प्रोफाईल पहा
                      </button>

                      {/* 2. Edit Profile Button */}
                      <button 
                        onClick={() => { setEditingBiz(b); setIsBizModalOpen(true); }}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-dark dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1 font-bold text-[11px]"
                      >
                        <Edit2 size={12} /> संपादित करा
                      </button>

                      {/* 3. Suspend / Reactivate Button */}
                      <button 
                        onClick={() => handleToggleSuspend(b.id)}
                        className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 font-bold text-[11px] transition-all ${
                          b.isSuspended 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        <Ban size={12} /> {b.isSuspended ? 'सक्रिय करा' : 'निलंबित करा'}
                      </button>

                      {/* 4. Delete Account Button */}
                      <button 
                        onClick={() => handleDeleteBiz(b.id, b.category)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-400 hover:bg-rose-100 flex items-center gap-1 font-bold text-[11px]"
                      >
                        <Trash2 size={12} /> हटवा
                      </button>

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* C. SUBSCRIPTION PLANS MANAGEMENT VIEW (ADMIN CONTROLLED POST LIMITS) */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-gray-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-brand-dark dark:text-white flex items-center gap-2">
                  <Package size={18} className="text-brand-purple" />
                  सबस्क्रिप्शन प्लॅन्स आणि पोस्ट मर्यादा (Subscription Plans & Post Limits)
                </h3>
                <p className="text-xs text-brand-muted dark:text-slate-400 font-light mt-0.5">
                  येथे प्रशासक सानुकूल सबस्क्रिप्शन प्लॅन, त्यांची किंमत (₹) आणि अचूक पोस्ट मर्यादा (Post Limit) निश्चित करू शकतात.
                </p>
              </div>

              <button 
                onClick={openNewPlanModal}
                className="bg-gradient-brand text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Plus size={14} /> नवीन सबस्क्रिप्शन प्लॅन जोडा
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <div key={plan.id} className="glass-card p-6 border border-white/70 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-brand-dark dark:text-white text-base">{plan.name}</h4>
                      <span className="bg-brand-purple/10 text-brand-purple font-mono font-bold text-xs px-2.5 py-1 rounded-full border border-brand-purple/20">
                        ₹{plan.price}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs font-semibold">
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>पोस्ट मर्यादा (Post Limit):</span>
                        <span className="font-extrabold text-sm">{plan.postLimit} पोस्ट्स</span>
                      </div>
                      <div className="flex justify-between text-brand-muted dark:text-slate-400">
                        <span>कालावधी (Duration):</span>
                        <span>{plan.durationDays} दिवस</span>
                      </div>
                    </div>

                    <p className="text-xs text-brand-muted dark:text-slate-300 font-light leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                    <button 
                      onClick={() => { setEditingPlan(plan); setIsPlanModalOpen(true); }}
                      className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-dark dark:text-slate-200 hover:bg-slate-50 text-xs font-bold flex items-center gap-1"
                    >
                      <Edit2 size={12} /> बदला
                    </button>
                    <button 
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 size={12} /> डिलीट
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* D. MERCHANT ACTIVITY HISTORY (AUDIT LOG VIEW) */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-gray-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-brand-dark dark:text-white flex items-center gap-2">
                  <History size={18} className="text-brand-purple" />
                  व्यापारी क्रियाकलाप इतिहास (Merchant Audit Log System)
                </h3>
                <p className="text-xs text-brand-muted dark:text-slate-400 font-light">व्यापाऱ्यांनी जोडलेला, बदललेला किंवा हटवलेला सर्व डेटा येथे सुरक्षितपणे संग्रहित केला जातो.</p>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <input 
                    type="text"
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    placeholder="व्यापारी किंवा क्रियाकलाप शोधा..."
                    className="w-full sm:w-60 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2 pl-8 pr-3 text-xs focus:outline-none"
                  />
                  <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                </div>

                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[10px] font-bold">
                  {(['ALL', 'ADD', 'UPDATE', 'DELETE'] as const).map(act => (
                    <button
                      key={act}
                      onClick={() => setActionFilter(act)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        actionFilter === act 
                          ? 'bg-white dark:bg-slate-700 text-brand-purple dark:text-white shadow-sm' 
                          : 'text-brand-muted dark:text-slate-400'
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="glass-card p-8 text-center text-xs text-brand-muted font-light">
                कोणताही ऑडिट लॉग आढळला नाही.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => {
                  let badgeColor = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300';
                  if (log.action === 'ADD') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300';
                  if (log.action === 'DELETE') badgeColor = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300';

                  return (
                    <div key={log.id} className="glass-card p-4 border border-white/70 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${badgeColor}`}>
                            {log.action}
                          </span>
                          <span className="font-extrabold text-brand-dark dark:text-white text-sm">{log.merchantName}</span>
                          <span className="text-[10px] text-brand-muted dark:text-slate-400 font-mono">({log.category})</span>
                        </div>
                        <p className="text-brand-muted dark:text-slate-300 font-light leading-relaxed">
                          <b>व्यवसाय:</b> {log.businessName} — {log.details}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-brand-muted dark:text-slate-400 font-mono flex items-center gap-1 justify-end">
                          <Clock size={10} />
                          {new Date(log.timestamp).toLocaleString('mr-IN')}
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* E. REVIEWS AUDITING VIEW */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-brand-dark dark:text-white pb-2 border-b border-gray-100 dark:border-slate-800">सर्व ग्राहक पुनरावलोकनांचे ऑडिट</h3>
            {reviews.length === 0 ? (
              <p className="text-xs text-brand-muted dark:text-slate-400 font-light">अद्याप पुनरावलोकने दाखल नाहीत.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="glass-card p-4 border border-white/70 shadow-sm text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-brand-dark dark:text-white">{r.userName} ({r.userEmail})</span>
                        <div className="flex gap-0.5 text-amber-500 mt-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={10} className={s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setEditingReview(r); setIsReviewModalOpen(true); }}
                          className="text-brand-blue font-bold hover:underline"
                        >
                          बदला
                        </button>
                        <button 
                          onClick={() => handleDeleteReview(r.id)}
                          className="text-rose-500 font-bold hover:underline"
                        >
                          हटवा
                        </button>
                      </div>
                    </div>
                    <p className="text-brand-muted dark:text-slate-300 font-light leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* F. HOMEPAGE SECTIONS LAYOUT MANAGER */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-brand-dark dark:text-white">वेबसाइट रचना व मांडणी (Homepage Sections Layout)</h3>
              <button 
                onClick={() => setShowAddSectionModal(true)}
                className="bg-rose-500 text-white font-bold py-2 px-3 rounded-lg text-xs hover:bg-rose-600 transition-all flex items-center gap-1"
              >
                <Plus size={14} /> नवीन विभाग जोडा
              </button>
            </div>

            <div className="space-y-4">
              {sections.map((sec, idx) => (
                <SectionConfigCard 
                  key={sec.id}
                  sec={sec}
                  idx={idx}
                  total={sections.length}
                  onToggle={handleToggleSectionVisibility}
                  onMove={handleMoveSection}
                  onSave={handleSaveSectionText}
                  onDelete={handleDeleteSection}
                />
              ))}
            </div>
          </div>
        )}

        {/* G. WEBSITE GENERAL SETTINGS EDITOR */}
        {activeTab === 'content' && settings && (
          <div className="glass-card p-6 border border-white/70 space-y-6">
            <h3 className="text-base font-bold text-brand-dark dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">होमपेज मुख्य मजकूर, बॅनर आणि संपर्क माहिती</h3>
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-semibold">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">मुख्य शीर्षक (Website Title)</label>
                  <input 
                    type="text"
                    value={settings.title}
                    onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">मुख्य बॅनर प्रतिमा URL (Homepage Banner URL)</label>
                  <input 
                    type="text"
                    value={settings.bannerUrl}
                    onChange={(e) => setSettings({ ...settings, bannerUrl: e.target.value })}
                    placeholder="उदा. https://images.unsplash.com/..."
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">वेबसाइटचे वर्णन (Description Text)</label>
                <textarea 
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={2}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 dark:border-slate-800 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">संपर्क ईमेल</label>
                  <input 
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">संपर्क मोबाईल क्रमांक</label>
                  <input 
                    type="text"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">संपर्क पत्ता (Footer Address)</label>
                  <input 
                    type="text"
                    value={settings.contactAddress}
                    onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="bg-gradient-brand text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 font-bold uppercase tracking-wider"
              >
                बदल जतन करा (Save Settings)
              </button>
            </form>
          </div>
        )}

        {/* H. COMPLAINTS/REPORTS VIEW */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-brand-dark dark:text-white pb-2 border-b border-gray-100 dark:border-slate-800">नोंदवलेल्या तक्रारींची यादी (Report Log)</h3>
            {reports.length === 0 ? (
              <p className="text-xs text-brand-muted dark:text-slate-400 font-light">कोणत्याही व्यवसायाबद्दल अद्याप तक्रार दाखल नाही.</p>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div key={rep.id} className="glass-card p-4 border border-rose-100 dark:border-rose-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs bg-rose-50/10">
                    <div>
                      <h4 className="font-extrabold text-rose-600">तक्रारदार विषय: {rep.businessName} (ID: {rep.businessId})</h4>
                      <p className="text-brand-muted dark:text-slate-300 leading-relaxed font-light mt-1"><b>कारण:</b> {rep.reason}</p>
                      <span className="text-[9px] text-brand-muted dark:text-slate-400 block mt-1">{new Date(rep.createdAt).toLocaleString('mr-IN')}</span>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => handleResolveReport(rep.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg"
                      >
                        निवारण करा (Resolve)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </motion.div>

      {/* --- COMPLETE MERCHANT PROFILE VIEW MODAL OVERLAY --- */}
      <AnimatePresence>
        {viewingBiz && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-md p-4 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl glass-card p-6 border border-white shadow-2xl relative text-left max-h-[90vh] overflow-y-auto space-y-6"
            >
              <button 
                onClick={() => setViewingBiz(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-white text-brand-dark dark:text-white transition-colors shadow-sm font-bold text-sm"
              >
                ✕
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4 pr-8 border-b border-gray-100 dark:border-slate-800 pb-4">
                {viewingBiz.logo ? (
                  <img src={viewingBiz.logo} alt="logo" className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <HelpCircle size={28} className="text-slate-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-extrabold text-brand-dark dark:text-white">{viewingBiz.name}</h3>
                  <p className="text-xs text-brand-muted dark:text-slate-400 font-medium">मालक: {viewingBiz.ownerName || 'N/A'}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                      श्रेणी: {viewingBiz.category}
                    </span>
                    {viewingBiz.isApproved ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">✓ मंजूर</span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-bold">⏳ मंजुरी प्रलंबित</span>
                    )}
                    {viewingBiz.isSuspended && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 text-[10px] font-bold">🚫 खाते निलंबित</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details Body */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                
                <div className="glass-card p-4 border border-white/60 space-y-2">
                  <h4 className="text-[10px] text-brand-purple uppercase tracking-wider font-extrabold">संपर्क माहिती</h4>
                  <p className="flex items-center gap-2 text-brand-dark dark:text-slate-200">
                    <Phone size={14} className="text-emerald-500" /> मोबाईल: {viewingBiz.phone}
                  </p>
                  {viewingBiz.whatsapp && (
                    <p className="flex items-center gap-2 text-brand-dark dark:text-slate-200">
                      <Phone size={14} className="text-emerald-600" /> व्हॉट्सॲप: {viewingBiz.whatsapp}
                    </p>
                  )}
                  {viewingBiz.email && (
                    <p className="flex items-center gap-2 text-brand-dark dark:text-slate-200">
                      <Mail size={14} className="text-blue-500" /> ईमेल: {viewingBiz.email}
                    </p>
                  )}
                </div>

                <div className="glass-card p-4 border border-white/60 space-y-2">
                  <h4 className="text-[10px] text-brand-purple uppercase tracking-wider font-extrabold">पत्ता व वेळ</h4>
                  <p className="flex items-center gap-2 text-brand-dark dark:text-slate-200">
                    <MapPin size={14} className="text-rose-500" /> {viewingBiz.address}, {viewingBiz.village}, {viewingBiz.taluka}
                  </p>
                  <p className="flex items-center gap-2 text-brand-dark dark:text-slate-200">
                    <Clock size={14} className="text-amber-500" /> {viewingBiz.openingTime} ते {viewingBiz.closingTime}
                  </p>
                  {viewingBiz.mapLink && (
                    <a href={viewingBiz.mapLink} target="_blank" rel="noreferrer" className="text-brand-blue flex items-center gap-1 hover:underline">
                      <ExternalLink size={12} /> गूगल मॅप्स लिंक पहा
                    </a>
                  )}
                </div>

              </div>

              {/* Description */}
              <div className="space-y-1 text-xs">
                <h4 className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider font-extrabold">व्यवसाय वर्णन</h4>
                <p className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-brand-muted dark:text-slate-300 leading-relaxed">
                  {viewingBiz.description}
                </p>
              </div>

              {/* Photos Gallery */}
              {viewingBiz.photos && viewingBiz.photos.length > 0 && (
                <div className="space-y-2 text-xs">
                  <h4 className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider font-extrabold">फोटो गॅलरी</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {viewingBiz.photos.map((p, i) => (
                      <img key={i} src={p} alt="gallery" className="w-full h-24 object-cover rounded-xl border border-gray-200" />
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Quick Action Footer */}
              <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs font-bold">
                <button 
                  onClick={() => { setViewingBiz(null); setEditingBiz(viewingBiz); setIsBizModalOpen(true); }}
                  className="px-4 py-2 bg-gradient-brand text-white rounded-xl hover:shadow-md"
                >
                  संपादित करा (Edit Profile)
                </button>
                <button 
                  onClick={() => { handleToggleSuspend(viewingBiz.id); setViewingBiz({ ...viewingBiz, isSuspended: !viewingBiz.isSuspended }); }}
                  className={`px-4 py-2 rounded-xl border ${viewingBiz.isSuspended ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}
                >
                  {viewingBiz.isSuspended ? 'सक्रिय करा (Reactivate)' : 'निलंबित करा (Suspend)'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- BUSINESS EDIT MODAL OVERLAY --- */}
      <AnimatePresence>
        {isBizModalOpen && editingBiz && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/35 backdrop-blur-md p-4 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-lg glass-card p-6 border border-white shadow-2xl relative text-left max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsBizModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-white text-brand-dark dark:text-white transition-colors shadow-sm font-bold text-xs"
              >
                ✕
              </button>
              
              <h3 className="text-lg font-extrabold text-brand-dark dark:text-white mb-4">व्यवसाय संपादन (Edit Details)</h3>
              
              <form onSubmit={handleSaveBizEdit} className="space-y-4 text-xs font-semibold">
                
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">व्यवसायाचे नाव</label>
                  <input 
                    type="text"
                    value={editingBiz.name}
                    onChange={(e) => setEditingBiz({ ...editingBiz, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">मालकाचे नाव</label>
                  <input 
                    type="text"
                    value={editingBiz.ownerName}
                    onChange={(e) => setEditingBiz({ ...editingBiz, ownerName: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">श्रेणी (Category)</label>
                    <select
                      value={editingBiz.category}
                      onChange={(e) => setEditingBiz({ ...editingBiz, category: e.target.value as any })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs"
                    >
                      <option value="mandi">🌾 शेतकरी</option>
                      <option value="technician">🛠️ घरगुती सेवा</option>
                      <option value="material">🧱 बांधकाम साहित्य</option>
                      <option value="hotel">🍔 हॉटेल</option>
                      <option value="vehicle">🚗 वाहने</option>
                      <option value="mechanics">🔧 मेकॅनिक</option>
                      <option value="beauty">💇‍♀️ ब्युटी पार्लर</option>
                      <option value="water">🚰 वॉटर जार</option>
                      <option value="cyber">💻 सायबर कॅफे</option>
                      <option value="mess">🍲 मेस</option>
                      <option value="photoshop">📸 फोटोशॉप</option>
                      <option value="gym">🏋️‍♂️ जिम</option>
                      <option value="hospital">🏥 हॉस्पिटल</option>
                      <option value="mobileshop">📱 मोबाईल शॉप</option>
                      <option value="sweethome">🧁 स्वीट होम</option>
                      <option value="offers">🛍️ ऑफर्स</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">पोस्ट मर्यादा (Post Limit)</label>
                    <input 
                      type="number"
                      value={editingBiz.postLimit || 2}
                      onChange={(e) => setEditingBiz({ ...editingBiz, postLimit: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">वर्णन</label>
                  <textarea 
                    value={editingBiz.description}
                    onChange={(e) => setEditingBiz({ ...editingBiz, description: e.target.value })}
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">मोबाईल क्रमांक</label>
                    <input 
                      type="tel"
                      value={editingBiz.phone}
                      onChange={(e) => setEditingBiz({ ...editingBiz, phone: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">गाव</label>
                    <input 
                      type="text"
                      value={editingBiz.village}
                      onChange={(e) => setEditingBiz({ ...editingBiz, village: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">पत्ता</label>
                  <input 
                    type="text"
                    value={editingBiz.address}
                    onChange={(e) => setEditingBiz({ ...editingBiz, address: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">सबस्क्रिप्शन स्थिती</label>
                    <select
                      value={editingBiz.subscriptionStatus || 'active'}
                      onChange={(e) => setEditingBiz({ ...editingBiz, subscriptionStatus: e.target.value as any })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs"
                    >
                      <option value="active">सक्रिय (Active)</option>
                      <option value="expired">मुदत संपली (Expired)</option>
                      <option value="pending">प्रलंबित (Pending)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">खाते स्थिती (Account Status)</label>
                    <select
                      value={editingBiz.isSuspended ? 'suspended' : 'active'}
                      onChange={(e) => setEditingBiz({ ...editingBiz, isSuspended: e.target.value === 'suspended' })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs"
                    >
                      <option value="active">सक्रिय (Active)</option>
                      <option value="suspended">निलंबित (Suspended)</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider"
                >
                  बदल जतन करा (Save Changes)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SUBSCRIPTION PLAN EDIT MODAL OVERLAY --- */}
      <AnimatePresence>
        {isPlanModalOpen && editingPlan && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/35 backdrop-blur-md p-4 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md glass-card p-6 border border-white shadow-2xl relative text-left"
            >
              <button 
                onClick={() => setIsPlanModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-white text-brand-dark dark:text-white transition-colors shadow-sm font-bold text-xs"
              >
                ✕
              </button>

              <h3 className="text-lg font-extrabold text-brand-dark dark:text-white mb-4">सबस्क्रिप्शन प्लॅन माहिती (Subscription Plan)</h3>

              <form onSubmit={handleSavePlan} className="space-y-4 text-xs font-semibold">
                
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">प्लॅनचे नाव *</label>
                  <input 
                    type="text" 
                    required
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    placeholder="उदा. गोल्ड प्लॅन (Gold Plan)" 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">किंमत (₹) *</label>
                    <input 
                      type="number" 
                      required
                      value={editingPlan.price}
                      onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) || 0 })}
                      placeholder="उदा. 299" 
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">अचूक पोस्ट मर्यादा (Post Limit) *</label>
                    <input 
                      type="number" 
                      required
                      value={editingPlan.postLimit}
                      onChange={(e) => setEditingPlan({ ...editingPlan, postLimit: parseInt(e.target.value) || 1 })}
                      placeholder="उदा. 5" 
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">कालावधी (दिवस / Days) *</label>
                  <input 
                    type="number" 
                    required
                    value={editingPlan.durationDays}
                    onChange={(e) => setEditingPlan({ ...editingPlan, durationDays: parseInt(e.target.value) || 30 })}
                    placeholder="उदा. 90" 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">वर्णन (Description)</label>
                  <textarea 
                    value={editingPlan.description}
                    onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                    rows={3}
                    placeholder="उदा. ५ पोस्ट मर्यादेसह ३ महिन्यांसाठी विशेष प्लॅन."
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-brand text-white py-3 rounded-xl font-bold uppercase tracking-wider"
                >
                  प्लॅन जतन करा (Save Plan)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- REVIEW EDIT MODAL OVERLAY --- */}
      <AnimatePresence>
        {isReviewModalOpen && editingReview && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/35 backdrop-blur-md p-4 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-sm glass-card p-6 border border-white shadow-2xl relative text-left"
            >
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-white text-brand-dark transition-colors shadow-sm font-bold text-xs"
              >
                ✕
              </button>

              <h3 className="text-lg font-extrabold text-brand-dark dark:text-white mb-4">पुनरावलोकन दुरुस्त करा (Edit Review)</h3>

              <form onSubmit={handleSaveReviewEdit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">रेटिंग (Stars)</label>
                  <select 
                    value={editingReview.rating}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) })}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-brand-dark"
                  >
                    <option value="5">५ स्टार</option>
                    <option value="4">४ स्टार</option>
                    <option value="3">३ स्टार</option>
                    <option value="2">२ स्टार</option>
                    <option value="1">१ स्टार</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">अभिप्राय टिप्पणी</label>
                  <textarea 
                    value={editingReview.comment}
                    onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl font-bold uppercase"
                >
                  बदल जतन करा
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD SECTION MODAL OVERLAY --- */}
      <AnimatePresence>
        {showAddSectionModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/35 backdrop-blur-md p-4 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-sm glass-card p-6 border border-white shadow-2xl relative text-left"
            >
              <button 
                onClick={() => setShowAddSectionModal(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-white text-brand-dark transition-colors shadow-sm font-bold text-xs"
              >
                ✕
              </button>

              <h3 className="text-lg font-extrabold text-brand-dark dark:text-white mb-4">नवीन विभाग जोडा (New Section)</h3>

              <form onSubmit={handleAddSection} className="space-y-4 text-xs font-semibold">
                
                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">विभाग ID (Section ID) *</label>
                  <input 
                    type="text" 
                    required
                    value={newSectionId}
                    onChange={(e) => setNewSectionId(e.target.value)}
                    placeholder="उदा. new-offers" 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">विभाग शीर्षक (Title) *</label>
                  <input 
                    type="text" 
                    required
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="उदा. 🛍️ विशेष सवलती" 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-brand-dark dark:text-slate-300 uppercase tracking-wider block">विभाग वर्णन (Description)</label>
                  <input 
                    type="text" 
                    value={newSectionDesc}
                    onChange={(e) => setNewSectionDesc(e.target.value)}
                    placeholder="उदा. सणासुदीच्या सर्वोत्तम डील्स एकाच ठिकाणी." 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-brand-dark text-xs focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl font-bold uppercase"
                >
                  विभाग तयार करा (Create)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Section sub-component to handle local texts mapping states cleanly
interface SectionConfigCardProps {
  sec: Section;
  idx: number;
  total: number;
  onToggle: (id: string, visible: boolean) => void;
  onMove: (idx: number, direction: 'up' | 'down') => void;
  onSave: (id: string, title: string, desc: string) => void;
  onDelete: (id: string) => void;
}

function SectionConfigCard({ sec, idx, total, onToggle, onMove, onSave, onDelete }: SectionConfigCardProps) {
  const [title, setTitle] = useState(sec.title);
  const [desc, setDesc] = useState(sec.desc);

  useEffect(() => {
    setTitle(sec.title);
    setDesc(sec.desc);
  }, [sec]);

  return (
    <div className="glass-card p-5 border border-white/70 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs">
      
      <div className="flex-grow space-y-3 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 shrink-0">
            {sec.order}
          </span>
          <span className="font-mono text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
            ID: {sec.id}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] text-brand-muted dark:text-slate-400 block uppercase tracking-wider">शीर्षक (Title)</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-brand-dark text-xs focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-brand-muted dark:text-slate-400 block uppercase tracking-wider">वर्णन (Description)</label>
            <input 
              type="text" 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-brand-dark text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0 self-stretch md:self-auto justify-end">
        
        <button 
          onClick={() => onToggle(sec.id, !sec.visible)}
          className={`p-2 rounded-xl border flex items-center gap-1.5 font-bold text-[10px] ${
            sec.visible 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          {sec.visible ? (
            <>
              <Eye size={12} /> दृश्य (Visible)
            </>
          ) : (
            <>
              <EyeOff size={12} /> लपवलेला (Hidden)
            </>
          )}
        </button>

        <div className="flex gap-1">
          <button 
            disabled={idx === 0}
            onClick={() => onMove(idx, 'up')}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-brand-dark disabled:opacity-30"
          >
            <ArrowUp size={12} />
          </button>
          <button 
            disabled={idx === total - 1}
            onClick={() => onMove(idx, 'down')}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-brand-dark disabled:opacity-30"
          >
            <ArrowDown size={12} />
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => onSave(sec.id, title, desc)}
            className="py-2 px-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-[10px] shadow-sm uppercase"
          >
            जतन करा
          </button>
          {sec.id !== 'hero' && sec.id !== 'contact' && (
            <button 
              onClick={() => onDelete(sec.id)}
              className="p-2 border border-gray-200 text-rose-600 hover:bg-rose-50 rounded-xl"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
