import React, { useState } from 'react';
import {
  BookOpen,
  Shield,
  ShieldCheck,
  Phone,
  Mail,
  FileText,
  Download,
  ExternalLink,
  Users,
  Compass,
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  CheckSquare,
  HelpCircle,
  Package,
  Layers,
  Thermometer,
  CloudRain,
  Sun,
  ShieldAlert
} from 'lucide-react';
import { getLatestAchievedRank } from '../data/ranksData';

// Official BSA Downloadable Resources
const OFFICIAL_BSA_DOCS = [
  {
    id: 'eagle-workbook',
    title: 'Eagle Scout Service Project Workbook',
    pubNumber: 'BSA Pub No. 512-927',
    description: 'The mandatory official workbook required for all 5 project phases: Proposal, 4 Signatures, Plan, Fundraising Application, and Final Report.',
    url: 'https://filestore.scouting.org/filestore/pdf/512-927_fillable.pdf',
    badge: 'Official Mandatory Workbook',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-600',
    type: 'Fillable PDF'
  },
  {
    id: 'eagle-application',
    title: 'Eagle Scout Rank Application',
    pubNumber: 'BSA Pub No. 512-728',
    description: 'Official application for certification of 21 Merit Badges, 6-Month Leadership Position, 5–6 References, Statement of Ambitions, and Board of Review.',
    url: 'https://filestore.scouting.org/filestore/pdf/512-728_WB_fillable.pdf',
    badge: 'Official Rank Application',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-600',
    type: 'Fillable PDF'
  },
  {
    id: 'medical-form',
    title: 'Annual Health & Medical Record (Parts A, B & C)',
    pubNumber: 'BSA Health & Safety',
    description: 'Required medical history and parent consent form for all outings, campouts, summer camp, and high-adventure expeditions.',
    url: 'https://www.scouting.org/health-and-safety/ahmr/',
    badge: 'Mandatory for Campouts',
    badgeColor: 'bg-sky-950 text-sky-300 border-sky-600',
    type: 'Official BSA Link'
  },
  {
    id: 'guide-advancement',
    title: 'BSA Guide to Advancement (Pub 33088)',
    pubNumber: 'BSA National Policy',
    description: 'The official governing handbook outlining all policies for rank advancements, merit badge counselor requirements, and Board of Review standards.',
    url: 'https://www.scouting.org/resources/guide-to-advancement/',
    badge: 'Advancement Policy',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-600',
    type: 'Official Web Guide'
  },
  {
    id: 'safe-scouting',
    title: 'BSA Guide to Safe Scouting',
    pubNumber: 'Youth Protection & Safety',
    description: 'Policies on youth protection, camping safety, vehicle transportation, water activities, and severe weather protocols.',
    url: 'https://www.scouting.org/health-and-safety/gss/',
    badge: 'Safety Handbook',
    badgeColor: 'bg-red-950 text-red-300 border-red-600',
    type: 'Safety Guidelines'
  }
];

