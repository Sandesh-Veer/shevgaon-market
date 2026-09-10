import React, { useState, useMemo, useEffect } from 'react';
import { Search as SearchIcon, X, Star, ArrowUpDown, Sparkles } from 'lucide-react';
import UniversalCard from '../ui/UniversalCard';

export interface ShopItem {
  id: string;
  shopName: string;
  ownerName: string;
  category: string;
  mobileNumber: string;
  address: string;
  imageUrl?: string;
  items?: string | string[];
  description?: string;
  rating?: number;
  status: 'pending' | 'approved';
  paymentStatus?: string;
  planType?: string;
  createdAt?: any;
}

interface AdvancedSearchBarProps {
  shops: ShopItem[];
  onResultsChange?: (results: ShopItem[]) => void;
  renderResults?: boolean;
  placeholder?: string;
  className?: string;
}

const CATEGORY_CHIPS = [
  { id: 'all', label: 'सर्व (All)' },
  { id: 'Grocery', label: '🛒 किराणा (Grocery)' },
  { id: 'Electronics', label: '📱 इलेक्ट्रॉनिक्स' },
  { id: 'Clothing', label: '👕 कपडे (Clothing)' },
  { id: 'Services', label: '🛠️ सेवा (Services)' },
  { id: 'Food', label: '🍔 खाद्यपदार्थ (Food)' },
  { id: 'Other', label: '✨ इतर' }
];

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  shops,
  onResultsChange,
  renderResults = false,
  placeholder = 'दुकान, श्रेणी, वस्तू किंवा सेवा शोधा... (उदा. किराणा, इलेक्ट्रॉनिक्स, कापड)',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Task 2 Logic: Filter approved shops by checking if search term exists in
  // shopName, category, items, OR description (case-insensitive)
  // Sorting: Sort filtered search results by the rating field in descending order (highest-rated first)
  const filteredAndSortedShops = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    // 1. Filter
    const filtered = shops.filter((shop) => {
      // Category filter check
      if (selectedCategory !== 'all' && shop.category !== selectedCategory) {
        return false;
      }

      // If search query is empty, it passes search filter
      if (!term) return true;

      // 1. shopName match
      const matchName = Boolean(shop.shopName && shop.shopName.toLowerCase().includes(term));

      // 2. category match
      const matchCategory = Boolean(shop.category && shop.category.toLowerCase().includes(term));

      // 3. items match (handles array of strings or comma-separated string)
      let matchItems = false;
      if (Array.isArray(shop.items)) {
        matchItems = shop.items.some((item) => typeof item === 'string' && item.toLowerCase().includes(term));
      } else if (typeof shop.items === 'string') {
        matchItems = shop.items.toLowerCase().includes(term);
      }

      // 4. description match
      const matchDescription = Boolean(shop.description && shop.description.toLowerCase().includes(term));

      // Returns true if search term exists in shopName, category, items, OR description
      return matchName || matchCategory || matchItems || matchDescription;
    });

    // 2. Sort: Sort by rating field in descending order (highest-rated shops appear first)
    const sorted = [...filtered].sort((a, b) => {
      const ratingA = typeof a.rating === 'number' ? a.rating : parseFloat(a.rating as any) || 0;
      const ratingB = typeof b.rating === 'number' ? b.rating : parseFloat(b.rating as any) || 0;
      return ratingB - ratingA;
    });

    return sorted;
  }, [shops, searchTerm, selectedCategory]);

  // Notify parent component of updated results
  useEffect(() => {
    if (onResultsChange) {
      onResultsChange(filteredAndSortedShops);
    }
  }, [filteredAndSortedShops, onResultsChange]);

  const handleClear = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  return (
    <div className={`w-full space-y-4 text-left ${className}`}>
      
      {/* Search Bar Input Container */}
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-brand-purple pointer-events-none">
            <SearchIcon size={20} />
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-200/80 dark:border-slate-800 rounded-2xl py-3.5 sm:py-4 pl-12 pr-28 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 shadow-lg shadow-brand-blue/5 transition-all"
          />

          <div className="absolute right-3 flex items-center gap-2">
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="शोध साफ करा (Clear)"
              >
                <X size={16} />
              </button>
            )}

            {/* Rating Sort Badge Indicator */}
            <div 
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-[11px] font-bold"
              title="रेटिंगनुसार क्रमवारी लावलेली आहे (Sorted by highest rating first)"
            >
              <ArrowUpDown size={11} className="text-amber-500" />
              <Star size={11} className="text-amber-500 fill-amber-500" />
              <span>रेटिंगनुसार</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-3xl mx-auto justify-start sm:justify-center">
        {CATEGORY_CHIPS.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-brand text-white shadow-sm scale-105'
                  : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Search & Result Count Info */}
      <div className="flex items-center justify-between max-w-3xl mx-auto px-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-brand-purple" />
          <span>
            {searchTerm ? (
              <>
                "<b>{searchTerm}</b>" साठी परिणाम: <span className="font-bold text-slate-800 dark:text-slate-200">{filteredAndSortedShops.length}</span> दुकाने
              </>
            ) : (
              <>
                एकूण नोंदणीकृत दुकाने: <span className="font-bold text-slate-800 dark:text-slate-200">{filteredAndSortedShops.length}</span>
              </>
            )}
          </span>
        </div>

        <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
          <Star size={12} className="fill-current" />
          <span>सर्वोच्च रेटिंग प्रथम (Highest Rated First)</span>
        </span>
      </div>

      {/* Optional In-Component Results Grid */}
      {renderResults && (
        <div className="pt-2">
          {filteredAndSortedShops.length === 0 ? (
            <div className="py-12 text-center glass-card border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
              <SearchIcon size={32} className="text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                कोणतेही दुकान सापडले नाही
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                कृपया वेगळे नाव, वस्तू किंवा श्रेणी टाकून पुन्हा शोधण्याचा प्रयत्न करा.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredAndSortedShops.map((shop) => (
                <UniversalCard
                  key={shop.id}
                  id={shop.id}
                  title={shop.shopName}
                  subtitle={shop.ownerName}
                  location={shop.address || 'शेवगाव'}
                  categoryBadge={shop.category}
                  categoryBadgeColor="bg-blue-50/95 dark:bg-blue-950/90 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  image={shop.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
                  phone={shop.mobileNumber}
                  whatsapp={shop.mobileNumber}
                  rating={shop.rating || 5.0}
                  whatsappMessage={`नमस्कार ${shop.shopName}, मी Shevgaon Market पोर्टलवरून संपर्क करत आहे.`}
                  showWhatsappInsteadOfDetails={true}
                  metaItems={[
                    { label: 'दुकानदार', value: shop.ownerName },
                    { 
                      label: 'वस्तू', 
                      value: Array.isArray(shop.items) 
                        ? shop.items.slice(0, 2).join(', ') 
                        : (shop.items || shop.address || 'शेवगाव').slice(0, 25) 
                    }
                  ]}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdvancedSearchBar;
