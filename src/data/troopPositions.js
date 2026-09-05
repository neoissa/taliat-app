// src/data/troopPositions.js
// Official BSA Youth & Adult Troop Positions Library based on standard BSA Troop Structure,
// Guide to Advancement, and Positions of Responsibility for Star, Life, and Eagle ranks.

export const TROOP_POSITIONS_CATEGORIES = {
  SENIOR_YOUTH: 'Senior Youth Leadership',
  SPECIALIZED_YOUTH: 'Specialized Troop Youth Leadership',
  ADULT_LEADERSHIP: 'Adult Troop Leadership'
};

export const TROOP_POSITIONS = [
  // ── A. SENIOR YOUTH LEADERSHIP ──
  {
    id: 'spl',
    title: 'Senior Patrol Leader (SPL)',
    shortName: 'SPL',
    category: TROOP_POSITIONS_CATEGORIES.SENIOR_YOUTH,
    icon: '👑',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    reportsTo: 'Scoutmaster',
    minRank: 'First Class (Star / Life recommended)',
    recommendedTenureMonths: 6,
    selectionMethod: 'Elected by the youth members of the troop',
    summary: 'The top youth leader of the troop. Runs all troop meetings, events, activities, and the Patrol Leaders’ Council (PLC), delegating duties and mentoring other youth leaders.',
    coreDuties: [
      'Preside over all troop meetings, assemblies, activities, campouts, and annual program planning conferences.',
      'Chair the monthly Patrol Leaders’ Council (PLC) meetings and set the troop meeting agendas.',
      'Delegate duties and assign responsibilities to troop youth officers (ASPL, Scribe, Quartermaster, etc.).',
      'Meet regularly with the Scoutmaster for leadership coaching and program alignment.',
      'Set an exemplary standard of Scout spirit, uniforming, punctuality, and character for the entire troop.'
    ],
    leadershipExpectations: [
      'Maintain continuous communication with patrol leaders to ensure every patrol is prepared.',
      'Lead by example through servant leadership rather than commanding.',
      'Ensure safety standards and Leave No Trace principles are strictly observed at all troop events.'
    ]
  },
  {
    id: 'aspl',
    title: 'Assistant Senior Patrol Leader (ASPL)',
    shortName: 'ASPL',
    category: TROOP_POSITIONS_CATEGORIES.SENIOR_YOUTH,
    icon: '⚜️',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    reportsTo: 'Senior Patrol Leader (SPL)',
    minRank: 'First Class recommended',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the Senior Patrol Leader with Scoutmaster consultation',
    summary: 'The second-highest youth leader in the troop. Directs troop administrative staff (Scribe, Quartermaster, Historian, Librarian) and assumes the SPL’s responsibilities in their absence.',
    coreDuties: [
      'Direct and supervise specialized troop leadership positions: Scribe, Quartermaster, Librarian, Historian, Webmaster, and Chaplain Aide.',
      'Lead troop meetings, assemblies, and campouts when the Senior Patrol Leader is absent or unavailable.',
      'Serve as an active voting member of the Patrol Leaders’ Council (PLC).',
      'Coordinate logistical setup and cleanup for weekly troop meetings and special courts of honor.',
      'Assist the SPL with annual program execution and troop skill training.'
    ],
    leadershipExpectations: [
      'Proactively anticipate troop operational needs before and during meetings.',
      'Coordinate support functions behind the scenes so the SPL can focus on leading.',
      'Step up immediately whenever meeting transitions require energetic guidance.'
    ]
  },
  {
    id: 'pl',
    title: 'Patrol Leader (PL)',
    shortName: 'PL',
    category: TROOP_POSITIONS_CATEGORIES.SENIOR_YOUTH,
    icon: '🛡️',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Senior Patrol Leader (SPL) & Assistant Scoutmaster',
    minRank: 'Scout / Tenderfoot',
    recommendedTenureMonths: 6,
    selectionMethod: 'Elected by the youth members of the specific patrol',
    summary: 'The primary youth leader of the patrol. Represents the patrol at the Patrol Leaders’ Council (PLC), plans patrol activities, organizes duty rosters, and drives patrol skill building.',
    coreDuties: [
      'Plan and lead weekly patrol meetings, team huddles, and skill development sessions.',
      'Represent the patrol at the Patrol Leaders’ Council (PLC), advocating for patrol ideas and reporting patrol progress.',
      'Establish and enforce duty rosters during camping trips (cooking, cleanup, water hauling, campfire preparation).',
      'Keep patrol members informed of all upcoming troop schedules, gear requirements, and uniform guidelines.',
      'Foster high patrol spirit, teamwork, cheer traditions, and patrol flag identity.'
    ],
    leadershipExpectations: [
      'Ensure every member of the patrol has an active role and feels valued.',
      'Encourage newer patrol members to advance through rank requirements.',
      'Know the strengths, weaknesses, and contact info of every scout in your patrol.'
    ]
  },
  {
    id: 'apl',
    title: 'Assistant Patrol Leader (APL)',
    shortName: 'APL',
    category: TROOP_POSITIONS_CATEGORIES.SENIOR_YOUTH,
    icon: '🤝',
    eagleQualifying: false,
    starLifeQualifying: false,
    qualificationNote: '⚠️ Note: Per the official BSA Guide to Advancement, Assistant Patrol Leader does NOT count toward Star, Life, or Eagle position of responsibility requirements.',
    badgeClass: 'bg-slate-700 text-slate-300 border-slate-600',
    reportsTo: 'Patrol Leader (PL)',
    minRank: 'Scout',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the Patrol Leader',
    summary: 'Assists the Patrol Leader in directing patrol activities and assumes full patrol leadership when the Patrol Leader is absent.',
    coreDuties: [
      'Assist the Patrol Leader in planning meetings, preparing gear, and organizing patrol activities.',
      'Lead the patrol during meetings and outdoor campouts whenever the Patrol Leader is absent.',
      'Help maintain the patrol duty roster and ensure duty assignments are completed thoroughly.',
      'Assist patrol members with rank skill practice and knot tying.',
      'Serve as patrol quartermaster/scribe helper if those specific roles are unassigned in the patrol.'
    ],
    leadershipExpectations: [
      'Work in seamless partnership with the Patrol Leader.',
      'Act as a reliable sounding board for patrol decisions.',
      'Step up without hesitation when the PL needs assistance.'
    ]
  },

  // ── B. SPECIALIZED TROOP YOUTH LEADERSHIP (STAR/LIFE/EAGLE QUALIFYING) ──
  {
    id: 'troop-guide',
    title: 'Troop Guide',
    shortName: 'TG',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '🧭',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Assistant Scoutmaster & SPL',
    minRank: 'First Class or higher',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the Scoutmaster and SPL',
    summary: 'An experienced, older scout assigned to mentor new scouts through their first year in the troop and help them achieve the First Class rank.',
    coreDuties: [
      'Mentor and guide new scout patrols through the transition from Cub Scouts or beginner scouting into troop life.',
      'Teach fundamental scoutcraft, camping, first aid, knot tying, and map & compass navigation skills.',
      'Encourage new scouts toward achieving the Scout, Tenderfoot, Second Class, and First Class ranks.',
      'Prevent bullying, isolation, or dropouts by building camaraderie and belonging among younger scouts.',
      'Attend PLC meetings to advocate for new scout needs and schedule advancement sessions.'
    ],
    leadershipExpectations: [
      'Exhibit exceptional patience and encouragement when teaching basic skills.',
      'Be a reliable big brother/mentor to every new scout in the unit.',
      'Communicate advancement roadblocks to the Assistant Scoutmaster for new scouts.'
    ]
  },
  {
    id: 'quartermaster',
    title: 'Quartermaster',
    shortName: 'QM',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '⛺',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Assistant Senior Patrol Leader (ASPL)',
    minRank: 'Tenderfoot',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the SPL with Scoutmaster consultation',
    summary: 'The troop supply officer. Keeps inventory of troop camping equipment, tents, stoves, flags, and ropes, ensuring gear is maintained, clean, and checked in/out properly.',
    coreDuties: [
      'Maintain an up-to-date inventory of all troop gear, tents, stoves, lanterns, cook kits, and tools.',
      'Oversee the check-out and check-in of patrol camping equipment before and after campouts.',
      'Ensure damaged equipment is tagged, repaired, or reported to adult leadership for replacement.',
      'Maintain the troop trailer / gear storage room in clean, orderly, inspection-ready condition.',
      'Advise the Patrol Leaders’ Council (PLC) on new equipment needs and gear maintenance schedules.'
    ],
    leadershipExpectations: [
      'Be the first to arrive and last to leave when loading and unloading gear trailers.',
      'Demand accountability from patrols returning wet or dirty tents and cook gear.',
      'Maintain organized records of gear assignments.'
    ]
  },
  {
    id: 'scribe',
    title: 'Scribe',
    shortName: 'SCR',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '📝',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Assistant Senior Patrol Leader (ASPL)',
    minRank: 'Tenderfoot',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the SPL with Scoutmaster consultation',
    summary: 'The troop recording secretary. Attends PLC meetings, logs official meeting minutes, records attendance records, and tracks dues and activity payments.',
    coreDuties: [
      'Attend and record detailed minutes of all Patrol Leaders’ Council (PLC) meetings.',
      'Work with adult leaders to ensure accurate attendance records at weekly meetings and campouts.',
      'Assist in tracking dues, event fees, and activity registrations.',
      'Help maintain the troop calendar and distribute meeting notes to youth leaders.',
      'Set a strong example of organizational diligence and prompt recordkeeping.'
    ],
    leadershipExpectations: [
      'Ensure minutes are prepared and shared within 48 hours of PLC meetings.',
      'Maintain accurate, legible logs of all troop decisions.',
      'Coordinate with the troop webmaster to publish key updates.'
    ]
  },
  {
    id: 'librarian',
    title: 'Librarian',
    shortName: 'LIB',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '📚',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Assistant Senior Patrol Leader (ASPL)',
    minRank: 'Scout',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the SPL with Scoutmaster consultation',
    summary: 'Organizes and manages the troop library of merit badge pamphlets, handbooks, fieldbooks, and reference literature, handling check-outs and returns.',
    coreDuties: [
      'Maintain a catalog of all troop merit badge pamphlets, reference manuals, and scout handbooks.',
      'Administer a check-out / check-in system for scouts borrowing merit badge literature.',
      'Recommend purchase of updated merit badge pamphlets as BSA requirements evolve.',
      'Ensure all library materials are kept organized, in good repair, and accessible during meetings.',
      'Promote the reading of merit badge literature to assist scouts in badge exploration.'
    ],
    leadershipExpectations: [
      'Track overdue pamphlets and follow up politely with borrowers.',
      'Keep the physical and digital library catalog up to date.',
      'Ensure the latest editions of Eagle-required pamphlets are in stock.'
    ]
  },
  {
    id: 'historian',
    title: 'Historian',
    shortName: 'HIST',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '📸',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Assistant Senior Patrol Leader (ASPL)',
    minRank: 'Scout',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the SPL with Scoutmaster consultation',
    summary: 'Documents troop events and preserves unit traditions through photographs, videos, scrapbooks, award archives, and historical troop records.',
    coreDuties: [
      'Photograph and record video of troop meetings, campouts, Courts of Honor, and service projects.',
      'Maintain troop photo albums, scrapbooks, and memorabilia archives.',
      'Preserve trophies, ribbons, historic flags, and past troop milestone records.',
      'Provide historical photos and summaries for troop anniversary celebrations and newsletters.',
      'Collaborate with the troop webmaster to feature photos and event recaps online.'
    ],
    leadershipExpectations: [
      'Actively capture candid moments showing true Scout spirit during rugged outings.',
      'Organize media folders systematically by year, event, and patrol.',
      'Respect individual privacy and photo consent guidelines.'
    ]
  },
  {
    id: 'chaplain-aide',
    title: 'Chaplain Aide',
    shortName: 'CA',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '🕌',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Assistant Senior Patrol Leader (ASPL) & Troop Chaplain',
    minRank: 'Tenderfoot',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the SPL with Scoutmaster consultation',
    summary: 'Assists the troop chaplain and adult leaders in conducting religious services, mealtime prayers, the "Duty to God" program, and spiritual reflection (Tadhakkur).',
    coreDuties: [
      'Lead prayers (Duʿāʾ, Bismillāh, and gratitude) before meals and at opening/closing ceremonies.',
      'Help plan and facilitate Scouts’ Own religious services during weekend camping trips.',
      'Encourage troop members to complete their age-appropriate religious emblems and Islamic Basics milestones.',
      'Promote moral values, Islamic ethics (Akhlāq), and mutual respect across the unit.',
      'Remind scouts of prayer times (Ṣalāt) during field outings and ensure clean prayer areas are prepared.'
    ],
    leadershipExpectations: [
      'Set an exemplary standard of reverent, courteous, and upright behavior at all times.',
      'Ensure all religious practices are inclusive, respectful, and spiritually enriching.',
      'Assist scouts who are working on their Islamic knowledge advancement.'
    ]
  },
  {
    id: 'den-chief',
    title: 'Den Chief',
    shortName: 'DC',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '🐺',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Cub Scout Den Leader & Scoutmaster',
    minRank: 'First Class recommended',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the Scoutmaster upon request from a Cub Scout Pack',
    summary: 'A scout who assists a Cub Scout or Webelos den leader with weekly den meetings, models youth scouting skills, and builds a bridge for cubs into the troop.',
    coreDuties: [
      'Assist the adult Den Leader in planning and executing weekly Cub Scout den meetings.',
      'Lead games, songs, stunts, ceremonies, and basic knot tying for Cub Scouts.',
      'Serve as an inspiring older-brother role model of Scout spirit and clean uniforming.',
      'Encourage Webelos Scouts to transition and cross over into the Scouts BSA troop upon graduation.',
      'Complete official BSA Den Chief Training.'
    ],
    leadershipExpectations: [
      'Attend every weekly den meeting punctually and reliably.',
      'Demonstrate endless enthusiasm and patience when interacting with young cub scouts.',
      'Keep the Scoutmaster informed of graduating Webelos.'
    ]
  },
  {
    id: 'instructor',
    title: 'Instructor',
    shortName: 'INST',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '🎯',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Assistant Senior Patrol Leader (ASPL)',
    minRank: 'First Class (Star or Life preferred)',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the SPL with Scoutmaster consultation',
    summary: 'An expert youth scout who specializes in teaching specific scouting and outdoor survival skills (first aid, knots/lashings, navigation, camping, cooking) to troop members.',
    coreDuties: [
      'Instruct troop members in fundamental rank advancement skills using the EDGE method (Explain, Demonstrate, Guide, Enable).',
      'Prepare engaging training demonstrations, props, and hands-on drills for troop meetings.',
      'Assess scout technique and provide constructive, encouraging feedback.',
      'Teach specialized topics: First Aid, Pioneering, Orienteering, Campfire Safety, and Wilderness Survival.',
      'Support the Troop Guide during new scout skill stations.'
    ],
    leadershipExpectations: [
      'Master the subject matter thoroughly before attempting to teach it.',
      'Ensure every learner gets direct, hands-on practice rather than just listening.',
      'Never certify a skill until the scout has demonstrated complete mastery.'
    ]
  },
  {
    id: 'webmaster',
    title: 'Webmaster',
    shortName: 'WEB',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '💻',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Assistant Senior Patrol Leader (ASPL)',
    minRank: 'Tenderfoot',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the SPL with Scoutmaster consultation',
    summary: 'Assists in building, updating, and maintaining the troop website, digital software tools, online calendars, and social media channels under adult oversight.',
    coreDuties: [
      'Keep the troop web portal, events calendar, and announcements accurate and up to date.',
      'Help maintain digital roster tools, photo galleries, and permission forms.',
      'Ensure BSA Youth Protection and Internet Safety guidelines (no full names with personal photos) are strictly followed.',
      'Assist adult leaders in streamlining digital communications and parent portals.',
      'Troubleshoot technical issues for youth members accessing online learning tools.'
    ],
    leadershipExpectations: [
      'Maintain rigorous cybersecurity, privacy, and password discipline.',
      'Ensure mobile-friendly layout and prompt posting of calendar adjustments.',
      'Coordinate with the troop Historian and Scribe.'
    ]
  },
  {
    id: 'outdoor-ethics-guide',
    title: 'Outdoor Ethics Guide',
    shortName: 'OEG',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '🌲',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Assistant Senior Patrol Leader (ASPL)',
    minRank: 'First Class recommended',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the SPL with Scoutmaster consultation',
    summary: 'Guides the troop in practicing Leave No Trace principles, Tread Lightly!, and the Outdoor Code during all outdoor campouts, hikes, and high-adventure treks.',
    coreDuties: [
      'Explain and promote the 7 Principles of Leave No Trace and the Outdoor Code at meetings and campouts.',
      'Conduct campsite environmental impact inspections before the troop departs any outdoor venue.',
      'Help scouts earn the Outdoor Ethics Awareness and Action Awards.',
      'Advise the PLC on low-impact camping practices, campfire safety, and wildlife etiquette.',
      'Lead by example by leaving every natural campsite cleaner than the troop found it.'
    ],
    leadershipExpectations: [
      'Inspect every patrol campsite thoroughly before giving the departure green light.',
      'Educate rather than reprimand when newer scouts inadvertently violate conservation rules.',
      'Inspire a deep reverence for the natural world created by God.'
    ]
  },
  {
    id: 'jasm',
    title: 'Junior Assistant Scoutmaster (JASM)',
    shortName: 'JASM',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '⭐',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    reportsTo: 'Scoutmaster',
    minRank: 'Eagle Scout or Life (Age 16 or 17)',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the Scoutmaster for veteran scouts aged 16–17',
    summary: 'An experienced 16- or 17-year-old scout who has demonstrated exceptional leadership and serves as a bridge between youth leaders and the adult committee.',
    coreDuties: [
      'Assist the Scoutmaster and Assistant Scoutmasters with troop operations, skill testing, and logistics.',
      'Mentor the Senior Patrol Leader and patrol leaders in advanced leadership techniques.',
      'Conduct advanced skill demonstrations and assist in coordinating high-adventure treks.',
      'Supervise troop safety, campsite logistics, and equipment maintenance alongside adult staff.',
      'Function as a senior youth mentor, modeling maturity and the highest standards of the Scout Oath and Law.'
    ],
    leadershipExpectations: [
      'Recognize that you are still a youth member while carrying adult-level trust and responsibility.',
      'Support the SPL without undermining the youth-led authority structure.',
      'Provide invaluable guidance to younger scouts working toward Eagle.'
    ]
  },
  {
    id: 'oa-rep',
    title: 'Order of the Arrow (OA) Troop Representative',
    shortName: 'OA Rep',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '🏹',
    eagleQualifying: true,
    starLifeQualifying: true,
    qualificationNote: '✓ Approved position of responsibility for Star, Life, and Eagle ranks.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Assistant Senior Patrol Leader (ASPL) & OA Troop Adviser',
    minRank: 'First Class (Must be an active OA member)',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the SPL (must be an inducted Order of the Arrow member)',
    summary: 'Serves as the vital communication link between the troop and the local Order of the Arrow (Scouting’s National Honor Society) lodge and chapter.',
    coreDuties: [
      'Coordinate the annual Order of the Arrow unit elections for eligible troop candidates.',
      'Promote OA events, chapter conclaves, fellowship weekends, and high-adventure opportunities.',
      'Encourage inducted Arrowmen in the troop to attain Brotherhood membership and remain active.',
      'Coordinate troop service participation in OA council service projects and camp workdays.',
      'Report on lodge activities during PLC meetings.'
    ],
    leadershipExpectations: [
      'Attend monthly OA chapter meetings faithfully and bring actionable reports to the troop.',
      'Foster the OA traditions of cheerful service and brotherhood.',
      'Encourage newer scouts to meet OA eligibility requirements.'
    ]
  },
  {
    id: 'bugler',
    title: 'Bugler',
    shortName: 'BUG',
    category: TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH,
    icon: '🎺',
    eagleQualifying: false,
    starLifeQualifying: true,
    qualificationNote: '⚠️ Approved for Star and Life ranks ONLY; per official BSA guidelines, Bugler does NOT qualify for the Eagle rank position of responsibility.',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    reportsTo: 'Assistant Senior Patrol Leader (ASPL)',
    minRank: 'Scout',
    recommendedTenureMonths: 6,
    selectionMethod: 'Appointed by the SPL (must be able to play the bugle, trumpet, or cornet)',
    summary: 'Performs musical bugle calls during troop ceremonies, flag raisings/lowerings, assemblies, campout Reveille, and Taps.',
    coreDuties: [
      'Sound official bugle calls during troop campouts: Reveille, Assembly, Mess Call, To the Colors, and Taps.',
      'Perform bugle calls for formal flag-raising and flag-lowering ceremonies at Courts of Honor.',
      'Maintain the troop bugle in clean, polished playing condition.',
      'Lead musical traditions and fanfares during troop gatherings and campfires.'
    ],
    leadershipExpectations: [
      'Practice calls diligently to perform them clearly and respectfully.',
      'Be punctually prepared to sound calls at the exact scheduled moment during campouts.',
      'Work with ceremonial color guards to synchronize fanfare timing.'
    ]
  },

  // ── C. ADULT TROOP LEADERSHIP ──
  {
    id: 'scoutmaster-adult',
    title: 'Scoutmaster (SM)',
    shortName: 'SM',
    category: TROOP_POSITIONS_CATEGORIES.ADULT_LEADERSHIP,
    icon: '👑',
    eagleQualifying: false,
    starLifeQualifying: false,
    qualificationNote: 'Adult Executive Position — Appointed by the Chartered Organization',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    reportsTo: 'Troop Committee & Chartered Organization Representative (COR)',
    minRank: 'Adult (Age 21+)',
    recommendedTenureMonths: 12,
    selectionMethod: 'Selected by the Troop Committee and approved by the Chartered Organization',
    summary: 'The adult leader responsible for the program of the troop. Mentors youth leaders, ensures the troop is youth-led, trains the SPL, and conducts Scoutmaster conferences.',
    coreDuties: [
      'Train and guide the youth leaders (SPL, ASPL, Patrol Leaders) to lead their own troop meetings and activities.',
      'Conduct Scoutmaster conferences with scouts prior to every rank advancement and Board of Review.',
      'Maintain Youth Protection, 2-deep adult leadership, and Safe Scouting compliance on all troop outings.',
      'Oversee the troop’s Islamic, moral, and character development standards.',
      'Coordinate with the Troop Committee Chair on budget, logistics, and adult supervision.'
    ],
    leadershipExpectations: [
      'Give youth leaders the freedom to lead, make mistakes, and learn in a safe environment.',
      'Ensure every youth member is treated with dignity, fairness, and encouragement.',
      'Maintain open, transparent relationships with parents.'
    ]
  },
  {
    id: 'assistant-scoutmaster-adult',
    title: 'Assistant Scoutmaster (ASM)',
    shortName: 'ASM',
    category: TROOP_POSITIONS_CATEGORIES.ADULT_LEADERSHIP,
    icon: '⚜️',
    eagleQualifying: false,
    starLifeQualifying: false,
    qualificationNote: 'Adult Executive Position — Appointed by the Chartered Organization',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    reportsTo: 'Scoutmaster',
    minRank: 'Adult (Age 18+)',
    recommendedTenureMonths: 12,
    selectionMethod: 'Appointed by the Scoutmaster and Troop Committee',
    summary: 'Assists the Scoutmaster with troop program delivery, skill testing, outdoor logistics, and adult supervision; may be assigned to oversee specific patrols or advancement areas.',
    coreDuties: [
      'Support the Scoutmaster during meetings, campouts, and high-adventure outings.',
      'Conduct skill instruction, oral milestone testing, and Scoutmaster conferences when designated.',
      'Serve as an advisor to specific patrols, new-scout programs, or the OA chapter.',
      'Provide secondary adult supervision to fulfill BSA 2-deep leadership mandates.',
      'Assume direction of the troop in the Scoutmaster’s absence.'
    ],
    leadershipExpectations: [
      'Reinforce the Scoutmaster\'s vision for a youth-led troop.',
      'Be a dedicated mentor and skills coach for youth patrol leaders.'
    ]
  },
  {
    id: 'committee-chair-adult',
    title: 'Troop Committee Chair (CC)',
    shortName: 'CC',
    category: TROOP_POSITIONS_CATEGORIES.ADULT_LEADERSHIP,
    icon: '📋',
    eagleQualifying: false,
    starLifeQualifying: false,
    qualificationNote: 'Adult Administrative Position — Appointed by the Chartered Organization',
    badgeClass: 'bg-slate-750 text-slate-300 border-slate-650',
    reportsTo: 'Chartered Organization Representative (COR)',
    minRank: 'Adult (Age 21+)',
    recommendedTenureMonths: 12,
    selectionMethod: 'Appointed by the Chartered Organization',
    summary: 'Leads the Troop Committee of adult volunteers who provide behind-the-scenes support: finances, equipment, transportation, adult recruitment, and Boards of Review.',
    coreDuties: [
      'Organize and chair monthly Troop Committee meetings.',
      'Coordinate parent volunteers to handle finances, equipment, medical records, and travel.',
      'Organize troop Boards of Review for all ranks from Tenderfoot through Life.',
      'Ensure troop policies comply with chartered organization guidelines and BSA bylaws.',
      'Maintain healthy parent communication and support the Scoutmaster.'
    ],
    leadershipExpectations: [
      'Maintain financial transparency and timely charter renewals.',
      'Ensure the troop has all necessary resources to thrive without overburdening the youth leaders.'
    ]
  },
  {
    id: 'patrol-advisor-adult',
    title: 'Patrol Advisor / Unit Leader (Adult)',
    shortName: 'Advisor',
    category: TROOP_POSITIONS_CATEGORIES.ADULT_LEADERSHIP,
    icon: '🛡️',
    eagleQualifying: false,
    starLifeQualifying: false,
    qualificationNote: 'Adult Unit Position — Appointed by Troop Leadership',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    reportsTo: 'Scoutmaster & ASM Team',
    minRank: 'Adult (Age 18+)',
    recommendedTenureMonths: 12,
    selectionMethod: 'Appointed by the Scoutmaster and Troop Committee',
    summary: 'An adult leader assigned to advise and support a specific youth patrol, monitoring attendance, grading homework, and ensuring safety during patrol activities.',
    coreDuties: [
      'Observe and coach the youth Patrol Leader and Assistant Patrol Leader without interfering in their leadership.',
      'Conduct patrol roll call, log service hours, and track attendance health.',
      'Inspect and grade weekly patrol assignments and Islamic curriculum homework.',
      'Facilitate parent communication and provide progress updates for patrol members.',
      'Ensure youth safety and discipline within the patrol circle.'
    ],
    leadershipExpectations: [
      'Empower the youth patrol leader to make decisions.',
      'Encourage patrol cohesion and team spirit.'
    ]
  },
  {
    id: 'merit-badge-counselor',
    title: 'Merit Badge Counselor (MBC)',
    shortName: 'MBC',
    category: TROOP_POSITIONS_CATEGORIES.ADULT_LEADERSHIP,
    icon: '🏅',
    eagleQualifying: false,
    starLifeQualifying: false,
    qualificationNote: 'District / Council Certified Position',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    reportsTo: 'District Advancement Committee & Scoutmaster',
    minRank: 'Adult (Age 18+)',
    recommendedTenureMonths: 12,
    selectionMethod: 'Approved by the Council / District Advancement Committee',
    summary: 'A recognized subject matter expert who interviews, instructs, tests, and certifies scouts in specific merit badge subjects according to official BSA standards.',
    coreDuties: [
      'Interview scouts and review requirements criteria before starting merit badge work.',
      'Coach scouts through hands-on projects, research, and skill demonstrations.',
      'Insist that every requirement is met exactly as written — no more, no less.',
      'Approve and sign off on completed digital blue cards and merit badge milestones.',
      'Maintain BSA Youth Protection protocols during all counseling sessions (buddy system).'
    ],
    leadershipExpectations: [
      'Inspire vocational curiosity and passion for the subject matter.',
      'Provide constructive guidance and rigorous evaluation.'
    ]
  }
];

