import React from 'react';
import {
  // Scouting & Outdoors
  Tent,
  Compass,
  Flame,
  Mountain,
  Trees,
  Fish,
  Footprints,
  Navigation,
  MapPin,

  // Leadership & Management
  Shield,
  Award,
  CheckSquare,
  FileText,
  Users,
  Briefcase,
  History,
  Crown,
  Target,
  ShieldCheck,
  Inbox,

  // Communication & Alerts
  Bell,
  MessageSquare,
  Megaphone,
  Send,
  Radio,
  Bookmark,
  PhoneCall,
  Mail,

  // Academics & Tech
  BookOpen,
  Cpu,
  Code,
  Terminal,
  GraduationCap,
  CheckCircle,
  Book,

  // General & Controls
  Home,
  Calendar,
  Clock,
  Star,
  Sparkles,
  Layers,
  User,
  Settings,
  Sliders,
  GripVertical,
  Eye,
  EyeOff,
  RotateCcw,
  HelpCircle,
  Check,
  Plus,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown,
  Pin,
  PinOff,
  Search,
  ExternalLink,
  Lock,
  FolderOpen
} from 'lucide-react';

/**
 * Master dictionary mapping icon string keys to Lucide React components.
 */
export const ICON_MAP = {
  // Scouting & Outdoors
  Tent,
  Compass,
  Flame,
  Mountain,
  Trees,
  Fish,
  Footprints,
  Navigation,
  MapPin,

  // Leadership & Management
  Shield,
  Award,
  CheckSquare,
  FileText,
  Users,
  Briefcase,
  History,
  Crown,
  Target,
  ShieldCheck,
  Inbox,

  // Communication & Alerts
  Bell,
  MessageSquare,
  Megaphone,
  Send,
  Radio,
  Bookmark,
  PhoneCall,
  Mail,

  // Academics & Tech
  BookOpen,
  Cpu,
  Code,
  Terminal,
  GraduationCap,
  CheckCircle,
  Book,

  // General & Navigation
  Home,
  Calendar,
  Clock,
  Star,
  Sparkles,
  Layers,
  User,
  Settings,
  Sliders,
  GripVertical,
  Eye,
  EyeOff,
  RotateCcw,
  HelpCircle,
  Check,
  Plus,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown,
  Pin,
  PinOff,
  Search,
  ExternalLink,
  Lock,
  FolderOpen
};

/**
 * Vibrant Theme Color Palettes for Role Navigation & UI Badges
 */
export const THEME_PALETTES = {
  sky: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  emerald: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  teal: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  amber: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  yellow: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  orange: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  indigo: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  purple: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  violet: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  blue: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  lime: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  fuchsia: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  rose: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  },
  cyan: {
    name: 'Ocean Sky (Light Blue, Dark Blue & White)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/30 dark:border-sky-500/30',
    hoverBg: 'group-hover:bg-sky-500/20 group-hover:border-sky-500/50',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-950/50 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.35)]'
  }
};

/**
 * Returns dynamic classes for an icon pill container based on theme and active state
 */
export function getIconTheme(themeKey = 'sky', isActive = false) {
  const palette = THEME_PALETTES.sky;
  if (isActive) {
    return {
      container: `${palette.activePill} ${palette.glow} scale-105 transition-all duration-200`,
      icon: 'text-inherit drop-shadow-sm',
      label: 'text-sky-300 font-extrabold'
    };
  }
  return {
    container: `${palette.pillBg} ${palette.border} ${palette.text} hover:scale-105 transition-all duration-200`,
    icon: palette.icon || palette.text,
    label: 'text-slate-400 font-medium'
  };
}

/**
 * Tab ID to Theme Mapping Dictionary
 */
