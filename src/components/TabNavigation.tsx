import React from 'react';
import {
  Shield,
  Sparkles,
  Cpu,
  Globe2,
  Activity,
  FileCheck,
  Camera,
  Grid,
  HardDrive,
  AppWindow,
  Layers
} from 'lucide-react';

export type ActiveTab =
  | 'DUAL_CAMERA'
  | 'MATRIX_ENGINE'
  | 'DRIVER_CPU'
  | 'SOVEREIGN_LATTICE'
  | 'GOVERNOR'
  | 'PNP_ADMM'
  | 'HARDWARE'
  | 'SOVEREIGN_11'
  | 'J09_RING'
  | 'MANIFEST';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  openIncidentsCount: number;
  isDesktopWindowsMode: boolean;
  onToggleDesktopWindowsMode: () => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onChangeTab,
  openIncidentsCount,
  isDesktopWindowsMode,
  onToggleDesktopWindowsMode
}) => {
  const tabs = [
    {
      id: 'DUAL_CAMERA' as ActiveTab,
      label: '01. DUAL CAM & LINK (∞)',
      icon: Camera,
      badge: 'FRONT / REAR 4K',
      badgeColor: 'bg-[#ff4e00]/20 text-[#ff4e00] font-bold border-[#ff4e00]/40'
    },
    {
      id: 'MATRIX_ENGINE' as ActiveTab,
      label: '02. MATRIX ENGINE',
      icon: Grid,
      badge: '5D / NAM / Ĥ',
      badgeColor: 'bg-[#00e5ff]/20 text-[#00e5ff] font-bold border-[#00e5ff]/40'
    },
    {
      id: 'DRIVER_CPU' as ActiveTab,
      label: '03. DRIVERS & 16-CPU',
      icon: Cpu,
      badge: 'AVX-512 / DMA',
      badgeColor: 'bg-[#22c55e]/20 text-[#22c55e] font-bold border-[#22c55e]/40'
    },
    {
      id: 'SOVEREIGN_LATTICE' as ActiveTab,
      label: '04. SOVEREIGN LATTICE',
      icon: Sparkles,
      badge: '432Hz LUX CODEX',
      badgeColor: 'bg-[#00e5ff]/20 text-[#00e5ff] font-bold border-[#00e5ff]/40'
    },
    {
      id: 'GOVERNOR' as ActiveTab,
      label: '05. RELEASE GOVERNOR',
      icon: Shield,
      badge: openIncidentsCount > 0 ? `${openIncidentsCount} ALERTS` : null,
      badgeColor: 'bg-[#ff4e00] text-[#0a0b0e] font-black border-[#ff4e00]'
    },
    {
      id: 'PNP_ADMM' as ActiveTab,
      label: '06. PNP-ADMM LAB',
      icon: Layers,
      badge: 'QUANTUM 2K',
      badgeColor: 'bg-[#2d3139] text-[#8e9299] border-[#404550]'
    },
    {
      id: 'HARDWARE' as ActiveTab,
      label: '07. HARDWARE & K7',
      icon: HardDrive,
      badge: 'IMX571 / TEC',
      badgeColor: 'bg-[#2d3139] text-[#8e9299] border-[#404550]'
    },
    {
      id: 'SOVEREIGN_11' as ActiveTab,
      label: '08. SOVEREIGN 11',
      icon: Globe2,
      badge: 'COHERENCE ≥0.99997',
      badgeColor: 'bg-[#2d3139] text-[#8e9299] border-[#404550]'
    },
    {
      id: 'J09_RING' as ActiveTab,
      label: '09. J09 BIO-RING',
      icon: Activity,
      badge: 'PQC DILITHIUM',
      badgeColor: 'bg-[#2d3139] text-[#8e9299] border-[#404550]'
    },
    {
      id: 'MANIFEST' as ActiveTab,
      label: '10. MANIFEST',
      icon: FileCheck,
      badge: 'SEALED JSON',
      badgeColor: 'bg-[#2d3139] text-[#8e9299] border-[#404550]'
    }
  ];

  return (
    <div className="bg-[#15171a] border-b border-[#2d3139] px-4 font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 py-2.5">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && !isDesktopWindowsMode;

            return (
              <button
                key={tab.id}
                id={`tab-${tab.id.toLowerCase()}`}
                onClick={() => {
                  onChangeTab(tab.id);
                  if (isDesktopWindowsMode) onToggleDesktopWindowsMode();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-tight whitespace-nowrap transition-all cursor-pointer border ${
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

        {/* Desktop Windows Mode Toggle Switcher */}
        <button
          onClick={onToggleDesktopWindowsMode}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap border shadow-sm ${
            isDesktopWindowsMode
              ? 'bg-[#00e5ff] text-[#0a0b0e] border-[#00e5ff] shadow-md shadow-[#00e5ff]/20'
              : 'bg-[#1f242e] text-[#00e5ff] hover:bg-[#282f3c] border-[#00e5ff]/50 hover:border-[#00e5ff]'
          }`}
          title="Switch to Desktop Display Homescreen with double-click icons, resizable windows, scaling, and custom pointer"
        >
          <AppWindow className="w-3.5 h-3.5" />
          <span>{isDesktopWindowsMode ? '💻 DESKTOP DISPLAY (ACTIVE)' : '💻 SWITCH TO DESKTOP OS'}</span>
        </button>
      </div>
    </div>
  );
};
