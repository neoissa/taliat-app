import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, AlertCircle, Info, Shield, Award, Sparkles, Check, X } from 'lucide-react';

const STATUS_VARIANTS = {
  success: {
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    DefaultIcon: CheckCircle2
  },
  completed: {
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    DefaultIcon: CheckCircle2
  },
  warning: {
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60',
    iconColor: 'text-amber-600 dark:text-amber-400',
    DefaultIcon: AlertTriangle
  },
  pending: {
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60',
    iconColor: 'text-amber-600 dark:text-amber-400',
    DefaultIcon: Clock
  },
  in_review: {
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60',
    iconColor: 'text-blue-600 dark:text-blue-400',
    DefaultIcon: Clock
  },
  info: {
    badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/60',
    iconColor: 'text-sky-600 dark:text-sky-400',
    DefaultIcon: Info
  },
  danger: {
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60',
    iconColor: 'text-rose-600 dark:text-rose-400',
    DefaultIcon: AlertCircle
  },
  overdue: {
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60',
    iconColor: 'text-rose-600 dark:text-rose-400',
    DefaultIcon: AlertCircle
  },
  indigo: {
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/60',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    DefaultIcon: Shield
  },
  purple: {
    badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200/60 dark:border-purple-800/60',
    iconColor: 'text-purple-600 dark:text-purple-400',
    DefaultIcon: Sparkles
  },
  neutral: {
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    iconColor: 'text-slate-500 dark:text-slate-400',
    DefaultIcon: Info
  }
};

const SIZE_VARIANTS = {
  xs: 'text-[10px] px-2 py-0.5 gap-1',
  sm: 'text-xs px-2.5 py-1 gap-1.5',
  md: 'text-sm px-3 py-1.5 gap-2'
};

const ICON_SIZES = {
  xs: 11,
  sm: 13,
  md: 15
};

export default function StatusBadge({
  type = 'neutral',
  label,
  children,
  icon: CustomIcon,
  showIcon = true,
  size = 'sm',
  className = '',
  pill = true,
  pulse = false
}) {
  const variant = STATUS_VARIANTS[type] || STATUS_VARIANTS.neutral;
  const sizeStyle = SIZE_VARIANTS[size] || SIZE_VARIANTS.sm;
  const iconSize = ICON_SIZES[size] || 13;
  const IconComponent = CustomIcon || (showIcon ? variant.DefaultIcon : null);
  const textContent = label || children;

  return (
    <span
      className={`inline-flex items-center font-bold tracking-tight border transition-colors duration-150 ${
        pill ? 'rounded-full' : 'rounded-lg'
      } ${variant.badge} ${sizeStyle} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 mr-0.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${variant.iconColor} bg-current`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${variant.iconColor} bg-current`} />
        </span>
      )}
      {IconComponent && !pulse && (
        <IconComponent size={iconSize} className={`shrink-0 ${variant.iconColor}`} />
      )}
      {textContent && <span className="truncate">{textContent}</span>}
    </span>
  );
}