const TAB_ID_THEME_MAP = {
  'home': 'sky',
  'admin': 'sky',
  'global-admin': 'sky',
  'merit-badges': 'sky',
  'road-to-eagle': 'sky',
  'assignments': 'sky',
  'events': 'sky',
  'journal': 'sky',
  'islamic': 'sky',
  'chat': 'sky',
  'resources': 'sky',
  'profile': 'sky',
  'roster': 'sky',
  'attendance': 'sky',
  'scouts': 'sky',
  'advancement': 'sky',
  'reports': 'sky',
  'lesson-plans': 'sky',
  'feed': 'sky',
  'scouts-hub': 'sky',
  'advancement-hub': 'sky',
  'events-hub': 'sky',
  'comm-hub': 'sky',
  'communication-hub': 'sky',
  'knowledge-hub': 'sky',
  'patrol-hub': 'sky',
  'homework': 'sky',
  'notes': 'sky',
  'admin-hub': 'sky',
  'counselors': 'sky',
  'parent-requests': 'sky'
};

/**
 * Icon Name to Theme Fallback Mapping - All standard icons use the unified Light Blue palette
 */
const ICON_THEME_MAP = {
  // All icons default to the unified sky theme
  'Crown': 'sky',
  'Star': 'sky',
  'Award': 'sky',
  'Shield': 'sky',
  'ShieldCheck': 'sky',
  'Inbox': 'sky',
  'Users': 'sky',
  'CheckSquare': 'sky',
  'FileText': 'sky',
  'Briefcase': 'sky',
  'History': 'sky',
  'Target': 'sky',
  'Mountain': 'sky',
  'Compass': 'sky',
  'Tent': 'sky',
  'Flame': 'sky',
  'Trees': 'sky',
  'Fish': 'sky',
  'Footprints': 'sky',
  'Navigation': 'sky',
  'MapPin': 'sky',
  'BookOpen': 'sky',
  'Book': 'sky',
  'GraduationCap': 'sky',
  'Sparkles': 'sky',
  'CheckCircle': 'sky',
  'Cpu': 'sky',
  'Code': 'sky',
  'Terminal': 'sky',
  'Bell': 'sky',
  'Megaphone': 'sky',
  'MessageSquare': 'sky',
  'Send': 'sky',
  'Radio': 'sky',
  'Bookmark': 'sky',
  'Mail': 'sky',
  'PhoneCall': 'sky',
  'Home': 'sky',
  'Calendar': 'sky',
  'Clock': 'sky',
  'User': 'sky',
  'Settings': 'sky',
  'Sliders': 'sky'
};

/**
 * Resolves full color palette and style classes for any navigation tab or icon.
 */
export function getNavItemColorTheme(tabItem, isActive = false, isOwner = false) {
  return THEME_PALETTES.sky;
}

/**
 * Categorized Icon Registry for Icon Pickers and Visual Categorization
 */
