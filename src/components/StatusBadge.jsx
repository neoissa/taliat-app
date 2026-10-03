import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, AlertCircle, Info, Shield, Award, Sparkles, Check, X } from 'lucide-react';

const STATUS_VARIANTS = {
  success: {
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    iconColor: 'text-sky-400',
    DefaultIcon: CheckCircle2
  },
  completed: {
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    iconColor: 'text-sky-400',
    DefaultIcon: CheckCircle2
  },
  warning: {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    iconColor: 'text-amber-400',
    DefaultIcon: AlertTriangle
  },
  pending: {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    iconColor: 'text-amber-400',
    DefaultIcon: Clock
  },
  in_review: {
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    iconColor: 'text-sky-400',
    DefaultIcon: Clock
  },
  info: {
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    iconColor: 'text-sky-400',
    DefaultIcon: Info
  },
  danger: {
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    iconColor: 'text-rose-400',
    DefaultIcon: AlertCircle
  },
  overdue: {
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    iconColor: 'text-rose-400',
    DefaultIcon: AlertCircle
  },
  indigo: {
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    iconColor: 'text-sky-400',
    DefaultIcon: Shield
  },
  purple: {
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    iconColor: 'text-sky-400',
    DefaultIcon: Sparkles
  },
  neutral: {
    badge: 'bg-slate-800/90 text-slate-200 border-slate-700',
    iconColor: 'text-sky-400',
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
