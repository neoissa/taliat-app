import React, { useState } from 'react';
import DynamicIcon from './DynamicIcon';
import { 
  ICON_CATEGORIES, 
  ALL_AVAILABLE_ICONS, 
  getIconComponent 
} from '../utils/IconRegistry';
import { 
  X, 
  Check, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  Pin, 
  PinOff, 
  Sliders, 
  Search, 
  Sparkles, 
  Shield, 
  Smartphone,
  Layers,
  HelpCircle,
  CheckCircle2,
  GripVertical
} from 'lucide-react';

export default function MobileTabManager({
  isOpen,
  onClose,
  navState,
  onSave,
  onReset,
  currentUser,
  userRoleContext
}) {
  const [tabs, setTabs] = useState(() => (navState?.tabs ? JSON.parse(JSON.stringify(navState.tabs)) : []));
  const [bottomTabIds, setBottomTabIds] = useState(() => (navState?.bottomTabIds ? [...navState.bottomTabIds] : []));
  const [customIcons, setCustomIcons] = useState(() => (navState?.customIcons ? { ...navState.customIcons } : {}));
  const [customLabels, setCustomLabels] = useState(() => (navState?.customLabels ? { ...navState.customLabels } : {}));
  
  // Icon Picker Modal State
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [editingTabId, setEditingTabId] = useState(null);
  const [iconSearchQuery, setIconSearchQuery] = useState('');
  const [selectedIconCategory, setSelectedIconCategory] = useState('all');

  // Saving / Success State
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const isOwner = userRoleContext?.isOwner;

  // ── REORDERING LOGIC ──
  const moveTabUp = (index) => {
    if (index <= 0) return;
    setTabs(prev => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index - 1];
      next[index - 1] = temp;
      return next;
    });
  };

  const moveTabDown = (index) => {
    if (index >= tabs.length - 1) return;
    setTabs(prev => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index + 1];
      next[index + 1] = temp;
      return next;
    });
  };

  // ── VISIBILITY TOGGLE ──
  const toggleVisibility = (tabId) => {
    setTabs(prev => prev.map(t => {
      if (t.id === tabId) {
        if (t.isPermanent) return t; // cannot hide permanent tabs
        const nextVis = !t.visible;
        // If hiding a tab that is in bottom quick bar, unpin it
        if (!nextVis && bottomTabIds.includes(tabId)) {
          setBottomTabIds(bPrev => bPrev.filter(id => id !== tabId));
        }
        return { ...t, visible: nextVis };
      }
      return t;
    }));
  };

  // ── BOTTOM QUICK BAR PIN TOGGLE ──
  const togglePinBottom = (tabId) => {
    if (bottomTabIds.includes(tabId)) {
      // Unpin
      if (bottomTabIds.length <= 1) {
        alert('You must have at least 1 quick tab in the mobile bottom bar.');
        return;
      }
      setBottomTabIds(prev => prev.filter(id => id !== tabId));
    } else {
      // Pin
      if (bottomTabIds.length >= 4) {
        alert('You can pin up to 4 quick tabs in the mobile bar. Please unpin one first.');
        return;
      }
      // Ensure tab is visible
      setTabs(prev => prev.map(t => t.id === tabId ? { ...t, visible: true } : t));
      setBottomTabIds(prev => [...prev, tabId]);
    }
  };

  // ── ICON PICKER HANDLERS ──
  const handleOpenIconPicker = (tabId) => {
    setEditingTabId(tabId);
    setIconSearchQuery('');
    setSelectedIconCategory('all');
    setIconPickerOpen(true);
  };

  const handleSelectIcon = (iconName) => {
    if (!editingTabId) return;
    setCustomIcons(prev => ({
      ...prev,
      [editingTabId]: iconName
    }));
    setTabs(prev => prev.map(t => t.id === editingTabId ? { ...t, icon: iconName } : t));
    setIconPickerOpen(false);
    setEditingTabId(null);
  };

  // ── SAVE & PERSIST ──
  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await onSave({
        tabs,
        bottomTabIds,
        customIcons,
        customLabels
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Error saving layout:', err);
      alert('Failed to save layout. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  // ── RESET TO DEFAULTS ──
  const handleReset = async () => {
    if (!window.confirm('Reset navigation layout to default for your role?')) return;
    setSaving(true);
    try {
      const resetState = await onReset();
      if (resetState) {
        setTabs(resetState.tabs || []);
        setBottomTabIds(resetState.bottomTabIds || []);
        setCustomIcons({});
        setCustomLabels({});
      }
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Error resetting layout:', err);
    } finally {
      setSaving(false);
    }
  };

  // Filtered icons for Icon Picker Modal
  const filteredIcons = ALL_AVAILABLE_ICONS.filter(item => {
    const matchesSearch = item.label.toLowerCase().includes(iconSearchQuery.toLowerCase()) || 
                          item.id.toLowerCase().includes(iconSearchQuery.toLowerCase());
    if (selectedIconCategory === 'all') return matchesSearch;
    const cat = ICON_CATEGORIES.find(c => c.id === selectedIconCategory);
    return matchesSearch && cat?.icons.some(i => i.id === item.id);
  });

  // Find active editing tab object
  const activeEditingTab = tabs.find(t => t.id === editingTabId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden z-10">
        
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
          isOwner ? 'border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950' : 'border-slate-800 bg-slate-900/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              isOwner ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400' : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
            }`}>
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>Customize Navigation</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold uppercase">
                  Mobile & Bar
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Reorder tabs, toggle visibility, and pin up to 4 quick items.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">

          {/* 1. Live Mobile Bottom Quick Bar Preview */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone size={15} className="text-emerald-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  Mobile Bottom Quick Bar Preview ({bottomTabIds.length}/4 Slots)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                Tap the Pin icon on any tab below to toggle
              </span>
            </div>

            {/* Bottom Bar Mockup */}
            <div className="bg-slate-950 border border-slate-750 rounded-xl p-2 flex items-center justify-around shadow-inner">
              {bottomTabIds.map((tabId, idx) => {
                const tabObj = tabs.find(t => t.id === tabId);
                if (!tabObj) return null;
                return (
                  <div key={tabId} className="flex flex-col items-center justify-center flex-1 py-1 px-1 text-emerald-300">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-1">
                      <DynamicIcon name={tabObj.icon} size={15} className="text-emerald-400" />
                    </div>
                    <span className="text-[9px] font-bold truncate max-w-[64px] text-center text-slate-200">
                      {tabObj.label}
                    </span>
                    <span className="text-[8px] text-emerald-400 font-mono font-bold">
                      Slot {idx + 1}
                    </span>
                  </div>
                );
              })}

              {/* Permanent Menu / More button */}
              <div className="flex flex-col items-center justify-center flex-1 py-1 px-1 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-1">
                  <span className="text-xs font-black">☰</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400">Menu</span>
                <span className="text-[8px] text-slate-500 font-mono">Drawer</span>
              </div>
            </div>
          </div>

          {/* 2. Reorderable & Customizable Tab List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={14} className="text-amber-400" />
                <span>All Modules & Navigation Tabs ({tabs.length})</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {tabs.filter(t => t.visible).length} visible
              </span>
            </div>

            <div className="space-y-2">
              {tabs.map((tab, idx) => {
                const isPinned = bottomTabIds.includes(tab.id);
                const pinSlotIndex = bottomTabIds.indexOf(tab.id);

                return (
                  <div
                    key={tab.id}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all ${
                      !tab.visible
                        ? 'bg-slate-900/30 border-slate-800/60 opacity-60'
                        : isPinned
                        ? 'bg-slate-900 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Left: Move Controls + Icon + Label */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      {/* Touch-Friendly Move Up / Down Buttons (min 44px hit area) */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveTabUp(idx)}
                          disabled={idx === 0}
                          className="w-7 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 transition cursor-pointer"
                          title="Move Tab Up"
                          aria-label={`Move ${tab.label} Up`}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveTabDown(idx)}
                          disabled={idx === tabs.length - 1}
                          className="w-7 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 transition cursor-pointer"
                          title="Move Tab Down"
                          aria-label={`Move ${tab.label} Down`}
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      {/* Interactive Icon Button (Click to pick icon) */}
                      <button
                        type="button"
                        onClick={() => handleOpenIconPicker(tab.id)}
                        className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 hover:border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm transition hover:scale-105 cursor-pointer relative group"
                        title="Click to customize icon"
                      >
                        <DynamicIcon name={tab.icon} size={18} />
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-amber-500 border border-slate-900 group-hover:block hidden" />
                      </button>

                      {/* Tab Text Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-white truncate">
                            {tab.label}
                          </span>
                          {tab.isPermanent && (
                            <span className="text-[9px] bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.2 rounded font-mono uppercase shrink-0">
                              Core
                            </span>
                          )}
                          {isPinned && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-black uppercase shrink-0">
                              ★ Slot {pinSlotIndex + 1}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                          {tab.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions (Pin Quick Bar + Show/Hide Toggle) */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-2">
                      {/* Pin to Mobile Bar Button (Touch target min-w-[44px] min-h-[44px]) */}
                      <button
                        type="button"
                        onClick={() => togglePinBottom(tab.id)}
                        className={`min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] px-2.5 rounded-xl border flex items-center justify-center gap-1 text-xs font-bold transition cursor-pointer ${
                          isPinned
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                        title={isPinned ? 'Unpin from quick bar' : 'Pin to quick bar'}
                      >
                        {isPinned ? <Pin size={15} className="fill-emerald-400 text-emerald-400" /> : <PinOff size={15} />}
                        <span className="hidden md:inline text-[11px]">{isPinned ? 'Pinned' : 'Pin'}</span>
                      </button>

                      {/* Visibility Toggle Button */}
                      {!tab.isPermanent ? (
                        <button
                          type="button"
                          onClick={() => toggleVisibility(tab.id)}
                          className={`min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] px-2.5 rounded-xl border flex items-center justify-center gap-1 text-xs font-bold transition cursor-pointer ${
                            tab.visible
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                              : 'bg-red-950/40 hover:bg-red-900/40 text-red-400 border-red-800/60'
                          }`}
                          title={tab.visible ? 'Hide tab from navigation' : 'Show tab in navigation'}
                        >
                          {tab.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                      ) : (
                        <div 
                          className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center text-slate-600 cursor-not-allowed"
                          title="Always visible"
                        >
                          <Eye size={15} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Success Alert Banner */}
        {savedSuccess && (
          <div className="bg-emerald-900/90 text-emerald-200 text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-2 animate-fadeIn border-t border-emerald-500">
            <CheckCircle2 size={16} />
            <span>Navigation layout & preferences successfully saved!</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-red-950/50 hover:text-red-300 text-slate-400 border border-slate-800 hover:border-red-800/60 text-xs font-bold transition cursor-pointer min-h-[44px]"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition cursor-pointer min-h-[44px] shadow-lg ${
                isOwner
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
              }`}
            >
              {saving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check size={16} />
                  <span>Save Layout</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── SUB-MODAL: ICON PICKER POPUP ── */}
        {iconPickerOpen && (
          <div className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Choose Icon for "{activeEditingTab?.label}"
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Select a visual icon from the expanded scouting library
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIconPickerOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search & Category Tabs */}
            <div className="py-3 space-y-2.5 shrink-0">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={iconSearchQuery}
                  onChange={(e) => setIconSearchQuery(e.target.value)}
                  placeholder="Search icons (e.g. Tent, Flame, Shield, Award, Compass)..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedIconCategory('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedIconCategory === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All Icons
                </button>
                {ICON_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedIconCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      selectedIconCategory === cat.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {filteredIcons.map(iconItem => {
                  const IconComp = getIconComponent(iconItem.id);
                  const isCurrent = activeEditingTab?.icon === iconItem.id;

                  return (
                    <button
                      key={iconItem.id}
                      type="button"
                      onClick={() => handleSelectIcon(iconItem.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer min-h-[64px] ${
                        isCurrent
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg scale-105'
                          : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-emerald-500 hover:text-white hover:bg-slate-850'
                      }`}
                    >
                      <IconComp size={22} className="mb-1.5" />
                      <span className="text-[10px] font-bold text-center leading-tight truncate w-full">
                        {iconItem.id}
                      </span>
                    </button>
                  );
                })}
              </div>

              {filteredIcons.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No icons matched "{iconSearchQuery}". Try another keyword.
                </div>
              )}
            </div>

            {/* Submodal Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIconPickerOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Close Picker
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
