import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Star, MessageSquare } from 'lucide-react';
import Button from './Button';

export interface CardMetaItem {
  label?: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  highlight?: boolean;
}

export interface UniversalCardProps {
  id: string;
  title: string;
  subtitle?: string;
  categoryBadge?: string;
  categoryBadgeColor?: string;
  statusBadge?: string;
  statusBadgeColor?: string;
  image?: string;
  location?: string;
  rating?: number;
  reviewsCount?: number;
  phone?: string;
  whatsapp?: string;
  whatsappMessage?: string;
  metaItems?: CardMetaItem[];
  extraContent?: React.ReactNode;
  detailsPath?: string;
  detailsLabel?: string;
  onCardClick?: () => void;
  onDetailsClick?: () => void;
  callLabel?: string;
  showWhatsappInsteadOfDetails?: boolean;
  className?: string;
}

export const UniversalCard: React.FC<UniversalCardProps> = ({
  id,
  title,
  subtitle,
  categoryBadge,
  categoryBadgeColor = 'bg-white/95 dark:bg-slate-900/90 text-brand-purple border border-white/60 dark:border-slate-700',
  statusBadge,
  statusBadgeColor = 'bg-rose-500 text-white',
  image = 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=400&q=80',
  location,
  rating,
  reviewsCount,
  phone,
  whatsapp,
  whatsappMessage,
  metaItems = [],
  extraContent,
  detailsPath,
  detailsLabel = 'तपशील',
  onCardClick,
  onDetailsClick,
  callLabel = 'कॉल',
  showWhatsappInsteadOfDetails = false,
  className = '',
}) => {
  const handlePrimaryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSecondaryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDetailsClick) {
      onDetailsClick();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      onClick={onCardClick}
      className={`glass-card border border-white/80 dark:border-slate-800/80 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between group hover:shadow-soft hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md ${className}`}
    >
      <div className="space-y-3">
        {/* Unified Aspect Ratio Image Container (16/10) */}
        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-gray-100/80 dark:border-slate-700/60 shadow-inner">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Floating Category Badge */}
          {categoryBadge && (
            <span
              className={`absolute top-2 left-2 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs tracking-tight ${categoryBadgeColor}`}
            >
              {categoryBadge}
            </span>
          )}

          {/* Floating Status / Discount Badge */}
          {statusBadge && (
            <span
              className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${statusBadgeColor}`}
            >
              {statusBadge}
            </span>
          )}
        </div>

        {/* Card Body Information */}
        <div className="px-0.5 space-y-1.5 text-left">
          {/* Top meta row: Subtitle / Location / Rating */}
          <div className="flex justify-between items-center text-xs text-brand-muted dark:text-slate-400 gap-2">
            {subtitle ? (
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                {subtitle}
              </span>
            ) : location ? (
              <span className="flex items-center gap-0.5 text-brand-muted dark:text-slate-400 truncate">
                <MapPin size={12} className="shrink-0 text-brand-purple" />
                {location}
              </span>
            ) : (
              <span />
            )}

            {/* Rating / Location on right */}
            {typeof rating === 'number' && rating > 0 ? (
              <div className="flex items-center gap-1 shrink-0 font-bold text-slate-800 dark:text-slate-200 text-xs">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span>{rating.toFixed(1)}</span>
                {typeof reviewsCount === 'number' && (
                  <span className="text-brand-muted dark:text-slate-400 font-normal">
                    ({reviewsCount})
                  </span>
                )}
              </div>
            ) : location && subtitle ? (
              <span className="flex items-center gap-0.5 text-brand-muted dark:text-slate-400 shrink-0 text-xs">
                <MapPin size={11} className="shrink-0 text-slate-400" />
                {location}
              </span>
            ) : null}
          </div>

          {/* Card Title */}
          <h3 className="font-bold text-brand-dark dark:text-white text-sm sm:text-base line-clamp-1 group-hover:text-brand-purple transition-colors">
            {title}
          </h3>

          {/* Dynamic Meta Key-Value Rows */}
          {metaItems.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-gray-100/80 dark:border-slate-800/80 text-xs">
              {metaItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1 ${
                    item.highlight
                      ? 'font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-mono'
                      : 'text-brand-muted dark:text-slate-400 text-xs font-normal'
                  }`}
                >
                  {item.icon}
                  {item.label && <span className="font-medium text-slate-500 dark:text-slate-400">{item.label}:</span>}
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Extra Custom Content (e.g. countdown, today's special, emergency tag) */}
          {extraContent}
        </div>
      </div>

      {/* Standardized Action Footer */}
      <div
        className="grid grid-cols-2 gap-2 mt-3.5 pt-2.5 border-t border-gray-100/80 dark:border-slate-800/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Primary Action: Globally Consistent Solid Green Call Button */}
        {phone ? (
          <Button
            variant="call"
            size="md"
            icon={Phone}
            href={`tel:${phone}`}
            onClick={handlePrimaryClick}
            fullWidth
          >
            {callLabel}
          </Button>
        ) : (
          <Button
            variant="call"
            size="md"
            icon={Phone}
            onClick={handlePrimaryClick}
            fullWidth
          >
            {callLabel}
          </Button>
        )}

        {/* 2. Secondary Action: Interactive Details Button (or WhatsApp) */}
        {showWhatsappInsteadOfDetails && (whatsapp || phone) ? (
          <Button
            variant="whatsapp"
            size="md"
            href={`https://wa.me/${whatsapp || phone}?text=${encodeURIComponent(
              whatsappMessage || `नमस्कार, मला तुमच्या ${title} बद्दल माहिती हवी आहे.`
            )}`}
            target="_blank"
            rel="noreferrer"
            onClick={handleSecondaryClick}
            fullWidth
          >
            WhatsApp
          </Button>
        ) : detailsPath ? (
          <Button
            variant="details"
            size="md"
            href={detailsPath}
            onClick={handleSecondaryClick}
            fullWidth
          >
            {detailsLabel}
          </Button>
        ) : (
          <Button
            variant="details"
            size="md"
            onClick={handleSecondaryClick}
            fullWidth
          >
            {detailsLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default UniversalCard;
