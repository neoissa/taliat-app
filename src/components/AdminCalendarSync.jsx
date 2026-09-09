import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  Calendar, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Shield, 
  ShieldCheck, 
  Sparkles, 
  Tent, 
  Users, 
  Check, 
  FileSpreadsheet, 
  Download, 
  Info, 
  Eye, 
  Layers, 
  ChevronRight, 
  Sliders, 
  HelpCircle, 
  CalendarDays, 
  CheckSquare, 
  X,
  Send,
  Lock,
  ArrowRight
} from 'lucide-react';
import { parseMasterCalendarWorkbook, commitEventsToFirestore, DESIGNATED_LOCATIONS } from '../utils/importCalendar.js';
import { MASTER_CALENDAR_DATA } from '../data/masterCalendarData.js';

export default function AdminCalendarSync({ currentUser, onNavigate, onClose }) {
  const isOwner = currentUser?.role === 'owner' || currentUser?.email === 'neoissa@gmail.com';
  const isLeader = currentUser?.role === 'leader' || currentUser?.role === 'admin' || isOwner;

  // Ingestion State
  const [calendarSource, setCalendarSource] = useState('bundled'); // 'bundled' | 'uploaded'
  const [fileName, setFileName] = useState('2026–27 Scout Year Calendar.xlsx');
  const [parsedData, setParsedData] = useState(MASTER_CALENDAR_DATA);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all'); // 'all' | 'youth_program' | 'scouting_program' | 'leader_meeting' | 'camp' | 'special_event' | 'blackout'
  const [islamicOnlyFilter, setIslamicOnlyFilter] = useState(false);
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'blackouts' | 'locations'

  // Commit to Firestore State
  const [committing, setCommitting] = useState(false);
  const [commitProgress, setCommitProgress] = useState({ current: 0, total: 0 });
  const [commitSuccess, setCommitSuccess] = useState(false);
  const [commitError, setCommitError] = useState('');
  const [overwriteMode, setOverwriteMode] = useState('merge'); // 'merge' | 'replace'
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 1. Handle File Upload (Drag & Drop or File Input)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsing(true);
    setParseError('');
    setCommitSuccess(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const result = parseMasterCalendarWorkbook(data);
        setParsedData(result);
        setFileName(file.name);
        setCalendarSource('uploaded');
        setParsing(false);
      } catch (err) {
        console.error('Failed to parse uploaded Excel file:', err);
        setParseError(`Failed to parse spreadsheet: ${err.message}. Ensure it contains a "Calendar" sheet.`);
        setParsing(false);
      }
    };
    reader.onerror = () => {
      setParseError('Failed to read file from disk.');
      setParsing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // 2. Reset to Bundled Master Dataset
  const handleResetToMasterDataset = () => {
    setParsing(true);
    setParseError('');
    setCommitSuccess(false);
    setTimeout(() => {
      setParsedData(MASTER_CALENDAR_DATA);
      setFileName('2026–27 Scout Year Calendar.xlsx');
      setCalendarSource('bundled');
      setParsing(false);
    }, 200);
  };

  // 3. Filtered Ingestion Events for Dry-Run Preview
  const filteredEvents = useMemo(() => {
    if (!parsedData?.events) return [];

    return parsedData.events.filter((ev) => {
      // Type Filter
      if (selectedTypeFilter !== 'all') {
        if (selectedTypeFilter === 'blackout') return false;
        if (ev.eventType !== selectedTypeFilter && ev.category !== selectedTypeFilter) {
          return false;
        }
      }

      // Islamic Filter
      if (islamicOnlyFilter && !ev.isIslamicSpecial) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = ev.title.toLowerCase().includes(q);
        const dateMatch = ev.date.includes(q);
        const locMatch = ev.location.toLowerCase().includes(q);
        const descMatch = (ev.description || '').toLowerCase().includes(q);
        const notesMatch = (ev.rawNotes || '').toLowerCase().includes(q);
        const islamicMatch = (ev.islamicOccasions || []).some(i => i.name.toLowerCase().includes(q));

        return titleMatch || dateMatch || locMatch || descMatch || notesMatch || islamicMatch;
      }

      return true;
    });
  }, [parsedData, selectedTypeFilter, islamicOnlyFilter, searchQuery]);

  // 4. Filtered Blackout Dates
  const filteredBlackouts = useMemo(() => {
    if (!parsedData?.blackouts) return [];

    return parsedData.blackouts.filter((bo) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return bo.title.toLowerCase().includes(q) || bo.date.includes(q) || (bo.rawNotes || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [parsedData, searchQuery]);

  // 5. Commit to Firestore
  const handleExecuteCommit = async () => {
    if (!parsedData?.events || parsedData.events.length === 0) return;

    setCommitting(true);
    setCommitError('');
    setCommitSuccess(false);
    setShowConfirmModal(false);

    try {
      const result = await commitEventsToFirestore(parsedData.events, {
        overwriteMode,
        onProgress: (cur, tot) => {
          setCommitProgress({ current: cur, total: tot });
        }
      });

      if (result.success) {
        setCommitSuccess(true);
      }
    } catch (err) {
      console.error('Failed to commit calendar events to Firestore:', err);
      setCommitError(`Commit Error: ${err.message}`);
    } finally {
      setCommitting(false);
    }
  };

  const stats = parsedData?.stats || {
    totalIngestibleEvents: 0,
    totalBlackouts: 0,
    tuesdayYouthPrograms: 0,
    fridayScoutingPrograms: 0,
    leaderMeetings: 0,
    camps: 0,
    specialEvents: 0,
    islamicOccasionsCount: 0
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* ── HEADER HERO ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/50 border border-slate-750 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none translate-x-10 -translate-y-10">
          <Calendar size={280} className="text-emerald-400" />
        </div>

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-950/60 shrink-0">
            🗓️
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Master Calendar Ingestion & Seeding Hub
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                2026–2027 Scout Year
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full font-mono">
                {fileName}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Automated ingestion engine parsing the official 2026–27 Scouting Year schedule. Ingests weekly Tuesday youth halqas, Friday advancement meetings, Monday executive councils, camps, and Islamic celebrations directly into Firestore.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap relative z-10 shrink-0">
          {/* Hidden File Input */}
          <input
            id="excel-calendar-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />

          <label
            htmlFor="excel-calendar-upload"
            className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs px-4 py-3 rounded-2xl border border-slate-700 transition cursor-pointer flex items-center gap-2 shadow-md hover:border-emerald-500/50"
            title="Upload custom .xlsx or updated schedule"
          >
            <Upload size={15} className="text-emerald-400" />
            <span>Upload Custom .xlsx</span>
          </label>

          {calendarSource === 'uploaded' && (
            <button
              type="button"
              onClick={handleResetToMasterDataset}
              className="bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs px-3.5 py-3 rounded-2xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
              title="Reset to bundled master dataset"
            >
              <RefreshCw size={14} className="text-amber-400" />
              <span>Reset to Master</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={committing || parsing || stats.totalIngestibleEvents === 0}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-5 py-3 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-950/60 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
          >
            <Sparkles size={16} />
            <span>Commit Ingestion to Firestore ({stats.totalIngestibleEvents} Events)</span>
          </button>
        </div>
      </div>

      {/* ── ERROR & SUCCESS ALERTS ── */}
      {parseError && (
        <div className="bg-red-950/80 border border-red-500/80 text-red-200 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
          <AlertTriangle size={18} className="text-red-400 shrink-0" />
          <span className="text-xs font-bold">{parseError}</span>
        </div>
      )}

      {commitSuccess && (
        <div className="bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500 text-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-300">
                ✓ All {parsedData?.events?.length || 0} events successfully committed to Firestore!
              </h4>
              <p className="text-[11px] text-emerald-200/80">
                The Troop Calendar and Attendance sessions have been fully updated with all locations, times, and Islamic occasion notes.
              </p>
            </div>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('events')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shrink-0"
            >
              <span>View Troop Calendar</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}

      {commitError && (
        <div className="bg-red-950/80 border border-red-500/80 text-red-200 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
          <AlertTriangle size={18} className="text-red-400 shrink-0" />
          <span className="text-xs font-bold">{commitError}</span>
        </div>
      )}

      {/* ── STATISTICAL SUMMARY CHIPS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-850 border border-slate-750 p-4 rounded-2xl shadow-md space-y-1">
          <div className="text-slate-400 text-[11px] font-bold flex items-center justify-between">
            <span>Active Sessions</span>
            <span className="text-base">📅</span>
          </div>
          <div className="text-xl font-black text-white font-mono">{stats.totalIngestibleEvents}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">Total Ingestible</div>
        </div>

        <div className="bg-slate-850 border border-slate-750 p-4 rounded-2xl shadow-md space-y-1">
          <div className="text-slate-400 text-[11px] font-bold flex items-center justify-between">
            <span>Friday Meetings</span>
            <span className="text-base">🏕️</span>
          </div>
          <div className="text-xl font-black text-emerald-300 font-mono">{stats.fridayScoutingPrograms}</div>
          <div className="text-[10px] text-slate-400">6:30 PM – 9:00 PM</div>
        </div>

        <div className="bg-slate-850 border border-slate-750 p-4 rounded-2xl shadow-md space-y-1">
          <div className="text-slate-400 text-[11px] font-bold flex items-center justify-between">
            <span>Tuesday Halqas</span>
            <span className="text-base">🕌</span>
          </div>
          <div className="text-xl font-black text-teal-300 font-mono">{stats.tuesdayYouthPrograms}</div>
          <div className="text-[10px] text-slate-400">7:30 PM – 8:30 PM</div>
        </div>

        <div className="bg-slate-850 border border-slate-750 p-4 rounded-2xl shadow-md space-y-1">
          <div className="text-slate-400 text-[11px] font-bold flex items-center justify-between">
            <span>Leader Councils</span>
            <span className="text-base">👑</span>
          </div>
          <div className="text-xl font-black text-amber-300 font-mono">{stats.leaderMeetings}</div>
          <div className="text-[10px] text-amber-400/80">🔒 Restricted Visibility</div>
        </div>

        <div className="bg-slate-850 border border-slate-750 p-4 rounded-2xl shadow-md space-y-1">
          <div className="text-slate-400 text-[11px] font-bold flex items-center justify-between">
            <span>Camps & Retreats</span>
            <span className="text-base">🌲</span>
          </div>
          <div className="text-xl font-black text-sky-300 font-mono">{stats.camps}</div>
          <div className="text-[10px] text-sky-400">Overnight / Multi-Day</div>
        </div>

        <div className="bg-slate-850 border border-slate-750 p-4 rounded-2xl shadow-md space-y-1">
          <div className="text-slate-400 text-[11px] font-bold flex items-center justify-between">
            <span>Blackout Dates</span>
            <span className="text-base">🚫</span>
          </div>
          <div className="text-xl font-black text-rose-300 font-mono">{stats.totalBlackouts}</div>
          <div className="text-[10px] text-rose-400">Closures Filtered</div>
        </div>
      </div>

      {/* ── CONTROLS & FILTER BAR ── */}
      <div className="bg-slate-850 border border-slate-750 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search parsed events by title, date, location, or Islamic occasion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-750 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Event Type Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter size={14} className="text-emerald-400" />
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="bg-slate-900 border border-slate-750 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              <option value="all">⚜️ All Active Types ({parsedData.events.length})</option>
              <option value="scouting_program">🏕️ Friday Scouting Programs ({stats.fridayScoutingPrograms})</option>
              <option value="youth_program">🕌 Tuesday Youth Programs ({stats.tuesdayYouthPrograms})</option>
              <option value="leader_meeting">👑 Leader Executive Meetings ({stats.leaderMeetings})</option>
              <option value="camp">🌲 Camps & Retreats ({stats.camps})</option>
              <option value="special_event">🌟 Special Troop Events ({stats.specialEvents})</option>
            </select>
          </div>

          {/* Islamic Occasion Toggle */}
          <button
            type="button"
            onClick={() => setIslamicOnlyFilter(!islamicOnlyFilter)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border shrink-0 ${
              islamicOnlyFilter
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-750'
            }`}
          >
            <span>🌙 Islamic Occasions Only</span>
            <span className="font-mono text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">
              {stats.islamicOccasionsCount}
            </span>
          </button>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-750 pt-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <CalendarDays size={13} />
              <span>Dry-Run Events Table ({filteredEvents.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('blackouts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'blackouts'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <span>🚫 Blackout Dates & Closures ({filteredBlackouts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('locations')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'locations'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <MapPin size={13} />
              <span>Designated Locations Map</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            Showing <strong className="text-white font-mono">{activeTab === 'events' ? filteredEvents.length : filteredBlackouts.length}</strong> records
          </span>
        </div>
      </div>

      {/* ── TAB 1: DRY-RUN EVENTS TABLE ── */}
      {activeTab === 'events' && (
        <div className="bg-slate-850 border border-slate-750 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-750 font-bold">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Date & Day</th>
                  <th className="py-3 px-4">Time & Duration</th>
                  <th className="py-3 px-4">Event Title & Type</th>
                  <th className="py-3 px-4">Assigned Location</th>
                  <th className="py-3 px-4">Islamic Occasion / Notes</th>
                  <th className="py-3 px-4">Scope & Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {filteredEvents.map((ev, index) => {
                  const dObj = new Date(ev.date + 'T12:00:00');
                  const dayName = dObj.toLocaleDateString('en-US', { weekday: 'short' });
                  const formattedDate = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
                  let typeIcon = '📅';
                  if (ev.eventType === 'scouting_program') {
                    badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
                    typeIcon = '🏕️';
                  } else if (ev.eventType === 'youth_program') {
                    badgeColor = 'bg-teal-950 text-teal-300 border-teal-700/60';
                    typeIcon = '🕌';
                  } else if (ev.eventType === 'leader_meeting') {
                    badgeColor = 'bg-amber-950 text-amber-300 border-amber-600/50';
                    typeIcon = '👑';
                  } else if (ev.eventType === 'camp') {
                    badgeColor = 'bg-sky-950 text-sky-300 border-sky-600/50';
                    typeIcon = '🌲';
                  } else if (ev.eventType === 'special_event' || ev.eventType === 'open_house' || ev.eventType === 'uniform_ordering') {
                    badgeColor = 'bg-purple-950 text-purple-300 border-purple-600/50';
                    typeIcon = '🌟';
                  }

                  return (
                    <tr key={ev.id || index} className="hover:bg-slate-800/60 transition">
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {index + 1}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-750 font-mono text-slate-300">
                            {dayName}
                          </span>
                          <span>{formattedDate}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{ev.date}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-200 flex items-center gap-1">
                          <Clock size={11} className="text-emerald-400" />
                          <span>{ev.time}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {ev.isAllDay ? 'All Day Session' : `${ev.durationHours} hrs`}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{typeIcon}</span>
                          <span>{ev.title}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 flex-wrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${badgeColor}`}>
                            {ev.categoryLabel}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-300 max-w-xs">
                        <div className="flex items-start gap-1">
                          <MapPin size={12} className="text-rose-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{ev.location}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        {ev.islamicOccasions && ev.islamicOccasions.length > 0 ? (
                          <div className="space-y-1">
                            {ev.islamicOccasions.map((occ, oIdx) => (
                              <div key={oIdx} className="inline-flex items-center gap-1 bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                <span>{occ.icon}</span>
                                <span>{occ.name}</span>
                              </div>
                            ))}
                            {ev.rawNotes && (
                              <p className="text-[10px] text-slate-400 italic leading-tight">{ev.rawNotes}</p>
                            )}
                          </div>
                        ) : ev.rawNotes ? (
                          <span className="text-[11px] text-slate-400 italic">{ev.rawNotes}</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {ev.leaderOnly ? (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                            <Lock size={10} /> Leaders Only
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                            <Users size={10} /> Troop-Wide
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: BLACKOUT DATES & CLOSURES ── */}
      {activeTab === 'blackouts' && (
        <div className="bg-slate-850 border border-slate-750 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-black text-lg">
              🚫
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Holiday Blackout Dates & Program Closures ({filteredBlackouts.length})
              </h3>
              <p className="text-xs text-slate-400">
                These dates were designated in the master calendar as no-session days and have been safely bypassed from recurring session generation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredBlackouts.map((bo, idx) => (
              <div key={idx} className="bg-slate-900 border border-rose-950/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <span>🚫</span>
                    <span>{bo.title}</span>
                  </span>
                  <span className="text-[10px] font-mono bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded">
                    {bo.date}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-snug">
                  {bo.rawNotes || 'Scheduled Program Closure'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: DESIGNATED LOCATIONS MAP ── */}
      {activeTab === 'locations' && (
        <div className="bg-slate-850 border border-slate-750 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-lg">
              📍
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Designated Troop Meeting & Activity Facilities
              </h3>
              <p className="text-xs text-slate-400">
                Official addresses assigned automatically to sessions during Excel parsing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-750 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🏫</span>
                <h4 className="text-sm font-bold text-white">Youth & Scouting Programs Headquarters</h4>
              </div>
              <p className="text-xs text-emerald-400 font-mono font-bold">
                {DESIGNATED_LOCATIONS.highview}
              </p>
              <p className="text-xs text-slate-400">
                Applied to all weekly Tuesday Youth Halqas (7:30 PM) and Friday Troop Scouting sessions (6:30 PM).
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-750 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">👑</span>
                <h4 className="text-sm font-bold text-white">Leader Executive Council Headquarters</h4>
              </div>
              <p className="text-xs text-amber-400 font-mono font-bold">
                {DESIGNATED_LOCATIONS.pleasantRidge}
              </p>
              <p className="text-xs text-slate-400">
                Applied to all Monday 9:00 PM executive leadership meetings.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-750 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🌲</span>
                <h4 className="text-sm font-bold text-white">Troop Fall Campgrounds</h4>
              </div>
              <p className="text-xs text-sky-400 font-mono font-bold">
                {DESIGNATED_LOCATIONS.dBarA}
              </p>
              <p className="text-xs text-slate-400">
                Official campsite for Fall Camp (Oct 30 – Nov 1) and outdoor retreats.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-750 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🥋</span>
                <h4 className="text-sm font-bold text-white">Uniform & Athletics Center</h4>
              </div>
              <p className="text-xs text-purple-400 font-mono font-bold">
                {DESIGNATED_LOCATIONS.hypeAthletics}
              </p>
              <p className="text-xs text-slate-400">
                Used for Uniform Ordering & BSA Applications Day and large indoor activities.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRMATION MODAL ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-850 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-lg">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Confirm Master Calendar Ingestion
                  </h3>
                  <p className="text-xs text-slate-400">Commit parsed schedule to Firestore `/events`</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-750 p-4 rounded-2xl space-y-3">
              <div className="text-xs text-slate-300 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Source Dataset:</span>
                  <span className="font-bold text-white font-mono">{fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Ingestible Events:</span>
                  <span className="font-bold text-emerald-400 font-mono">{stats.totalIngestibleEvents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Blackouts Bypassed:</span>
                  <span className="font-bold text-rose-400 font-mono">{stats.totalBlackouts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Islamic Occasions Tagged:</span>
                  <span className="font-bold text-teal-400 font-mono">{stats.islamicOccasionsCount}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-750 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Sync Mode:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOverwriteMode('merge')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                      overwriteMode === 'merge'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div>Merge / Safe Update</div>
                    <div className="text-[10px] text-slate-400 font-normal">Preserves custom fields</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverwriteMode('replace')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                      overwriteMode === 'replace'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div>Clean Ingest</div>
                    <div className="text-[10px] text-slate-400 font-normal">Fresh document write</div>
                  </button>
                </div>
              </div>
            </div>

            {committing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Committing events to Firestore...</span>
                  <span className="font-mono text-emerald-400">
                    {commitProgress.current} / {commitProgress.total}
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-750">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${commitProgress.total > 0 ? (commitProgress.current / commitProgress.total) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={committing}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteCommit}
                disabled={committing}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/50"
              >
                {committing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Ingesting...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Confirm & Ingest</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