// Packing Checklists Data
const PACKING_LISTS = {
  essentials: {
    id: 'essentials',
    title: 'The 10 Outdoor Essentials',
    description: 'Must-have survival and safety items carried by every scout on every outdoor activity and hike.',
    items: [
      { name: 'Pocketknife', detail: 'Folding lock-blade knife. Must have passed Totin’ Chip certification.' },
      { name: 'First Aid Kit', detail: 'Personal kit with adhesive bandages, gauze, antiseptic wipes, blister moleskin.' },
      { name: 'Extra Clothing & Rain Gear', detail: 'Waterproof rain jacket/poncho and non-cotton insulating layers.' },
      { name: 'Flashlight / Headlamp', detail: 'LED headlamp or compact flashlight with fresh backup batteries.' },
      { name: 'Trail Food & Snacks', detail: 'High-energy trail mix, granola bars, dried fruits, halal jerky.' },
      { name: 'Water Bottle / Hydration Pack', detail: 'At least 1 to 2 liters of drinking water in durable reusable bottles.' },
      { name: 'Matches & Fire Starter', detail: 'Waterproof matches, striker, or fire tinder in sealed container (Firem’n Chip certified).' },
      { name: 'Sun Protection', detail: 'Broad-spectrum SPF 30+ sunscreen, UV sunglasses, and wide-brim hat.' },
      { name: 'Map & Compass', detail: 'Topographic trail map and magnetic compass for land navigation.' },
      { name: 'Emergency Shelter / Blanket', detail: 'Mylar reflective emergency space blanket or lightweight bivvy bag.' }
    ]
  },
  weekend: {
    id: 'weekend',
    title: 'Standard Weekend Campout Gear',
    description: 'Complete personal packing list for 2-day / 1-night troop campouts and cabin retreats.',
    items: [
      { name: 'Sleeping Bag & Compression Sack', detail: 'Appropriate temperature rating for season (30°F or lower for spring/autumn).' },
      { name: 'Sleeping Pad / Mat', detail: 'Insulated foam or inflatable pad to prevent thermal loss from the ground.' },
      { name: 'Personal Mess Kit & Spork', detail: 'Durable plate/bowl, cup, utensils, and mesh dunk bag for drying.' },
      { name: 'Class A Field Uniform', detail: 'Complete BSA scout shirt with patches, neckerchief, slide, and scout belt for travel.' },
      { name: 'Class B Activity T-Shirts', detail: '2–3 troop activity shirts for daytime hiking, camp cooking, and games.' },
      { name: 'Sturdy Hiking Boots & Socks', detail: 'Broken-in hiking boots and 3 pairs of moisture-wicking synthetic or wool socks.' },
      { name: 'Personal Hygiene Kit', detail: 'Toothbrush, toothpaste, biodegradable soap, hand towel, comb.' },
      { name: 'Daypack / Backpack', detail: '25–40L daypack to carry 10 essentials on daytime hikes and service tasks.' },
      { name: 'Scout Handbook & Pen', detail: 'Official Scout Handbook in ziploc bag for rank requirement sign-offs.' },
      { name: 'Camp Chair (Optional)', detail: 'Lightweight folding camp chair for patrol campfires and meal circles.' }
    ]
  },
  winter: {
    id: 'winter',
    title: 'Cold Weather & Winter Expedition Additions',
    description: 'Critical cold-weather gear to maintain thermal safety and prevent hypothermia.',
    items: [
      { name: 'Thermal Base Layer (Top & Bottom)', detail: 'Strictly NO COTTON. Moisture-wicking polyester, polypropylene, or merino wool.' },
      { name: 'Insulating Mid-Layer', detail: 'Thick fleece pullover, synthetic down jacket, or wool sweater.' },
      { name: 'Waterproof & Windproof Outer Shell', detail: 'Breathable, waterproof jacket and snow/rain pants.' },
      { name: 'Wool Beanie & Neck Gaiter', detail: 'Heavyweight fleece/wool cap covering ears and thermal balaclava or neck gaiter.' },
      { name: 'Insulated Waterproof Gloves & Liners', detail: '2 pairs: thin liner gloves and heavy waterproof ski/snowboard mittens.' },
      { name: 'Thermal Insulated Boots', detail: 'Waterproof snow boots with removable felt or Thinsulate insulation liners.' },
      { name: 'Double Sleeping Pad Setup', detail: 'Closed-cell foam pad underneath an inflatable pad to block freezing ground temperatures.' },
      { name: 'Chemical Hand & Toe Warmers', detail: '3–4 packs of air-activated heat warmers for gloves and sleeping bag footbox.' }
    ]
  }
};

