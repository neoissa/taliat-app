import React from 'react';
import DynamicIcon from './DynamicIcon';

/**
 * HubSubNav Component
 * 
 * Renders a clean, modern, horizontal sub-tab bar at the top of multi-tool Hubs.
 * Supports icons, active pill animations, real-time unread badges, and horizontal scrolling on mobile.
 */
export default function HubSubNav({
  tabs = [],
  activeTab,
  onChange,
  hubTitle = '',
  hubSubtitle = '',
  colorTheme = 'emerald',
  className = ''
}) {
  const getThemeClasses = (isActive) => {
    switch (colorTheme) {
      case 'amber':
        return isActive
          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-950/40 border-amber-400'
          : 'text-slate-300 hover:text-amber-200 hover:bg-slate-800/80 border-transparent';
      case 'sky':
        return isActive
          ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white font-black shadow-md shadow-sky-950/40 border-sky-400'
          : 'text-slate-300 hover:text-sky-200 hover:bg-slate-800/80 border-transparent';
      case 'indigo':
        return isActive
          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-black shadow-md shadow-indigo-950/40 border-indigo-400'
          : 'text-slate-300 hover:text-indigo-200 hover:bg-slate-800/80 border-transparent';
      case 'purple':
        return isActive
          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white font-black shadow-md shadow-purple-950/40 border-purple-400'
          : 'text-slate-300 hover:text-purple-200 hover:bg-slate-800/80 border-transparent';
      case 'emerald':
      default:
        return isActive
          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black shadow-md shadow-emerald-950/40 border-emerald-400'
          : 'text-slate-300 hover:text-emerald-200 hover:bg-slate-800/80 border-transparent';
    }
  };

  return (
    <div className={`space-y-2.5 mb-4 ${className}`}>
      {/* Optional Hub Title Bar */}
      {(hubTitle || hubSubtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
          <div>
            {hubTitle && (
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>{hubTitle}</span>
              </h2>
            )}
            {hubSubtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{hubSubtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Pill Tabs Container (Horizontal Scrollable on Mobile) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const themeStyle = getThemeClasses(isActive);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer shrink-0 border select-none ${themeStyle}`}
            >
              {tab.icon && (
                <DynamicIcon
                  name={tab.icon}
                  size={15}
                  className={`shrink-0 ${isActive ? '' : 'text-slate-400'}`}
                />
              )}
              <span className="truncate">{tab.label}</span>

              {/* Dynamic Badge */}
              {tab.badge > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full shrink-0 shadow-xs ${
                  isActive
                    ? 'bg-slate-950 text-white'
                    : 'bg-red-500 text-white animate-pulse'
                }`}>
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