export const ICON_CATEGORIES = [
  {
    id: 'outdoors',
    name: 'Scouting & Outdoors',
    color: 'text-sky-400',
    bg: 'bg-slate-900 border-sky-500/30',
    icons: [
      { id: 'Tent', label: 'Tent / Camping' },
      { id: 'Compass', label: 'Compass / Orienteering' },
      { id: 'Flame', label: 'Campfire / Survival' },
      { id: 'Mountain', label: 'Mountain / Hiking' },
      { id: 'Trees', label: 'Trees / Nature' },
      { id: 'Fish', label: 'Fish / Angling' },
      { id: 'Footprints', label: 'Footprints / Tracking' },
      { id: 'Navigation', label: 'Navigation' },
      { id: 'MapPin', label: 'Location Pin' }
    ]
  },
  {
    id: 'leadership',
    name: 'Leadership & Management',
    color: 'text-sky-400',
    bg: 'bg-slate-900 border-sky-500/30',
    icons: [
      { id: 'Crown', label: 'Crown / Owner' },
      { id: 'Shield', label: 'Shield / Leader' },
      { id: 'ShieldCheck', label: 'Verified Shield' },
      { id: 'Award', label: 'Award / Ranks' },
      { id: 'CheckSquare', label: 'Attendance / Tasks' },
      { id: 'FileText', label: 'Reports / Docs' },
      { id: 'Users', label: 'Troop / Patrol Roster' },
      { id: 'Briefcase', label: 'Administration' },
      { id: 'History', label: 'Audit / History' },
      { id: 'Target', label: 'Goals / Standards' },
      { id: 'Inbox', label: 'Inbox / Parent Requests' }
    ]
  },
  {
    id: 'communication',
    name: 'Communication & Alerts',
    color: 'text-sky-400',
    bg: 'bg-slate-900 border-sky-500/30',
    icons: [
      { id: 'Bell', label: 'Alerts & Feed' },
      { id: 'MessageSquare', label: 'Patrol Chat' },
      { id: 'Megaphone', label: 'Broadcasts' },
      { id: 'Send', label: 'Direct Messages' },
      { id: 'Radio', label: 'Radio / Comms' },
      { id: 'Bookmark', label: 'Saved / Notes' },
      { id: 'Mail', label: 'Mail / Requests' },
      { id: 'PhoneCall', label: 'Emergency Contacts' }
    ]
  },
  {
    id: 'academics',
    name: 'Academics & Technology',
    color: 'text-sky-400',
    bg: 'bg-slate-900 border-sky-500/30',
    icons: [
      { id: 'BookOpen', label: 'Homework / Lessons' },
      { id: 'Book', label: 'Islamic Knowledge / Manual' },
      { id: 'GraduationCap', label: 'Education / Merit' },
      { id: 'CheckCircle', label: 'Passed / Completed' },
      { id: 'Cpu', label: 'Robotics / STEM' },
      { id: 'Code', label: 'Programming' },
      { id: 'Terminal', label: 'Console / Tech' }
    ]
  },
  {
    id: 'navigation',
    name: 'Navigation & Core',
    color: 'text-sky-400',
    bg: 'bg-slate-900 border-sky-500/30',
    icons: [
      { id: 'Home', label: 'Home Hub' },
      { id: 'Calendar', label: 'Calendar / Events' },
      { id: 'Clock', label: 'Live Clock' },
      { id: 'Star', label: 'Favorites / Eagle' },
      { id: 'Sparkles', label: 'Special / Islamic' },
      { id: 'Layers', label: 'Modules' },
      { id: 'User', label: 'Profile' },
      { id: 'Settings', label: 'Settings' },
      { id: 'Sliders', label: 'Customization' }
    ]
  }
];

/**
 * Flattened list of all available selectable icons
 */
export const ALL_AVAILABLE_ICONS = ICON_CATEGORIES.flatMap(cat => cat.icons);

/**
 * Resolve an icon component safely from name string or fallback
 */
export function getIconComponent(name) {
  if (!name) return HelpCircle;
  
  // Direct match in registry
  if (ICON_MAP[name]) return ICON_MAP[name];

  // Case-insensitive match
  const lower = String(name).toLowerCase();
  const matchedKey = Object.keys(ICON_MAP).find(k => k.toLowerCase() === lower);
  if (matchedKey) return ICON_MAP[matchedKey];

  return HelpCircle;
}

/**
 * Mapping of common legacy emojis to standard Lucide icon names
 */
export const EMOJI_TO_LUCIDE_MAP = {
  '🏠': 'Home',
  '⚡': 'Shield',
  '👥': 'Users',
  '📋': 'CheckSquare',
  '📊': 'Award',
  '🏅': 'Award',
  '📈': 'FileText',
  '🦅': 'Mountain',
  '🎒': 'BookOpen',
  '📅': 'Calendar',
  '📝': 'Bookmark',
  '🕌': 'Sparkles',
  '💬': 'MessageSquare',
  '📚': 'Book',
  '👤': 'User',
  '🔔': 'Bell',
  '⚜️': 'Compass',
  '🏕️': 'Tent',
  '🔥': 'Flame',
  '👑': 'Crown',
  '👨‍👩‍👧': 'Users',
  '⚙️': 'Settings',
  '📥': 'Inbox',
  '📢': 'Megaphone'
};

/**
 * Safely resolves an icon string (whether Lucide name, emoji, or custom key)
 */
export function resolveIconName(iconStr, defaultFallback = 'Home') {
  if (!iconStr) return defaultFallback;
  if (ICON_MAP[iconStr]) return iconStr;
  if (EMOJI_TO_LUCIDE_MAP[iconStr]) return EMOJI_TO_LUCIDE_MAP[iconStr];
  return defaultFallback;
}
