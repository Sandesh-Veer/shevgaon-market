import { Link } from 'react-router-dom';
import { ArrowLeft, Store, Sparkles } from 'lucide-react';
import AddShopForm from '../components/admin/AddShopForm';

export default function AddShopPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 text-left">
      
      {/* Top Back & Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-purple hover:text-brand-blue transition-colors"
        >
          <ArrowLeft size={16} />
          <span>मुख्य पानावर जा (Back to Home)</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Sparkles size={14} className="text-amber-500" />
          <span>शेवगाव मार्केटवर तुमचे दुकान मोफत जोडा</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-4">
        <div className="text-center space-y-2 max-w-lg mx-auto py-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-brand text-white flex items-center justify-center mx-auto shadow-lg">
            <Store size={28} />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            तुमचा व्यवसाय नोंदवा (Register Your Shop)
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            शेवगाव परिसरातील हजारो ग्राहकांपर्यंत तुमचे दुकान आणि सेवा पोहोचवण्यासाठी खालील सोपी माहिती भरा.
          </p>
        </div>

        {/* Reusable Mobile-Friendly AddShopForm Component */}
        <AddShopForm />
      </div>

    </div>
  );
}
