import React from 'react';
import { Shield, Sparkles, Cpu, Globe2, Activity, FileCheck } from 'lucide-react';

export type ActiveTab = 'GOVERNOR' | 'PNP_ADMM' | 'HARDWARE' | 'SOVEREIGN_11' | 'J09_RING' | 'MANIFEST';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  openIncidentsCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onChangeTab,
  openIncidentsCount
}) => {
  const tabs = [
    {
      id: 'GOVERNOR' as ActiveTab,
      label: '01. RELEASE GOVERNOR & GATES',
      icon: Shield,
      badge: openIncidentsCount > 0 ? `${openIncidentsCount} ALERTS` : null,
      badgeColor: 'bg-[#ff4e00] text-[#0a0b0e] font-black border-[#ff4e00]'
    },
    {
      id: 'PNP_ADMM' as ActiveTab,
      label: '02. PNP-ADMM PHOTON LAB',
      icon: Sparkles,
      badge: 'QUANTUM 2K',
      badgeColor: 'bg-[#2d3139] text-[#8e9299] border-[#404550]'
    },
    {
      id: 'HARDWARE' as ActiveTab,
      label: '03. HARDWARE & K7 FPGA',
      icon: Cpu,
      badge: 'IMX571 / TEC',
      badgeColor: 'bg-[#2d3139] text-[#8e9299] border-[#404550]'
    },
    {
      id: 'SOVEREIGN_11' as ActiveTab,
      label: '04. SOVEREIGN 11 ENGINES',
      icon: Globe2,
      badge: 'COHERENCE ≥0.99997',
      badgeColor: 'bg-[#2d3139] text-[#8e9299] border-[#404550]'
    },
    {
      id: 'J09_RING' as ActiveTab,
      label: '05. J09 BIO-RESONANCE',
      icon: Activity,
      badge: 'PQC DILITHIUM',
      badgeColor: 'bg-[#2d3139] text-[#8e9299] border-[#404550]'
    },
    {
      id: 'MANIFEST' as ActiveTab,
      label: '06. AUDIT MANIFEST',
      icon: FileCheck,
      badge: 'SEALED JSON',
      badgeColor: 'bg-[#2d3139] text-[#8e9299] border-[#404550]'
    }
  ];

  return (
    <div className="bg-[#15171a] border-b border-[#2d3139] px-4 font-mono">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id.toLowerCase()}`}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-tight whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#0a0b0e] text-[#ff4e00] border-[#ff4e00] shadow-sm shadow-[#ff4e00]/10'
                  : 'bg-[#15171a] text-[#8e9299] hover:text-[#e0e0e0] hover:bg-[#2d3139] border-[#2d3139]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff4e00]' : 'text-[#8e9299]'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${tab.badgeColor}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

