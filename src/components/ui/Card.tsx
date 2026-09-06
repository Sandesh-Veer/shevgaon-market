import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Section sub-header displayed above the card group (e.g., "Account", "Categories") */
  sectionTitle?: string;
  /** Optional secondary text or count in the sub-header */
  sectionSubtitle?: string;
  /** Optional action in the sub-header (e.g., "View All") */
  sectionAction?: React.ReactNode;
  /** Card padding: 'none' | 'sm' | 'md' | 'lg' (default: 'md' -> p-4 sm:p-5) */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Border radius: '2xl' | '3xl' (default: '2xl') */
  rounded?: '2xl' | '3xl';
  /** Soft floating elevation shadow */
  elevated?: boolean;
  /** Custom wrapper class (for outer container when sectionTitle is used) */
  containerClassName?: string;
}

/**
 * Generic modern Container Card matching Apple Settings / GPay aesthetics:
 * - bg-white (with dark:bg-slate-900)
 * - rounded-2xl or rounded-3xl
 * - soft drop shadows (shadow-sm or shadow-[0_2px_10px_rgba(0,0,0,0.05)])
 * - generous padding (p-4 or p-5)
 * - uppercase muted section sub-header
 */
export const Card: React.FC<CardProps> = ({
  children,
  sectionTitle,
  sectionSubtitle,
  sectionAction,
  padding = 'md',
  rounded = '2xl',
  elevated = true,
  className = '',
  containerClassName = '',
  ...rest
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  }[padding];

  const roundedClasses = {
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  }[rounded];

  const shadowClasses = elevated
    ? 'shadow-sm shadow-slate-200/50 dark:shadow-none hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow duration-300'
    : '';

  const cardContent = (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800/80 ${roundedClasses} ${shadowClasses} ${paddingClasses} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );

  if (!sectionTitle) {
    return cardContent;
  }

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {/* Apple / GPay style section sub-header */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            {sectionTitle}
          </span>
          {sectionSubtitle && (
            <span className="text-[11px] text-slate-400 font-normal">
              {sectionSubtitle}
            </span>
          )}
        </div>
        {sectionAction && (
          <div className="text-xs font-medium text-brand-blue hover:underline cursor-pointer">
            {sectionAction}
          </div>
        )}
      </div>
      {cardContent}
    </div>
  );
};

export interface CardRowProps {
  /** Leading icon component */
  icon?: React.ReactNode;
  /** Custom background color class for the icon wrapper (defaults to bg-gray-100) */
  iconBgColor?: string;
  /** Primary label text */
  title: React.ReactNode;
  /** Optional secondary subtitle or description */
  subtitle?: React.ReactNode;
  /** Trailing value, badge, or custom element */
  value?: React.ReactNode;
  /** Whether to show chevron arrow at the right (defaults to true if onClick is provided) */
  showChevron?: boolean;
  /** Whether this row is interactive/clickable */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Destructive styling (e.g. Delete, Logout) */
  destructive?: boolean;
  /** Optional custom class */
  className?: string;
}

/**
 * Modern Apple Settings / GPay row item:
 * - Icon wrapped in bg-gray-100 p-2 rounded-full with consistent stroke width
 * - Clear title & muted subtitle
 * - Trailing badge, switch, or chevron
 * - Micro-interaction active feedback
 */
export const CardRow: React.FC<CardRowProps> = ({
  icon,
  iconBgColor = 'bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  title,
  subtitle,
  value,
  showChevron,
  onClick,
  disabled = false,
  destructive = false,
  className = '',
}) => {
  const isClickable = !!onClick && !disabled;
  const renderChevron = showChevron ?? isClickable;

  const content = (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`w-full flex items-center justify-between gap-3.5 py-3 px-1 transition-all duration-200 select-none ${
        isClickable
          ? 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 active:scale-[0.99] rounded-xl px-2.5 -mx-1'
          : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {/* Left section: Icon + Title/Subtitle */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {icon && (
          <div
            className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-transform ${iconBgColor}`}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1 text-left">
          <div
            className={`text-sm font-semibold truncate ${
              destructive
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5 font-normal">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Right section: Value / Badge + Chevron */}
      <div className="flex items-center gap-2 shrink-0">
        {value && (
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {value}
          </div>
        )}
        {renderChevron && (
          <ChevronRight
            size={16}
            strokeWidth={2}
            className="text-slate-300 dark:text-slate-600 shrink-0"
          />
        )}
      </div>
    </div>
  );

  return content;
};

/**
 * Helper divider to place between CardRows with optional inset matching the icon width
 */
export const CardDivider: React.FC<{ inset?: boolean }> = ({ inset = true }) => {
  return (
    <div
      className={`h-px bg-slate-100 dark:bg-slate-800/80 ${
        inset ? 'ml-[52px]' : ''
      }`}
    />
  );
};

export default Card;
