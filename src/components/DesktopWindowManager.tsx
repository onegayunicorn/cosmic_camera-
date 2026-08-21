import React, { useState, useRef, useEffect } from 'react';
import {
  AppWindow,
  Shield,
  Sparkles,
  Cpu,
  Globe2,
  Activity,
  FileCheck,
  Camera,
  Grid,
  HardDrive,
  Terminal,
  Minimize2,
  Maximize2,
  X,
  Pin,
  Move,
  Layers,
  LayoutGrid,
  Sliders,
  Power,
  RefreshCw,
  Clock,
  Radio,
  Eye,
  CheckCircle2,
  MousePointer,
  Crosshair,
  Folder,
  Settings,
  Search,
  Volume2,
  VolumeX,
  Palette,
  Maximize,
  HelpCircle,
  Info,
  ChevronRight,
  Monitor,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Lock,
  Unlock,
  Wifi,
  Square,
  Copy,
  Check,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { DesktopWindow, PlatformPreset } from '../types';

// Child components to render inside floating windows
import { DualCameraView } from './DualCameraView';
import { MatrixEngineView } from './MatrixEngineView';
import { DriverCpuView } from './DriverCpuView';
import { ReleaseGovernorView } from './ReleaseGovernorView';
import { PhotonReconstructionView } from './PhotonReconstructionView';
import { HardwareLabView } from './HardwareLabView';
import { SovereignEnginesView } from './SovereignEnginesView';
import { SovereignLatticeView } from './SovereignLatticeView';
import { J09RingView } from './J09RingView';
import { AuditManifestView } from './AuditManifestView';

interface DesktopWindowManagerProps {
  releaseState: any;
  onApproveGate: (id: string) => void;
  onRejectGate: (id: string, reason: string) => void;
  onOverrideProvenance: (gateId: string, prov: any) => void;
  onSealManifest: () => void;
  onResetSystem: () => void;
}

// Wallpaper definitions
export type WallpaperTheme = 'CYAN_GRID' | 'OBSIDIAN_DEEP' | 'GOLD_COAST' | 'QUANTUM_HEX' | 'CYBER_RED';

interface DesktopIconItem {
  id: string;
  title: string;
  subTitle: string;
  iconName: string;
  color: string;
  badge?: string;
  x?: number;
  y?: number;
}

export const DesktopWindowManager: React.FC<DesktopWindowManagerProps> = ({
  releaseState,
  onApproveGate,
  onRejectGate,
  onOverrideProvenance,
  onSealManifest,
  onResetSystem
}) => {
  // Desktop Global States
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [highestZ, setHighestZ] = useState(20);
  const [wallpaper, setWallpaper] = useState<WallpaperTheme>('CYAN_GRID');
  const [globalZoom, setGlobalZoom] = useState<number>(1.0);
  const [customCursorEnabled, setCustomCursorEnabled] = useState<boolean>(true);
  const [audioOscillatorActive, setAudioOscillatorActive] = useState<boolean>(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeContextMenu, setActiveContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Mouse & Ripple State for High-Precision Quantum Cursor
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isPointerOverClickable, setIsPointerOverClickable] = useState<boolean>(false);
  const [clickRipples, setClickRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Desktop Scratchpad Note
  const [desktopNote, setDesktopNote] = useState<string>(
    '# SOVEREIGN ORCHESTRATOR RUNTIME\n- Coherence anchor locked at 432.000 Hz\n- All 12 Gates in PROD-ALPHA verification\n- Double-click any desktop icon to launch window.'
  );

  // Desktop Icons Configuration (Homescreen)
  const desktopIcons: DesktopIconItem[] = [
    {
      id: 'DUAL_CAMERA',
      title: 'Dual Camera (∞)',
      subTitle: 'Front/Rear 4K & Link',
      iconName: 'Camera',
      color: '#ff4e00',
      badge: 'LIVE 4K'
    },
    {
      id: 'MATRIX_ENGINE',
      title: 'Matrix Engine',
      subTitle: '5D Tensor & NAM Ĥ',
      iconName: 'Grid',
      color: '#00e5ff',
      badge: '5x5'
    },
    {
      id: 'DRIVER_CPU',
      title: 'Drivers & 16-CPU',
      subTitle: 'AVX-512 & DMA Engine',
      iconName: 'Cpu',
      color: '#22c55e',
      badge: '5.2 GHz'
    },
    {
      id: 'SOVEREIGN_LATTICE',
      title: 'Sovereign Lattice',
      subTitle: '432Hz Lux Codex',
      iconName: 'Sparkles',
      color: '#00e5ff',
      badge: '432Hz'
    },
    {
      id: 'GOVERNOR',
      title: 'Release Governor',
      subTitle: '12 Hardware Gates',
      iconName: 'Shield',
      color: '#ff4e00',
      badge: '2-KEY'
    },
    {
      id: 'PNP_ADMM',
      title: 'PnP-ADMM Lab',
      subTitle: '26MP Quantum Recon',
      iconName: 'Layers',
      color: '#a855f7',
      badge: 'ADMM'
    },
    {
      id: 'HARDWARE',
      title: 'Hardware Lab',
      subTitle: 'Sony IMX571 & FPGA',
      iconName: 'HardDrive',
      color: '#eab308',
      badge: 'K7-PCIe'
    },
    {
      id: 'SOVEREIGN_11',
      title: 'Sovereign 11',
      subTitle: '11 Orchestrator Engines',
      iconName: 'Globe2',
      color: '#06b6d4',
      badge: '≥0.99997'
    },
    {
      id: 'J09_RING',
      title: 'J09 Bio-Ring',
      subTitle: 'PQC Dilithium Telemetry',
      iconName: 'Activity',
      color: '#10b981',
      badge: '1Hz UDP'
    },
    {
      id: 'MANIFEST',
      title: 'Audit Manifest',
      subTitle: 'Sealed Merkle JSON',
      iconName: 'FileCheck',
      color: '#3b82f6',
      badge: 'SHA-256'
    },
    {
      id: 'TERMINAL',
      title: 'Agent Terminal',
      subTitle: 'Dual-Agent Protocol',
      iconName: 'Terminal',
      color: '#ff4e00',
      badge: 'LOGS'
    },
    {
      id: 'EXPLORER',
      title: 'File Explorer',
      subTitle: 'Merkle Roots & Trees',
      iconName: 'Folder',
      color: '#f59e0b',
      badge: 'VFS'
    },
    {
      id: 'SETTINGS',
      title: 'Cosmic Settings',
      subTitle: 'Scaling, Theme, Pointer',
      iconName: 'Settings',
      color: '#ec4899',
      badge: 'OS'
    }
  ];

  // Windows State Definition
  const [windows, setWindows] = useState<DesktopWindow[]>([
    {
      id: 'DUAL_CAMERA',
      title: '01. Dual Camera & Infinity Link (∞)',
      iconName: 'Camera',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      x: 240,
      y: 20,
      width: 780,
      height: 560,
      minWidth: 500,
      minHeight: 380,
      pinned: false,
      opacity: 1.0
    },
    {
      id: 'MATRIX_ENGINE',
      title: '02. Hyperdimensional Matrix Engine (NAM / 5D / Ĥ)',
      iconName: 'Grid',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 9,
      x: 320,
      y: 60,
      width: 760,
      height: 540,
      minWidth: 500,
      minHeight: 380,
      pinned: false,
      opacity: 1.0
    },
    {
      id: 'DRIVER_CPU',
      title: '03. Drivers HAL & 16-Core CPU Topology',
      iconName: 'Cpu',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 8,
      x: 280,
      y: 80,
      width: 780,
      height: 550,
      minWidth: 500,
      minHeight: 380,
      pinned: false,
      opacity: 1.0
    },
    {
      id: 'SOVEREIGN_LATTICE',
      title: '04. Sovereign Lattice (432Hz Lux Codex)',
      iconName: 'Sparkles',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 7,
      x: 260,
      y: 40,
      width: 800,
      height: 570,
      minWidth: 500,
      minHeight: 380,
      pinned: false,
      opacity: 1.0
    },
    {
      id: 'GOVERNOR',
      title: '05. Release Governor & 12 Hardware Invariants',
      iconName: 'Shield',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 6,
      x: 270,
      y: 50,
      width: 820,
      height: 580,
      minWidth: 500,
      minHeight: 380,
      pinned: false,
      opacity: 1.0
    },
    {
      id: 'PNP_ADMM',
      title: '06. PnP-ADMM Photon Reconstruction Lab',
      iconName: 'Layers',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 5,
      x: 300,
      y: 70,
      width: 800,
      height: 560,
      minWidth: 500,
      minHeight: 380,
      pinned: false,
      opacity: 1.0
    },
    {
      id: 'HARDWARE',
      title: '07. Hardware & Kintex-7 FPGA Lab',
      iconName: 'HardDrive',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 4,
      x: 310,
      y: 90,
      width: 780,
      height: 550,
      minWidth: 500,
      minHeight: 380,
      pinned: false,
      opacity: 1.0
    },
    {
      id: 'SOVEREIGN_11',
      title: '08. 11 Sovereign Engines Orchestrator',
      iconName: 'Globe2',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 3,
      x: 290,
      y: 60,
      width: 820,
      height: 580,
      minWidth: 500,
      minHeight: 380,
      pinned: false,
      opacity: 1.0
    },
    {
      id: 'J09_RING',
      title: '09. J09 Bio-Resonance & Dilithium PQC',
      iconName: 'Activity',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 2,
      x: 320,
      y: 100,
      width: 780,
      height: 550,
      minWidth: 500,
      minHeight: 380,
      pinned: false,
      opacity: 1.0
    },
    {
      id: 'MANIFEST',
      title: '10. Audit Manifest & Cryptographic Release JSON',
      iconName: 'FileCheck',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      x: 330,
      y: 110,
      width: 780,
      height: 550,
      minWidth: 500,
      minHeight: 380,
      pinned: false,
      opacity: 1.0
    },
    {
      id: 'TERMINAL',
      title: '11. Agent Operations Terminal & Invariant Stream',
      iconName: 'Terminal',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      x: 340,
      y: 120,
      width: 740,
      height: 500,
      minWidth: 480,
      minHeight: 350,
      pinned: false,
      opacity: 1.0
    },
    {
      id: 'EXPLORER',
      title: '12. Quantum File Explorer & Merkle VFS',
      iconName: 'Folder',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      x: 350,
      y: 130,
      width: 720,
      height: 480,
      minWidth: 460,
      minHeight: 340,
      pinned: false,
      opacity: 1.0
    },
    {
      id: 'SETTINGS',
      title: '13. Cosmic System Settings & Scaling',
      iconName: 'Settings',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      x: 360,
      y: 140,
      width: 680,
      height: 460,
      minWidth: 440,
      minHeight: 320,
      pinned: false,
      opacity: 1.0
    }
  ]);

  // Dragging and Resizing References
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [resizeDirection, setResizeDirection] = useState<'SE' | 'E' | 'S' | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resizeInitial = useRef<{ width: number; height: number; mouseX: number; mouseY: number }>({
    width: 0,
    height: 0,
    mouseX: 0,
    mouseY: 0
  });

  // Bring Window to Front
  const focusWindow = (id: string) => {
    const nextZ = highestZ + 1;
    setHighestZ(nextZ);
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w))
    );
  };

  // Open / Launch Window (Triggered by DOUBLE CLICK on desktop icon or Start Menu)
  const openWindow = (id: string) => {
    const nextZ = highestZ + 1;
    setHighestZ(nextZ);
    setWindows(prev =>
      prev.map(w =>
        w.id === id
          ? {
              ...w,
              isOpen: true,
              isMinimized: false,
              zIndex: nextZ
            }
          : w
      )
    );
    setStartMenuOpen(false);
  };

  // Close Window
  const closeWindow = (id: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isOpen: false } : w)));
  };

  // Minimize Window
  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w)));
  };

  // Toggle Maximize / Restore
  const toggleMaximizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  // Toggle Pin to Top
  const togglePinWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, pinned: !w.pinned, zIndex: !w.pinned ? 999 : highestZ } : w))
    );
  };

  // Adjust Window Opacity
  const adjustWindowOpacity = (id: string, opacity: number) => {
    setWindows(prev => prev.map(w => (w.id === id ? { ...w, opacity } : w)));
  };

  // Snap Window
  const snapWindow = (
    id: string,
    layout: 'LEFT' | 'RIGHT' | 'TOP' | 'QUAD_1' | 'QUAD_2' | 'QUAD_3' | 'QUAD_4' | 'CENTER'
  ) => {
    focusWindow(id);
    const bounds = desktopContainerRef.current?.getBoundingClientRect();
    const availableW = bounds ? bounds.width - 20 : 1200;
    const availableH = bounds ? bounds.height - 60 : 700;

    setWindows(prev =>
      prev.map(w => {
        if (w.id !== id) return w;
        if (layout === 'LEFT') {
          return {
            ...w,
            isMaximized: false,
            x: 10,
            y: 10,
            width: Math.floor(availableW / 2) - 10,
            height: availableH
          };
        } else if (layout === 'RIGHT') {
          return {
            ...w,
            isMaximized: false,
            x: Math.floor(availableW / 2) + 10,
            y: 10,
            width: Math.floor(availableW / 2) - 20,
            height: availableH
          };
        } else if (layout === 'CENTER') {
          return {
            ...w,
            isMaximized: false,
            x: Math.floor(availableW * 0.1),
            y: Math.floor(availableH * 0.05),
            width: Math.floor(availableW * 0.8),
            height: Math.floor(availableH * 0.9)
          };
        } else if (layout === 'QUAD_1') {
          return {
            ...w,
            isMaximized: false,
            x: 10,
            y: 10,
            width: Math.floor(availableW / 2) - 10,
            height: Math.floor(availableH / 2) - 10
          };
        } else if (layout === 'QUAD_2') {
          return {
            ...w,
            isMaximized: false,
            x: Math.floor(availableW / 2) + 10,
            y: 10,
            width: Math.floor(availableW / 2) - 20,
            height: Math.floor(availableH / 2) - 10
          };
        } else if (layout === 'QUAD_3') {
          return {
            ...w,
            isMaximized: false,
            x: 10,
            y: Math.floor(availableH / 2) + 10,
            width: Math.floor(availableW / 2) - 10,
            height: Math.floor(availableH / 2) - 20
          };
        } else {
          return {
            ...w,
            isMaximized: false,
            x: Math.floor(availableW / 2) + 10,
            y: Math.floor(availableH / 2) + 10,
            width: Math.floor(availableW / 2) - 20,
            height: Math.floor(availableH / 2) - 20
          };
        }
      })
    );
  };

  // Minimize All Windows (Show Desktop)
  const minimizeAllWindows = () => {
    setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })));
  };

  // Tile All Open Windows (2x2 Grid)
  const tileAllWindows = () => {
    const openWins = windows.filter(w => w.isOpen);
    if (openWins.length === 0) return;

    const bounds = desktopContainerRef.current?.getBoundingClientRect();
    const availableW = bounds ? bounds.width - 20 : 1200;
    const availableH = bounds ? bounds.height - 60 : 700;

    if (openWins.length === 1) {
      snapWindow(openWins[0].id, 'CENTER');
      return;
    }

    if (openWins.length === 2) {
      snapWindow(openWins[0].id, 'LEFT');
      snapWindow(openWins[1].id, 'RIGHT');
      return;
    }

    // 3 or 4 windows: quadrant layout
    openWins.slice(0, 4).forEach((win, index) => {
      const quad = ['QUAD_1', 'QUAD_2', 'QUAD_3', 'QUAD_4'][index] as any;
      snapWindow(win.id, quad);
    });
  };

  // Drag Handlers
  const handleMouseDownTitlebar = (e: React.MouseEvent, id: string) => {
    focusWindow(id);
    const win = windows.find(w => w.id === id);
    if (!win || win.isMaximized) return;
    setDraggingId(id);
    dragOffset.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y
    };
  };

  // Resize Handlers
  const handleMouseDownResize = (
    e: React.MouseEvent,
    id: string,
    direction: 'SE' | 'E' | 'S'
  ) => {
    e.stopPropagation();
    focusWindow(id);
    const win = windows.find(w => w.id === id);
    if (!win || win.isMaximized) return;

    setResizingId(id);
    setResizeDirection(direction);
    resizeInitial.current = {
      width: win.width,
      height: win.height,
      mouseX: e.clientX,
      mouseY: e.clientY
    };
  };

  // Global Mouse Move & Cursor Tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (desktopContainerRef.current) {
      const rect = desktopContainerRef.current.getBoundingClientRect();
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }

    // Check if dragging window
    if (draggingId) {
      const nextX = Math.max(0, e.clientX - dragOffset.current.x);
      const nextY = Math.max(0, e.clientY - dragOffset.current.y);
      setWindows(prev =>
        prev.map(w => (w.id === draggingId ? { ...w, x: nextX, y: nextY } : w))
      );
    }

    // Check if resizing window
    if (resizingId && resizeDirection) {
      const deltaX = e.clientX - resizeInitial.current.mouseX;
      const deltaY = e.clientY - resizeInitial.current.mouseY;

      setWindows(prev =>
        prev.map(w => {
          if (w.id !== resizingId) return w;
          const minW = w.minWidth || 480;
          const minH = w.minHeight || 340;

          let newWidth = w.width;
          let newHeight = w.height;

          if (resizeDirection === 'SE' || resizeDirection === 'E') {
            newWidth = Math.max(minW, resizeInitial.current.width + deltaX);
          }
          if (resizeDirection === 'SE' || resizeDirection === 'S') {
            newHeight = Math.max(minH, resizeInitial.current.height + deltaY);
          }

          return { ...w, width: newWidth, height: newHeight };
        })
      );
    }
  };

  // Mouse Up Handler
  const handleMouseUp = () => {
    setDraggingId(null);
    setResizingId(null);
    setResizeDirection(null);
  };

  // Interactive Quantum Ripple on Click
  const handleDesktopClick = (e: React.MouseEvent) => {
    if (desktopContainerRef.current) {
      const rect = desktopContainerRef.current.getBoundingClientRect();
      const rippleX = e.clientX - rect.left;
      const rippleY = e.clientY - rect.top;
      const rippleId = Date.now();
      setClickRipples(prev => [...prev.slice(-8), { id: rippleId, x: rippleX, y: rippleY }]);

      // Remove after animation
      setTimeout(() => {
        setClickRipples(prev => prev.filter(r => r.id !== rippleId));
      }, 700);
    }
    setActiveContextMenu(null);
  };

  // Right-Click Context Menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (desktopContainerRef.current) {
      const rect = desktopContainerRef.current.getBoundingClientRect();
      setActiveContextMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Icon Click & Double-Click Handler
  const handleIconClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIconId(id);
  };

  const handleIconDoubleClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    openWindow(id);
  };

  // Keyboard shortcut to open selected icon
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedIconId) {
      openWindow(selectedIconId);
    }
    if (e.key === 'Escape') {
      setSelectedIconId(null);
      setStartMenuOpen(false);
      setQuickSettingsOpen(false);
      setActiveContextMenu(null);
    }
  };

  // Get Icon Component Helper
  const getIcon = (name: string) => {
    switch (name) {
      case 'Camera':
        return Camera;
      case 'Grid':
        return Grid;
      case 'Cpu':
        return Cpu;
      case 'Sparkles':
        return Sparkles;
      case 'Shield':
        return Shield;
      case 'Layers':
        return Layers;
      case 'HardDrive':
        return HardDrive;
      case 'Globe2':
        return Globe2;
      case 'Activity':
        return Activity;
      case 'FileCheck':
        return FileCheck;
      case 'Terminal':
        return Terminal;
      case 'Folder':
        return Folder;
      case 'Settings':
        return Settings;
      default:
        return AppWindow;
    }
  };

  // Render Window Content
  const renderWindowContent = (id: string) => {
    switch (id) {
      case 'DUAL_CAMERA':
        return <DualCameraView />;
      case 'MATRIX_ENGINE':
        return <MatrixEngineView />;
      case 'DRIVER_CPU':
        return <DriverCpuView />;
      case 'SOVEREIGN_LATTICE':
        return <SovereignLatticeView />;
      case 'GOVERNOR':
        return (
          <ReleaseGovernorView
            gates={releaseState.gates}
            incidents={releaseState.incidents}
            onAuthorizeRelease={onSealManifest}
            onRollback={onResetSystem}
            isAuthorized={releaseState.overallStatus === 'PASS'}
          />
        );
      case 'PNP_ADMM':
        return <PhotonReconstructionView />;
      case 'HARDWARE':
        return <HardwareLabView />;
      case 'SOVEREIGN_11':
        return <SovereignEnginesView />;
      case 'J09_RING':
        return <J09RingView />;
      case 'MANIFEST':
        return (
          <AuditManifestView
            releaseState={releaseState}
            incidents={releaseState.incidents}
            onRollback={onResetSystem}
          />
        );
      case 'TERMINAL':
        return (
          <div className="p-4 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#ff4e00]" />
                <span className="font-bold text-[#f0f0f0]">DUAL-AGENT PROTOCOL TERMINAL</span>
              </div>
              <span className="text-[10px] text-[#22c55e] font-bold">
                {releaseState.messages?.length || 0} INVARIANTS LOGGED
              </span>
            </div>
            <div className="space-y-2 max-h-[380px] overflow-y-auto bg-[#0a0b0e] p-3 rounded border border-[#2d3139]">
              {releaseState.messages?.map((msg: any, idx: number) => (
                <div
                  key={msg.id || idx}
                  className="p-2 rounded bg-[#15171a] border border-[#252a33] text-[11px]"
                >
                  <div className="flex items-center justify-between text-[#8e9299]">
                    <span className="text-[#00e5ff] font-bold">[{msg.sender}]</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-white font-bold mt-0.5">{msg.title}</div>
                  <div className="text-[#8e9299] text-[10px] mt-0.5">{msg.content}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'EXPLORER':
        return (
          <div className="p-4 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-[#f59e0b]" />
                <span className="font-bold text-[#f0f0f0]">QUANTUM FILE EXPLORER / VFS</span>
              </div>
              <span className="text-[10px] text-[#00e5ff]">MERKLE ROOT VERIFIED</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
                <h4 className="text-[11px] font-bold text-[#ff4e00] uppercase">System Artifacts</h4>
                <div className="space-y-1.5 text-[11px] text-[#8e9299]">
                  <div className="flex items-center justify-between hover:text-white cursor-pointer p-1 rounded hover:bg-[#1f232b]">
                    <span>📄 release_manifest.json</span>
                    <span className="text-[9px] text-[#22c55e]">SEALED</span>
                  </div>
                  <div className="flex items-center justify-between hover:text-white cursor-pointer p-1 rounded hover:bg-[#1f232b]">
                    <span>📄 imx571_calib_26mp.raw</span>
                    <span className="text-[9px] text-[#00e5ff]">MEASURED</span>
                  </div>
                  <div className="flex items-center justify-between hover:text-white cursor-pointer p-1 rounded hover:bg-[#1f232b]">
                    <span>📄 admm_weights_v3.bin</span>
                    <span className="text-[9px] text-[#eab308]">2.4 MB</span>
                  </div>
                  <div className="flex items-center justify-between hover:text-white cursor-pointer p-1 rounded hover:bg-[#1f232b]">
                    <span>📄 j09_dilithium_keys.pem</span>
                    <span className="text-[9px] text-[#a855f7]">PQC-3</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#0a0b0e] p-3 rounded border border-[#2d3139] space-y-2">
                <h4 className="text-[11px] font-bold text-[#00e5ff] uppercase">Merkle Chain Roots</h4>
                <div className="text-[10px] space-y-1 text-[#8e9299]">
                  <div>GLOBAL MERKLE:</div>
                  <div className="bg-[#15171a] p-1.5 rounded text-[#22c55e] font-mono break-all text-[9px]">
                    {releaseState.merkleRoot || '0x8f4c2e9a1b7d5c3f...'}
                  </div>
                  <div className="pt-2">COHERENCE RATIO:</div>
                  <div className="text-white font-bold text-sm">0.999974 (100% UNBROKEN)</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'SETTINGS':
        return (
          <div className="p-4 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#ec4899]" />
                <span className="font-bold text-[#f0f0f0]">COSMIC SYSTEM SETTINGS</span>
              </div>
              <span className="text-[10px] text-[#8e9299]">BUILD v3.0.0</span>
            </div>

            {/* Wallpaper Selection */}
            <div className="space-y-2">
              <label className="text-[11px] text-[#8e9299] font-bold">DESKTOP WALLPAPER THEME:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CYAN_GRID' as WallpaperTheme, label: 'Cyan Grid 432Hz' },
                  { id: 'OBSIDIAN_DEEP' as WallpaperTheme, label: 'Obsidian Space' },
                  { id: 'GOLD_COAST' as WallpaperTheme, label: 'Gold Coast Solstice' },
                  { id: 'QUANTUM_HEX' as WallpaperTheme, label: 'Quantum Hex' },
                  { id: 'CYBER_RED' as WallpaperTheme, label: 'Cyber Red Shift' }
                ].map(th => (
                  <button
                    key={th.id}
                    onClick={() => setWallpaper(th.id)}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                      wallpaper === th.id
                        ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]'
                        : 'bg-[#15171a] text-[#8e9299] border-[#2d3139] hover:text-white'
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantum Laser Pointer Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#0a0b0e] rounded border border-[#2d3139]">
              <div className="space-y-0.5">
                <div className="text-white font-bold text-xs">High-Precision Quantum Crosshair Pointer</div>
                <div className="text-[#8e9299] text-[10px]">
                  Displays glowing reticle, coordinate telemetry (X, Y), and pulse feedback.
                </div>
              </div>
              <button
                onClick={() => setCustomCursorEnabled(!customCursorEnabled)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  customCursorEnabled
                    ? 'bg-[#00e5ff] text-[#0a0b0e]'
                    : 'bg-[#23272e] text-[#8e9299]'
                }`}
              >
                {customCursorEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {/* Desktop Zoom Slider */}
            <div className="space-y-1.5 p-3 bg-[#0a0b0e] rounded border border-[#2d3139]">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-xs">Global Desktop Workspace Zoom</span>
                <span className="text-[#00e5ff] font-bold">{Math.round(globalZoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                {[75, 90, 100, 110, 125].map(z => (
                  <button
                    key={z}
                    onClick={() => setGlobalZoom(z / 100)}
                    className={`flex-1 py-1 rounded text-[10px] font-bold cursor-pointer ${
                      Math.round(globalZoom * 100) === z
                        ? 'bg-[#ff4e00] text-[#0a0b0e]'
                        : 'bg-[#1a1d24] text-[#8e9299] hover:text-white'
                    }`}
                  >
                    {z}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return <div className="p-4 text-xs text-[#8e9299]">Window content not available.</div>;
    }
  };

  // Filtered Start Menu Apps
  const filteredApps = desktopIcons.filter(
    app =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.subTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      ref={desktopContainerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        cursor: customCursorEnabled ? 'none' : 'default'
      }}
      className={`relative w-full h-[860px] border border-[#2d3139] rounded-xl overflow-hidden font-mono select-none flex flex-col shadow-2xl transition-all ${
        wallpaper === 'CYAN_GRID'
          ? 'bg-[#07090c]'
          : wallpaper === 'OBSIDIAN_DEEP'
          ? 'bg-[#030406]'
          : wallpaper === 'GOLD_COAST'
          ? 'bg-[#0d0908]'
          : wallpaper === 'QUANTUM_HEX'
          ? 'bg-[#060c12]'
          : 'bg-[#0e0707]'
      }`}
    >
      {/* DESKTOP BACKGROUND GRAPHICS & MESH */}
      {wallpaper === 'CYAN_GRID' && (
        <div className="absolute inset-0 bg-[radial-gradient(#00e5ff18_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none"></div>
      )}
      {wallpaper === 'OBSIDIAN_DEEP' && (
        <div className="absolute inset-0 bg-[radial-gradient(#2d313922_1px,transparent_1px)] [background-size:36px_36px] pointer-events-none"></div>
      )}
      {wallpaper === 'GOLD_COAST' && (
        <div className="absolute inset-0 bg-[radial-gradient(#ff4e0018_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>
      )}
      {wallpaper === 'QUANTUM_HEX' && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00e5ff0a_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      )}
      {wallpaper === 'CYBER_RED' && (
        <div className="absolute inset-0 bg-[radial-gradient(#ef444418_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      )}

      {/* Ambient Radial Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e]/80 via-transparent to-transparent pointer-events-none"></div>

      {/* DESKTOP WATERMARK & LIVE CLOCK WIDGET */}
      <div className="absolute top-6 right-8 pointer-events-none text-right opacity-80 z-0">
        <div className="flex items-center justify-end gap-2 text-[#00e5ff]">
          <Radio className="w-4 h-4 animate-pulse text-[#00e5ff]" />
          <h1 className="text-xl font-black tracking-widest text-[#00e5ff]">COSMIC OS // V3.0</h1>
        </div>
        <p className="text-xs text-[#8e9299] font-mono mt-0.5">GOLD COAST LATTICE • 432.000 Hz LOCKED</p>
        <div className="mt-2 text-2xl font-black text-white tracking-widest">
          {new Date().toLocaleTimeString()}
        </div>
        <div className="text-[10px] text-[#5c6370] tracking-wider">
          LAT 28.0167° S • LON 153.4000° E • MERKLE SEALED
        </div>
      </div>

      {/* DESKTOP TELEMETRY & SCRATCHPAD WIDGET (TOP RIGHT / BOTTOM RIGHT) */}
      <div className="absolute bottom-16 right-6 z-0 w-72 bg-[#121418]/70 border border-[#2d3139] rounded-lg p-3 backdrop-blur-sm hidden xl:block pointer-events-auto">
        <div className="flex items-center justify-between border-b border-[#2d3139] pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#ff4e00]" />
            <span className="text-[11px] font-bold text-white uppercase">Cosmic Scratchpad</span>
          </div>
          <span className="text-[9px] text-[#22c55e]">AUTO-SAVED</span>
        </div>
        <textarea
          value={desktopNote}
          onChange={e => setDesktopNote(e.target.value)}
          className="w-full h-24 bg-[#0a0b0e]/90 text-[10px] text-[#8e9299] font-mono p-2 rounded border border-[#252a33] focus:border-[#00e5ff] focus:outline-none resize-none"
        />
        <div className="mt-2 flex items-center justify-between text-[9px] text-[#5c6370]">
          <span>💡 Double-click icons to launch</span>
          <button
            onClick={tileAllWindows}
            className="text-[#00e5ff] hover:underline cursor-pointer"
          >
            🪟 Tile Windows
          </button>
        </div>
      </div>

      {/* DESKTOP HOMESCREEN ICONS GRID (PAGES) */}
      <div className="relative z-10 p-5 flex flex-col flex-wrap gap-4 max-h-[720px] w-fit">
        {desktopIcons.map(item => {
          const Icon = getIcon(item.iconName);
          const isSelected = selectedIconId === item.id;
          const openWin = windows.find(w => w.id === item.id);
          const isRunning = openWin?.isOpen && !openWin?.isMinimized;

          return (
            <div
              key={item.id}
              onClick={e => handleIconClick(e, item.id)}
              onDoubleClick={e => handleIconDoubleClick(e, item.id)}
              className={`group flex flex-col items-center justify-center p-2.5 rounded-xl w-24 h-24 cursor-pointer transition-all duration-150 relative ${
                isSelected
                  ? 'bg-[#00e5ff]/20 border-2 border-[#00e5ff] shadow-lg shadow-[#00e5ff]/20 scale-105'
                  : 'hover:bg-[#1a1d24]/60 border border-transparent hover:border-[#2d3139]'
              }`}
            >
              {/* Running Indicator Dot */}
              {isRunning && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00ff41] ring-2 ring-[#0a0b0e] animate-pulse"></div>
              )}

              {/* Icon Container with Custom Glowing Color */}
              <div
                style={{
                  backgroundColor: `${item.color}18`,
                  borderColor: `${item.color}40`,
                  boxShadow: isSelected ? `0 0 12px ${item.color}50` : 'none'
                }}
                className="w-11 h-11 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110"
              >
                <Icon
                  style={{ color: item.color }}
                  className="w-5 h-5 transition-transform group-hover:rotate-3"
                />
              </div>

              {/* Icon Title & Subtitle */}
              <span className="text-[10px] font-bold text-[#f0f0f0] tracking-tight text-center mt-1.5 truncate max-w-[86px] drop-shadow-md">
                {item.title}
              </span>

              {/* Badge */}
              {item.badge && (
                <span className="text-[8px] text-[#8e9299] font-mono scale-90">
                  {item.badge}
                </span>
              )}

              {/* Hover Tooltip Helper */}
              <div className="absolute -bottom-7 bg-[#15171a] border border-[#2d3139] px-2 py-0.5 rounded text-[9px] text-[#00e5ff] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
                Double-click to open
              </div>
            </div>
          );
        })}
      </div>

      {/* FLOATING WINDOWED PAGES CONTAINER */}
      <div className="absolute inset-0 bottom-11 overflow-hidden pointer-events-none z-20">
        {windows.map(win => {
          if (!win.isOpen || win.isMinimized) return null;
          const Icon = getIcon(win.iconName);

          return (
            <div
              key={win.id}
              onClick={() => focusWindow(win.id)}
              style={{
                zIndex: win.zIndex,
                transform: win.isMaximized
                  ? 'none'
                  : `translate(${win.x}px, ${win.y}px) scale(${globalZoom})`,
                transformOrigin: 'top left',
                width: win.isMaximized ? '100%' : `${win.width}px`,
                height: win.isMaximized ? '100%' : `${win.height}px`,
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: win.opacity
              }}
              className={`pointer-events-auto flex flex-col bg-[#101216] border ${
                win.zIndex === highestZ
                  ? 'border-[#00e5ff]/60 shadow-2xl shadow-[#00e5ff]/10'
                  : 'border-[#2d3139] shadow-xl'
              } rounded-xl overflow-hidden transition-shadow select-text`}
            >
              {/* Window Titlebar */}
              <div
                onMouseDown={e => handleMouseDownTitlebar(e, win.id)}
                onDoubleClick={() => toggleMaximizeWindow(win.id)}
                className={`px-3 py-2 border-b flex items-center justify-between cursor-move select-none ${
                  win.zIndex === highestZ
                    ? 'bg-[#181b22] border-[#00e5ff]/30 text-white'
                    : 'bg-[#13151a] border-[#252830] text-[#8e9299]'
                }`}
              >
                {/* Left: Window Title & Icon */}
                <div className="flex items-center gap-2 overflow-hidden">
                  <Icon className="w-3.5 h-3.5 text-[#00e5ff] shrink-0" />
                  <span className="text-xs font-bold tracking-tight truncate max-w-[320px]">
                    {win.title}
                  </span>
                  {win.pinned && (
                    <span className="text-[9px] px-1 bg-[#ff4e00]/20 text-[#ff4e00] rounded font-bold border border-[#ff4e00]/40">
                      PINNED
                    </span>
                  )}
                </div>

                {/* Right: Window Controls & Snapping */}
                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                  {/* Quick Snapping Dropdown / Buttons */}
                  <div className="flex items-center bg-[#0a0b0e] p-0.5 rounded border border-[#262a33]">
                    <button
                      onClick={() => snapWindow(win.id, 'LEFT')}
                      className="p-1 hover:bg-[#23272e] text-[#8e9299] hover:text-white rounded text-[10px]"
                      title="Snap 50% Left"
                    >
                      ◧
                    </button>
                    <button
                      onClick={() => snapWindow(win.id, 'RIGHT')}
                      className="p-1 hover:bg-[#23272e] text-[#8e9299] hover:text-white rounded text-[10px]"
                      title="Snap 50% Right"
                    >
                      ◨
                    </button>
                    <button
                      onClick={() => snapWindow(win.id, 'CENTER')}
                      className="p-1 hover:bg-[#23272e] text-[#8e9299] hover:text-white rounded text-[10px]"
                      title="Center Window"
                    >
                      ▣
                    </button>
                  </div>

                  {/* Pin to Top */}
                  <button
                    onClick={() => togglePinWindow(win.id)}
                    className={`p-1 rounded transition-colors ${
                      win.pinned ? 'bg-[#ff4e00] text-[#0a0b0e]' : 'text-[#8e9299] hover:text-white hover:bg-[#23272e]'
                    }`}
                    title={win.pinned ? 'Unpin from Top' : 'Pin to Top'}
                  >
                    <Pin className="w-3 h-3" />
                  </button>

                  <div className="h-3 w-px bg-[#374151] mx-0.5"></div>

                  {/* Minimize */}
                  <button
                    onClick={() => minimizeWindow(win.id)}
                    className="p-1 text-[#8e9299] hover:text-white hover:bg-[#23272e] rounded transition-colors"
                    title="Minimize"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>

                  {/* Maximize / Restore */}
                  <button
                    onClick={() => toggleMaximizeWindow(win.id)}
                    className="p-1 text-[#8e9299] hover:text-white hover:bg-[#23272e] rounded transition-colors"
                    title={win.isMaximized ? 'Restore' : 'Maximize'}
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>

                  {/* Close Window */}
                  <button
                    onClick={() => closeWindow(win.id)}
                    className="p-1 text-[#8e9299] hover:text-white hover:bg-[#ef4444] rounded transition-colors"
                    title="Close"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Window Body Container */}
              <div className="flex-1 overflow-y-auto bg-[#0d0f13] relative">
                {renderWindowContent(win.id)}
              </div>

              {/* Window Resizing Handles */}
              {!win.isMaximized && (
                <>
                  {/* Right edge */}
                  <div
                    onMouseDown={e => handleMouseDownResize(e, win.id, 'E')}
                    className="absolute top-0 right-0 w-1.5 h-full cursor-e-resize hover:bg-[#00e5ff]/40 z-30"
                  />
                  {/* Bottom edge */}
                  <div
                    onMouseDown={e => handleMouseDownResize(e, win.id, 'S')}
                    className="absolute bottom-0 left-0 h-1.5 w-full cursor-s-resize hover:bg-[#00e5ff]/40 z-30"
                  />
                  {/* Bottom-Right corner */}
                  <div
                    onMouseDown={e => handleMouseDownResize(e, win.id, 'SE')}
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-se-resize flex items-center justify-center bg-[#181b22] border-t border-l border-[#2d3139] hover:bg-[#00e5ff] text-[#8e9299] hover:text-[#0a0b0e] z-30"
                    title="Drag to resize"
                  >
                    <div className="w-1.5 h-1.5 border-r border-b border-current"></div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* DESKTOP RIGHT-CLICK CONTEXT MENU */}
      {activeContextMenu && (
        <div
          style={{ top: activeContextMenu.y, left: activeContextMenu.x }}
          className="absolute z-50 w-56 bg-[#15171a]/95 border border-[#ff4e00]/50 rounded-xl shadow-2xl p-2 space-y-1 backdrop-blur-md font-mono text-xs text-[#e0e0e0]"
          onClick={e => e.stopPropagation()}
        >
          <div className="px-2 py-1 text-[10px] text-[#ff4e00] font-bold border-b border-[#2d3139] uppercase">
            ⚡ Cosmic Desktop Menu
          </div>

          <button
            onClick={() => {
              if (selectedIconId) openWindow(selectedIconId);
              setActiveContextMenu(null);
            }}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-[#23272e] flex items-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>Open Selected App</span>
          </button>

          <button
            onClick={() => {
              tileAllWindows();
              setActiveContextMenu(null);
            }}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-[#23272e] flex items-center gap-2 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>Tile All Windows (2x2)</span>
          </button>

          <button
            onClick={() => {
              minimizeAllWindows();
              setActiveContextMenu(null);
            }}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-[#23272e] flex items-center gap-2 cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5 text-[#eab308]" />
            <span>Show Desktop</span>
          </button>

          <div className="h-px bg-[#2d3139] my-1"></div>

          <button
            onClick={() => {
              setCustomCursorEnabled(!customCursorEnabled);
              setActiveContextMenu(null);
            }}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-[#23272e] flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>Quantum Crosshair</span>
            </span>
            <span className="text-[9px] text-[#00e5ff]">
              {customCursorEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={() => {
              openWindow('SETTINGS');
              setActiveContextMenu(null);
            }}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-[#23272e] flex items-center gap-2 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#ec4899]" />
            <span>Cosmic OS Settings...</span>
          </button>
        </div>
      )}

      {/* START MENU POPUP */}
      {startMenuOpen && (
        <div
          onClick={e => e.stopPropagation()}
          className="absolute bottom-12 left-3 z-50 w-96 bg-[#12151b]/95 border border-[#ff4e00]/60 rounded-2xl shadow-2xl p-4 space-y-3 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {/* Header & Search */}
          <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff4e00] animate-pulse"></div>
              <span className="text-xs font-bold text-white tracking-wide">COSMIC LAUNCHER</span>
            </div>
            <span className="text-[10px] text-[#00e5ff] font-bold">432Hz HARMONIC</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8e9299] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search modules, gates, engines..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0b0e] text-xs text-white pl-8 pr-3 py-1.5 rounded-lg border border-[#2d3139] focus:border-[#00e5ff] focus:outline-none font-mono"
            />
          </div>

          {/* Applications Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
            {filteredApps.map(item => {
              const Icon = getIcon(item.iconName);
              return (
                <button
                  key={item.id}
                  onClick={() => openWindow(item.id)}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-[#181b22] hover:bg-[#ff4e00]/20 hover:border-[#ff4e00] border border-[#252830] text-left text-xs text-[#e0e0e0] font-bold cursor-pointer transition-all group"
                >
                  <div
                    style={{ backgroundColor: `${item.color}20` }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-[#2d3139]"
                  >
                    <Icon style={{ color: item.color }} className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="truncate text-white text-[11px] group-hover:text-[#ff4e00]">
                      {item.title}
                    </div>
                    <div className="text-[9px] text-[#8e9299] truncate font-normal">
                      {item.subTitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Start Menu Footer Controls */}
          <div className="pt-2 border-t border-[#2d3139] flex items-center justify-between text-[11px]">
            <button
              onClick={() => {
                onResetSystem();
                setStartMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-[#ff4e00] hover:underline cursor-pointer"
            >
              <Power className="w-3.5 h-3.5" />
              <span>RESTART SOVEREIGN RUNTIME</span>
            </button>
            <span className="text-[10px] text-[#5c6370]">v3.0.0 DUAL-KEY</span>
          </div>
        </div>
      )}

      {/* QUICK SETTINGS FLYOUT */}
      {quickSettingsOpen && (
        <div
          onClick={e => e.stopPropagation()}
          className="absolute bottom-12 right-3 z-50 w-72 bg-[#12151b]/95 border border-[#00e5ff]/50 rounded-2xl shadow-2xl p-4 space-y-3 backdrop-blur-xl font-mono text-xs text-white"
        >
          <div className="flex items-center justify-between border-b border-[#2d3139] pb-2">
            <span className="font-bold text-[#00e5ff] uppercase">Quick Controls</span>
            <span className="text-[10px] text-[#8e9299]">SOVEREIGN HAL</span>
          </div>

          {/* 432Hz Audio Oscillator */}
          <div className="flex items-center justify-between p-2 rounded bg-[#0a0b0e] border border-[#252830]">
            <div className="flex items-center gap-2">
              {audioOscillatorActive ? (
                <Volume2 className="w-4 h-4 text-[#22c55e]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#8e9299]" />
              )}
              <div>
                <div className="font-bold text-[11px]">432Hz Carrier Synth</div>
                <div className="text-[9px] text-[#8e9299]">Harmonic PLL Anchor</div>
              </div>
            </div>
            <button
              onClick={() => setAudioOscillatorActive(!audioOscillatorActive)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                audioOscillatorActive ? 'bg-[#22c55e] text-[#0a0b0e]' : 'bg-[#23272e] text-[#8e9299]'
              }`}
            >
              {audioOscillatorActive ? 'ACTIVE' : 'MUTED'}
            </button>
          </div>

          {/* Quantum Reticle */}
          <div className="flex items-center justify-between p-2 rounded bg-[#0a0b0e] border border-[#252830]">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#00e5ff]" />
              <div>
                <div className="font-bold text-[11px]">Quantum Pointer</div>
                <div className="text-[9px] text-[#8e9299]">Sci-Fi HUD Cursor</div>
              </div>
            </div>
            <button
              onClick={() => setCustomCursorEnabled(!customCursorEnabled)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                customCursorEnabled ? 'bg-[#00e5ff] text-[#0a0b0e]' : 'bg-[#23272e] text-[#8e9299]'
              }`}
            >
              {customCursorEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Tile / Window Snap shortcuts */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={tileAllWindows}
              className="flex-1 py-1 bg-[#1a1d24] hover:bg-[#23272e] text-[#00e5ff] rounded text-[10px] font-bold border border-[#2d3139] cursor-pointer"
            >
              🪟 Tile Windows
            </button>
            <button
              onClick={minimizeAllWindows}
              className="flex-1 py-1 bg-[#1a1d24] hover:bg-[#23272e] text-[#eab308] rounded text-[10px] font-bold border border-[#2d3139] cursor-pointer"
            >
              🧹 Minimize All
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM DESKTOP TASKBAR */}
      <div className="h-11 bg-[#111317]/95 border-t border-[#2d3139] px-3 flex items-center justify-between z-40 text-xs backdrop-blur-md">
        {/* Start Button & Active Running Window Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Start Launcher Button */}
          <button
            onClick={e => {
              e.stopPropagation();
              setStartMenuOpen(!startMenuOpen);
              setQuickSettingsOpen(false);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              startMenuOpen
                ? 'bg-[#ff4e00] text-[#0a0b0e] shadow-lg shadow-[#ff4e00]/30'
                : 'bg-[#1c2027] hover:bg-[#252a33] text-[#ff4e00] border border-[#ff4e00]/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-wide">START</span>
          </button>

          {/* Active Running Window Tabs in Taskbar */}
          {windows.map(win => {
            if (!win.isOpen) return null;
            const Icon = getIcon(win.iconName);
            const isFocused = !win.isMinimized && win.zIndex === highestZ;

            return (
              <button
                key={win.id}
                onClick={e => {
                  e.stopPropagation();
                  if (win.isMinimized) {
                    focusWindow(win.id);
                  } else if (win.zIndex === highestZ) {
                    minimizeWindow(win.id);
                  } else {
                    focusWindow(win.id);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer max-w-[170px] truncate ${
                  isFocused
                    ? 'bg-[#1b222d] text-[#00e5ff] border-[#00e5ff]/60 shadow-sm shadow-[#00e5ff]/20'
                    : win.isMinimized
                    ? 'bg-[#101215] text-[#5c6370] border-[#20232b] hover:bg-[#181b22]'
                    : 'bg-[#15181e] text-[#8e9299] border-[#2d3139] hover:bg-[#1e222a] hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3 text-[#00e5ff] shrink-0" />
                <span className="truncate">{win.title.split(' ')[1] || win.title}</span>
              </button>
            );
          })}
        </div>

        {/* System Tray (Right Side) */}
        <div className="flex items-center gap-2.5 text-[11px] text-[#8e9299]">
          {/* Quick Settings Trigger */}
          <button
            onClick={e => {
              e.stopPropagation();
              setQuickSettingsOpen(!quickSettingsOpen);
              setStartMenuOpen(false);
            }}
            className={`p-1.5 rounded hover:bg-[#23272e] transition-colors cursor-pointer ${
              quickSettingsOpen ? 'text-[#00e5ff] bg-[#1a1e26]' : 'text-[#8e9299]'
            }`}
            title="Quick Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 text-[#22c55e] hidden sm:flex">
            <CheckCircle2 className="w-3 h-3" />
            <span className="text-[10px]">HAL: ON</span>
          </div>

          <div className="flex items-center gap-1 text-[#00e5ff] hidden sm:flex">
            <Radio className="w-3 h-3 animate-pulse" />
            <span className="text-[10px]">432Hz</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#f0f0f0] bg-[#0a0b0e] px-2 py-1 rounded border border-[#252830]">
            <Clock className="w-3 h-3 text-[#ff4e00]" />
            <span className="text-[10px] font-mono">{new Date().toLocaleTimeString()}</span>
          </div>

          {/* Show Desktop (Peek Button) */}
          <div
            onClick={minimizeAllWindows}
            className="w-2.5 h-7 bg-[#23272e] hover:bg-[#00e5ff] rounded-xs cursor-pointer transition-colors"
            title="Show Desktop (Minimize All)"
          />
        </div>
      </div>

      {/* CUSTOM HIGH-PRECISION QUANTUM CROSSHAIR CURSOR */}
      {customCursorEnabled && cursorPos.x >= 0 && cursorPos.y >= 0 && (
        <div
          style={{
            transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
            pointerEvents: 'none'
          }}
          className="fixed top-0 left-0 z-[9999] transition-transform duration-[15ms] ease-out pointer-events-none"
        >
          {/* Reticle Outer Circle */}
          <div className="relative -top-3 -left-3 w-6 h-6 border border-[#00e5ff]/80 rounded-full animate-spin-slow flex items-center justify-center">
            {/* Center Cross Dot */}
            <div className="w-1.5 h-1.5 bg-[#ff4e00] rounded-full shadow-sm shadow-[#ff4e00]"></div>
            {/* 4 Crosshair ticks */}
            <div className="absolute top-0 w-0.5 h-1 bg-[#00e5ff]"></div>
            <div className="absolute bottom-0 w-0.5 h-1 bg-[#00e5ff]"></div>
            <div className="absolute left-0 h-0.5 w-1 bg-[#00e5ff]"></div>
            <div className="absolute right-0 h-0.5 w-1 bg-[#00e5ff]"></div>
          </div>

          {/* Micro Telemetry Coordinate Badge */}
          <div className="absolute top-4 left-4 bg-[#0a0b0e]/90 text-[8px] font-mono text-[#00e5ff] px-1 py-0.2 rounded border border-[#00e5ff]/40 whitespace-nowrap shadow-sm">
            X:{Math.round(cursorPos.x)} Y:{Math.round(cursorPos.y)}
          </div>
        </div>
      )}

      {/* INTERACTIVE CLICK RIPPLE ANIMATIONS */}
      {clickRipples.map(ripple => (
        <div
          key={ripple.id}
          style={{ top: ripple.y, left: ripple.x }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-[#00e5ff] animate-ping pointer-events-none z-50 opacity-70"
        />
      ))}
    </div>
  );
};
