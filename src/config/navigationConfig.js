/**
 * Role-Based Mobile Navigation Configurations (5-Hub Architecture)
 * 
 * Provides tailored 5-hub architectures for Leaders, Owners, Scouts, and Parents
 * featuring vibrant color themes and dedicated Lucide icons.
 */

export const LEADER_OWNER_TABS = [
  {
    id: 'home',
    label: 'Command Center',
    icon: 'Shield',
    theme: 'sky',
    description: 'Unit Command Center & Executive Overview',
    badgeKey: null
  },
  {
    id: 'scouts-hub',
    label: 'Scouts & Patrols',
    icon: 'Users',
    theme: 'sky',
    description: 'Patrol Roster, Attendance, Advancement & Reports',
    badgeKey: null
  },
  {
    id: 'assignments',
    label: 'Weekly Homework',
    icon: 'BookOpen',
    theme: 'sky',
    description: 'Assign, Grade & Review Scout Homework',
    badgeKey: 'unreadHomeworkCount'
  },
  {
    id: 'lesson-plans',
    label: 'Lesson Curriculum',
    icon: 'GraduationCap',
    theme: 'sky',
    description: 'Patrol Lesson Plans & Weekly Agendas',
    badgeKey: null
  },
  {
    id: 'events',
    label: 'Calendar & Events',
    icon: 'Calendar',
    theme: 'sky',
    description: 'Troop Schedule, RSVPs & Ingestion',
    badgeKey: null
  },
  {
    id: 'communication-hub',
    label: 'Communications',
    icon: 'MessageSquare',
    theme: 'sky',
    description: 'Parent DMs, Broadcasts & Patrol Chat',
    badgeKey: 'unreadDirectMessagesCount'
  },
  {
    id: 'admin-hub',
    label: 'Leader Admin Console',
    icon: 'Sliders',
    theme: 'sky',
    description: 'User Management & Security Governance',
    badgeKey: null
  },
  {
    id: 'profile',
    label: 'My Profile & Training (SPT)',
    icon: 'ShieldCheck',
    theme: 'sky',
    description: 'Leader Profile, Credentials & Safety Protection Training',
    badgeKey: null
  }
];

export const SCOUT_TABS = [
  {
    id: 'home',
    label: 'My Dashboard',
    icon: 'Home',
    theme: 'sky',
    description: 'My Scout Dashboard & Next Milestones',
    badgeKey: null
  },
  {
    id: 'advancement-hub',
    label: 'My Advancement',
    icon: 'Award',
    theme: 'sky',
    description: '7 Ranks, Merit Badges & Eagle Roadmap',
    badgeKey: null
  },
  {
    id: 'events-hub',
    label: 'Schedule & Tasks',
    icon: 'Calendar',
    theme: 'sky',
    description: 'Troop Calendar, RSVPs & Homework',
    badgeKey: null
  },
  {
    id: 'tarbiyah-hub',
    label: 'Patrol & Tarbiyah',
    icon: 'Sparkles',
    theme: 'sky',
    description: 'Patrol Chat, Islamic Knowledge & Guides',
    badgeKey: 'unreadChatCount'
  },
  {
    id: 'profile',
    label: 'My Profile',
    icon: 'User',
    theme: 'sky',
    description: 'Scout Profile, Credentials & Service Log',
    badgeKey: null
  }
];

export const PARENT_TABS = [
  {
    id: 'home',
    label: 'Family Overview',
    icon: 'Home',
    theme: 'sky',
    description: 'Family Dashboard & Child Summary',
    badgeKey: null
  },
  {
    id: 'events',
    label: 'Calendar & Schedule',
    icon: 'Calendar',
    theme: 'sky',
    description: 'Child Meetings, Hikes & Calendar',
    badgeKey: null
  },
  {
    id: 'communication-hub',
    label: 'Messages & Alerts',
    icon: 'MessageSquare',
    theme: 'sky',
    description: 'Leader Inquiries, Meeting Requests & Alerts',
    badgeKey: 'unreadDirectMessagesCount'
  },
  {
    id: 'road-to-eagle',
    label: 'Eagle & Progress',
    icon: 'Mountain',
    theme: 'sky',
    description: 'Eagle Scout Roadmap & Child Advancement',
    badgeKey: null
  },
  {
    id: 'profile',
    label: 'Family Profile',
    icon: 'User',
    theme: 'sky',
    description: 'Family Profile & Contacts',
    badgeKey: null
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
          theme: 'sky',
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
