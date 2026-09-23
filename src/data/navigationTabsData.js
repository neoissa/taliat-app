/**
 * Comprehensive System Navigation Tabs Registry (5-Hub Architecture)
 */

export const MASTER_TABS_REGISTRY = [
  // ── 1. PRIMARY HUBS ──
  {
    id: 'home',
    defaultLabel: 'Command Center',
    labelByRole: {
      owner: '👑 Command Center',
      admin: '👑 Command Center',
      leader: '⚜️ Command Center',
      parent: 'Family Hub',
      scout: 'My Dashboard'
    },
    defaultIcon: 'Home',
    iconByRole: {
      owner: 'Crown',
      admin: 'ShieldCheck',
      leader: 'Shield',
      parent: 'Home',
      scout: 'Home'
    },
    category: 'navigation',
    description: 'Central overview, urgent action items, and quick shortcuts',
    allowedRoles: ['owner', 'admin', 'leader', 'scout', 'parent'],
    badgeKey: null,
    isPermanent: true
  },
  {
    id: 'scouts-hub',
    defaultLabel: 'Scouts & Patrols',
    labelByRole: {
      owner: 'Scouts & Patrols',
      admin: 'Scouts & Patrols',
      leader: 'Scouts & Patrols'
    },
    defaultIcon: 'Users',
    iconByRole: {
      owner: 'Users',
      admin: 'Users',
      leader: 'Users'
    },
    category: 'leadership',
    description: 'Patrol Roster, Attendance, Advancement Sign-Offs & Reports',
    allowedRoles: ['owner', 'admin', 'leader'],
    badgeKey: null
  },
  {
    id: 'advancement-hub',
    defaultLabel: 'My Advancement',
    labelByRole: {
      scout: 'My Advancement',
      parent: 'Eagle & Advancement'
    },
    defaultIcon: 'Award',
    iconByRole: {
      scout: 'Award',
      parent: 'Mountain'
    },
    category: 'outdoors',
    description: '7 Ranks Progress, Merit Badges & Road to Eagle',
    allowedRoles: ['scout', 'parent'],
    badgeKey: null
  },
  {
    id: 'events-hub',
    defaultLabel: 'Schedule & Tasks',
    labelByRole: {
      scout: 'Schedule & Tasks',
      parent: 'Schedule & Tasks',
      leader: 'Calendar & Events',
      owner: 'Calendar & Events'
    },
    defaultIcon: 'Calendar',
    iconByRole: {
      owner: 'Calendar',
      admin: 'Calendar',
      leader: 'Calendar',
      parent: 'Calendar',
      scout: 'Calendar'
    },
    category: 'outdoors',
    description: 'Troop Calendar, RSVPs & Homework Challenges',
    allowedRoles: ['scout', 'parent'],
    badgeKey: null
  },
  {
    id: 'events',
    defaultLabel: 'Calendar & Events',
    labelByRole: {
      parent: 'Troop Schedule',
      scout: 'Troop Calendar',
      leader: 'Calendar & Events',
      owner: 'Calendar & Events'
    },
    defaultIcon: 'Calendar',
    iconByRole: {
      owner: 'Calendar',
      admin: 'Calendar',
      leader: 'Calendar',
      parent: 'Calendar',
      scout: 'Calendar'
    },
    category: 'outdoors',
    description: 'Upcoming meetings, campouts, RSVPs & Excel Ingestion',
    allowedRoles: ['owner', 'admin', 'leader', 'scout', 'parent'],
    badgeKey: null
  },
  {
    id: 'communication-hub',
    defaultLabel: 'Communications',
    labelByRole: {
      owner: 'Communications',
      admin: 'Communications',
      leader: 'Communications',
      parent: 'Messages & Alerts'
    },
    defaultIcon: 'MessageSquare',
    iconByRole: {
      owner: 'MessageSquare',
      admin: 'MessageSquare',
      leader: 'MessageSquare',
      parent: 'MessageSquare'
    },
    category: 'communication',
    description: 'Direct Parent Inquiries, Troop Broadcasts & Patrol Messenger',
    allowedRoles: ['owner', 'admin', 'leader', 'parent'],
    badgeKey: 'unreadDirectMessagesCount'
  },
  {
    id: 'tarbiyah-hub',
    defaultLabel: 'Patrol & Tarbiyah',
    labelByRole: {
      scout: 'Patrol & Tarbiyah'
    },
    defaultIcon: 'Sparkles',
    iconByRole: {
      scout: 'Sparkles'
    },
    category: 'academics',
    description: 'Patrol Chat, Islamic Knowledge, Handbook Guides & Field Notes',
    allowedRoles: ['scout'],
    badgeKey: 'unreadChatCount'
  },
  {
    id: 'admin-hub',
    defaultLabel: 'Admin & Settings',
    labelByRole: {
      owner: '👑 Admin & Settings',
      admin: '👑 Executive & Settings',
      leader: '⚜️ Admin & Settings'
    },
    defaultIcon: 'Sliders',
    iconByRole: {
      owner: 'Crown',
      admin: 'ShieldCheck',
      leader: 'Sliders'
    },
    category: 'leadership',
    description: 'User Management, Security, Excel Ingestion & Profile',
    allowedRoles: ['owner', 'admin', 'leader'],
    badgeKey: null
  },
  {
    id: 'road-to-eagle',
    defaultLabel: 'Road to Eagle',
    defaultIcon: 'Mountain',
    iconByRole: {
      parent: 'Mountain',
      scout: 'Mountain'
    },
    category: 'outdoors',
    description: 'Eagle Scout service project milestones, timeline, and conference prep',
    allowedRoles: ['parent', 'scout'],
    badgeKey: null
  },
  {
    id: 'profile',
    defaultLabel: 'My Profile',
    labelByRole: {
      parent: 'Family Profile',
      scout: 'My Profile',
      leader: 'Leader Profile',
      owner: 'Owner Profile'
    },
    defaultIcon: 'User',
    iconByRole: {
      owner: 'Crown',
      admin: 'ShieldCheck',
      leader: 'ShieldCheck',
      parent: 'Users',
      scout: 'User'
    },
    category: 'navigation',
    description: 'Account settings, emergency contacts, credentials, and service log',
    allowedRoles: ['owner', 'admin', 'leader', 'scout', 'parent'],
    badgeKey: null,
    isPermanent: true
  },

  // ── 2. INDIVIDUAL SUB-MODULES (Kept for routing compatibility) ──
  {
    id: 'roster',
    defaultLabel: 'Patrol Roster',
    defaultIcon: 'Users',
    category: 'leadership',
    description: 'Manage scouts, patrols, phone contacts, and member profiles',
    allowedRoles: ['owner', 'admin', 'leader'],
    badgeKey: null
  },
  {
    id: 'attendance',
    defaultLabel: 'Patrol Attendance',
    defaultIcon: 'CheckSquare',
    category: 'leadership',
    description: 'Record weekly patrol roll call, tardiness, and participation points',
    allowedRoles: ['owner', 'admin', 'leader'],
    badgeKey: null
  },
  {
    id: 'scouts',
    defaultLabel: 'Advancement Tracker',
    defaultIcon: 'Award',
    category: 'leadership',
    description: 'Review and approve BSA rank requirements and badge milestones',
    allowedRoles: ['owner', 'admin', 'leader'],
    badgeKey: null
  },
  {
    id: 'advancement',
    defaultLabel: '7 Ranks Progress',
    defaultIcon: 'Compass',
    category: 'outdoors',
    description: 'Track Scout through Eagle rank requirements and status',
    allowedRoles: ['scout'],
    badgeKey: null
  },
  {
    id: 'merit-badges',
    defaultLabel: 'Merit Badges & Eagle',
    defaultIcon: 'Star',
    category: 'academics',
    description: 'Track required Eagle and elective merit badge progress',
    allowedRoles: ['owner', 'admin', 'leader', 'scout'],
    badgeKey: null
  },
  {
    id: 'reports',
    defaultLabel: 'Reports Center',
    defaultIcon: 'FileText',
    category: 'leadership',
    description: 'Generate, sign, and export PDF / Excel progress and attendance audits',
    allowedRoles: ['owner', 'admin', 'leader'],
    badgeKey: null
  },
  {
    id: 'assignments',
    defaultLabel: 'Homework & Tasks',
    defaultIcon: 'BookOpen',
    category: 'academics',
    description: 'Weekly troop homework, skill challenges, and file submissions',
    allowedRoles: ['owner', 'admin', 'leader', 'scout', 'parent'],
    badgeKey: null
  },
  {
    id: 'lesson-plans',
    defaultLabel: 'Lesson Plans',
    defaultIcon: 'GraduationCap',
    category: 'academics',
    description: 'Shared lesson curriculum, skills teaching guides, and patrol materials',
    allowedRoles: ['owner', 'admin', 'leader'],
    badgeKey: null
  },
  {
    id: 'journal',
    defaultLabel: 'Journal & Notes',
    defaultIcon: 'Bookmark',
    category: 'communication',
    description: 'Private personal reflections, patrol observations, and field notes',
    allowedRoles: ['owner', 'admin', 'leader', 'scout'],
    badgeKey: null
  },
  {
    id: 'islamic',
    defaultLabel: 'Islamic Knowledge',
    defaultIcon: 'Sparkles',
    category: 'academics',
    description: 'Duas, Islamic manners, prayer times, and character teachings',
    allowedRoles: ['owner', 'admin', 'leader', 'scout'],
    badgeKey: null
  },
  {
    id: 'feed',
    defaultLabel: 'Alerts & Feed',
    defaultIcon: 'Bell',
    category: 'communication',
    description: 'Urgent announcements, troop broadcasts, and parental alerts',
    allowedRoles: ['scout', 'parent'],
    badgeKey: 'unreadAlertsCount'
  },
  {
    id: 'chat',
    defaultLabel: 'Patrol Messenger',
    defaultIcon: 'MessageSquare',
    category: 'communication',
    description: 'Real-time encrypted patrol messaging and team discussions',
    allowedRoles: ['owner', 'admin', 'leader', 'scout'],
    badgeKey: 'unreadChatCount'
  },
  {
    id: 'direct-messages',
    defaultLabel: 'Direct Messages',
    defaultIcon: 'MessageSquare',
    category: 'communication',
    description: 'Private 1-on-1 parent-leader conversations and troop suggestions',
    allowedRoles: ['owner', 'admin', 'leader', 'parent'],
    badgeKey: 'unreadDirectMessagesCount'
  },
  {
    id: 'resources',
    defaultLabel: 'Resources & Guide',
    defaultIcon: 'Book',
    category: 'communication',
    description: 'Instructional videos, handbook references, and field materials',
    allowedRoles: ['owner', 'admin', 'leader', 'scout', 'parent'],
    badgeKey: null
  },
  {
    id: 'admin',
    defaultLabel: 'Admin Console',
    defaultIcon: 'Shield',
    category: 'leadership',
    description: 'System security, user management, and broadcast administration',
    allowedRoles: ['owner', 'admin'],
    badgeKey: null
  }
];

