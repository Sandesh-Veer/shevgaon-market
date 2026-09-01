import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'call' | 'details' | 'danger' | 'whatsapp';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export const getButtonClasses = (
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  fullWidth = false,
  className = ''
): string => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'min-h-[34px] px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'min-h-[40px] px-4 py-2 text-xs sm:text-sm rounded-xl gap-2',
    lg: 'min-h-[48px] px-6 py-3 text-sm sm:text-base rounded-2xl gap-2.5',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    // 1. Primary: Solid Brand Gradient filled
    primary: 'bg-gradient-brand text-white shadow-sm hover:shadow-md hover:shadow-brand-blue/20 hover:brightness-105 border border-transparent',
    
    // 2. Secondary: Interactive bordered with light background
    secondary: 'border-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs',
    
    // 3. Ghost: Transparent background with subtle hover
    ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-transparent',
    
    // 4. Call (Primary Action): Globally consistent Solid Emerald Green
    call: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold shadow-sm shadow-emerald-600/25 border border-transparent',
    
    // 5. Details (Secondary Action): Highly interactive thickened border with purple tint
    details: 'border-2 border-brand-purple/40 hover:border-brand-purple bg-brand-purple/5 hover:bg-brand-purple/10 text-brand-purple dark:text-purple-300 dark:border-purple-500/40 dark:hover:border-purple-400 shadow-xs',
    
    // Danger
    danger: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-sm border border-transparent',
    
    // WhatsApp
    whatsapp: 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-500/25 border border-transparent',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`.trim();
};

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      href,
      target,
      rel,
      className = '',
      children,
      ...rest
    },
    ref
  ) => {
    const classes = getButtonClasses(variant, size, fullWidth, className);
    const iconSize = size === 'sm' ? 13 : size === 'lg' ? 18 : 15;

    const content = (
      <>
        {Icon && iconPosition === 'left' && <Icon size={iconSize} className="shrink-0" />}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && <Icon size={iconSize} className="shrink-0" />}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
          className={classes}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...rest}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
