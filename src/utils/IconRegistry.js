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
      { id: 'Target', label: 'Goals / Standards' }
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
  '⚙️': 'Settings'
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