/**
 * Returns clean 5-hub navigation items for a given user context
 */
export function getDefaultRoleTabs(userRoleContext) {
  const { isOwner, isLeader, isExecutive, isParent, isScout } = userRoleContext || {};
  const effectiveRole = isOwner ? 'owner' : isExecutive ? 'admin' : isLeader ? 'leader' : isParent ? 'parent' : 'scout';

  let primaryHubIds = [];

  if (isOwner || isExecutive || isLeader) {
    primaryHubIds = ['home', 'scouts-hub', 'events', 'communication-hub', 'admin-hub'];
  } else if (isParent) {
    primaryHubIds = ['home', 'events', 'communication-hub', 'road-to-eagle', 'profile'];
  } else {
    // Scout
    primaryHubIds = ['home', 'advancement-hub', 'events-hub', 'tarbiyah-hub', 'profile'];
  }

  const tabMap = new Map(MASTER_TABS_REGISTRY.map(t => [t.id, t]));

  return primaryHubIds
    .map(id => tabMap.get(id))
    .filter(Boolean)
    .map(tab => {
      const roleIcon = tab.iconByRole?.[effectiveRole] || tab.defaultIcon;
      return {
        id: tab.id,
        label: tab.labelByRole?.[effectiveRole] || tab.defaultLabel,
        icon: roleIcon,
        category: tab.category,
        description: tab.description,
        visible: true,
        badgeKey: tab.badgeKey,
        isPermanent: !!tab.isPermanent
      };
    });
}

/**
 * Returns the default 4 pinned bottom quick bar tab IDs for a role
 */
export function getDefaultBottomTabIds(userRoleContext) {
  const { isOwner, isLeader, isExecutive, isParent } = userRoleContext || {};
  
  if (isOwner || isExecutive || isLeader) {
    return ['home', 'scouts-hub', 'events', 'communication-hub'];
  }
  if (isParent) {
    return ['home', 'events', 'communication-hub', 'road-to-eagle'];
  }
  // Scout
  return ['home', 'advancement-hub', 'events-hub', 'tarbiyah-hub'];
}