export default function ParentPatrolResources({
  linkedScouts = [],
  selectedScoutId = 'all',
  onSelectScout,
  allGroups = [],
  allUsers = [],
  onNavigate
}) {
  // Determine active scout
  const effectiveScout = 
    (selectedScoutId !== 'all' ? linkedScouts.find(s => s.uid === selectedScoutId) : null) || 
    linkedScouts[0] || 
    null;

  const activeScoutId = effectiveScout?.uid;
  const [selectedPackingTab, setSelectedPackingTab] = useState('essentials');

  // Group / Patrol Info
  const scoutGroupId = effectiveScout?.groupId;
  const scoutGroup = allGroups.find(g => g.id === scoutGroupId) || {};
  const scoutPatrolName = 
    effectiveScout?.patrol || 
    effectiveScout?.patrolName || 
    effectiveScout?.talia || 
    scoutGroup.name || 
    'Taliʿat Abū al-Fadl al-ʿAbbās';

  // Leaders matching this group/patrol or troop executives
  const patrolLeaders = allUsers.filter(u => {
    if (u.role !== 'leader' && u.role !== 'admin' && u.role !== 'owner') return false;
    if (u.groupId && u.groupId === scoutGroupId) return true;
    if (u.patrolId && u.patrolId === scoutGroupId) return true;
    if (u.assignedPatrol && u.assignedPatrol === scoutGroupId) return true;
    if (['Scoutmaster', 'Assistant Scoutmaster', 'Unit Leader', 'Committee Chair'].includes(u.leaderPosition || u.leadershipPosition)) return true;
    if (u.role === 'admin' || u.role === 'owner') return true;
    return false;
  });

  // Fallback leadership contacts if database has empty group leaders
  const displayLeaders = patrolLeaders.length > 0 ? patrolLeaders : [
    {
      uid: 'sm_default',
      fullName: 'Br. Hassan Issa',
      leaderPosition: 'Scoutmaster & Unit Leader',
      phone: '(313) 555-0192',
      email: 'scoutmaster@dhulfiqarscouts.org',
      role: 'leader'
    },
    {
      uid: 'asm_default',
      fullName: 'Br. Ali Reza',
      leaderPosition: 'Taliʿa Patrol Advisor',
      phone: '(313) 555-0144',
      email: 'patrol.advisor@dhulfiqarscouts.org',
      role: 'leader'
    },
    {
      uid: 'committee_default',
      fullName: 'Sr. Fatima Zahra',
      leaderPosition: 'Troop Committee & Safety Officer',
      phone: '(313) 555-0188',
      email: 'committee@dhulfiqarscouts.org',
      role: 'leader'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-sans pb-12">
      
      {/* ── TOP MULTI-CHILD PATROL SWITCHER PILLS ── */}
      {linkedScouts.length > 1 && (
        <div className="bg-slate-900 border border-slate-750 p-2.5 rounded-2xl flex items-center justify-between gap-2 overflow-x-auto scrollbar-none shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black text-slate-400 px-2 flex items-center gap-1">
              <Users size={12} className="text-emerald-400" />
              <span>Patrol Scope:</span>
            </span>
            {linkedScouts.map(scout => {
              const isSelected = scout.uid === activeScoutId;
              const pName = scout.patrol || scout.patrolName || scout.talia || allGroups.find(g => g.id === scout.groupId)?.name || 'Taliʿa Unit';
              return (
                <button
                  key={scout.uid}
                  type="button"
                  onClick={() => onSelectScout && onSelectScout(scout.uid)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 scale-[1.02]'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-slate-950/60 border border-white/20 flex items-center justify-center text-[10px] font-black shrink-0 uppercase">
                    {scout.fullName?.charAt(0) || scout.username?.charAt(0) || 'S'}
                  </div>
                  <span>{scout.fullName || scout.username}</span>
                  <span className="text-[10px] opacity-75 font-mono">({pName})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 1. DYNAMIC PATROL HEADER & UNIT PROFILE ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/50 border border-slate-750 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-900 border-2 border-emerald-400/50 flex items-center justify-center text-3xl shadow-xl shadow-emerald-950/60 shrink-0">
              ⚜️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Official Patrol Resources & Directory
                </span>
                <span className="text-[10px] bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full font-mono">
                  {effectiveScout ? `Scout: ${effectiveScout.fullName || effectiveScout.username}` : 'Troop Unit'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {scoutPatrolName}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {scoutGroup.description || 'Dedicated to leadership, outdoorsmanship, brotherhood, Islamic character, and the pursuit of the Eagle Scout rank.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 shrink-0 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-755">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Calendar size={11} className="text-emerald-400" /> Meeting Schedule
              </span>
              <p className="text-xs font-bold text-white font-mono">
                {scoutGroup.meetingTime || 'Sundays 11:00 AM – 1:30 PM'}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <MapPin size={11} className="text-emerald-400" /> Meeting Hall
              </span>
              <p className="text-xs font-bold text-white truncate">
                {scoutGroup.meetingLocation || 'Troop Scout Hall & Basecamp'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. PATROL LEADERSHIP & DIRECT CONTACT ROSTER ── */}
      <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-750 pb-3">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <HeartHandshake size={18} className="text-emerald-400" />
              <span>Patrol & Troop Leadership Contacts</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct communication channels for your child’s patrol advisor, unit leaders, and safety officers.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-900 text-slate-300 border border-slate-700">
            {displayLeaders.length} Registered Leaders
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {displayLeaders.map((ldr, idx) => {
            const role = ldr.leaderPosition || ldr.leadershipPosition || (ldr.role === 'owner' ? 'Supreme Unit Commander' : 'Patrol Leader / Advisor');
            return (
              <div 
                key={ldr.uid || idx}
                className="bg-slate-900/90 border border-slate-755 hover:border-slate-700 p-4 rounded-2xl space-y-3 transition shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
                    {ldr.fullName?.charAt(0) || ldr.username?.charAt(0) || 'L'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-white truncate">{ldr.fullName || ldr.username}</h4>
                    <span className="text-[10px] font-bold text-emerald-400 block truncate">{role}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                  {ldr.phone ? (
                    <a
                      href={`tel:${ldr.phone}`}
                      className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition font-mono text-[11px] p-1.5 rounded-lg hover:bg-slate-800"
                    >
                      <Phone size={12} className="text-emerald-400 shrink-0" />
                      <span>{ldr.phone}</span>
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 text-slate-500 font-mono text-[11px] p-1.5">
                      <Phone size={12} className="shrink-0" /> On Troop Dispatch
                    </span>
                  )}

                  {ldr.email ? (
                    <a
                      href={`mailto:${ldr.email}`}
                      className="flex items-center gap-2 text-slate-300 hover:text-sky-400 transition font-mono text-[11px] p-1.5 rounded-lg hover:bg-slate-800 truncate"
                    >
                      <Mail size={12} className="text-sky-400 shrink-0" />
                      <span className="truncate">{ldr.email}</span>
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 text-slate-500 font-mono text-[11px] p-1.5">
                      <Mail size={12} className="shrink-0" /> In-App Messenger
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. OFFICIAL BSA DOCUMENT & REFERENCE LIBRARY ── */}
      <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-750 pb-3">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <FileText size={18} className="text-sky-400" />
              <span>Official BSA Reference & Document Library</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Official fillable PDFs, national workbooks, medical forms, and regulatory advancement guidelines.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-sky-950 text-sky-300 border border-sky-800">
            Direct BSA Filestore Links
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {OFFICIAL_BSA_DOCS.map(doc => (
            <div
              key={doc.id}
              className="bg-slate-900/90 border border-slate-755 hover:border-slate-700 p-4 rounded-2xl flex flex-col justify-between gap-3 transition shadow-md group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${doc.badgeColor}`}>
                    {doc.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{doc.pubNumber}</span>
                </div>
                <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition">
                  {doc.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {doc.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-400 font-bold">{doc.type}</span>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 px-3 py-1.5 rounded-xl border border-emerald-700/60 transition cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download / Open</span>
                  <ExternalLink size={11} className="opacity-70" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. PATROL EQUIPMENT CHECKLISTS & PACKING PROTOCOLS ── */}
      <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-750 pb-3">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Package size={18} className="text-amber-400" />
              <span>Patrol Gear Checklists & Packing Guidelines</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ensure your scout is properly equipped for safety, cold weather, and all outdoor adventures.
            </p>
          </div>

          {/* Packing Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-750 self-start sm:self-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedPackingTab('essentials')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedPackingTab === 'essentials'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass size={13} />
              <span>10 Essentials</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPackingTab('weekend')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedPackingTab === 'weekend'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun size={13} />
              <span>Weekend Campout</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPackingTab('winter')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedPackingTab === 'winter'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Thermometer size={13} />
              <span>Winter / Cold</span>
            </button>
          </div>
        </div>

        {/* Selected Packing List Details */}
        {(() => {
          const activeList = PACKING_LISTS[selectedPackingTab];
          return (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-755 p-4 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <span>{activeList.title}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono font-bold">
                      {activeList.items.length} Items Required
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{activeList.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeList.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/60 border border-slate-755 p-3.5 rounded-2xl flex items-start gap-3 hover:border-slate-700 transition"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 font-black text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h5 className="text-xs font-extrabold text-white">{it.name}</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{it.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── 5. YOUTH PROTECTION & SAFETY PROTOCOLS ── */}
      <div className="bg-slate-850 border border-slate-750 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-750 pb-3">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-400" />
              <span>Youth Protection & Troop Safety Protocols</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly enforced standards protecting all youth scouts during meetings, outings, and online communication.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-red-950 text-red-300 border border-red-700">
            Zero-Tolerance Policy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {[
            {
              id: 'two-deep',
              title: 'Two-Deep Leadership Rule',
              icon: '🛡️',
              summary: 'A minimum of two registered adult leaders, or one registered leader and a participating parent, are required for all activities.',
              details: 'One-on-one contact between an adult and youth (who is not their child) is strictly forbidden in all settings, including electronic messaging, vehicle transport, and private rooms.'
            },
            {
              id: 'buddy-system',
              title: 'The Scout Buddy System',
              icon: '🤝',
              summary: 'Scouts must always operate in pairs or groups of three at all times during meetings, campouts, and hikes.',
              details: 'No scout may leave the campsite, hike a trail, or use camp facilities alone. Buddies look out for each other’s physical safety and hydration.'
            },
            {
              id: 'medical-forms',
              title: 'Medical Records & Medication Policy',
              icon: '🏥',
              summary: 'Every scout must have current BSA Annual Health Forms A & B on file with the troop.',
              details: 'Prescription medications must be in original containers, clearly labeled with dosage, and handed directly to the designated adult health officer before departure.'
            },
            {
              id: 'dropoff-policy',
              title: 'Timely Drop-Off & Pick-Up Safety',
              icon: '🚗',
              summary: 'Parents must ensure two adult leaders are present before dropping off their scout.',
              details: 'Scouts under 14 will only be released to parents/guardians listed on their household profile. Please arrive 10 minutes prior to dismissal.'
            }
          ].map(rule => (
            <div
              key={rule.id}
              className="bg-slate-900/90 border border-slate-755 p-4 rounded-2xl space-y-2 hover:border-slate-700 transition shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{rule.icon}</span>
                <h4 className="text-xs font-black text-white">{rule.title}</h4>
              </div>
              <p className="text-xs font-semibold text-slate-300 leading-relaxed font-sans">{rule.summary}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                {rule.details}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. PARENT COACHING & MENTORSHIP GUIDE ── */}
      <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-600/40 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 font-black text-xl shrink-0">
            💡
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">
              Parent Mentorship Guide: Supporting the Scout Journey
            </h3>
            <p className="text-xs text-emerald-300/90 font-medium">
              How parents can best empower their scouts to build resilience, character, and complete the Eagle rank.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-755 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">1. Scout-Led Ownership</span>
            <h4 className="text-xs font-bold text-white">Let the Scout Lead</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Resist the urge to complete requirements, contact counselors, or pack gear for your scout. Scouting teaches self-reliance by allowing youth to organize their own binders and call merit badge counselors directly.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-755 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block">2. Pacing & Deadlines</span>
            <h4 className="text-xs font-bold text-white">Mind the 18th Birthday Gate</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              All Eagle requirements, the 21 merit badges, 6-month leadership position, and the Eagle Service Project must be completed before the scout turns 18. Encourage steady pacing (1 badge every 4–6 weeks).
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-755 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">3. Constructive Encouragement</span>
            <h4 className="text-xs font-bold text-white">Celebrate Every Milestone</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Attend Courts of Honor, review digital reports together, and encourage your scout when they hit difficult obstacles in long tracking badges (Personal Fitness, Personal Management, Family Life).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
