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
    name: 'Emerald & Forest (Scouting & Outdoors)',
    text: 'text-emerald-400',
    icon: 'text-emerald-400',
    pillBg: 'bg-emerald-500/15 dark:bg-emerald-500/15',
    border: 'border-emerald-500/35 dark:border-emerald-500/40',
    hoverBg: 'group-hover:bg-emerald-500/25 group-hover:border-emerald-500/60',
    activePill: 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-emerald-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]'
  },
  teal: {
    name: 'Teal & Cyan (Campcraft & Directory)',
    text: 'text-teal-400',
    icon: 'text-teal-400',
    pillBg: 'bg-teal-500/15 dark:bg-teal-500/15',
    border: 'border-teal-500/35 dark:border-teal-500/40',
    hoverBg: 'group-hover:bg-teal-500/25 group-hover:border-teal-500/60',
    activePill: 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-teal-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(20,184,166,0.4)]'
  },
  amber: {
    name: 'Amber & Gold (Executive, Badges & Owner)',
    text: 'text-amber-400',
    icon: 'text-amber-400',
    pillBg: 'bg-amber-500/15 dark:bg-amber-500/15',
    border: 'border-amber-500/35 dark:border-amber-500/40',
    hoverBg: 'group-hover:bg-amber-500/25 group-hover:border-amber-500/60',
    activePill: 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-amber-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]'
  },
  yellow: {
    name: 'Warm Gold & Yellow (Journal & Notes)',
    text: 'text-yellow-400',
    icon: 'text-yellow-300',
    pillBg: 'bg-yellow-500/15 dark:bg-yellow-500/15',
    border: 'border-yellow-500/35 dark:border-yellow-500/40',
    hoverBg: 'group-hover:bg-yellow-500/25 group-hover:border-yellow-500/60',
    activePill: 'bg-yellow-400 text-slate-950 shadow-md shadow-yellow-500/30 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-yellow-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(234,179,8,0.4)]'
  },
  orange: {
    name: 'Vivid Orange & Coral (Homework & Tasks)',
    text: 'text-orange-400',
    icon: 'text-orange-400',
    pillBg: 'bg-orange-500/15 dark:bg-orange-500/15',
    border: 'border-orange-500/35 dark:border-orange-500/40',
    hoverBg: 'group-hover:bg-orange-500/25 group-hover:border-orange-500/60',
    activePill: 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/30 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-orange-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(249,115,22,0.4)]'
  },
  indigo: {
    name: 'Electric Indigo (Patrol Messenger)',
    text: 'text-indigo-400',
    icon: 'text-indigo-400',
    pillBg: 'bg-indigo-500/15 dark:bg-indigo-500/15',
    border: 'border-indigo-500/35 dark:border-indigo-500/40',
    hoverBg: 'group-hover:bg-indigo-500/25 group-hover:border-indigo-500/60',
    activePill: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 font-black',
    activeIcon: 'text-white',
    activeText: 'text-indigo-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(99,102,241,0.4)]'
  },
  purple: {
    name: 'Purple & Violet (Islamic Knowledge)',
    text: 'text-purple-400',
    icon: 'text-purple-400',
    pillBg: 'bg-purple-500/15 dark:bg-purple-500/15',
    border: 'border-purple-500/35 dark:border-purple-500/40',
    hoverBg: 'group-hover:bg-purple-500/25 group-hover:border-purple-500/60',
    activePill: 'bg-purple-600 text-white shadow-md shadow-purple-500/30 font-black',
    activeIcon: 'text-white',
    activeText: 'text-purple-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.4)]'
  },
  violet: {
    name: 'Violet (HQ & Executive)',
    text: 'text-violet-400',
    icon: 'text-violet-400',
    pillBg: 'bg-violet-500/15 dark:bg-violet-500/15',
    border: 'border-violet-500/35 dark:border-violet-500/40',
    hoverBg: 'group-hover:bg-violet-500/25 group-hover:border-violet-500/60',
    activePill: 'bg-violet-600 text-white shadow-md shadow-violet-500/30 font-black',
    activeIcon: 'text-white',
    activeText: 'text-violet-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.4)]'
  },
  sky: {
    name: 'Sky Blue (Troop Calendar & Reports)',
    text: 'text-sky-400',
    icon: 'text-sky-400',
    pillBg: 'bg-sky-500/15 dark:bg-sky-500/15',
    border: 'border-sky-500/35 dark:border-sky-500/40',
    hoverBg: 'group-hover:bg-sky-500/25 group-hover:border-sky-500/60',
    activePill: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-sky-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(14,165,233,0.4)]'
  },
  blue: {
    name: 'Royal Blue (Patrol Roster & Directory)',
    text: 'text-blue-400',
    icon: 'text-blue-400',
    pillBg: 'bg-blue-500/15 dark:bg-blue-500/15',
    border: 'border-blue-500/35 dark:border-blue-500/40',
    hoverBg: 'group-hover:bg-blue-500/25 group-hover:border-blue-500/60',
    activePill: 'bg-blue-600 text-white shadow-md shadow-blue-500/30 font-black',
    activeIcon: 'text-white',
    activeText: 'text-blue-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.4)]'
  },
  lime: {
    name: 'Lime & Emerald (Attendance & Lessons)',
    text: 'text-lime-400',
    icon: 'text-lime-400',
    pillBg: 'bg-lime-500/15 dark:bg-lime-500/15',
    border: 'border-lime-500/35 dark:border-lime-500/40',
    hoverBg: 'group-hover:bg-lime-500/25 group-hover:border-lime-500/60',
    activePill: 'bg-lime-500 text-slate-950 shadow-md shadow-lime-500/30 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-lime-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(132,204,22,0.4)]'
  },
  fuchsia: {
    name: 'Fuchsia & Pink (Advancement & Awards)',
    text: 'text-fuchsia-400',
    icon: 'text-fuchsia-400',
    pillBg: 'bg-fuchsia-500/15 dark:bg-fuchsia-500/15',
    border: 'border-fuchsia-500/35 dark:border-fuchsia-500/40',
    hoverBg: 'group-hover:bg-fuchsia-500/25 group-hover:border-fuchsia-500/60',
    activePill: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/30 font-black',
    activeIcon: 'text-white',
    activeText: 'text-fuchsia-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(217,70,239,0.4)]'
  },
  rose: {
    name: 'Rose & Coral (Alerts, Broadcasts & Profile)',
    text: 'text-rose-400',
    icon: 'text-rose-400',
    pillBg: 'bg-rose-500/15 dark:bg-rose-500/15',
    border: 'border-rose-500/35 dark:border-rose-500/40',
    hoverBg: 'group-hover:bg-rose-500/25 group-hover:border-rose-500/60',
    activePill: 'bg-rose-600 text-white shadow-md shadow-rose-500/30 font-black',
    activeIcon: 'text-white',
    activeText: 'text-rose-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.4)]'
  },
  cyan: {
    name: 'Cyan & Turquoise (Resources & Guide)',
    text: 'text-cyan-400',
    icon: 'text-cyan-400',
    pillBg: 'bg-cyan-500/15 dark:bg-cyan-500/15',
    border: 'border-cyan-500/35 dark:border-cyan-500/40',
    hoverBg: 'group-hover:bg-cyan-500/25 group-hover:border-cyan-500/60',
    activePill: 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-black',
    activeIcon: 'text-slate-950',
    activeText: 'text-cyan-300 font-black',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.4)]'
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
    container: `${palette.pillBg} ${palette.border} ${palette.text} hover:scale-105 transition-all duration-200`,
    icon: palette.icon || palette.text,
    label: 'text-slate-600 dark:text-slate-400 font-medium'
  };
}

