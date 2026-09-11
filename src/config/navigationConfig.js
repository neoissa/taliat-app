/**
 * Role-Based Mobile Navigation Configurations
 * 
 * Provides tailored bottom tab architectures for Leaders, Owners, Scouts, and Parents
 * featuring vibrant color themes and dedicated Lucide icons.
 */

export const LEADER_OWNER_TABS = [
  {
    id: 'home',
    label: 'Command Center',
    icon: 'Shield',
    theme: 'indigo',
    description: 'Unit Command Center & Executive Overview',
    badgeKey: null
  },
  {
    id: 'events',
    label: 'Schedule & Calendar',
    icon: 'Calendar',
    theme: 'sky',
    description: 'Upcoming Troop Events & Weekly Meetings',
    badgeKey: null
  },
  {
    id: 'parent-requests',
    label: 'Parent Requests',
    icon: 'Inbox',
    theme: 'amber',
    description: 'Pending Parent Approvals & Inquiries',
    badgeKey: 'unreadRequestsCount'
  },
  {
    id: 'roster',
    label: 'Roster & Profiles',
    icon: 'Users',
    theme: 'indigo',
    description: 'Patrol Roster, Contacts & Scout Details',
    badgeKey: null
  },
  {
    id: 'broadcasts',
    label: 'Alerts & Broadcasts',
    icon: 'Megaphone',
    theme: 'rose',
    description: 'Troop Broadcast Center & Announcements',
    badgeKey: 'unreadAlertsCount'
  }
];

export const SCOUT_TABS = [
  {
    id: 'home',
    label: 'My Dashboard',
    icon: 'Home',
    theme: 'emerald',
    description: 'My Scout Dashboard & Next Milestones',
    badgeKey: null
  },
  {
    id: 'assignments',
    label: 'Assignments & Tasks',
    icon: 'CheckSquare',
    theme: 'amber',
    description: 'Weekly Homework, Tasks & Challenges',
    badgeKey: null
  },
  {
    id: 'advancement',
    label: 'Advancement & Rank',
    icon: 'Award',
    theme: 'emerald',
    description: '7 Ranks Advancement & Milestones',
    badgeKey: null
  },
  {
    id: 'feed',
    label: 'Alerts & Feed',
    icon: 'Bell',
    theme: 'amber',
    description: 'Troop Alerts & Live Announcements',
    badgeKey: 'unreadAlertsCount'
  },
  {
    id: 'counselors',
    label: 'Counselor Directory',
    icon: 'Compass',
    theme: 'teal',
    description: 'Merit Badge Counselors Directory',
    badgeKey: null
  }
];

export const PARENT_TABS = [
  {
    id: 'home',
    label: 'Family Overview',
    icon: 'Home',
    theme: 'emerald',
    description: 'Family Dashboard & Child Summary',
    badgeKey: null
  },
  {
    id: 'events',
    label: 'Children Schedule',
    icon: 'Calendar',
    theme: 'sky',
    description: 'Child Meetings, Hikes & Calendar',
    badgeKey: null
  },
  {
    id: 'assignments',
    label: 'Homework & Tasks',
    icon: 'BookOpen',
    theme: 'amber',
    description: 'Child Homework & Activity Submissions',
    badgeKey: null
  },
  {
    id: 'road-to-eagle',
    label: 'Road to Eagle',
    icon: 'Mountain',
    theme: 'teal',
    description: 'Eagle Scout Roadmap & Projects',
    badgeKey: null
  },
  {
    id: 'feed',
    label: 'Alerts & Feed',
    icon: 'Bell',
    theme: 'amber',
    description: 'Troop Alerts & Family Notifications',
    badgeKey: 'unreadAlertsCount'
  }
];

/**
 * Returns role-tailored navigation items merged with custom preferences if available
 */
export function getRoleNavigationConfig(userRoleContext, customPreferences = null) {
  const { isOwner, isLeader, isExecutive, isParent, isScout } = userRoleContext || {};

  let defaultRoleTabs = SCOUT_TABS;

  if (isOwner || isLeader || isExecutive) {
    defaultRoleTabs = LEADER_OWNER_TABS;
  } else if (isParent) {
    defaultRoleTabs = PARENT_TABS;
  }

  // If user has saved custom bottom tab preferences, respect their custom selection while applying theme colors
  if (customPreferences?.bottomNavTabIds && customPreferences.bottomNavTabIds.length > 0) {
    const customMap = new Map((customPreferences.tabs || []).map(t => [t.id, t]));
    const defaultMap = new Map(defaultRoleTabs.map(t => [t.id, t]));

    const customPinned = customPreferences.bottomNavTabIds
      .map(id => {
        const customTab = customMap.get(id);
        const defaultTab = defaultMap.get(id);
        if (!customTab) return defaultTab;

        return {
          id: customTab.id,
          label: customTab.label,
          icon: customTab.icon || defaultTab?.icon || 'Home',
          theme: defaultTab?.theme || (customTab.category === 'leadership' ? 'indigo' : customTab.category === 'communication' ? 'amber' : customTab.category === 'academics' ? 'amber' : 'emerald'),
          description: customTab.description || defaultTab?.description || '',
          badgeKey: customTab.badgeKey || defaultTab?.badgeKey || null
        };
      })
      .filter(Boolean);

    if (customPinned.length > 0) {
      return customPinned.slice(0, 5);
    }
  }

  return defaultRoleTabs;
}
