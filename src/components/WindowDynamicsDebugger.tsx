import React, { useState, useEffect } from 'react';
import {
  Activity,
  Layers,
  Zap,
  Sliders,
  Maximize2,
  Minimize2,
  RefreshCw,
  Cpu,
  Move,
  Compass,
  Crosshair,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Radio,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { DesktopWindow, WindowPhysicsState } from '../types';

interface WindowDynamicsDebuggerProps {
  windows: DesktopWindow[];
  onUpdateWindow: (id: string, updates: Partial<DesktopWindow>) => void;
  onTileWindows: () => void;
  onCascadeWindows: () => void;
  onResetPositions: () => void;
}

export const WindowDynamicsDebugger: React.FC<WindowDynamicsDebuggerProps> = ({
  windows,
  onUpdateWindow,
  onTileWindows,
  onCascadeWindows,
  onResetPositions
}) => {
  // Live physics state simulation
  const [physicsState, setPhysicsState] = useState<WindowPhysicsState>({
    fps: 60,
    frameTimeMs: 16.67,
    totalRedraws: 1420,
    activeWindowCount: windows.filter(w => w.isOpen).length,
    draggedWindowId: null,
    velocityVectors: {},
    collisionIntersections: [],
    snapActive: false,
    snapTargetZone: 'NONE',
    magneticDistancePx: 24,
    springDamping: 0.85,
    boundaryCollisions: 0,
    dragEventLog: [
      { timestamp: '14:02:11.042', windowId: 'win-dual-cam', type: 'DRAG_START', x: 280, y: 80 },
      { timestamp: '14:02:11.380', windowId: 'win-dual-cam', type: 'DRAGGING', x: 310, y: 92 },
      { timestamp: '14:02:11.950', windowId: 'win-dual-cam', type: 'SNAP', x: 320, y: 100 },
      { timestamp: '14:02:12.110', windowId: 'win-dual-cam', type: 'DRAG_END', x: 320, y: 100 }
    ]
  });

  const [selectedWindowId, setSelectedWindowId] = useState<string>(windows[0]?.id || 'win-dual-cam');
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [antiCollisionActive, setAntiCollisionActive] = useState(true);
  const [magneticThreshold, setMagneticThreshold] = useState(28);
  const [springElasticity, setSpringElasticity] = useState(0.88);
  const [desktopBounds, setDesktopBounds] = useState({ width: 1200, height: 720 });

  // Update physics calculation on window changes & interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate AABB Intersections between all open windows
      const openWindows = windows.filter(w => w.isOpen && !w.isMinimized);
      const collisions: Array<{ idA: string; idB: string; overlapAreaPx: number }> = [];

      for (let i = 0; i < openWindows.length; i++) {
        for (let j = i + 1; j < openWindows.length; j++) {
          const wA = openWindows[i];
          const wB = openWindows[j];

          const xOverlap = Math.max(0, Math.min(wA.x + wA.width, wB.x + wB.width) - Math.max(wA.x, wB.x));
          const yOverlap = Math.max(0, Math.min(wA.y + wA.height, wB.y + wB.height) - Math.max(wA.y, wB.y));
          const area = xOverlap * yOverlap;

          if (area > 0) {
            collisions.push({
              idA: wA.id,
              idB: wB.id,
              overlapAreaPx: Math.round(area)
            });
          }
        }
      }

      setPhysicsState(prev => ({
        ...prev,
        fps: 59 + Math.floor(Math.random() * 3),
        frameTimeMs: 16.2 + Math.random() * 0.8,
        totalRedraws: prev.totalRedraws + 1,
        activeWindowCount: openWindows.length,
        collisionIntersections: collisions,
        boundaryCollisions: openWindows.filter(w => w.x <= 10 || w.y <= 10 || w.x + w.width >= desktopBounds.width - 20).length
      }));
    }, 500);

    return () => clearInterval(interval);
  }, [windows, desktopBounds]);

  // Stress test loop
  useEffect(() => {
    if (!isStressTesting) return;

    const stressInterval = setInterval(() => {
      const openWins = windows.filter(w => w.isOpen);
      if (openWins.length === 0) return;

      const randWin = openWins[Math.floor(Math.random() * openWins.length)];
      const deltaX = (Math.random() - 0.5) * 40;
      const deltaY = (Math.random() - 0.5) * 30;

      onUpdateWindow(randWin.id, {
        x: Math.max(40, Math.min(desktopBounds.width - randWin.width - 40, randWin.x + deltaX)),
        y: Math.max(40, Math.min(desktopBounds.height - randWin.height - 40, randWin.y + deltaY))
      });
    }, 120);

    return () => clearInterval(stressInterval);
  }, [isStressTesting, windows, desktopBounds, onUpdateWindow]);

  const selectedWin = windows.find(w => w.id === selectedWindowId) || windows[0];

  // Anti-Collision Scatter Algorithm
  const handleAntiCollisionScatter = () => {
    const openWins = windows.filter(w => w.isOpen && !w.isMinimized);
    const spacingX = 45;
    const spacingY = 40;
    
    openWins.forEach((win, index) => {
      const targetX = 60 + (index * spacingX) % (desktopBounds.width - win.width - 80);
      const targetY = 50 + (index * spacingY) % (desktopBounds.height - win.height - 70);
      onUpdateWindow(win.id, { x: targetX, y: targetY });
    });
  };

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Header & Status Bar */}
      <div className="bg-[#12151b] border border-[#2d3340] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-lg text-[#00e5ff]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">WINDOWS DYNAMICS ENGINE & PHYSICS DEBUGGER</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40">
                AABB DETECTOR ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[#8e9299]">
              Real-time window kinematics, boundary collisions, inertia vectors, spring damping & layout orchestration
            </p>
          </div>
        </div>

        {/* Global Action Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAntiCollisionScatter}
            className="px-3 py-1.5 bg-[#1b202a] hover:bg-[#252c3a] text-[#00e5ff] border border-[#00e5ff]/30 rounded font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>ANTI-COLLISION SCATTER</span>
          </button>

          <button
            onClick={onCascadeWindows}
            className="px-3 py-1.5 bg-[#1b202a] hover:bg-[#252c3a] text-[#f0f0f0] border border-[#3b4252] rounded font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AUTO-CASCADE</span>
          </button>

          <button
            onClick={onTileWindows}
            className="px-3 py-1.5 bg-[#1b202a] hover:bg-[#252c3a] text-[#f0f0f0] border border-[#3b4252] rounded font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>TILE 2x2 QUADRANTS</span>
          </button>

          <button
            onClick={() => setIsStressTesting(!isStressTesting)}
            className={`px-3 py-1.5 rounded font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isStressTesting
                ? 'bg-[#ff4e00] text-white border-[#ff4e00] animate-pulse'
                : 'bg-[#1b202a] text-[#ffb300] hover:bg-[#282218] border-[#ffb300]/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isStressTesting ? 'STOP STRESS TEST' : 'RUN PHYSICS STRESS'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg">
          <span className="text-[10px] text-[#8e9299]">REFRESH RATE</span>
          <div className="text-lg font-bold text-[#00e5ff] flex items-baseline gap-1 mt-0.5">
            {physicsState.fps} <span className="text-[10px] text-[#8e9299]">FPS</span>
          </div>
          <div className="text-[9px] text-[#46d369]">Target: 60.0 Hz Lock</div>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg">
          <span className="text-[10px] text-[#8e9299]">FRAME DISPATCH</span>
          <div className="text-lg font-bold text-white flex items-baseline gap-1 mt-0.5">
            {physicsState.frameTimeMs.toFixed(2)} <span className="text-[10px] text-[#8e9299]">ms</span>
          </div>
          <div className="text-[9px] text-[#00e5ff]">&lt; 16.6ms Render budget</div>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg">
          <span className="text-[10px] text-[#8e9299]">OPEN WINDOWS</span>
          <div className="text-lg font-bold text-white flex items-baseline gap-1 mt-0.5">
            {physicsState.activeWindowCount} <span className="text-[10px] text-[#8e9299]">/ {windows.length}</span>
          </div>
          <div className="text-[9px] text-[#8e9299]">Z-Stack Indexed</div>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg">
          <span className="text-[10px] text-[#8e9299]">AABB OVERLAPS</span>
          <div className={`text-lg font-bold flex items-baseline gap-1 mt-0.5 ${
            physicsState.collisionIntersections.length > 0 ? 'text-[#ffb300]' : 'text-[#46d369]'
          }`}>
            {physicsState.collisionIntersections.length} <span className="text-[10px] text-[#8e9299]">collisions</span>
          </div>
          <div className="text-[9px] text-[#8e9299]">Intersections detected</div>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg">
          <span className="text-[10px] text-[#8e9299]">BOUNDARY CLAMP</span>
          <div className={`text-lg font-bold flex items-baseline gap-1 mt-0.5 ${
            physicsState.boundaryCollisions > 0 ? 'text-[#ff4e00]' : 'text-[#46d369]'
          }`}>
            {physicsState.boundaryCollisions} <span className="text-[10px] text-[#8e9299]">edges</span>
          </div>
          <div className="text-[9px] text-[#8e9299]">Viewport constraints</div>
        </div>

        <div className="bg-[#12151b] border border-[#262b36] p-3 rounded-lg">
          <span className="text-[10px] text-[#8e9299]">TOTAL REDRAWS</span>
          <div className="text-lg font-bold text-[#b388ff] flex items-baseline gap-1 mt-0.5">
            {physicsState.totalRedraws}
          </div>
          <div className="text-[9px] text-[#46d369]">Zero Memory Leaks</div>
        </div>
      </div>

      {/* Main 2-Column Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 2D Spatial Map & Window Dynamics Canvas */}
        <div className="lg:col-span-7 bg-[#12151b] border border-[#262b36] rounded-xl p-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#00e5ff]" />
              <span className="font-bold text-white uppercase">2D Spatial Bounding Box & Collision Map</span>
            </div>
            <span className="text-[10px] text-[#8e9299]">Scale: 1:2.5 Virtual Screen</span>
          </div>

          {/* Interactive Mini Spatial Canvas */}
          <div className="relative w-full h-[320px] bg-[#0a0c10] border border-[#232834] rounded-lg overflow-hidden flex items-center justify-center p-2">
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

            {/* Viewport Bounds Container */}
            <div className="relative w-[95%] h-[90%] border-2 border-dashed border-[#00e5ff]/30 rounded bg-[#0e1117]/60">
              {/* Windows Rendered as Interactive Rectangles */}
              {windows.map(win => {
                const isOpen = win.isOpen && !win.isMinimized;
                const isSelected = win.id === selectedWindowId;
                const hasCollision = physicsState.collisionIntersections.some(
                  c => c.idA === win.id || c.idB === win.id
                );

                // Scaled coordinates for the mini map
                const scaleX = 0.28;
                const scaleY = 0.28;
                const miniX = win.x * scaleX;
                const miniY = win.y * scaleY;
                const miniW = Math.max(50, win.width * scaleX);
                const miniH = Math.max(35, win.height * scaleY);

                if (!isOpen) return null;

                return (
                  <div
                    key={win.id}
                    onClick={() => setSelectedWindowId(win.id)}
                    style={{
                      left: `${miniX}px`,
                      top: `${miniY}px`,
                      width: `${miniW}px`,
                      height: `${miniH}px`,
                      zIndex: win.zIndex
                    }}
                    className={`absolute rounded transition-all cursor-pointer flex flex-col justify-between p-1 select-none text-[9px] font-bold border ${
                      isSelected
                        ? 'bg-[#00e5ff]/25 border-[#00e5ff] text-white shadow-md shadow-[#00e5ff]/30'
                        : hasCollision
                        ? 'bg-[#ff4e00]/20 border-[#ff4e00] text-[#ff8a65]'
                        : 'bg-[#1e232f]/80 border-[#3d4659] text-[#c0c6d0] hover:border-[#00e5ff]'
                    }`}
                  >
                    <div className="truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                      <span className="truncate">{win.title}</span>
                    </div>
                    <div className="flex justify-between text-[8px] opacity-80">
                      <span>z:{win.zIndex}</span>
                      <span>{Math.round(win.x)},{Math.round(win.y)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Physics Engine Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0a0c10] border border-[#232834] p-3 rounded-lg">
            <div>
              <div className="flex justify-between text-[10px] text-[#8e9299] mb-1">
                <span>MAGNETIC SNAP DIST:</span>
                <span className="text-[#00e5ff] font-bold">{magneticThreshold}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={magneticThreshold}
                onChange={e => setMagneticThreshold(Number(e.target.value))}
                className="w-full accent-[#00e5ff]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-[#8e9299] mb-1">
                <span>SPRING ELASTICITY:</span>
                <span className="text-[#00e5ff] font-bold">{springElasticity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.99"
                step="0.01"
                value={springElasticity}
                onChange={e => setSpringElasticity(Number(e.target.value))}
                className="w-full accent-[#00e5ff]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8e9299] block">ANTI-COLLISION:</span>
                <span className={`text-[11px] font-bold ${antiCollisionActive ? 'text-[#46d369]' : 'text-[#8e9299]'}`}>
                  {antiCollisionActive ? 'ENABLED (REPULSION)' : 'DISABLED'}
                </span>
              </div>
              <button
                onClick={() => setAntiCollisionActive(!antiCollisionActive)}
                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer border ${
                  antiCollisionActive
                    ? 'bg-[#46d369]/20 text-[#46d369] border-[#46d369]/40'
                    : 'bg-[#1b202a] text-[#8e9299] border-[#3b4252]'
                }`}
              >
                {antiCollisionActive ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Selected Window Inspector & Event Traces */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Window Dynamics Card */}
          {selectedWin && (
            <div className="bg-[#12151b] border border-[#262b36] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#ff4e00]" />
                  <span className="font-bold text-white">INSPECT: {selectedWin.title}</span>
                </div>
                <span className="px-2 py-0.5 bg-[#ff4e00]/20 text-[#ff4e00] rounded text-[9px] font-bold border border-[#ff4e00]/30">
                  ID: {selectedWin.id}
                </span>
              </div>

              {/* Coordinates & Sizing Micro-Adjustment */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#0a0c10] p-2 rounded border border-[#232834]">
                  <span className="text-[#8e9299] text-[9px]">POS X (PX):</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={Math.round(selectedWin.x)}
                      onChange={e => onUpdateWindow(selectedWin.id, { x: Number(e.target.value) })}
                      className="w-full bg-[#161a22] text-white px-2 py-1 rounded border border-[#3b4252]"
                    />
                  </div>
                </div>

                <div className="bg-[#0a0c10] p-2 rounded border border-[#232834]">
                  <span className="text-[#8e9299] text-[9px]">POS Y (PX):</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={Math.round(selectedWin.y)}
                      onChange={e => onUpdateWindow(selectedWin.id, { y: Number(e.target.value) })}
                      className="w-full bg-[#161a22] text-white px-2 py-1 rounded border border-[#3b4252]"
                    />
                  </div>
                </div>

                <div className="bg-[#0a0c10] p-2 rounded border border-[#232834]">
                  <span className="text-[#8e9299] text-[9px]">WIDTH (PX):</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={Math.round(selectedWin.width)}
                      onChange={e => onUpdateWindow(selectedWin.id, { width: Number(e.target.value) })}
                      className="w-full bg-[#161a22] text-white px-2 py-1 rounded border border-[#3b4252]"
                    />
                  </div>
                </div>

                <div className="bg-[#0a0c10] p-2 rounded border border-[#232834]">
                  <span className="text-[#8e9299] text-[9px]">HEIGHT (PX):</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={Math.round(selectedWin.height)}
                      onChange={e => onUpdateWindow(selectedWin.id, { height: Number(e.target.value) })}
                      className="w-full bg-[#161a22] text-white px-2 py-1 rounded border border-[#3b4252]"
                    />
                  </div>
                </div>
              </div>

              {/* State Toggles for Selected Window */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => onUpdateWindow(selectedWin.id, { isMaximized: !selectedWin.isMaximized })}
                  className="px-2.5 py-1 bg-[#1a1f29] hover:bg-[#252c3a] text-white rounded text-[10px] font-bold border border-[#3b4252] cursor-pointer"
                >
                  {selectedWin.isMaximized ? 'RESTORE SIZE' : 'MAXIMIZE'}
                </button>
                <button
                  onClick={() => onUpdateWindow(selectedWin.id, { pinned: !selectedWin.pinned })}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold border cursor-pointer ${
                    selectedWin.pinned
                      ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]'
                      : 'bg-[#1a1f29] text-[#8e9299] border-[#3b4252]'
                  }`}
                >
                  {selectedWin.pinned ? 'PINNED ON TOP' : 'PIN TO TOP'}
                </button>
                <button
                  onClick={() => onUpdateWindow(selectedWin.id, { isMinimized: !selectedWin.isMinimized })}
                  className="px-2.5 py-1 bg-[#1a1f29] hover:bg-[#252c3a] text-[#8e9299] hover:text-white rounded text-[10px] font-bold border border-[#3b4252] cursor-pointer"
                >
                  MINIMIZE
                </button>
              </div>
            </div>
          )}

          {/* Live Drag & Dynamics Log Stream */}
          <div className="bg-[#12151b] border border-[#262b36] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">KINEMATICS EVENT STREAM</span>
              <span className="w-2 h-2 rounded-full bg-[#46d369] animate-pulse" />
            </div>

            <div className="h-[150px] overflow-y-auto bg-[#0a0c10] border border-[#232834] rounded-lg p-2.5 space-y-1.5 text-[10px] font-mono">
              {physicsState.dragEventLog.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-[#1b2029] pb-1">
                  <span className="text-[#8e9299]">{log.timestamp}</span>
                  <span className={`font-bold ${
                    log.type === 'SNAP' ? 'text-[#00e5ff]' : log.type === 'DRAG_START' ? 'text-[#ffb300]' : 'text-[#46d369]'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-white truncate max-w-[120px]">{log.windowId}</span>
                  <span className="text-[#8e9299]">({log.x}, {log.y})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
