import React from 'react';
import DynamicIcon from './DynamicIcon';
import { getIconTheme } from '../utils/IconRegistry';
import { getRoleNavigationConfig } from '../config/navigationConfig';
import { Menu } from 'lucide-react';

/**
 * MobileTabBar: Context-Aware, Role-Specific Bottom Navigation Bar
 * Features vibrant color themes, glowing active state badges, and touch-optimized hit targets.
 */
export default function MobileTabBar({
  currentTab,
  onNavigate,
  onOpenMenu,
  userRoleContext,
  customPreferences,
  unreadAlertsCount = 0,
  unreadRequestsCount = 0,
  unreadChatCount = 0
}) {
  // Load tailored role navigation tabs
  const roleTabs = getRoleNavigationConfig(userRoleContext, customPreferences);

  // Map badge counts dynamically
  const getBadgeCount = (badgeKey, tabId) => {
    if (badgeKey === 'unreadRequestsCount' || tabId === 'parent-requests') return unreadRequestsCount;
    if (badgeKey === 'unreadAlertsCount' || tabId === 'broadcasts' || tabId === 'feed') return unreadAlertsCount;
    if (badgeKey === 'unreadChatCount' || tabId === 'chat') return unreadChatCount;
    return 0;
  };

  const handleTabClick = (tabId) => {
    if (tabId === '__more__') {
      if (typeof onOpenMenu === 'function') onOpenMenu();
    } else {
      if (typeof onNavigate === 'function') onNavigate(tabId);
    }
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800/90 backdrop-blur-xl px-1 sm:px-2 flex items-center justify-around select-none shadow-2xl print-hide w-full overflow-x-auto scrollbar-none"
    >
      {roleTabs.map((tab) => {
        const isActive = currentTab === tab.id || (!currentTab && tab.id === 'home');
        const badgeCount = getBadgeCount(tab.badgeKey, tab.id);
        const themeStyles = getIconTheme(tab.theme || 'emerald', isActive);

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className="flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-all cursor-pointer relative min-w-[56px] max-w-[80px] min-h-[48px] group"
            title={tab.description || tab.label}
          >
            {/* Vibrant Icon Pill Container */}
            <div className="relative">
              <div className={`p-1.5 rounded-xl flex items-center justify-center ${themeStyles.container}`}>
                <DynamicIcon 
                  name={tab.icon} 
                  size={18} 
                  className={themeStyles.icon}
                />
              </div>

              {/* Real-time Unread Notification Badge */}
              {badgeCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-sm animate-pulse border-2 border-white dark:border-slate-950">
                  {badgeCount > 99 ? '99+' : badgeCount}
                </span>
              )}
            </div>

            {/* Tab Label */}
            <span className={`text-[9.5px] sm:text-[10px] truncate leading-tight mt-0.5 max-w-[72px] text-center ${
              isActive 
                ? `${themeStyles.label} font-extrabold` 
                : 'text-slate-600 dark:text-slate-400 font-semibold group-hover:text-slate-900 dark:group-hover:text-slate-200'
            }`}>
              {tab.label}
            </span>

            {/* Active Indicator Line */}
            {isActive && (
              <span className="w-4 h-0.5 rounded-full mt-0.5 bg-current animate-fadeIn" />
            )}
          </button>
        );
      })}

      {/* Permanent Menu / More Button for full drawer exploration */}
      <button
        type="button"
        onClick={() => handleTabClick('__more__')}
        className="flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-all cursor-pointer relative min-w-[56px] max-w-[80px] min-h-[48px] group text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        title="Open Full Menu"
      >
        <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:scale-105 transition-all">
          <Menu size={18} className="text-slate-700 dark:text-slate-300" />
        </div>
        <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
          Menu
        </span>
      </button>
    </nav>
  );
}
