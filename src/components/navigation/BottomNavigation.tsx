import React from 'react';
import { Home, Receipt, MessageSquare, Bell, Settings } from 'lucide-react';

export type TabType = 'home' | 'expenses' | 'mediator' | 'reminders' | 'settings';

interface BottomNavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingRemindersCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  pendingRemindersCount = 0,
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'mediator', label: 'Mediator', icon: MessageSquare },
    { id: 'reminders', label: 'Reminders', icon: Bell, badge: pendingRemindersCount },
    { id: 'settings', label: 'More', icon: Settings },
  ] as const;

  return (
    <nav
      id="bottom-nav-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D5] max-w-md mx-auto"
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id as TabType)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-[#1E3932]'
                  : 'text-[#8A958E] hover:text-[#526057]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {'badge' in tab && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-[#C45E3D] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-heading ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
