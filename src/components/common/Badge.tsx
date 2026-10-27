import React from 'react';
import { DietaryLabel } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  label?: DietaryLabel | string;
  variant?: 'vegan' | 'vegetarian' | 'gluten-free' | 'dairy-free' | 'high-protein' | 'keto' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  label,
  variant,
  size = 'sm',
  className = '',
}) => {
  const content = children || label;
  const determinedVariant = variant || (typeof label === 'string' ? label.toLowerCase() : 'default');

  const variantStyles: Record<string, string> = {
    vegan: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
    vegetarian: 'bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-300 border border-green-300 dark:border-green-800',
    'gluten-free': 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800',
    'dairy-free': 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-300 dark:border-sky-800',
    'high-protein': 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-300 dark:border-orange-800',
    keto: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300 dark:border-purple-800',
    'low-carb': 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800',
    default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium rounded-full',
    md: 'text-xs px-3 py-1 font-medium rounded-full',
  };

  const chosenStyle = variantStyles[determinedVariant] || variantStyles.default;

  return (
    <span className={`inline-flex items-center gap-1 ${chosenStyle} ${sizeStyles[size]} ${className}`}>
      {content}
    </span>
  );
};