/**
 * Tab ID to Theme Mapping Dictionary
 */
const TAB_ID_THEME_MAP = {
  'home': (isOwner) => (isOwner ? 'amber' : 'emerald'),
  'admin': 'amber',
  'global-admin': 'amber',
  'merit-badges': 'amber',
  'road-to-eagle': 'teal',
  'assignments': 'orange',
  'events': 'sky',
  'journal': 'yellow',
  'islamic': 'purple',
  'chat': 'indigo',
  'resources': 'cyan',
  'profile': 'rose',
  'roster': 'blue',
  'attendance': 'lime',
  'scouts': 'fuchsia',
  'advancement': 'teal',
  'reports': 'sky',
  'lesson-plans': 'lime',
  'feed': 'rose',
  'broadcasts': 'rose',
  'counselors': 'teal',
  'parent-requests': 'orange'
};

/**
 * Icon Name to Theme Fallback Mapping
 */
const ICON_THEME_MAP = {
  // Leadership & Owner & Badges
  'Crown': 'amber',
  'Star': 'amber',
  'Award': 'fuchsia',
  'Shield': (isOwner) => (isOwner ? 'amber' : 'emerald'),
  'ShieldCheck': 'emerald',
  'Inbox': 'orange',
  'Users': 'blue',
  'CheckSquare': 'lime',
  'FileText': 'sky',
  'Briefcase': 'amber',
  'History': 'amber',
  'Target': 'rose',

  // Outdoors & Scouting
  'Mountain': 'teal',
  'Compass': 'teal',
  'Tent': 'emerald',
  'Flame': 'orange',
  'Trees': 'emerald',
  'Fish': 'cyan',
  'Footprints': 'amber',
  'Navigation': 'teal',
  'MapPin': 'rose',

  // Academics & Tech
  'BookOpen': 'orange',
  'Book': 'cyan',
  'GraduationCap': 'lime',
  'Sparkles': 'purple',
  'CheckCircle': 'emerald',
  'Cpu': 'cyan',
  'Code': 'indigo',
  'Terminal': 'emerald',

  // Communication & Alerts
  'Bell': 'rose',
  'Megaphone': 'rose',
  'MessageSquare': 'indigo',
  'Send': 'sky',
  'Radio': 'indigo',
  'Bookmark': 'yellow',
  'Mail': 'amber',
  'PhoneCall': 'rose',

  // Navigation
  'Home': (isOwner) => (isOwner ? 'amber' : 'emerald'),
  'Calendar': 'sky',
  'Clock': 'sky',
  'User': 'rose',
  'Settings': 'teal',
  'Sliders': 'emerald'
};

