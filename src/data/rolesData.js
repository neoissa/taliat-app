// src/data/rolesData.js
// Structured reference data detailing system access levels, administrative permissions,
// and unit responsibilities for every account role in the Tali'at App.

export const ROLES_DATA = {
  scoutmaster: {
    id: 'scoutmaster',
    roleKey: 'leader',
    positionName: 'Scoutmaster (SM) & Assistant Scoutmaster (ASM)',
    shortTitle: 'Executive Leadership (SM / ASM)',
    badgeLabel: '⚜️ Troop Executive Leadership',
    colorTheme: 'amber',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: 'Crown',
    accessScope: 'Troop-Wide (All Patrols & Organizational Units)',
    tagline: 'Directs youth leadership, mentors the SPL, and administers troop-wide advancement and safety.',
    appPermissions: [
      {
        title: 'Full Cross-Patrol Visibility',
        desc: 'Unrestricted visibility across all patrols, rosters, individual scouts, and troop activity metrics.'
      },
      {
        title: 'Global Troop Broadcasts & Announcements',
        desc: 'Publish urgent alerts, campout briefings, calendar changes, and organization-wide broadcast bulletins.'
      },
      {
        title: 'Universal Advancement & Scoutmaster Conferences',
        desc: 'Conduct and sign off on all 7 rank tiers, merit badges, Scoutmaster conferences, Board of Review approvals, and Eagle applications.'
      },
      {
        title: 'Troop Roster & Patrol Architecture Management',
        desc: 'Create and edit patrol groups, assign or reassign scouts to patrols, and appoint adult unit staff.'
      },
      {
        title: 'Universal Testing Queue Sign-Offs',
        desc: 'Access the Troop Oral Testing and Sign-off queue to review, test, and approve submitted scout milestones.'
      },
      {
        title: 'Troop-Wide Attendance & Absence Risk Oversight',
        desc: 'Monitor attendance health across all units, identify high-risk absence streaks (Yellow/Red), and initiate parent interventions.'
      }
    ],
    unitResponsibilities: [
      {
        title: 'Youth-Led Troop Mentorship',
        desc: 'Guide and mentor the Senior Patrol Leader (SPL) and Patrol Leaders\' Council (PLC) without taking over their leadership.'
      },
      {
        title: 'Safety & Youth Protection Compliance',
        desc: 'Ensure 2-deep adult leadership, Youth Protection / Safe Scouting (SPT/YPT) compliance, and emergency preparedness on all outings.'
      },
      {
        title: 'Character Development & Scout Spirit',
        desc: 'Foster high moral standards, Islamic values (Akhlāq & ʿAqāʾid), and active living of the Scout Oath and Law.'
      },
      {
        title: 'Boards of Review & Conferences',
        desc: 'Conduct formal Scoutmaster conferences prior to rank advancements and coordinate troop Boards of Review.'
      }
    ],
    keyFeatures: [
      'Universal Patrol Access',
      'Broadcast Center',
      'Eagle Capstone Approvals',
      'Roster Provisioning',
      'Troop-Wide Analytics'
    ]
  },

  patrol_leader_adult: {
    id: 'patrol_leader_adult',
    roleKey: 'leader',
    positionName: 'Patrol Leader & Assistant Patrol Leader (Adult Unit Staff)',
    shortTitle: 'Unit Leadership (Patrol Leader / Staff)',
    badgeLabel: '🛡️ Patrol Unit Leadership',
    colorTheme: 'emerald',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: 'Shield',
    accessScope: 'Scoped Strictly to Assigned Patrol Unit',
    tagline: 'Mentors assigned patrol members, conducts roll call, grades homework, and coordinates patrol activities.',
    appPermissions: [
      {
        title: 'Patrol-Scoped Roster Management',
        desc: 'Manage and monitor all scouts registered within the leader\'s assigned patrol unit.'
      },
      {
        title: 'Live Roll Call & Absence Risk Engine',
        desc: 'Conduct meeting roll calls (Present, Late, Excused, Absent), log service/meeting hours and camping nights, and track yellow/red absence risk indicators.'
      },
      {
        title: 'Patrol Homework & Quest Grading',
        desc: 'Create, assign, inspect, and grade weekly patrol assignments, Islamic study homework, and outdoor preparation tasks.'
      },
      {
        title: 'Scoped Patrol Stream & Direct Messaging',
        desc: 'Facilitate dedicated patrol communication, share resource links, and coordinate patrol gear and meeting times.'
      },
      {
        title: 'Parent Progress Reports & WhatsApp Sharing',
        desc: 'Generate individual scout progress snapshots and send pre-formatted WhatsApp check-in messages directly to parents.'
      },
      {
        title: 'Patrol Scout Provisioning',
        desc: 'Register new scout accounts locked automatically to the leader\'s assigned patrol unit.'
      }
    ],
    unitResponsibilities: [
      {
        title: 'Direct Patrol Mentorship',
        desc: 'Actively coach youth patrol members in outdoor skills, scoutcraft, teamwork, and patrol identity.'
      },
      {
        title: 'Patrol Outings & Meeting Execution',
        desc: 'Organize patrol meetings, assist youth leaders during campouts, and oversee patrol gear maintenance.'
      },
      {
        title: 'Scoutmaster Liaison',
        desc: 'Represent the patrol\'s needs, progress, and safety requirements directly to the Scoutmaster and ASM team.'
      },
      {
        title: 'Active Family Engagement',
        desc: 'Maintain transparent communication with patrol parents regarding attendance, gear checklists, and upcoming schedules.'
      }
    ],
    keyFeatures: [
      'Patrol Roll Call Tracking',
      'Absence Risk Alerts',
      'Homework Manager',
      'WhatsApp Parent Outreach',
      'Patrol Chat Stream'
    ]
  },

  scout: {
    id: 'scout',
    roleKey: 'scout',
    positionName: 'Scout (Youth Member)',
    shortTitle: 'Youth Scout Member',
    badgeLabel: '🏕️ Active Scout Member',
    colorTheme: 'sky',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    icon: 'User',
    accessScope: 'Individual Profile & Assigned Patrol Stream',
    tagline: 'Tracks individual rank advancements, merit badges, Road to Eagle, submits homework, and engages in patrol life.',
    appPermissions: [
      {
        title: 'Interactive 7-Rank Advancement Tracking',
        desc: 'Submit rank requirements from Scout to Eagle for leader verification, view requirements criteria, and prepare for testing.'
      },
      {
        title: 'Road to Eagle & Eagle Palms Portal',
        desc: 'Track the 21 required merit badges, 6-month leadership tenure of responsibility, Eagle project phases, and reference contacts.'
      },
      {
        title: 'Merit Badge Dashboard & Electives',
        desc: 'Access 138+ BSA merit badges, explore requirements, track completed badges, and request counselor reviews.'
      },
      {
        title: 'Homework & Quest Submission',
        desc: 'View assigned patrol tasks, upload completed work, and receive feedback from patrol leadership.'
      },
      {
        title: 'Islamic Basics Curriculum Tracker',
        desc: 'Track milestones across Jaʿfarī fiqh, ʿAqāʾid, Akhlāq, and the Sīrah of Ahl al-Bayt (ʿa).'
      },
      {
        title: 'Patrol Chat & Troop Calendar',
        desc: 'Collaborate in your patrol channel, view upcoming troop campouts, and track your logged camping nights and service hours.'
      }
    ],
    unitResponsibilities: [
      {
        title: 'Active Participation & Punctuality',
        desc: 'Attend Friday troop meetings and patrol assemblies on time, fully uniformed with your Scout Handbook.'
      },
      {
        title: 'Demonstrating Scout Spirit',
        desc: 'Live the Scout Oath, Law, Motto ("Be Prepared"), and Slogan ("Do a Good Turn Daily") in your family, school, and community.'
      },
      {
        title: 'Individual Advancement Drive',
        desc: 'Take ownership of your learning, practice outdoor skills diligently, and proactively seek leader testing.'
      },
      {
        title: 'Patrol Duty Fulfillment',
        desc: 'Fulfill assigned patrol chores during camping trips (cooking, cleanup, water duty, campfire preparation).'
      }
    ],
    keyFeatures: [
      '7-Rank Progress Tracker',
      'Merit Badge Library (138+)',
      'Road to Eagle Capstone',
      'Homework Submissions',
      'Personal Attendance Log'
    ]
  },

  parent: {
    id: 'parent',
    roleKey: 'parent',
    positionName: 'Parent / Guardian (Dual-Parent Account)',
    shortTitle: 'Parent & Guardian Portal',
    badgeLabel: '👨‍👩‍👧 Parent / Guardian',
    colorTheme: 'indigo',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    icon: 'Users',
    accessScope: 'Read-Only Linked Children Profile(s)',
    tagline: 'Monitors children’s advancement, reviews attendance health, submits excuse notes, and signs waivers.',
    appPermissions: [
      {
        title: 'Real-Time Advancement Dashboard',
        desc: 'Inspect real-time progress for each linked child across all 7 ranks, merit badges, and Islamic studies milestones.'
      },
      {
        title: 'Attendance Standing & Absence Risk Monitor',
        desc: 'View real-time attendance percentages, total meeting hours, camping nights logged, and absence alerts (Green/Yellow/Red).'
      },
      {
        title: 'Absence Excuses & Communication',
        desc: 'Submit written absence excuse notes with dates and reasons directly to patrol leaders before meetings.'
      },
      {
        title: 'Event RSVPs & Camp Registration',
        desc: 'Confirm attendance for upcoming campouts, field trips, court of honors, and service projects.'
      },
      {
        title: 'Digital Forms, Medical Waivers & Notes',
        desc: 'Review and sign required activity waivers, medical updates, and review private leader evaluation notes.'
      },
      {
        title: 'Homework & Assignment Oversight',
        desc: 'Monitor assigned troop homework and track submission completion status.'
      }
    ],
    unitResponsibilities: [
      {
        title: 'Advancement Encouragement',
        desc: 'Support your child\'s goal-setting, encourage merit badge completion, and celebrate advancement milestones.'
      },
      {
        title: 'Timely Logistics & Communication',
        desc: 'Ensure punctual drop-offs and pick-ups, confirm event RSVPs promptly, and keep contact details current.'
      },
      {
        title: 'Health & Safety Updates',
        desc: 'Keep medical forms, dietary requirements, and emergency contacts up to date with troop leaders.'
      },
      {
        title: 'Uniform & Gear Preparedness',
        desc: 'Support your child in maintaining a complete, inspection-ready Scout uniform and appropriate outdoor weather gear.'
      }
    ],
    keyFeatures: [
      'Multi-Child Switcher',
      'Live Rank Inspection',
      'Absence Note Submission',
      'Campout RSVPs & Forms',
      'WhatsApp Quick-Connect'
    ]
  },

  owner: {
    id: 'owner',
    roleKey: 'owner',
    positionName: 'Troop Owner & System Superadministrator',
    shortTitle: 'Troop Owner / Superadmin',
    badgeLabel: '👑 Troop Owner / Superadmin',
    colorTheme: 'amber',
    badgeClass: 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-200 border-amber-500/50',
    icon: 'Crown',
    accessScope: 'Full Sovereign Master Control of Troop Database',
    tagline: 'Complete governance of troop architecture, security keys, account provisioning, and system maintenance.',
    appPermissions: [
      {
        title: 'Sovereign Database Governance',
        desc: 'Complete administrative access to all collections, user profiles, credentials, security secrets, and data exports.'
      },
      {
        title: 'Global Account Provisioning & Roles',
        desc: 'Create, modify, promote, or archive any user account across Owners, Scoutmasters, Leaders, Scouts, and Parents.'
      },
      {
        title: 'Patrol Hierarchy & Architecture Control',
        desc: 'Create, rename, re-order, or delete patrols, assign patrol leadership staff, and configure troop banners.'
      },
      {
        title: 'Safety Password Resets & Master Recovery',
        desc: 'Perform one-click administrative credential resets for any troop member with zero downtime.'
      },
      {
        title: 'Troop Safety Wipes & Archival Tools',
        desc: 'Access emergency diagnostic tools and maintenance operations with multi-step safety confirmation.'
      }
    ],
    unitResponsibilities: [
      {
        title: 'Institutional Troop Stewardship',
        desc: 'Ensure the sustainable operation of the troop platform, preserving historical scouting records and user security.'
      },
      {
        title: 'Charter Organization Alignment',
        desc: 'Maintain harmony between institutional goals, charter standards, and BSA scouting policies.'
      }
    ],
    keyFeatures: [
      'Universal Master Access',
      'Direct Credential Management',
      'Patrol Architecture Builder',
      'Global User Directory',
      'Safety Archive Tools'
    ]
  }
};

/**
 * Resolves the matching role guide object based on user role and leaderPosition
 * @param {string} role - 'owner' | 'leader' | 'scout' | 'parent'
 * @param {string} leaderPosition - 'Scoutmaster' | 'Assistant Scoutmaster' | 'Patrol Leader' | etc.
 * @returns {object} The matching ROLES_DATA definition
 */
export function getRoleGuide(role, leaderPosition) {
  if (role === 'owner') return ROLES_DATA.owner;
  if (role === 'scout') return ROLES_DATA.scout;
  if (role === 'parent') return ROLES_DATA.parent;
  
  if (role === 'leader' || role === 'admin') {
    const isExecutive = leaderPosition === 'Scoutmaster' || leaderPosition === 'Assistant Scoutmaster' || role === 'admin';
    if (isExecutive) {
      return ROLES_DATA.scoutmaster;
    }
    return ROLES_DATA.patrol_leader_adult;
  }

  return ROLES_DATA.scout;
}

export const ALL_ROLES_ARRAY = [
  ROLES_DATA.scoutmaster,
  ROLES_DATA.patrol_leader_adult,
  ROLES_DATA.scout,
  ROLES_DATA.parent,
  ROLES_DATA.owner
];
