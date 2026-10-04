import React from 'react';
import DynamicIcon from './DynamicIcon';

/**
 * HubSubNav Component
 * 
 * Clean, lightweight header with direct horizontal tabs on all screens.
 * Minimalist design with zero wordy clutter.
 */
export default function HubSubNav({
  tabs = [],
  activeTab,
  onChange,
  hubTitle = '',
  className = '',
  children
}) {
  return (
    <div className={`space-y-4 w-full ${className}`}>
      {/* ── CLEAN COMPACT HUB HEADER & TABS BAR ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:px-4 sm:py-3 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {hubTitle && (
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>{hubTitle}</span>
          </h2>
        )}

        {/* ── HORIZONTAL TABS (DESKTOP & MOBILE) ── */}
        {tabs.length > 1 && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800/80 rounded-xl overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer shrink-0 select-none ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  {tab.icon && (
                    <DynamicIcon
                      name={tab.icon}
                      size={14}
                      className={isActive ? 'text-slate-950' : 'text-sky-400'}
                    />
                  )}
                  <span>{tab.label}</span>

                  {tab.badge > 0 && (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-slate-950 text-sky-300'
                          : 'bg-sky-500 text-slate-950'
                      }`}
                    >
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── FULL-WIDTH TAB CONTENT ── */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
