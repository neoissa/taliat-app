import React from 'react';
import DynamicIcon from './DynamicIcon';

/**
 * HubSubNav Component
 * 
 * Renders a full-width Hub Title Banner and optional mobile quick-scroll pill bar.
 * Sub-menu navigation is elevated directly to the main sidebar for maximum screen workspace.
 */
export default function HubSubNav({
  tabs = [],
  activeTab,
  onChange,
  hubTitle = '',
  hubSubtitle = '',
  colorTheme = 'emerald',
  className = '',
  children
}) {
  const getThemeStyles = (isActive) => {
    return {
      mobileActive: 'bg-gradient-to-r from-sky-500 to-sky-600 text-slate-950 font-black shadow-md shadow-sky-950/40 border-sky-400',
      mobileInactive: 'text-slate-300 hover:text-sky-300 hover:bg-slate-800/80 border-transparent',
      iconActive: 'text-slate-950',
      iconInactive: 'text-sky-400 group-hover:text-sky-300',
      badgeActive: 'bg-slate-950 text-sky-300'
    };
  };

  return (
    <div className={`space-y-4 w-full ${className}`}>
      {/* ── HUB TITLE BANNER ── */}
      {(hubTitle || hubSubtitle) && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {hubTitle && (
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>{hubTitle}</span>
              </h2>
            )}
            {hubSubtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">{hubSubtitle}</p>
            )}
          </div>
          {tabs.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-400">Current Section:</span>
              <span className="text-xs font-black text-white bg-slate-800 border border-slate-700 px-3 py-1 rounded-xl shadow-xs">
                {tabs.find(t => t.id === activeTab)?.label || activeTab}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── MOBILE QUICK HORIZONTAL PILL BAR (< md) ── */}
      {tabs.length > 1 && (
        <div className="block md:hidden">
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/95 border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none shadow-inner">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const theme = getThemeStyles(isActive);

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer shrink-0 border select-none ${
                    isActive ? theme.mobileActive : theme.mobileInactive
                  }`}
                >
                  {tab.icon && (
                    <DynamicIcon
                      name={tab.icon}
                      size={14}
                      className={`shrink-0 ${isActive ? theme.iconActive : theme.iconInactive}`}
                    />
                  )}
                  <span className="truncate">{tab.label}</span>

                  {tab.badge > 0 && (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded-full shrink-0 shadow-xs ${
                        isActive
                          ? theme.badgeActive
                          : 'bg-red-500 text-white animate-pulse'
                      }`}
                    >
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FULL-WIDTH TAB CONTENT ── */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
