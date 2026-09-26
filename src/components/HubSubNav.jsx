import React from 'react';
import DynamicIcon from './DynamicIcon';
import { ChevronRight, LayoutGrid } from 'lucide-react';

/**
 * HubSubNav Component
 * 
 * Provides a modern, high-visibility Sub-Side Navigation layout for multi-tool Hubs.
 * On desktop/tablet (md+): Renders as a vertical left sub-sidebar with rich icons, active glow, and badges.
 * On mobile (<md): Renders as a responsive horizontal scrollable pill bar.
 * When children are provided, it automatically handles the side-by-side grid/flex layout.
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
    switch (colorTheme) {
      case 'amber':
        return {
          desktopActive: 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-950/40 border-amber-400 ring-1 ring-amber-300/30',
          desktopInactive: 'text-slate-300 hover:text-amber-200 hover:bg-slate-800/80 border-transparent',
          mobileActive: 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-950/40 border-amber-400',
          mobileInactive: 'text-slate-300 hover:text-amber-200 hover:bg-slate-800/80 border-transparent',
          iconActive: 'text-slate-950',
          iconInactive: 'text-amber-400 group-hover:text-amber-300',
          badgeActive: 'bg-slate-950 text-amber-300',
          indicator: 'bg-amber-400 text-slate-950',
          activeBorder: 'border-amber-500/30'
        };
      case 'sky':
        return {
          desktopActive: 'bg-gradient-to-r from-sky-500 to-sky-600 text-white font-black shadow-lg shadow-sky-950/40 border-sky-400 ring-1 ring-sky-300/30',
          desktopInactive: 'text-slate-300 hover:text-sky-200 hover:bg-slate-800/80 border-transparent',
          mobileActive: 'bg-gradient-to-r from-sky-500 to-sky-600 text-white font-black shadow-md shadow-sky-950/40 border-sky-400',
          mobileInactive: 'text-slate-300 hover:text-sky-200 hover:bg-slate-800/80 border-transparent',
          iconActive: 'text-white',
          iconInactive: 'text-sky-400 group-hover:text-sky-300',
          badgeActive: 'bg-slate-950 text-sky-300',
          indicator: 'bg-sky-400 text-slate-950',
          activeBorder: 'border-sky-500/30'
        };
      case 'indigo':
        return {
          desktopActive: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-black shadow-lg shadow-indigo-950/40 border-indigo-400 ring-1 ring-indigo-300/30',
          desktopInactive: 'text-slate-300 hover:text-indigo-200 hover:bg-slate-800/80 border-transparent',
          mobileActive: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-black shadow-md shadow-indigo-950/40 border-indigo-400',
          mobileInactive: 'text-slate-300 hover:text-indigo-200 hover:bg-slate-800/80 border-transparent',
          iconActive: 'text-white',
          iconInactive: 'text-indigo-400 group-hover:text-indigo-300',
          badgeActive: 'bg-slate-950 text-indigo-300',
          indicator: 'bg-indigo-400 text-white',
          activeBorder: 'border-indigo-500/30'
        };
      case 'purple':
        return {
          desktopActive: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white font-black shadow-lg shadow-purple-950/40 border-purple-400 ring-1 ring-purple-300/30',
          desktopInactive: 'text-slate-300 hover:text-purple-200 hover:bg-slate-800/80 border-transparent',
          mobileActive: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white font-black shadow-md shadow-purple-950/40 border-purple-400',
          mobileInactive: 'text-slate-300 hover:text-purple-200 hover:bg-slate-800/80 border-transparent',
          iconActive: 'text-white',
          iconInactive: 'text-purple-400 group-hover:text-purple-300',
          badgeActive: 'bg-slate-950 text-purple-300',
          indicator: 'bg-purple-400 text-white',
          activeBorder: 'border-purple-500/30'
        };
      case 'emerald':
      default:
        return {
          desktopActive: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black shadow-lg shadow-emerald-950/40 border-emerald-400 ring-1 ring-emerald-300/30',
          desktopInactive: 'text-slate-300 hover:text-emerald-200 hover:bg-slate-800/80 border-transparent',
          mobileActive: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black shadow-md shadow-emerald-950/40 border-emerald-400',
          mobileInactive: 'text-slate-300 hover:text-emerald-200 hover:bg-slate-800/80 border-transparent',
          iconActive: 'text-slate-950',
          iconInactive: 'text-emerald-400 group-hover:text-emerald-300',
          badgeActive: 'bg-slate-950 text-emerald-300',
          indicator: 'bg-emerald-400 text-slate-950',
          activeBorder: 'border-emerald-500/30'
        };
    }
  };

  const navContent = (
    <div className="w-full">
      {/* ── MOBILE HORIZONTAL SUB-NAV (< md) ── */}
      <div className="block md:hidden mb-4">
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/95 border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none shadow-inner">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const theme = getThemeStyles(isActive);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer shrink-0 border select-none ${
                  isActive ? theme.mobileActive : theme.mobileInactive
                }`}
              >
                {tab.icon && (
                  <DynamicIcon
                    name={tab.icon}
                    size={15}
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

      {/* ── DESKTOP/TABLET VERTICAL SUB-SIDE NAV (md+) ── */}
      <div className="hidden md:block">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl backdrop-blur-md sticky top-20 space-y-2">
          {/* Sub-navigation Header */}
          <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutGrid size={13} className="text-slate-400" />
              <span>Sub Sections</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700/50">
              {tabs.length} {tabs.length === 1 ? 'Tab' : 'Tabs'}
            </span>
          </div>

          {/* Vertical Buttons List */}
          <div className="space-y-1.5 pt-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const theme = getThemeStyles(isActive);

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChange(tab.id)}
                  className={`group w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left border select-none ${
                    isActive ? theme.desktopActive : theme.desktopInactive
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                        isActive
                          ? 'bg-slate-950/20'
                          : 'bg-slate-800/90 border border-slate-700/60'
                      }`}
                    >
                      {tab.icon && (
                        <DynamicIcon
                          name={tab.icon}
                          size={16}
                          className={`shrink-0 ${isActive ? theme.iconActive : theme.iconInactive}`}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-black">{tab.label}</div>
                      {tab.description && (
                        <div
                          className={`text-[10px] font-normal truncate mt-0.5 ${
                            isActive
                              ? colorTheme === 'amber' || colorTheme === 'emerald'
                                ? 'text-slate-900/80 font-medium'
                                : 'text-slate-200/80'
                              : 'text-slate-400 group-hover:text-slate-300'
                          }`}
                        >
                          {tab.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {tab.badge > 0 && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs ${
                          isActive
                            ? theme.badgeActive
                            : 'bg-red-500 text-white animate-pulse'
                        }`}
                      >
                        {tab.badge > 99 ? '99+' : tab.badge}
                      </span>
                    )}
                    <ChevronRight
                      size={14}
                      className={`transition-transform duration-200 ${
                        isActive
                          ? 'translate-x-0.5 opacity-90'
                          : 'opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ── OPTIONAL HUB TITLE BAR ── */}
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
              <span className="text-xs font-semibold text-slate-400">Current View:</span>
              <span className="text-xs font-black text-white bg-slate-800 border border-slate-700 px-3 py-1 rounded-xl shadow-xs">
                {tabs.find(t => t.id === activeTab)?.label || activeTab}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── SIDE-BY-SIDE CONTENT LAYOUT (IF CHILDREN PROVIDED) ── */}
      {children ? (
        <div className="flex flex-col md:flex-row items-start gap-5">
          <div className="w-full md:w-64 lg:w-72 shrink-0">
            {navContent}
          </div>
          <div className="flex-1 min-w-0 w-full">
            {children}
          </div>
        </div>
      ) : (
        navContent
      )}
    </div>
  );
}
