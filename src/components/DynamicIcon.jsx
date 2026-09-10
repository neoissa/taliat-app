import React from 'react';
import { getIconComponent, EMOJI_TO_LUCIDE_MAP, ICON_MAP } from '../utils/IconRegistry';
import { HelpCircle } from 'lucide-react';

/**
 * DynamicIcon safely renders an icon by name string, emoji, or Lucide key.
 * 
 * Usage:
 * <DynamicIcon name="Tent" className="w-5 h-5 text-emerald-400" />
 * <DynamicIcon name="⛺" size={20} className="text-amber-300" />
 */
export default function DynamicIcon({
  name,
  size = 18,
  className = '',
  fallback = 'HelpCircle',
  ...props
}) {
  if (!name) {
    const FallbackComponent = ICON_MAP[fallback] || HelpCircle;
    return <FallbackComponent size={size} className={className} {...props} />;
  }

  // If name is already a React component / element
  if (typeof name === 'function') {
    const CustomComponent = name;
    return <CustomComponent size={size} className={className} {...props} />;
  }

  if (React.isValidElement(name)) {
    return name;
  }

  // If name is a known emoji, map it to a Lucide icon
  if (typeof name === 'string' && EMOJI_TO_LUCIDE_MAP[name]) {
    const mappedName = EMOJI_TO_LUCIDE_MAP[name];
    const LucideComp = ICON_MAP[mappedName] || HelpCircle;
    return <LucideComp size={size} className={className} {...props} />;
  }

  // Check if it's a character or emoji not in map (e.g. Arabic, multi-byte emoji)
  if (typeof name === 'string' && name.length <= 4 && !ICON_MAP[name]) {
    // Check if it's raw emoji
    const isEmoji = /\p{Extended_Pictographic}/u.test(name);
    if (isEmoji) {
      return (
        <span 
          style={{ fontSize: `${size}px`, lineHeight: 1 }} 
          className={`inline-flex items-center justify-center select-none ${className}`}
          role="img"
          aria-label="icon"
        >
          {name}
        </span>
      );
    }
  }

  // Resolve Lucide Component
  const Component = getIconComponent(name);
  if (Component && Component !== HelpCircle) {
    return <Component size={size} className={className} {...props} />;
  }

  // Try Fallback Component
  const FallbackComponent = ICON_MAP[fallback] || HelpCircle;
  return <FallbackComponent size={size} className={className} {...props} />;
}