/**
 * Resolves full color palette and style classes for any navigation tab or icon.
 */
export function getNavItemColorTheme(tabItem, isActive = false, isOwner = false) {
  if (!tabItem) return THEME_PALETTES.emerald;

  let themeKey = null;

  // 1. Explicit theme assigned on tab object
  if (typeof tabItem === 'object' && tabItem.theme && THEME_PALETTES[tabItem.theme]) {
    themeKey = tabItem.theme;
  }

  // 2. Resolve by Tab ID
  const tabId = typeof tabItem === 'string' ? tabItem : tabItem.id;
  if (!themeKey && tabId && TAB_ID_THEME_MAP[tabId]) {
    const mapped = TAB_ID_THEME_MAP[tabId];
    themeKey = typeof mapped === 'function' ? mapped(isOwner) : mapped;
  }

  // 3. Resolve by Icon Name
  const iconName = typeof tabItem === 'object' ? tabItem.icon : tabItem;
  if (!themeKey && iconName && ICON_THEME_MAP[iconName]) {
    const mapped = ICON_THEME_MAP[iconName];
    themeKey = typeof mapped === 'function' ? mapped(isOwner) : mapped;
  }

  // 4. Resolve by Category
  if (!themeKey && typeof tabItem === 'object' && tabItem.category) {
    const catMap = {
      outdoors: 'teal',
      leadership: isOwner ? 'amber' : 'indigo',
      communication: 'rose',
      academics: 'orange',
      navigation: isOwner ? 'amber' : 'emerald'
    };
    themeKey = catMap[tabItem.category];
  }

  const palette = THEME_PALETTES[themeKey] || THEME_PALETTES.emerald;
  return palette;
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
