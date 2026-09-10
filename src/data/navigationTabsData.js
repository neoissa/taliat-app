/**
 * Comprehensive System Navigation Tabs Registry
 */
export const MASTER_TABS_REGISTRY = [
  {
    id: 'home',
    defaultLabel: 'Home Dashboard',
    labelByRole: {
      owner: 'Owner Hub',
      leader: 'Leader Hub',
      parent: 'Parent Hub',
      scout: 'Home Dashboard'
    },
    defaultIcon: 'Home',
    category: 'navigation',
    description: 'Central overview, urgent tasks, and quick actions',
    allowedRoles: ['owner', 'admin', 'leader', 'scout', 'parent'],
    badgeKey: null,
    isPermanent: true // Cannot be fully disabled
  },
  {
    id: 'admin',
    defaultLabel: 'Owner Admin Hub',
    labelByRole: {
      owner: '👑 Owner Admin Hub',
      admin: '👑 Executive Hub'
    },
    defaultIcon: 'Shield',
    category: 'leadership',
    description: 'System security, user management, and broadcast administration',
    allowedRoles: ['owner', 'admin'],
    badgeKey: null
  },
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
    defaultLabel: 'My 7 Ranks',
    defaultIcon: 'Compass',
    category: 'outdoors',
    description: 'Track Scout through Eagle rank requirements and status',
    allowedRoles: ['scout'],
    badgeKey: null
  },
  {
    id: 'merit-badges',
    defaultLabel: 'Merit Badges & Eagle',
    labelByRole: {
      scout: 'My Merit Badges',
      leader: 'Merit Badges & Eagle',
      owner: 'Merit Badges & Eagle'
    },
    defaultIcon: 'Star',
    category: 'academics',
    description: 'Track required Eagle and elective merit badge progress',
    allowedRoles: ['owner', 'admin', 'leader', 'scout'],
    badgeKey: null
  },
  {
    id: 'road-to-eagle',
    defaultLabel: 'Road to Eagle',
    defaultIcon: 'Mountain',
    category: 'outdoors',
    description: 'Eagle Scout service project milestones, timeline, and conference prep',
    allowedRoles: ['owner', 'admin', 'leader', 'scout', 'parent'],
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
    labelByRole: {
      scout: 'My Homework',
      parent: 'Homework & Tasks',
      leader: 'Homework & Tasks',
      owner: 'Homework & Tasks'
    },
    defaultIcon: 'BookOpen',
    category: 'academics',
    description: 'Weekly troop homework, skill challenges, and file submissions',
    allowedRoles: ['owner', 'admin', 'leader', 'scout', 'parent'],
    badgeKey: null
  },
  {
    id: 'events',
    defaultLabel: 'Troop Calendar',
    labelByRole: {
      parent: 'Troop Schedule',
      scout: 'Troop Calendar',
      leader: 'Troop Calendar',
      owner: 'Troop Calendar'
    },
    defaultIcon: 'Calendar',
    category: 'outdoors',
    description: 'Upcoming meetings, hikes, campouts, service projects, and RSVPs',
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
    labelByRole: {
      scout: 'My Journal & Notes',
      leader: 'Leader Journal & Notes',
      owner: 'Leader Journal & Notes'
    },
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
    labelByRole: {
      scout: 'Patrol Chat',
      leader: 'Patrol Messenger',
      owner: 'Patrol Messenger'
    },
    defaultIcon: 'MessageSquare',
    category: 'communication',
    description: 'Real-time encrypted patrol messaging and team discussions',
    allowedRoles: ['owner', 'admin', 'leader', 'scout'],
    badgeKey: 'unreadChatCount'
  },
  {
    id: 'resources',
    defaultLabel: 'Resources & Guide',
    labelByRole: {
      parent: 'Safety & Guides',
      scout: 'Resources & Guide',
      leader: 'Resources & Guide',
      owner: 'Resources & Guide'
    },
    defaultIcon: 'Book',
    category: 'communication',
    description: 'Instructional videos, handbook references, and field materials',
    allowedRoles: ['owner', 'admin', 'leader', 'scout', 'parent'],
    badgeKey: null
  },
  {
    id: 'profile',
    defaultLabel: 'My Profile',
    labelByRole: {
      parent: 'Family Profile',
      scout: 'My Profile',
      leader: 'My Profile',
      owner: 'My Profile'
    },
    defaultIcon: 'User',
    category: 'navigation',
    description: 'Account settings, emergency contacts, credentials, and service log',
    allowedRoles: ['owner', 'admin', 'leader', 'scout', 'parent'],
    badgeKey: null,
    isPermanent: true
  }
];

/**
 * Returns role-permitted tabs in their default order for a given user context
 */
export function getDefaultRoleTabs(userRoleContext) {
  const { isOwner, isLeader, isExecutive, isParent, isScout } = userRoleContext;
  
  const effectiveRole = isOwner ? 'owner' : isExecutive ? 'admin' : isLeader ? 'leader' : isParent ? 'parent' : 'scout';

  // Filter master tabs based on user permissions
  const availableTabs = MASTER_TABS_REGISTRY.filter(tab => {
    if (tab.allowedRoles.includes('owner') && isOwner) return true;
    if (tab.allowedRoles.includes('admin') && isExecutive) return true;
    if (tab.allowedRoles.includes('leader') && isLeader) return true;
    if (tab.allowedRoles.includes('parent') && isParent) return true;
    if (tab.allowedRoles.includes('scout') && isScout) return true;
    return false;
  });

  // Assign role-specific labels and icons
  return availableTabs.map(tab => ({
    id: tab.id,
    label: tab.labelByRole?.[effectiveRole] || tab.defaultLabel,
    icon: tab.defaultIcon,
    category: tab.category,
    description: tab.description,
    visible: true,
    badgeKey: tab.badgeKey,
    isPermanent: !!tab.isPermanent
  }));
}

/**
 * Returns the default 4 pinned bottom quick bar tab IDs for a role
 */
export function getDefaultBottomTabIds(userRoleContext) {
  const { isOwner, isLeader, isParent } = userRoleContext;
  
  if (isParent) {
    return ['home', 'events', 'feed', 'road-to-eagle'];
  }
  if (isOwner || isLeader) {
    return ['home', 'roster', 'attendance', 'events'];
  }
  // Scout
  return ['home', 'advancement', 'events', 'chat'];
}