/**
 * Searches and finds an official position by exact or fuzzy title match
 * @param {string} searchTitle - e.g. 'Senior Patrol Leader', 'SPL', 'Troop Guide', 'Scoutmaster'
 * @returns {object|null} Matching position object or null
 */
export function findPositionByTitle(searchTitle) {
  if (!searchTitle || typeof searchTitle !== 'string') return null;
  const clean = searchTitle.trim().toLowerCase();
  
  // Exact or included title matches
  return TROOP_POSITIONS.find(p => {
    const pTitle = p.title.toLowerCase();
    const pShort = p.shortName.toLowerCase();
    const pId = p.id.toLowerCase();
    return (
      pTitle === clean ||
      pShort === clean ||
      pId === clean ||
      pTitle.includes(clean) ||
      clean.includes(pTitle) ||
      (clean.includes('spl') && pShort === 'spl') ||
      (clean.includes('aspl') && pShort === 'aspl') ||
      (clean.includes('patrol leader') && !clean.includes('assistant') && !clean.includes('senior') && p.id === 'pl') ||
      (clean.includes('assistant patrol leader') && p.id === 'apl') ||
      (clean.includes('quartermaster') && p.id === 'quartermaster') ||
      (clean.includes('scribe') && p.id === 'scribe') ||
      (clean.includes('guide') && p.id === 'troop-guide') ||
      (clean.includes('scoutmaster') && !clean.includes('assistant') && !clean.includes('junior') && p.id === 'scoutmaster-adult') ||
      (clean.includes('assistant scoutmaster') && p.id === 'assistant-scoutmaster-adult')
    );
  }) || null;
}

export const YOUTH_LEADERSHIP_POSITIONS = TROOP_POSITIONS.filter(p => 
  p.category === TROOP_POSITIONS_CATEGORIES.SENIOR_YOUTH || 
  p.category === TROOP_POSITIONS_CATEGORIES.SPECIALIZED_YOUTH
);

export const ADULT_LEADERSHIP_POSITIONS = TROOP_POSITIONS.filter(p => 
  p.category === TROOP_POSITIONS_CATEGORIES.ADULT_LEADERSHIP
);

export const EAGLE_QUALIFYING_POSITIONS = TROOP_POSITIONS.filter(p => p.eagleQualifying);
