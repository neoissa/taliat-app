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
  emerald: {
    name: 'Emerald & Teal (Scouting & Outdoors)',
    text: 'text-emerald-500 dark:text-emerald-400',
    pillBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30',
    activePill: 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md shadow-emerald-500/25',
    activeText: 'text-emerald-600 dark:text-emerald-300 font-black',
    glow: 'ring-2 ring-emerald-400/40'
  },
  teal: {
    name: 'Teal & Cyan (Campcraft & Directory)',
    text: 'text-teal-500 dark:text-teal-400',
    pillBg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-500/30',
    activePill: 'bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950 shadow-md shadow-teal-500/25',
    activeText: 'text-teal-600 dark:text-teal-300 font-black',
    glow: 'ring-2 ring-teal-400/40'
  },
  amber: {
    name: 'Amber & Orange (Alerts, Tasks & Requests)',
    text: 'text-amber-500 dark:text-amber-400',
    pillBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/30',
    activePill: 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-black',
    activeText: 'text-amber-600 dark:text-amber-300 font-black',
    glow: 'ring-2 ring-amber-400/40'
  },
  indigo: {
    name: 'Indigo & Violet (Leadership & Management)',
    text: 'text-indigo-500 dark:text-indigo-400',
    pillBg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/30',
    activePill: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 font-black',
    activeText: 'text-indigo-600 dark:text-indigo-300 font-black',
    glow: 'ring-2 ring-indigo-400/40'
  },
  violet: {
    name: 'Violet & Purple (HQ & Administration)',
    text: 'text-violet-500 dark:text-violet-400',
    pillBg: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-500/30',
    activePill: 'bg-violet-600 text-white shadow-md shadow-violet-500/25 font-black',
    activeText: 'text-violet-600 dark:text-violet-300 font-black',
    glow: 'ring-2 ring-violet-400/40'
  },
  sky: {
    name: 'Sky Blue (Schedule & Calendar)',
    text: 'text-sky-500 dark:text-sky-400',
    pillBg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-500/30',
    activePill: 'bg-sky-500 text-slate-950 dark:text-slate-950 shadow-md shadow-sky-500/25 font-black',
    activeText: 'text-sky-600 dark:text-sky-300 font-black',
    glow: 'ring-2 ring-sky-400/40'
  },
  rose: {
    name: 'Rose & Coral (Urgent Broadcasts)',
    text: 'text-rose-500 dark:text-rose-400',
    pillBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/30',
    activePill: 'bg-rose-600 text-white shadow-md shadow-rose-500/25 font-black',
    activeText: 'text-rose-600 dark:text-rose-300 font-black',
    glow: 'ring-2 ring-rose-400/40'
  }
};

/**
 * Returns dynamic classes for an icon pill container based on theme and active state
 */
export function getIconTheme(themeKey = 'emerald', isActive = false) {
  const palette = THEME_PALETTES[themeKey] || THEME_PALETTES.emerald;
  if (isActive) {
    return {
      container: `${palette.activePill} ${palette.glow} scale-105 transition-all duration-200`,
      icon: 'text-inherit drop-shadow-sm',
      label: palette.activeText
    };
  }
  return {
    container: `${palette.pillBg} ${palette.text} hover:scale-105 transition-all duration-200`,
    icon: palette.text,
    label: 'text-slate-600 dark:text-slate-400 font-medium'
  };
}

/**
 * Categorized Icon Registry for Icon Pickers and Visual Categorization
 */
export const ICON_CATEGORIES = [
  {
    id: 'outdoors',
    name: 'Scouting & Outdoors',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40 border-emerald-500/30',
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
    color: 'text-amber-400',
    bg: 'bg-amber-950/40 border-amber-500/30',
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
    bg: 'bg-sky-950/40 border-sky-500/30',
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
    color: 'text-indigo-400',
    bg: 'bg-indigo-950/40 border-indigo-500/30',
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
    color: 'text-teal-400',
    bg: 'bg-teal-950/40 border-teal-500/30',
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
